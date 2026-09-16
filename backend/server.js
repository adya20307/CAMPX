const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const facultyRoutes = require("./routes/faculty");
const canteenRoutes = require("./routes/canteen");

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());

// ============================================
// HOME
// ============================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampX Backend is running 🚀",
  });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT 1 AS database_test"
    );

    res.json({
      success: true,
      server: "OK",
      database:
        result[0].database_test === 1
          ? "Connected"
          : "Error",
      message: "CampX API is healthy 🚀",
    });
  } catch (error) {
    console.error("Database health error:", error);

    res.status(500).json({
      success: false,
      server: "OK",
      database: "Disconnected",
      message: "Database connection failed",
    });
  }
});

// ============================================
// AUTH ROUTES
// ============================================

app.use("/api/auth", authRoutes);

// ============================================
// STUDENT ROUTES
// ============================================

app.use("/api/students", studentRoutes);

// ============================================
// FACULTY / ADMIN ROUTES
// ============================================

app.use("/api/faculty", facultyRoutes);

// ============================================
// CANTEEN ROUTES
// ============================================

app.use("/api/canteen", canteenRoutes);

// ============================================
// TEST POST
// ============================================

app.post("/api/test", (req, res) => {
  console.log("Received data:", req.body);

  res.json({
    success: true,
    message: "Data received successfully",
    data: req.body,
  });
});

// ============================================
// 404
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log("");
  console.log("================================");
  console.log("      CAMPX BACKEND SERVER");
  console.log("================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`API:    http://localhost:${PORT}/api`);
  console.log("Auth:   /api/auth");
  console.log("Students: /api/students");
  console.log("Faculty:  /api/faculty");
  console.log("================================");
  console.log("");
});