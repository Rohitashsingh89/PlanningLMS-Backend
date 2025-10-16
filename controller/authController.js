import bcrypt from "bcrypt";
import User from "../models/User.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

// cookie options helper
const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "strict",
  maxAge: maxAgeMs,
  path: "/", // send on all routes to same site
});

const ACCESS_COOKIE_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_COOKIE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash });

    // minimal payload; sub = user id; rtv = refresh token version
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      rtv: user.refreshTokenVersion,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res
      .cookie("accessToken", accessToken, cookieOptions(ACCESS_COOKIE_AGE))
      .cookie("refreshToken", refreshToken, cookieOptions(REFRESH_COOKIE_AGE))
      .status(201)
      .json({
        message: "Registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email, password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      rtv: user.refreshTokenVersion,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res
      .cookie("accessToken", accessToken, cookieOptions(ACCESS_COOKIE_AGE))
      .cookie("refreshToken", refreshToken, cookieOptions(REFRESH_COOKIE_AGE))
      .json({
        message: "Logged in",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: accessToken,
      });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear cookies
    res
      .clearCookie("accessToken", { path: "/" })
      .clearCookie("refreshToken", { path: "/" })
      .json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Optional: refresh endpoint to rotate access token
export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ message: "User not found" });

    // check refresh token version to invalidate old refresh tokens after logout-all
    if (decoded.rtv !== user.refreshTokenVersion) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      rtv: user.refreshTokenVersion,
    };
    const newAccess = signAccessToken(payload);
    res
      .cookie("accessToken", newAccess, cookieOptions(ACCESS_COOKIE_AGE))
      .json({ message: "Access token refreshed" });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// Optional: logout all sessions by bumping refreshTokenVersion
export const logoutAll = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await User.findByIdAndUpdate(userId, { $inc: { refreshTokenVersion: 1 } });
    res
      .clearCookie("accessToken", { path: "/" })
      .clearCookie("refreshToken", { path: "/" })
      .json({ message: "Logged out from all devices" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
