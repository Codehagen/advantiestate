import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, pageUrl } = await request.json();

    // Validate required fields
    if (!email || !pageUrl) {
      return NextResponse.json(
        { error: "Email and page URL are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get Discord webhook URL from environment
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Discord webhook not configured" },
        { status: 500 }
      );
    }

    // Format timestamp in Norwegian locale
    const timestamp = new Date().toLocaleString("no-NO", {
      timeZone: "Europe/Oslo",
      dateStyle: "long",
      timeStyle: "short",
    });

    // Send Discord webhook
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "🔔 Ny kontaktforespørsel",
            color: 0x2c2825, // warm-grey color
            fields: [
              {
                name: "📧 E-post",
                value: email,
                inline: false,
              },
              {
                name: "🕐 Tidspunkt",
                value: timestamp,
                inline: true,
              },
              {
                name: "🔗 Side",
                value: pageUrl,
                inline: false,
              },
            ],
            footer: {
              text: "Advanti CTA Form",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!discordResponse.ok) {
      console.error("Discord webhook failed:", await discordResponse.text());
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Notification sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Discord notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
