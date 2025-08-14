// api/base.js

import { handleSlackEvent } from "../utils/handleSlackEvent.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).send("Base endpoint is live");
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
