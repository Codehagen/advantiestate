"use server";

import { cookies } from "next/headers";

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
              value: data.purpose,
            },
            {
              name: "Company Details",
              value: [
                `**Name**: ${data.company.name}`,
                `**Org Number**: ${data.company.orgNumber}`,
                `**Address**: ${data.company.address}`,
              ].join("\n"),
            },
            {
              name: "Contact Information",
              value: [
                `**Name**: ${data.contact.name}`,
                `**Email**: ${data.contact.email}`,
                `**Phone**: ${data.contact.phone}`,
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
      console.error(`Discord webhook ${webhookUrl.slice(0, 50)}... error:`, body);
    }
    return response.ok;
  } catch (err) {
    console.error(`Discord webhook fetch failed:`, err);
    return false;
  }
}

export async function submitContactInquiry(data: ContactInquiryData) {
  try {
    // Build common embed fields
    const fields = [
      { name: "Navn", value: data.name },
      { name: "E-post", value: data.email },
      { name: "Telefon", value: data.phone },
      { name: "Ønsket tjeneste", value: data.service },
    ];

    if (data.message) {
      fields.push({
        name: "Melding",
        value: data.message.length > 1024 ? data.message.substring(0, 1021) + "..." : data.message,
      });
    }

    fields.push({ name: "Tidspunkt", value: new Date().toLocaleString("nb-NO") });

    const contactMessage: DiscordMessage = {
      content: "",
      embeds: [
        {
          title: "📬 Ny henvendelse fra nettsiden",
          description: `${data.name} har sendt inn en forespørsel om ${data.service.toLowerCase()}.`,
          color: 0x00aaff,
          fields,
        },
      ],
    };

    // The primary (#team) and secondary (#nettside-henvendelser) webhooks are
    // independent — fire them in parallel instead of one after the other.
    // postToDiscordWebhook never throws (it catches internally and returns a
    // boolean), so Promise.all cannot short-circuit. See PERFORMANCE_PLAN.md 4.1.
    const primaryUrl = process.env.DISCORD_WEBHOOK_URL;
    const nettsideUrl = process.env.DISCORD_NETTSIDE_WEBHOOK_URL;

    const nettsideMessage: DiscordMessage = {
      content: "",
      embeds: [
        {
          title: "📬 Ny nettside-henvendelse",
          description: `**${data.name}** — ${data.service}`,
          color: 0x00ff88,
          fields,
        },
      ],
    };

    await Promise.all([
      primaryUrl
        ? postToDiscordWebhook(primaryUrl, contactMessage)
        : Promise.resolve(false),
      nettsideUrl
        ? postToDiscordWebhook(nettsideUrl, nettsideMessage)
        : Promise.resolve(false),
    ]);

    if (!primaryUrl && !nettsideUrl) {
      throw new Error("Discord webhook URL not configured");
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return { success: false, error: "Innsending feilet. Vennligst prøv igjen." };
  }
}
