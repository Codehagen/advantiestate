"use server";

import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { subscribe } from "@/lib/email/subscribe";
import { sanitizeDiscordValue } from "@/lib/email/sanitize";
import { contactInquirySchema } from "@/lib/forms/schemas";

interface DiscordMessage {
  content: string;
  embeds: {
    title: string;
    description: string;
    color: number;
    fields: { name: string; value: string }[];
  }[];
}

interface OnboardingData {
  purpose: string;
  company: {
    name: string;
    orgNumber: string;
    address: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

export async function submitOnboarding(data: OnboardingData) {
  if (!(await checkRateLimit("onboarding"))) {
    return { success: false, error: "For mange forsøk. Prøv igjen om noen minutter." };
  }

  try {
    // Send to Discord
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("Discord webhook URL not configured");
    }

    const message: DiscordMessage = {
      content: "🎉 New Advanti User!",
      embeds: [
        {
          title: "New Onboarding Submission",
          description: `${data.company.name} has completed their onboarding!`,
          color: 0x00ffff, // Light blue color
          fields: [
            {
              name: "Purpose",
              value: sanitizeDiscordValue(data.purpose),
            },
            {
              name: "Company Details",
              value: [
                `**Name**: ${sanitizeDiscordValue(data.company.name)}`,
                `**Org Number**: ${sanitizeDiscordValue(data.company.orgNumber)}`,
                `**Address**: ${sanitizeDiscordValue(data.company.address)}`,
              ].join("\n"),
            },
            {
              name: "Contact Information",
              value: [
                `**Name**: ${sanitizeDiscordValue(data.contact.name)}`,
                `**Email**: ${sanitizeDiscordValue(data.contact.email)}`,
                `**Phone**: ${sanitizeDiscordValue(data.contact.phone)}`,
              ].join("\n"),
            },
            {
              name: "Timestamp",
              value: new Date().toISOString(),
            },
          ],
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error("Failed to send Discord notification");
    }

    // Set completion cookie
    const cookieStore = await cookies();
    cookieStore.set("onboarding-completed", "true", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting onboarding:", error);
    return { success: false, error: "Failed to submit onboarding" };
  }
}

// Interface for the new contact inquiry data
interface ContactInquiryData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
}

async function postToDiscordWebhook(
  webhookUrl: string,
  message: DiscordMessage,
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error("Discord webhook error:", body);
    }
    return response.ok;
  } catch (err) {
    console.error(`Discord webhook fetch failed:`, err);
    return false;
  }
}

export async function submitContactInquiry(data: ContactInquiryData) {
  if (!(await checkRateLimit("kontakt"))) {
    return { success: false, error: "For mange forsøk. Prøv igjen om noen minutter." };
  }

  const parsed = contactInquirySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Fyll inn navn, en gyldig e-postadresse og ønsket tjeneste.",
    };
  }
  const d = parsed.data;

  try {
    const intake: Record<string, string | undefined> = {
      Telefon: d.phone,
      Tjeneste: d.service,
      Beskjed: d.message,
    };

    // Full pipeline: Resend (audience + welcome), Discord #team digest
    // (high-intent stripe), Supabase crm_leads + crm_activities. The
    // "kontakt" source is already wired end-to-end in lib/email and
    // lib/supabase — see leads.ts HIGH_INTENT.
    const pipeline = subscribe({
      email: d.email,
      firstName: d.name,
      source: "kontakt",
      pageUrl: "/kontakt",
      intake,
    });

    // Secondary channel (#nettside-henvendelser) — not covered by subscribe().
    const nettsideUrl = process.env.DISCORD_NETTSIDE_WEBHOOK_URL;
    const nettsidePost = nettsideUrl
      ? postToDiscordWebhook(nettsideUrl, {
          content: "",
          embeds: [
            {
              title: "📬 Ny nettside-henvendelse",
              description: `**${sanitizeDiscordValue(d.name)}** — ${sanitizeDiscordValue(d.service)}`,
              color: 0x00ff88,
              fields: [
                { name: "Navn", value: sanitizeDiscordValue(d.name) },
                { name: "E-post", value: sanitizeDiscordValue(d.email) },
                { name: "Telefon", value: sanitizeDiscordValue(d.phone) },
                {
                  name: "Ønsket tjeneste",
                  value: sanitizeDiscordValue(d.service),
                },
                ...(d.message
                  ? [
                      {
                        name: "Melding",
                        value: sanitizeDiscordValue(d.message, 1024),
                      },
                    ]
                  : []),
              ],
            },
          ],
        })
      : Promise.resolve(false);

    const [result] = await Promise.all([pipeline, nettsidePost]);

    if (!result.ok) {
      return { success: false, error: result.error };
    }
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return { success: false, error: "Innsending feilet. Vennligst prøv igjen." };
  }
}
