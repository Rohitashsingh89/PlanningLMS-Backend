import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

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
    origin: [
      "https://codechisel-official.vercel.app",
      "http://localhost:3000",
    ],
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

app.use('/api/v1/logs', logsRouter);
app.use('/api/v1/tasks', tasksRouter);
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/quotes', quotesRouter);
app.use('/api/v1/notes', notesRouter);
app.use('/api/v1/vault', vaultRouter);
app.use('/api/v1', backupRouter);

app.use('/api/v1/table', tableRouter);

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
