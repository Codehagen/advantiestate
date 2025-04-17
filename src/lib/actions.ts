"use server"

interface DiscordMessage {
  content: string
  embeds: {
    title: string
    description: string
    color: number
    fields: { name: string; value: string }[]
  }[]
}

export async function submitEarlyAccess(email: string) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      throw new Error("Discord webhook URL not configured")
    }

    const message: DiscordMessage = {
      content: "🎉 New Early Access Request!",
      embeds: [
        {
          title: "Early Access Signup",
          description: "A new user has signed up for early access!",
          color: 0x00ffff, // Light blue color
          fields: [
            {
              name: "Email",
              value: email,
            },
            {
              name: "Timestamp",
              value: new Date().toISOString(),
            },
          ],
        },
      ],
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error("Failed to send Discord notification")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending Discord notification:", error)
    return { success: false, error: "Failed to process request" }
  }
}
