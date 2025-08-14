// server.js - Local development server
import { createServer } from "http";
import { parse } from "url";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

// Import the webhook handler
import webhookHandler from "./api/webhook.js";

const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  // Set CORS headers for local development
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route to webhook handler
  if (pathname === "/api/webhook" || pathname === "/webhook") {
    // Parse request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        // Parse JSON body if present
        if (body && req.headers["content-type"]?.includes("application/json")) {
          req.body = JSON.parse(body);
        } else {
          req.body = {};
        }

        // Create mock Vercel request/response objects
        const mockReq = {
          method: req.method,
          headers: req.headers,
          body: req.body,
          url: req.url,
          query: parsedUrl.query,
        };

        const mockRes = {
          status: (code) => ({
            json: (data) => {
              res.writeHead(code, { "Content-Type": "application/json" });
              res.end(JSON.stringify(data, null, 2));
            },
          }),
          json: (data) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data, null, 2));
          },
        };

        // Call the webhook handler
        await webhookHandler(mockReq, mockRes);
      } catch (error) {
        console.error("Error processing request:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });
  } else if (pathname === "/") {
    // Health check endpoint
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        message: "Slack Webhook Handler is running",
        endpoints: ["/api/webhook", "/webhook"],
        app_id: "A09A9MLEY6P",
      })
    );
  } else {
    // 404 for unknown routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/api/webhook`);
  console.log(`🏥 Health check: http://localhost:${PORT}/`);
  console.log("\nReady to receive webhooks! 🎯");
});
