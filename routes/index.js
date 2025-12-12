import express from "express";
import generateKeyRoute from "./token/generate.js";
import getKeyRoute from "./token/getKey.js";
import usageRoute from "./token/usage.js";
import shortenRoute from "./urls/shorten.js";
import redirectRoute from "./urls/redirect.js";

const router = express.Router();


router.use("/generate-key", generateKeyRoute);
router.use("/get-key", getKeyRoute);
router.use("/usage", usageRoute);


router.use("/shorten", shortenRoute);


router.use("/", redirectRoute);

export default router;
