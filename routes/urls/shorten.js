import express from "express";
import redis from "../../services/redisClient.js";
import { nanoid } from "nanoid";
import { validateUrl } from "../../middleware/validateUrl.js"; 
import { rateLimitToken } from "../../middleware/rateLimit.js";

const router = express.Router();

router.post("/", rateLimitToken, validateUrl, async (req, res) => {
  try {

    if (!req.cookies || !req.cookies.deviceId) {
      return res.status(400).json({ error: "Coookie is missing or Expired" });
    }

    const  url  = req.cleanedUrl;
    const id = nanoid(8);

    await redis.set(`short:${id}`, url, {EX:48 * 3600});

    const protocol = req.protocol;
    const host = process.env.BASE_URL;
    
    res.json({ shortUrl: `${protocol}://${host}/${id}` });

  } catch (err) {
    console.error("Shorten error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;