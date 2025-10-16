import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  logoutAll,
} from "../controller/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// public
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// protected
router.post("/logout", requireAuth, logout);
router.post("/logout-all", requireAuth, logoutAll);

// example protected resource
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
