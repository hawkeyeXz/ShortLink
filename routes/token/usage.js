import express from "express";
import redis from "../../services/redisClient.js";
import { todayKey } from "../../utils/dateKey.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const deviceId = req.deviceId;
    const date = todayKey();

    const countKey = `devkeycount:${deviceId}:${date}`;
    const activeKey = `devkey:${deviceId}`;

    const tokenGenUsed = Number(await redis.get(countKey)) || 0;
    const tokenGenRemaining = 5 - tokenGenUsed;

    const token = await redis.get(activeKey);

    let shortenUsed = 0;
    let shortenRemaining = 100;

    if (token) {
      const shortenKey = `tokenuse:${token}:${date}`;
      shortenUsed = Number(await redis.get(shortenKey)) || 0;
      shortenRemaining = 100 - shortenUsed;
    }

    res.json({
      deviceId,
      activeToken: token || null,
      tokenGeneration: {
        used: tokenGenUsed,
        remaining: tokenGenRemaining,
        limit: 5
      },
      urlShortening: {
        used: shortenUsed,
        remaining: shortenRemaining,
        limit: 100
      }
    });

  } catch (err) {
    console.error("usage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
