import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import databaseConnection from '../config/databaseConnection.js';
import router from '../routes/route.js';
import problemRouter from '../routes/problem.js';
import groupRoutes from '../routes/groupRoutes.js';
import expenseRoutes from '../routes/expenseRoutes.js';

dotenv.config(); // Load .env variables early

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME || 'test'; // Default if missing

// Middlewares
app.use(cors());
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

app.use('/api/v1/problems', problemRouter);

app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/expenses', expenseRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server Listening at http://localhost:${PORT}`);
});
