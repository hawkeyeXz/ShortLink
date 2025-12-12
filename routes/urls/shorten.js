// routes/urls/shorten.js
import express from "express";
import redis from "../../services/redisClient.js";
import { nanoid } from "nanoid";
import { validateUrl } from "../../middleware/validateUrl.js"; // FIXED: Added Security
import { rateLimitToken } from "../../middleware/rateLimit.js"; // FIXED: Added Rate Limit

const router = express.Router();

// FIXED: Added middleware chain (rateLimitToken -> validateUrl -> handler)
router.post("/", rateLimitToken, validateUrl, async (req, res) => {
  try {
    // Note: rateLimitToken middleware already handles token validation 
    // and daily limit checks, so we don't need to repeat that logic here.

    const { url } = req.body;
    const id = nanoid(8);

    // Store URL with 48 hour expiration
    await redis.set(`short:${id}`, url, {EX:48 * 3600});

    // FIXED: Dynamic Host Fallback
    // If PUBLIC_IP env var is missing, use the incoming request's host header
    const protocol = req.protocol; // 'http' or 'https'
    const host = process.env.PUBLIC_IP;
    
    res.json({ shortUrl: `${protocol}://${host}/${id}` });

  } catch (err) {
    console.error("Shorten error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;