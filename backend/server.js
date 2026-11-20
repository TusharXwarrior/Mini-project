const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_dropout_db";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: [CLIENT_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Request logging (clean format for showcase)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "EduRisk AI API",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Routes
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found.`,
  });
});

// Centralized error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("==================================================");
    console.log(" Connected successfully to MongoDB database");
    console.log(` Database URI: ${MONGODB_URI}`);
    console.log("==================================================");

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` API Endpoint: http://localhost:${PORT}/api/students`);
      console.log("==================================================");
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    console.error("Please ensure the MongoDB service is running locally on port 27017.");
    process.exit(1);
  });
