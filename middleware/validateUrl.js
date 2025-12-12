export function validateUrl(req, res, next) {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "URL required" });

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "malformed URL" });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return res.status(400).json({ error: "invalid protocol" });
  }

  const host = parsed.hostname;
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^0\./,
    /^169\.254\./
  ];

  if (privateRanges.some(r => r.test(host))) {
    return res.status(400).json({ error: "private networks not allowed" });
  }

  req.cleanedUrl = parsed.toString();
  next();
}
