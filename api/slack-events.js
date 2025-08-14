// api/slack-events.js

import { handleSlackEvent } from "../utils/handleSlackEvent.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { body } = req;

    // Handle Slack URL verification
    if (body.type === "url_verification") {
      return res.status(200).send(body.challenge);
    }

    try {
      const response = await handleSlackEvent(body);
      return res.status(200).json(response);
    } catch (err) {
      console.error("Error handling Slack event:", err);
      return res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
