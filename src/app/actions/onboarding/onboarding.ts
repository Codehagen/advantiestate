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
      content: "🎉 New PropDock User!",
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
}

export async function submitContactInquiry(data: ContactInquiryData) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("Discord webhook URL not configured");
    }

    const message: DiscordMessage = {
      content: "📬 New Contact Form Inquiry!",
      embeds: [
        {
          title: "New Contact Form Submission",
          description: `${data.name} has submitted a contact inquiry regarding ${data.service}.`,
          color: 0x00aaff, // A different blue color
          fields: [
            {
              name: "Contact Name",
              value: data.name,
            },
            {
              name: "Contact Email",
              value: data.email,
            },
            {
              name: "Contact Phone",
              value: data.phone,
            },
            {
              name: "Service Interest",
              value: data.service,
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
      const errorBody = await response.text();
      console.error("Discord API Error:", errorBody);
      throw new Error(
        "Failed to send Discord notification for contact inquiry"
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return { success: false, error: "Failed to submit contact inquiry" };
  }
}
