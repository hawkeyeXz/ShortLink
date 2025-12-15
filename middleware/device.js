import { nanoid } from "nanoid";

export default function deviceMiddleware(req, res, next) {
  const existingId = req.cookies.deviceId;

  if(existingId){
    req.deviceId = existingId;
    return next();
  }

  
  const newId = nanoid();
  res.cookie("deviceId", newId, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  });
  

  req.deviceId = newId;
  next();
}
