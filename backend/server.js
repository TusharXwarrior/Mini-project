const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_dropout_db";
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((v) => v.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV !== "production" && ["http://localhost:5173", "http://127.0.0.1:5173"].includes(origin))) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => { console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`); next(); });

app.get("/api/health", (_req, res) => res.status(200).json({
  status: "ok",
  service: "EduRisk AI API",
  database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
}));

app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.use((req, res) => res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found.` }));
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

mongoose.connect(MONGODB_URI).then(() => {
  console.log("Connected successfully to MongoDB");
  app.listen(PORT, () => console.log(`EduRisk API running on port ${PORT}`));
}).catch((err) => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});
