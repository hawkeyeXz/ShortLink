import express from "express";
import redis from "../../services/redisClient.js";
import crypto from "crypto";
import { todayKey } from "../../utils/dateKey.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const deviceId = req.deviceId;

    const date = todayKey();

    const countKey = `devkeycount:${deviceId}:${date}`;
    const activeKey = `devkey:${deviceId}`;

    let count = Number(await redis.get(countKey) || 0);

    if (count >= 5) {
      return res.status(429).json({ error: "Daily token limit reached." });
    }

    const token = crypto.randomBytes(16).toString("hex");

    const oldToken = await redis.get(activeKey);
    if (oldToken) {
      await redis.del(`validtoken:${oldToken}`);
    }

    await redis.set(activeKey, token, { EX: 3 * 24 * 60 * 60 });
    await redis.set(`validtoken:${token}`, "1", { EX: 3 * 24 * 60 * 60});

    const newCount = await redis.incr(countKey);
    if (newCount === 1) {
      await redis.expire(countKey, 86400);
    }

    return res.json({ token });

  } catch (err) {
    console.error("generate-key error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
