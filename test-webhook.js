import fetch from "node-fetch";

const WEBHOOK_URL = "http://localhost:3000/api/webhook";

// Test 1: URL Verification Challenge
async function testUrlVerification() {
  console.log("🧪 Testing URL Verification...");

  const payload = {
    token: "verification_token",
    challenge: "test_challenge_string",
    type: "url_verification",
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("✅ URL Verification Response:", result);
  } catch (error) {
    console.error("❌ URL Verification Error:", error.message);
  }
}

// Test 2: Message Event
async function testMessageEvent() {
  console.log("🧪 Testing Message Event...");

  const payload = {
    token: "verification_token",
    team_id: "T1234567890",
    api_app_id: "A09A9MLEY6P",
    event: {
      type: "message",
      channel: "C1234567890",
      user: "U1234567890",
      text: "Hello from test!",
      ts: "1234567890.123456",
    },
    type: "event_callback",
    event_id: "Ev1234567890",
    event_time: 1234567890,
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("✅ Message Event Response:", result);
  } catch (error) {
    console.error("❌ Message Event Error:", error.message);
  }
}

// Test 3: App Mention Event
async function testAppMention() {
  console.log("🧪 Testing App Mention...");

  const payload = {
    token: "verification_token",
    team_id: "T1234567890",
    api_app_id: "A09A9MLEY6P",
    event: {
      type: "app_mention",
      channel: "C1234567890",
      user: "U1234567890",
      text: "<@U0LAN0Z89> hello!",
      ts: "1234567890.123456",
    },
    type: "event_callback",
    event_id: "Ev1234567890",
    event_time: 1234567890,
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("✅ App Mention Response:", result);
  } catch (error) {
    console.error("❌ App Mention Error:", error.message);
  }
}

// Test 4: Invalid Method (should return 405)
async function testInvalidMethod() {
  console.log("🧪 Testing Invalid Method...");

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "GET",
    });

    const result = await response.json();
    console.log("✅ Invalid Method Response:", response.status, result);
  } catch (error) {
    console.error("❌ Invalid Method Error:", error.message);
  }
}

// Run all tests
async function runTests() {
  console.log("🚀 Starting local webhook tests...\n");

  await testUrlVerification();
  console.log("");

  await testMessageEvent();
  console.log("");

  await testAppMention();
  console.log("");

  await testInvalidMethod();
  console.log("");

  console.log("✨ All tests completed!");
}

runTests();
