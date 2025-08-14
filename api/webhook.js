export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { body, headers } = req;

    // Log the incoming request (optional - remove in production if sensitive)
    console.log("Received POST request:", {
      headers: headers,
      body: body,
      timestamp: new Date().toISOString(),
    });

    // Handle Slack URL verification challenge
    if (body.type === "url_verification") {
      return res.status(200).json({ challenge: body.challenge });
    }

    // Process the webhook payload
    // You can add your custom logic here based on the payload
    if (body.event) {
      console.log("Slack event received:", body.event);

      // Add your event processing logic here
      switch (body.event.type) {
        case "message":
          console.log("Message event:", body.event);
          break;
        case "app_mention":
          console.log("App mention:", body.event);
          break;
        default:
          console.log("Unknown event type:", body.event.type);
      }
    }

    // If you need to make API calls back to Slack, you can do it here
    // Example: Send a response message
    if (process.env.SLACK_BOT_TOKEN && body.event?.channel) {
      await sendSlackResponse(body.event.channel, "Message received!");
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      app_id: "A09A9MLEY6P",
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

// Helper function to send messages back to Slack
async function sendSlackResponse(channel, text) {
  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channel,
        text: text,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Slack API error:", data.error);
    }
    return data;
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error;
  }
}
