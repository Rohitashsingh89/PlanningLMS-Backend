import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import nodemailer from 'nodemailer';

import databaseConnection from "../config/databaseConnection.js";
import router from "../routes/route.js";
import authRoutes from "../routes/authRoutes.js";
import problemRouter from "../routes/problem.js";
import groupRoutes from "../routes/groupRoutes.js";
import expenseRoutes from "../routes/expenseRoutes.js";
import gameRouter from "../routes/gameRoutes.js";
import vaultRouter from "../routes/vault.routes.js";
import backupRouter from "../routes/backup.routes.js";
import logsRouter from "../routes/logs.routes.js";
import tasksRouter from "../routes/tasks.routes.js";
import transactionsRouter from "../routes/transactions.routes.js";
import quotesRouter from "../routes/quotes.routes.js";
import notesRouter from "../routes/notes.routes.js";
import tableRouter from "../routes/table.routes.js";

dotenv.config(); // Load .env variables early

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME || "test"; // Default if missing

// Middlewares
// app.use(cors());
app.use(
  cors({
    origin: ["https://codechisel-official.vercel.app", "http://localhost:3000", "https://diwali-crazy.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect to database
databaseConnection(DATABASE_URL, DATABASE_NAME);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running perfectly");
});

// API routes
app.use("/api/v1", router);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRouter);

app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/game", gameRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/v1/logs", logsRouter);
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/quotes", quotesRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/vault", vaultRouter);
app.use("/api/v1", backupRouter);

app.use("/api/v1/table", tableRouter);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getClientIp(req) {
  const xf = (req.headers["x-forwarded-for"] || "").toString();
  if (xf) return xf.split(",")[0].trim();
  // Fallbacks
  return (
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    req.ip ||
    ""
  ).toString();
}

async function geoLookup(ip) {
  if (
    !ip ||
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("::ffff:127.")
  ) {
    return { city: "", region: "", country: "", org: "" };
  }
  try {
    if ((process.env.GEO_API || "ipapi") === "ipapi") {
      const r = await fetch(`https://ipapi.co/${ip}/json/`, { timeout: 3000 });
      const j = await r.json();
      return {
        city: j.city || "",
        region: j.region || j.region_code || "",
        country: j.country_name || j.country || "",
        org: j.org || j.org_name || "",
      };
    } else {
      const token = process.env.IPINFO_TOKEN
        ? `?token=${process.env.IPINFO_TOKEN}`
        : "";
      const r = await fetch(`https://ipinfo.io/${ip}/json${token}`, {
        timeout: 3000,
      });
      const j = await r.json();
      const [city, region, country] = [
        j.city || "",
        j.region || "",
        j.country || "",
      ];
      return { city, region, country, org: j.org || "" };
    }
  } catch {
    return { city: "", region: "", country: "", org: "" };
  }
}

app.post("/api/notify", async (req, res) => {
  try {
    const nameRaw = (req.body?.name || "").toString();
    const name = nameRaw.trim().slice(0, 100);
    if (!name)
      return res.status(400).json({ ok: false, error: "name_required" });

    const ip = getClientIp(req);
    const ua = (req.headers["user-agent"] || "").toString();
    const geo = await geoLookup(ip);

    const subject = `New Diwali Wish Entry: ${name}`;
    const html = `
      <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5">
        <h2 style="margin:0 0 8px">New entry received</h2>
        <p style="margin:0 0 6px"><b>Name:</b> ${escapeHtml(name)}</p>
        <p style="margin:0 0 6px"><b>IP:</b> ${escapeHtml(ip)}</p>
        <p style="margin:0 0 6px"><b>Location:</b> ${escapeHtml(
          [geo.city, geo.region, geo.country].filter(Boolean).join(", ") ||
            "N/A"
        )}</p>
        <p style="margin:0 0 6px"><b>Org/ISP:</b> ${escapeHtml(
          geo.org || "N/A"
        )}</p>
        <p style="margin:0 0 6px"><b>User-Agent:</b> ${escapeHtml(ua)}</p>
        <p style="margin:12px 0 0; font-size:12px; color:#666">Time: ${new Date().toISOString()}</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject,
      html,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("notify error", err);
    res.status(500).json({ ok: false });
  }
});

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// const httpServer = createServer(app);
// const io = new Server(httpServer, { cors: { origin: '*' } });

// io.on('connection', (socket) => {
//   socket.on('join', (roomId) => {
//     socket.join(roomId);
//     socket.emit('joined', roomId);
//   });
//   socket.on('move', (roomId, payload) => {
//     store.set(roomId, payload);
//     socket.to(roomId).emit('update', payload);
//   });
// });

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server Listening at http://localhost:${PORT}`);
});
