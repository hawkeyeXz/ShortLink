import { nanoid } from "nanoid";

export default function deviceMiddleware(req, res, next) {
  let deviceId = req.cookies?.deviceId;

  if (!deviceId) {
    deviceId = nanoid(16);
    res.cookie("deviceId", deviceId, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  req.deviceId = deviceId;
  next();
}
