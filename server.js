import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js"; // relative path

import authRoutes from "./routes/authRoutes.js";
import carRoutes from './routes/carRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());

// =========================================================
// IN-MEMORY RATE LIMITERS
// =========================================================

// Helper function to create custom rate limiters
const createLimiter = (windowMs, maxRequests, message) => {
  const map = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!map.has(ip)) {
      map.set(ip, { count: 1, startTime: now });
      return next();
    }

    const record = map.get(ip);

    // Reset counter if window has passed
    if (now - record.startTime > windowMs) {
      map.set(ip, { count: 1, startTime: now });
      return next();
    }

    // Check limit
    if (record.count >= maxRequests) {
      return res.status(429).json({ success: false, error: message });
    }

    record.count++;
    next();
  };
};

// 1. General API Limiter (Allows fast page navigation)
// 300 requests every 15 minutes (900,000 ms)
const generalLimiter = createLimiter(
  15 * 60 * 1000, 
  300, 
  "Too many requests. Please slow down."
);

// 2. Strict Auth Limiter (Prevents login/signup brute-force)
// 15 requests every 15 minutes
const authLimiter = createLimiter(
  15 * 60 * 1000, 
  15, 
  "Too many authentication attempts. Please try again in 15 minutes."
);

// =========================================================
// ROUTE APPLICATION
// =========================================================

// Apply strict limiter ONLY to auth routes
app.use("/api/auth", authLimiter, authRoutes);

// Apply general limiter to car routes & other data routes
app.use("/api/car", generalLimiter, carRoutes);




// 📝 [SETUP]
app.use(express.static(path.join(__dirname, "src")));
// 🔗 [PAGE]
app.use(express.static(path.join(__dirname, "src/page")));

// ⚓️ [MAIN]
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

// 🔊 [Cron-job.org]
app.get('/health', (req, res) => {

    res.status(200).send('OK');
});

// 🔻 [CRASH]
app.use((req, res) => {

    res.status(404).send("404: Page Not Found");
});

// 🔌 [CONNECT]
const startServer = async () => {

  try {

    await connectDB();

    app.listen(PORT, () => {

      // ✅️ [OK]
      console.log(`Server running on PORT: ${PORT}`);
    });
  } 

  // 🚫 [ERROR]
  catch (err) {

    // 🔻 [EXIT]
    console.error("Database initialization failed:", err);
  }
};

startServer();
