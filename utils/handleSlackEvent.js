// utils/handleSlackEvent.js

import fetch from "node-fetch";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

export async function handleSlackEvent(event) {
  const { event: slackEvent } = event;

  if (slackEvent.type === "app_mention") {
    const reply = `You mentioned me! Here's a placeholder answer.`; // Replace with real query logic

    await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: slackEvent.channel,
        text: reply,
      }),
    });
  }

  return { status: "ok" };
}
