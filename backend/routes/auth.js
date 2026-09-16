const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db");

const router = express.Router();

// =====================================================
// STUDENT LOGIN
// POST /api/auth/student/login
// =====================================================

router.post("/student/login", async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;

    // -------------------------------------------------
    // Validate input
    // -------------------------------------------------

    if (!registrationNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Registration number and password are required",
      });
    }

    const studentId = registrationNumber.trim();

    // -------------------------------------------------
    // Find student
    // -------------------------------------------------

    const [students] = await db.query(
      `
      SELECT *
      FROM students
      WHERE student_id = ?
      LIMIT 1
      `,
      [studentId]
    );

    if (students.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid registration number or password",
      });
    }

    const student = students[0];

    // -------------------------------------------------
    // Check password
    // -------------------------------------------------

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

    // -------------------------------------------------
    // Create Student JWT
    // -------------------------------------------------

    const token = jwt.sign(
      {
        id: student.id,
        studentId: student.student_id,
        role: "student",
        batchYear: student.batch_year,
        hostelStatus: student.hostel_status,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // -------------------------------------------------
    // Send response
    // -------------------------------------------------

    return res.json({
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

        batchYear: student.batch_year,

        hostel: student.hostel,

        room: student.room,

        hostelStatus: student.hostel_status,

        phone: student.phone,

        role: "student",
      },
    });
  } catch (error) {
    console.error("Student login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during student login",
    });
  }
});


// =====================================================
// ADMIN / SUPER ADMIN LOGIN
// POST /api/auth/admin/login
//
// Both ADMIN and SUPER_ADMIN use this same API.
// The database role determines which dashboard they get.
// =====================================================

router.post("/admin/login", async (req, res) => {
  try {
    const { facultyId, password } = req.body;

    // -------------------------------------------------
    // Validate input
    // -------------------------------------------------

    if (!facultyId || !password) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID and password are required",
      });
    }

    const enteredFacultyId = facultyId.trim();

    // -------------------------------------------------
    // Find faculty/admin
    // -------------------------------------------------

    const [facultyMembers] = await db.query(
      `
      SELECT
        id,
        faculty_id,
        name,
        email,
        password_hash,
        designation,
        department,
        role,
        admin_section,
        is_active,
        created_at
      FROM faculty
      WHERE faculty_id = ?
      LIMIT 1
      `,
      [enteredFacultyId]
    );

    // -------------------------------------------------
    // Faculty not found
    // -------------------------------------------------

    if (facultyMembers.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Faculty ID or password",
      });
    }

    const faculty = facultyMembers[0];

    // -------------------------------------------------
    // Check if account is active
    // -------------------------------------------------

    if (!faculty.is_active) {
      return res.status(403).json({
        success: false,
        message:
          "Your admin account has been deactivated. Please contact the Super Admin.",
      });
    }

    // -------------------------------------------------
    // Check password
    // -------------------------------------------------

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

    // -------------------------------------------------
    // Safety check for role
    // -------------------------------------------------

    const userRole =
      faculty.role === "SUPER_ADMIN"
        ? "SUPER_ADMIN"
        : "ADMIN";

    // -------------------------------------------------
    // Create Admin / Super Admin JWT
    // -------------------------------------------------

    const token = jwt.sign(
      {
        id: faculty.id,

        facultyId: faculty.faculty_id,

        role: userRole,

        adminSection: faculty.admin_section || null,

        department: faculty.department || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // -------------------------------------------------
    // Send response
    // -------------------------------------------------

    return res.json({
      success: true,

      message:
        userRole === "SUPER_ADMIN"
          ? "Super Admin login successful"
          : "Admin login successful",

      token,

      user: {
        id: faculty.id,

        facultyId: faculty.faculty_id,

        name: faculty.name,

        email: faculty.email,

        designation: faculty.designation,

        department: faculty.department,

        role: userRole,

        adminSection: faculty.admin_section || null,

        isActive: Boolean(faculty.is_active),
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during admin login",
    });
  }
});


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;