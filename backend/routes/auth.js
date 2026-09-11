const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db");

const router = express.Router();

// =====================================================
// STUDENT LOGIN
// =====================================================

router.post("/student/login", async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;

    // Validate input
    if (!registrationNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Registration number and password are required",
      });
    }

    // Find student
    const [students] = await db.query(
      `SELECT *
       FROM students
       WHERE student_id = ?`,
      [registrationNumber]
    );

    if (students.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid registration number or password",
      });
    }

    const student = students[0];

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      student.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid registration number or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: student.id,
        studentId: student.student_id,
        role: "student",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send response
    res.json({
      success: true,
      message: "Student login successful",
      token,
      user: {
        id: student.id,
        studentId: student.student_id,
        name: student.name,
        email: student.email,
        branch: student.branch,
        semester: student.semester,
        section: student.section,
        hostel: student.hostel,
        room: student.room,
        phone: student.phone,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Student login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during student login",
    });
  }
});

// =====================================================
// FACULTY / ADMIN LOGIN
// =====================================================

router.post("/admin/login", async (req, res) => {
  try {
    const { facultyId, password } = req.body;

    // Validate input
    if (!facultyId || !password) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID and password are required",
      });
    }

    // Find faculty
    const [facultyMembers] = await db.query(
      `SELECT *
       FROM faculty
       WHERE faculty_id = ?`,
      [facultyId]
    );

    if (facultyMembers.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Faculty ID or password",
      });
    }

    const faculty = facultyMembers[0];

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      faculty.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Faculty ID or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: faculty.id,
        facultyId: faculty.faculty_id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send response
    res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: faculty.id,
        facultyId: faculty.faculty_id,
        name: faculty.name,
        email: faculty.email,
        designation: faculty.designation,
        department: faculty.department,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during admin login",
    });
  }
});

module.exports = router;