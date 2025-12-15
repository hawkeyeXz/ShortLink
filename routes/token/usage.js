import express from "express";
import redis from "../../services/redisClient.js";
import { todayKey } from "../../utils/dateKey.js";

const router = express.Router();


const LIMIT_PER_DEVICE = 5;
const LIMIT_IP_DAILY = 100;
const LIMIT_SHORTEN_DAILY = 100;

router.get("/", async (req, res) => {
  try {
    const deviceId = req.cookies.deviceId;

    if (!deviceId) {
      return res.status(401).json({ error: "Session cookie required" });
    }
    
    
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cleanIp = ip.replace(/^.*:/, ''); 

    const date = todayKey();

   
    const deviceGenKey = `gen:device:${deviceId}:${date}`;
    const ipGenKey = `gen:ip_daily:${cleanIp}:${date}`;
    const activeKey = `devkey:${deviceId}`;

    
    const [deviceGenStr, ipGenStr, token] = await Promise.all([
      redis.get(deviceGenKey),
      redis.get(ipGenKey),
      redis.get(activeKey)
    ]);

    const deviceGenUsed = Number(deviceGenStr) || 0;
    const ipGenUsed = Number(ipGenStr) || 0;

    
    let shortenUsed = 0;
    if (token) {
      const shortenKey = `tokenuse:${token}:${date}`;
      shortenUsed = Number(await redis.get(shortenKey)) || 0;
    }

    
    res.json({
      deviceId,
      ip: cleanIp, 
      activeToken: token || null,
      limits: {
        tokenGeneration: {
          device: {
            used: deviceGenUsed,
            limit: LIMIT_PER_DEVICE,
            remaining: Math.max(0, LIMIT_PER_DEVICE - deviceGenUsed)
          },
          network: {
            used: ipGenUsed,
            limit: LIMIT_IP_DAILY,
            remaining: Math.max(0, LIMIT_IP_DAILY - ipGenUsed)
          }
        },
        shortening: {
          used: shortenUsed,
          limit: LIMIT_SHORTEN_DAILY,
          remaining: Math.max(0, LIMIT_SHORTEN_DAILY - shortenUsed)
        }
      }
    });

  } catch (err) {
    console.error("usage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;