import { verifyAccessToken } from "../utils/token.js";

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = verifyAccessToken(token);
    req.user = decoded; // { sub, email, role, rtv }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
