const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../db");

const {
  authenticateToken,
  requirePermission,
} = require("../middleware/departmentAuth");

const router = express.Router();


// =====================================================
// GET ALL STUDENTS
// GET /api/students
//
// Permission:
// STUDENT_PROFILES
//
// Super Admin automatically allowed.
// =====================================================

router.get(
  "/",
  authenticateToken,
  requirePermission("STUDENT_PROFILES"),
  async (req, res) => {

    try {

      const [students] = await db.query(`
        SELECT
          id,
          student_id,
          name,
          email,
          branch,
          semester,
          section,
          batch_year,
          hostel,
          room,
          hostel_status,
          phone,
          created_at
        FROM students
        ORDER BY id DESC
      `);


      return res.json({
        success: true,
        students,
      });


    } catch (error) {

      console.error(
        "Get students error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch students",
      });

    }

  }
);


// =====================================================
// GET SINGLE STUDENT
// GET /api/students/:studentId
//
// Permission:
// STUDENT_PROFILES
// =====================================================

router.get(
  "/:studentId",
  authenticateToken,
  requirePermission("STUDENT_PROFILES"),
  async (req, res) => {

    try {

      const studentId =
        req.params.studentId.trim();


      const [students] =
        await db.query(
          `
          SELECT
            id,
            student_id,
            name,
            email,
            branch,
            semester,
            section,
            batch_year,
            hostel,
            room,
            hostel_status,
            phone,
            created_at
          FROM students
          WHERE student_id = ?
          LIMIT 1
          `,
          [studentId]
        );


      if (
        students.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });

      }


      return res.json({
        success: true,
        student: students[0],
      });


    } catch (error) {

      console.error(
        "Get student error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch student",
      });

    }

  }
);


// =====================================================
// CREATE STUDENT
//
// POST /api/students
//
// Permission:
// ADD_STUDENTS
//
// Every Admin can create students.
// Super Admin automatically allowed.
// =====================================================

router.post(
  "/",
  authenticateToken,
  requirePermission("ADD_STUDENTS"),
  async (req, res) => {

    try {

      const {
        registrationNumber,
        name,
        email,
        branch,
        semester,
        section,
        batchYear,
        hostelStatus,
        hostel,
        room,
        phone,
        password,
      } = req.body;


      // =================================================
      // VALIDATION
      // =================================================

      if (
        !registrationNumber ||
        !name ||
        !email ||
        !branch ||
        !semester ||
        !section ||
        !batchYear ||
        !hostelStatus ||
        !password
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Please fill all required student information.",
        });

      }


      const studentId =
        String(
          registrationNumber
        ).trim();


      const studentName =
        String(name).trim();


      const studentEmail =
        String(email).trim();


      const studentBranch =
        String(branch).trim();


      const studentSemester =
        String(semester).trim();


      const studentSection =
        String(section).trim();


      const studentBatch =
        Number(batchYear);


      const studentPassword =
        String(password);


      // =================================================
      // VALIDATE BATCH
      // =================================================

      const allowedBatches = [
        2022,
        2024,
        2025,
        2026,
      ];


      if (
        !allowedBatches.includes(
          studentBatch
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid batch year. Allowed batches are 2022, 2024, 2025 and 2026.",
        });

      }


      // =================================================
      // VALIDATE HOSTEL STATUS
      // =================================================

      if (
        hostelStatus !==
          "HOSTELLER" &&
        hostelStatus !==
          "NON_HOSTELLER"
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid hostel status.",
        });

      }


      // =================================================
      // PASSWORD VALIDATION
      // =================================================

      if (
        studentPassword.length < 6
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least 6 characters.",
        });

      }


      // =================================================
      // CHECK EXISTING STUDENT ID
      // =================================================

      const [existingStudent] =
        await db.query(
          `
          SELECT id
          FROM students
          WHERE student_id = ?
          LIMIT 1
          `,
          [studentId]
        );


      if (
        existingStudent.length > 0
      ) {

        return res.status(409).json({
          success: false,
          message:
            "This registration number is already registered.",
        });

      }


      // =================================================
      // CHECK EXISTING EMAIL
      // =================================================

      const [existingEmail] =
        await db.query(
          `
          SELECT id
          FROM students
          WHERE email = ?
          LIMIT 1
          `,
          [studentEmail]
        );


      if (
        existingEmail.length > 0
      ) {

        return res.status(409).json({
          success: false,
          message:
            "This email address is already registered.",
        });

      }


      // =================================================
      // HASH PASSWORD
      // =================================================

      const passwordHash =
        await bcrypt.hash(
          studentPassword,
          10
        );


      // =================================================
      // HOSTEL DATA
      // =================================================

      let hostelName =
        hostel
          ? String(
              hostel
            ).trim()
          : null;


      let roomNumber =
        room
          ? String(
              room
            ).trim()
          : null;


      if (
        hostelStatus ===
        "NON_HOSTELLER"
      ) {

        hostelName = "NA";

        roomNumber = "NA";

      }


      // =================================================
      // PHONE
      // =================================================

      const studentPhone =
        phone
          ? String(
              phone
            ).trim()
          : null;


      // =================================================
      // INSERT STUDENT
      // =================================================

      const [result] =
        await db.query(
          `
          INSERT INTO students
          (
            student_id,
            name,
            email,
            password_hash,
            branch,
            semester,
            section,
            batch_year,
            hostel,
            room,
            hostel_status,
            phone
          )
          VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            studentId,
            studentName,
            studentEmail,
            passwordHash,
            studentBranch,
            studentSemester,
            studentSection,
            studentBatch,
            hostelName,
            roomNumber,
            hostelStatus,
            studentPhone,
          ]
        );


      // =================================================
      // RESPONSE
      // =================================================

      return res.status(201).json({

        success: true,

        message:
          "Student registered successfully.",

        student: {

          id:
            result.insertId,

          studentId,

          name:
            studentName,

          email:
            studentEmail,

          branch:
            studentBranch,

          semester:
            studentSemester,

          section:
            studentSection,

          batchYear:
            studentBatch,

          hostel:
            hostelName,

          room:
            roomNumber,

          hostelStatus,

          phone:
            studentPhone,

        },

      });


    } catch (error) {

      console.error(
        "Create student error:",
        error
      );


      // ===============================================
      // DUPLICATE ENTRY SAFETY
      // ===============================================

      if (
        error.code ===
        "ER_DUP_ENTRY"
      ) {

        return res.status(409).json({
          success: false,
          message:
            "Registration number or email already exists.",
        });

      }


      // ===============================================
      // SERVER ERROR
      // ===============================================

      return res.status(500).json({
        success: false,
        message:
          "Server error while registering student.",
      });

    }

  }
);


// =====================================================
// DELETE STUDENT
//
// DELETE /api/students/:studentId
//
// Permission:
// STUDENT_PROFILES
// =====================================================

router.delete(
  "/:studentId",
  authenticateToken,
  requirePermission("STUDENT_PROFILES"),
  async (req, res) => {

    try {

      const studentId =
        req.params.studentId.trim();


      const [result] =
        await db.query(
          `
          DELETE FROM students
          WHERE student_id = ?
          `,
          [studentId]
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            "Student not found.",
        });

      }


      return res.json({
        success: true,
        message:
          "Student deleted successfully.",
      });


    } catch (error) {

      console.error(
        "Delete student error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Failed to delete student.",
      });

    }

  }
);


module.exports = router;