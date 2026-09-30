const express = require("express");
const jwt = require("jsonwebtoken");

const db = require("../db");
const {
  hasPermission,
} = require("../config/departmentPermissions");

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    console.error(
      "Accounts token verification error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

// =====================================================
// ACCOUNTS PERMISSION
// =====================================================

function requireAccountsPermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (
      !hasPermission(
        req.user.department ||
          req.user.admin_section,
        permission,
        req.user
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this Accounts feature.",
      });
    }

    next();
  };
}

// =====================================================
// HELPER
// =====================================================

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function calculateFeeTotal(body) {
  return (
    toNumber(body.tuition_fee) +
    toNumber(body.exam_fee) +
    toNumber(body.hostel_fee) +
    toNumber(body.library_fee) +
    toNumber(body.development_fee) +
    toNumber(body.other_fee)
  );
}

// =====================================================
// GET STUDENTS
// GET /api/accounts/students
// =====================================================

router.get(
  "/students",
  authenticateToken,
  requireAccountsPermission("STUDENT_FEES"),
  async (req, res) => {
    try {
      const [students] = await db.query(
        `
        SELECT
          student_id,
          name,
          email,
          branch,
          semester,
          batch_year,
          hostel_status
        FROM students
        ORDER BY name ASC
        `
      );

      return res.json({
        success: true,
        students,
      });
    } catch (error) {
      console.error(
        "Accounts - Get Students Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while loading students.",
      });
    }
  }
);

// =====================================================
// FEE STRUCTURES
// =====================================================

// GET /api/accounts/fee-structures

router.get(
  "/fee-structures",
  authenticateToken,
  requireAccountsPermission("FEE_STRUCTURES"),
  async (req, res) => {
    try {
      const [structures] = await db.query(
        `
        SELECT
          id,
          batch_year,
          branch,
          semester,
          tuition_fee,
          exam_fee,
          hostel_fee,
          library_fee,
          development_fee,
          other_fee,
          total_fee,
          due_date,
          created_at
        FROM fee_structures
        ORDER BY batch_year DESC, branch ASC, semester ASC
        `
      );

      return res.json({
        success: true,
        feeStructures: structures,
      });
    } catch (error) {
      console.error(
        "Accounts - Get Fee Structures Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while loading fee structures.",
      });
    }
  }
);

// POST /api/accounts/fee-structures

router.post(
  "/fee-structures",
  authenticateToken,
  requireAccountsPermission("FEE_STRUCTURES"),
  async (req, res) => {
    try {
      const {
        batch_year,
        branch,
        semester,
        tuition_fee,
        exam_fee,
        hostel_fee,
        library_fee,
        development_fee,
        other_fee,
        due_date,
      } = req.body;

      if (
        !batch_year ||
        !branch ||
        !semester ||
        !due_date
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Batch year, branch, semester and due date are required.",
        });
      }

      const cleanBatchYear = Number(batch_year);
      const cleanBranch = String(branch).trim();
      const cleanSemester = String(semester).trim();

      if (
        !Number.isInteger(cleanBatchYear) ||
        cleanBatchYear < 2020 ||
        cleanBatchYear > 2028
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Batch year must be between 2020 and 2028.",
        });
      }

      const fees = {
        tuition_fee: toNumber(tuition_fee),
        exam_fee: toNumber(exam_fee),
        hostel_fee: toNumber(hostel_fee),
        library_fee: toNumber(library_fee),
        development_fee: toNumber(
          development_fee
        ),
        other_fee: toNumber(other_fee),
      };

      const total_fee =
        fees.tuition_fee +
        fees.exam_fee +
        fees.hostel_fee +
        fees.library_fee +
        fees.development_fee +
        fees.other_fee;

      const [result] = await db.query(
        `
        INSERT INTO fee_structures (
          batch_year,
          branch,
          semester,
          tuition_fee,
          exam_fee,
          hostel_fee,
          library_fee,
          development_fee,
          other_fee,
          total_fee,
          due_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          cleanBatchYear,
          cleanBranch,
          cleanSemester,
          fees.tuition_fee,
          fees.exam_fee,
          fees.hostel_fee,
          fees.library_fee,
          fees.development_fee,
          fees.other_fee,
          total_fee,
          due_date,
        ]
      );

      const [rows] = await db.query(
        `
        SELECT
          id,
          batch_year,
          branch,
          semester,
          tuition_fee,
          exam_fee,
          hostel_fee,
          library_fee,
          development_fee,
          other_fee,
          total_fee,
          due_date,
          created_at
        FROM fee_structures
        WHERE id = ?
        `,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message:
          "Fee structure created successfully.",
        feeStructure: rows[0],
      });
    } catch (error) {
      console.error(
        "Accounts - Create Fee Structure Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while creating fee structure.",
      });
    }
  }
);

// PUT /api/accounts/fee-structures/:id

router.put(
  "/fee-structures/:id",
  authenticateToken,
  requireAccountsPermission("FEE_STRUCTURES"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        batch_year,
        branch,
        semester,
        tuition_fee,
        exam_fee,
        hostel_fee,
        library_fee,
        development_fee,
        other_fee,
        due_date,
      } = req.body;

      if (
        !batch_year ||
        !branch ||
        !semester ||
        !due_date
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Batch year, branch, semester and due date are required.",
        });
      }

      const cleanBatchYear = Number(batch_year);

      if (
        !Number.isInteger(cleanBatchYear) ||
        cleanBatchYear < 2020 ||
        cleanBatchYear > 2028
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Batch year must be between 2020 and 2028.",
        });
      }

      const cleanFees = {
        tuition_fee: toNumber(tuition_fee),
        exam_fee: toNumber(exam_fee),
        hostel_fee: toNumber(hostel_fee),
        library_fee: toNumber(library_fee),
        development_fee: toNumber(
          development_fee
        ),
        other_fee: toNumber(other_fee),
      };

      const total_fee =
        cleanFees.tuition_fee +
        cleanFees.exam_fee +
        cleanFees.hostel_fee +
        cleanFees.library_fee +
        cleanFees.development_fee +
        cleanFees.other_fee;

      const [result] = await db.query(
        `
        UPDATE fee_structures
        SET
          batch_year = ?,
          branch = ?,
          semester = ?,
          tuition_fee = ?,
          exam_fee = ?,
          hostel_fee = ?,
          library_fee = ?,
          development_fee = ?,
          other_fee = ?,
          total_fee = ?,
          due_date = ?
        WHERE id = ?
        `,
        [
          cleanBatchYear,
          String(branch).trim(),
          String(semester).trim(),
          cleanFees.tuition_fee,
          cleanFees.exam_fee,
          cleanFees.hostel_fee,
          cleanFees.library_fee,
          cleanFees.development_fee,
          cleanFees.other_fee,
          total_fee,
          due_date,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Fee structure not found.",
        });
      }

      const [rows] = await db.query(
        `
        SELECT
          id,
          batch_year,
          branch,
          semester,
          tuition_fee,
          exam_fee,
          hostel_fee,
          library_fee,
          development_fee,
          other_fee,
          total_fee,
          due_date,
          created_at
        FROM fee_structures
        WHERE id = ?
        `,
        [id]
      );

      return res.json({
        success: true,
        message:
          "Fee structure updated successfully.",
        feeStructure: rows[0],
      });
    } catch (error) {
      console.error(
        "Accounts - Update Fee Structure Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while updating fee structure.",
      });
    }
  }
);

// DELETE /api/accounts/fee-structures/:id

router.delete(
  "/fee-structures/:id",
  authenticateToken,
  requireAccountsPermission("FEE_STRUCTURES"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await db.query(
        `
        DELETE FROM fee_structures
        WHERE id = ?
        `,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Fee structure not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Fee structure deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Accounts - Delete Fee Structure Error:",
        error
      );

      if (
        error.code ===
        "ER_ROW_IS_REFERENCED_2"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This fee structure cannot be deleted because it is already assigned to a student.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Server error while deleting fee structure.",
      });
    }
  }
);

// =====================================================
// STUDENT-WISE FEES
// =====================================================

// GET /api/accounts/student-fees

router.get(
  "/student-fees",
  authenticateToken,
  requireAccountsPermission("STUDENT_FEES"),
  async (req, res) => {
    try {
      const [records] = await db.query(
        `
        SELECT
          sf.id,
          sf.student_id,
          s.name AS student_name,
          s.email AS student_email,
          s.branch,
          s.semester AS student_semester,
          s.batch_year,
          sf.fee_structure_id,
          fs.branch AS fee_branch,
          fs.semester AS fee_semester,
          fs.total_fee AS structure_total,
          sf.academic_year,
          sf.semester,
          sf.total_amount,
          sf.scholarship_amount,
          sf.discount_amount,
          sf.paid_amount,
          sf.due_amount,
          sf.due_date,
          sf.status,
          sf.created_at
        FROM student_fees sf
        INNER JOIN students s
          ON s.student_id = sf.student_id
        INNER JOIN fee_structures fs
          ON fs.id = sf.fee_structure_id
        ORDER BY sf.created_at DESC
        `
      );

      return res.json({
        success: true,
        studentFees: records,
      });
    } catch (error) {
      console.error(
        "Accounts - Get Student Fees Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while loading student fees.",
      });
    }
  }
);

// POST /api/accounts/student-fees

router.post(
  "/student-fees",
  authenticateToken,
  requireAccountsPermission("STUDENT_FEES"),
  async (req, res) => {
    try {
      const {
        student_id,
        fee_structure_id,
        academic_year,
        semester,
        scholarship_amount,
        discount_amount,
        paid_amount,
        due_date,
      } = req.body;

      if (
        !student_id ||
        !fee_structure_id ||
        !academic_year ||
        !semester ||
        !due_date
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Student, fee structure, academic year, semester and due date are required.",
        });
      }

      const [students] = await db.query(
        `
        SELECT
          student_id,
          name,
          branch,
          semester,
          batch_year
        FROM students
        WHERE student_id = ?
        LIMIT 1
        `,
        [student_id]
      );

      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const [structures] = await db.query(
        `
        SELECT
          id,
          total_fee,
          due_date
        FROM fee_structures
        WHERE id = ?
        LIMIT 1
        `,
        [fee_structure_id]
      );

      if (structures.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Fee structure not found.",
        });
      }

      const totalAmount = toNumber(
        structures[0].total_fee
      );

      const scholarship = Math.max(
        0,
        toNumber(scholarship_amount)
      );

      const discount = Math.max(
        0,
        toNumber(discount_amount)
      );

      const paid = Math.max(
        0,
        toNumber(paid_amount)
      );

      const due = Math.max(
        0,
        totalAmount -
          scholarship -
          discount -
          paid
      );

      let status = "PENDING";

      if (due <= 0) {
        status = "PAID";
      } else if (paid > 0) {
        status = "PARTIAL";
      }

      const [result] = await db.query(
        `
        INSERT INTO student_fees (
          student_id,
          fee_structure_id,
          academic_year,
          semester,
          total_amount,
          scholarship_amount,
          discount_amount,
          paid_amount,
          due_amount,
          due_date,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          student_id,
          fee_structure_id,
          String(academic_year).trim(),
          String(semester).trim(),
          totalAmount,
          scholarship,
          discount,
          paid,
          due,
          due_date,
          status,
        ]
      );

      const [rows] = await db.query(
        `
        SELECT
          sf.id,
          sf.student_id,
          s.name AS student_name,
          s.email AS student_email,
          s.branch,
          s.semester AS student_semester,
          s.batch_year,
          sf.fee_structure_id,
          sf.academic_year,
          sf.semester,
          sf.total_amount,
          sf.scholarship_amount,
          sf.discount_amount,
          sf.paid_amount,
          sf.due_amount,
          sf.due_date,
          sf.status,
          sf.created_at
        FROM student_fees sf
        INNER JOIN students s
          ON s.student_id = sf.student_id
        WHERE sf.id = ?
        `,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message:
          "Student fee assigned successfully.",
        studentFee: rows[0],
      });
    } catch (error) {
      console.error(
        "Accounts - Create Student Fee Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while creating student fee record.",
      });
    }
  }
);

// PUT /api/accounts/student-fees/:id

router.put(
  "/student-fees/:id",
  authenticateToken,
  requireAccountsPermission("STUDENT_FEES"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        student_id,
        fee_structure_id,
        academic_year,
        semester,
        scholarship_amount,
        discount_amount,
        paid_amount,
        due_date,
      } = req.body;

      if (
        !student_id ||
        !fee_structure_id ||
        !academic_year ||
        !semester ||
        !due_date
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Student, fee structure, academic year, semester and due date are required.",
        });
      }

      const [structures] = await db.query(
        `
        SELECT
          id,
          total_fee
        FROM fee_structures
        WHERE id = ?
        LIMIT 1
        `,
        [fee_structure_id]
      );

      if (structures.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Fee structure not found.",
        });
      }

      const totalAmount = toNumber(
        structures[0].total_fee
      );

      const scholarship = Math.max(
        0,
        toNumber(scholarship_amount)
      );

      const discount = Math.max(
        0,
        toNumber(discount_amount)
      );

      const paid = Math.max(
        0,
        toNumber(paid_amount)
      );

      const due = Math.max(
        0,
        totalAmount -
          scholarship -
          discount -
          paid
      );

      let status = "PENDING";

      if (due <= 0) {
        status = "PAID";
      } else if (paid > 0) {
        status = "PARTIAL";
      }

      const [result] = await db.query(
        `
        UPDATE student_fees
        SET
          student_id = ?,
          fee_structure_id = ?,
          academic_year = ?,
          semester = ?,
          total_amount = ?,
          scholarship_amount = ?,
          discount_amount = ?,
          paid_amount = ?,
          due_amount = ?,
          due_date = ?,
          status = ?
        WHERE id = ?
        `,
        [
          student_id,
          fee_structure_id,
          String(academic_year).trim(),
          String(semester).trim(),
          totalAmount,
          scholarship,
          discount,
          paid,
          due,
          due_date,
          status,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Student fee record not found.",
        });
      }

      const [rows] = await db.query(
        `
        SELECT
          sf.id,
          sf.student_id,
          s.name AS student_name,
          s.email AS student_email,
          s.branch,
          s.semester AS student_semester,
          s.batch_year,
          sf.fee_structure_id,
          sf.academic_year,
          sf.semester,
          sf.total_amount,
          sf.scholarship_amount,
          sf.discount_amount,
          sf.paid_amount,
          sf.due_amount,
          sf.due_date,
          sf.status,
          sf.created_at
        FROM student_fees sf
        INNER JOIN students s
          ON s.student_id = sf.student_id
        WHERE sf.id = ?
        `,
        [id]
      );

      return res.json({
        success: true,
        message:
          "Student fee record updated successfully.",
        studentFee: rows[0],
      });
    } catch (error) {
      console.error(
        "Accounts - Update Student Fee Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while updating student fee record.",
      });
    }
  }
);

// DELETE /api/accounts/student-fees/:id

router.delete(
  "/student-fees/:id",
  authenticateToken,
  requireAccountsPermission("STUDENT_FEES"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await db.query(
        `
        DELETE FROM student_fees
        WHERE id = ?
        `,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Student fee record not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Student fee record deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Accounts - Delete Student Fee Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while deleting student fee record.",
      });
    }
  }
);

// =====================================================
// EXPORT
// =====================================================
// =====================================================
// STUDENT MY FEES
// GET /api/accounts/student/my-fees
// =====================================================

router.get(
  "/student/my-fees",
  authenticateToken,
  async (req, res) => {
    try {
      const user = req.user || {};

      const role = String(
        user.role ||
          user.userRole ||
          user.user_role ||
          ""
      )
        .trim()
        .toUpperCase();

      // Allow only student accounts
      if (role && role !== "STUDENT") {
        return res.status(403).json({
          success: false,
          message:
            "This page is available only to student accounts.",
        });
      }

      // Try all possible student ID fields
      const possibleStudentIds = [
        user.student_id,
        user.studentId,
        user.registrationNumber,
        user.registration_number,
      ]
        .filter(
          (value) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        )
        .map((value) => String(value).trim());

      // Email fallback
      const possibleEmails = [
        user.email,
      ]
        .filter(
          (value) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        )
        .map((value) => String(value).trim());

      let students = [];

      // Find student using registration/student ID
      if (possibleStudentIds.length > 0) {
        const placeholders = possibleStudentIds
          .map(() => "?")
          .join(", ");

        const [rows] = await db.query(
          `
          SELECT
            student_id,
            name,
            email,
            branch,
            semester,
            batch_year,
            hostel_status
          FROM students
          WHERE student_id IN (${placeholders})
          LIMIT 1
          `,
          possibleStudentIds
        );

        students = rows;
      }

      // If ID was not found, try email
      if (
        students.length === 0 &&
        possibleEmails.length > 0
      ) {
        const [rows] = await db.query(
          `
          SELECT
            student_id,
            name,
            email,
            branch,
            semester,
            batch_year,
            hostel_status
          FROM students
          WHERE email = ?
          LIMIT 1
          `,
          [possibleEmails[0]]
        );

        students = rows;
      }

      // Student does not exist
      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Student profile could not be found.",
        });
      }

      const student = students[0];
      const studentId = student.student_id;

      // =================================================
      // STUDENT FEE RECORDS
      // =================================================

      const [studentFees] = await db.query(
        `
        SELECT
          sf.id,
          sf.student_id,
          sf.fee_structure_id,
          sf.academic_year,
          sf.semester,
          sf.total_amount,
          sf.scholarship_amount,
          sf.discount_amount,
          sf.paid_amount,
          sf.due_amount,
          sf.due_date,
          sf.status,
          sf.created_at,

          fs.batch_year,
          fs.branch AS fee_branch,
          fs.semester AS fee_semester,
          fs.tuition_fee,
          fs.exam_fee,
          fs.hostel_fee,
          fs.library_fee,
          fs.development_fee,
          fs.other_fee,
          fs.total_fee AS structure_total_fee

        FROM student_fees sf

        INNER JOIN fee_structures fs
          ON fs.id = sf.fee_structure_id

        WHERE sf.student_id = ?

        ORDER BY
          sf.created_at DESC,
          sf.id DESC
        `,
        [studentId]
      );

      // =================================================
      // PAYMENT HISTORY
      // =================================================

      const [payments] = await db.query(
        `
        SELECT
          fp.id,
          fp.student_fee_id,
          fp.student_id,
          fp.amount,
          fp.payment_method,
          fp.transaction_id,
          fp.payment_date,
          fp.remarks,
          fp.recorded_by,
          fp.created_at,

          sf.academic_year,
          sf.semester,
          sf.total_amount,
          sf.due_amount

        FROM fee_payments fp

        LEFT JOIN student_fees sf
          ON sf.id = fp.student_fee_id

        WHERE fp.student_id = ?

        ORDER BY
          fp.payment_date DESC,
          fp.id DESC
        `,
        [studentId]
      );

      // =================================================
      // SCHOLARSHIPS
      // =================================================

      const [scholarships] = await db.query(
        `
        SELECT
          id,
          student_id,
          scholarship_name,
          scholarship_type,
          amount,
          description,
          approved_by,
          status,
          created_at

        FROM scholarships

        WHERE student_id = ?

        ORDER BY
          created_at DESC,
          id DESC
        `,
        [studentId]
      );

      // =================================================
      // FEE RECEIPTS
      // =================================================

      const [receipts] = await db.query(
        `
        SELECT
          fr.id,
          fr.payment_id,
          fr.receipt_number,
          fr.receipt_file,
          fr.generated_by,
          fr.created_at,

          fp.student_fee_id,
          fp.amount,
          fp.payment_method,
          fp.transaction_id,
          fp.payment_date

        FROM fee_receipts fr

        INNER JOIN fee_payments fp
          ON fp.id = fr.payment_id

        WHERE fp.student_id = ?

        ORDER BY
          fr.created_at DESC,
          fr.id DESC
        `,
        [studentId]
      );

      // =================================================
      // CALCULATE TOTALS
      // =================================================

      const totals = studentFees.reduce(
        (summary, item) => {
          summary.total += Number(
            item.total_amount || 0
          );

          summary.scholarship += Number(
            item.scholarship_amount || 0
          );

          summary.discount += Number(
            item.discount_amount || 0
          );

          summary.paid += Number(
            item.paid_amount || 0
          );

          summary.due += Number(
            item.due_amount || 0
          );

          return summary;
        },
        {
          total: 0,
          scholarship: 0,
          discount: 0,
          paid: 0,
          due: 0,
        }
      );

      // =================================================
      // RESPONSE
      // =================================================

      return res.json({
        success: true,

        student,

        totals,

        studentFees,

        payments,

        scholarships,

        receipts,
      });
    } catch (error) {
      console.error(
        "Student My Fees Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while loading your fee information.",
      });
    }
  }
);
module.exports = router;