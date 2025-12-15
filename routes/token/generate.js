import express from "express";
import redis from "../../services/redisClient.js";
import crypto from "crypto";
import { todayKey } from "../../utils/dateKey.js";

const router = express.Router();

const LIMIT_PER_DEVICE = 5;     
const LIMIT_IP_DAILY = 100;     
const LIMIT_IP_BURST = 5;      
const BURST_WINDOW = 120;      

router.post("/", async (req, res) => {
  try {
    const deviceId = req.cookies.deviceId;
    if(!deviceId){
      return res.status(401).json({error: "Session cookie required..."})
    }
    
   
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cleanIp = ip.replace(/^.*:/, ''); 

    const date = todayKey();

    
    const deviceKey = `gen:device:${deviceId}:${date}`;
    const ipDailyKey = `gen:ip_daily:${cleanIp}:${date}`;
    const ipBurstKey = `gen:ip_burst:${cleanIp}`; 

    
    const [deviceCountStr, ipDailyStr, ipBurstStr] = await Promise.all([
      redis.get(deviceKey),
      redis.get(ipDailyKey),
      redis.get(ipBurstKey)
    ]);

    const deviceCount = Number(deviceCountStr) || 0;
    const ipDailyCount = Number(ipDailyStr) || 0;
    const ipBurstCount = Number(ipBurstStr) || 0;

   
    if (deviceCount >= LIMIT_PER_DEVICE) {
      return res.status(429).json({ error: "Daily limit reached for this device." });
    }

    
    if (ipBurstCount >= LIMIT_IP_BURST) {
      return res.status(429).json({ 
        error: "Network busy. Too many requests from this WiFi. Please wait 2 minutes." 
      });
    }

    
    if (ipDailyCount >= LIMIT_IP_DAILY) {
      return res.status(429).json({ 
        error: "Daily limit reached for this Network." 
      });
    }

  
    const token = crypto.randomBytes(16).toString("hex");
    const activeKey = `devkey:${deviceId}`;

  
    const oldToken = await redis.get(activeKey);
    if (oldToken) await redis.del(`validtoken:${oldToken}`);

  
    const multi = redis.multi();

   
    multi.set(activeKey, token, { EX: 3 * 24 * 60 * 60 });
    multi.set(`validtoken:${token}`, "1", { EX: 3 * 24 * 60 * 60 });

    
    multi.incr(deviceKey);
    if (deviceCount === 0) multi.expire(deviceKey, 86400);

  
    multi.incr(ipDailyKey);
    if (ipDailyCount === 0) multi.expire(ipDailyKey, 86400);

    multi.incr(ipBurstKey);
    
    if (ipBurstCount === 0) multi.expire(ipBurstKey, BURST_WINDOW);

    await multi.exec();

    return res.json({ token });

  } catch (err) {
    console.error("generate-key error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;