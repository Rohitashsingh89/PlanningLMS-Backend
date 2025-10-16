import { verifyAccessToken } from "../utils/token.js";

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyAccessToken(token); // { sub, email, role, rtv }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
