import express from "express";
import redis from "../../services/redisClient.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const url = await redis.get(`short:${id}`);

  if (!url) {
    return res.status(404).send("Not found");
  }

  return res.redirect(url);
});

export default router;
