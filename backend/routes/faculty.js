const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db");

const router = express.Router();


// =====================================================
// VALID DEPARTMENTS
// =====================================================

const VALID_DEPARTMENTS = [
  "DOCUMENTATION",
  "ACCOUNTS",
  "ACADEMIC",
  "EXAMINATION",
  "NOTICE_COMMUNICATION",
  "HOSTEL",
  "STUDENT_AFFAIRS",
  "ADMINISTRATION",
  "LIBRARY",
  "TRANSPORT",
  "IT",
  "PLACEMENT",
  "DISCIPLINE",
  "HEALTH_EMERGENCY",
  "INFRASTRUCTURE_MAINTENANCE",
  "MESS_FOOD",
];


// =====================================================
// DEPARTMENT DISPLAY NAMES
// =====================================================

const DEPARTMENT_NAMES = {
  DOCUMENTATION: "Documentation",
  ACCOUNTS: "Accounts",
  ACADEMIC: "Academic / Class",
  EXAMINATION: "Examination",
  NOTICE_COMMUNICATION: "Notice & Communication",
  HOSTEL: "Hostel",
  STUDENT_AFFAIRS: "Student Affairs",
  ADMINISTRATION: "Administration",
  LIBRARY: "Library",
  TRANSPORT: "Transport",
  IT: "IT Services",
  PLACEMENT: "Placement",
  DISCIPLINE: "Discipline",
  HEALTH_EMERGENCY: "Health & Emergency",
  INFRASTRUCTURE_MAINTENANCE:
    "Infrastructure & Maintenance",
  MESS_FOOD: "Mess / Food Services",
};


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

function authenticateToken(req, res, next) {

  const authHeader = req.headers.authorization;

  const token =
    authHeader &&
    authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;


  if (!token) {

    return res.status(401).json({
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
      "Token verification error:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired token.",
    });

  }
}


// =====================================================
// SUPER ADMIN AUTHORIZATION
// =====================================================

function requireSuperAdmin(
  req,
  res,
  next
) {

  if (!req.user) {

    return res.status(401).json({
      message:
        "Authentication required.",
    });

  }


  if (
    req.user.role !==
    "SUPER_ADMIN"
  ) {

    return res.status(403).json({
      message:
        "Only the Super Admin can perform this action.",
    });

  }


  next();
}


// =====================================================
// CREATE ADMIN
// =====================================================
// POST /api/faculty/admin
//
// Only SUPER_ADMIN can create an Admin.
//
// Required:
// name
// email
// department
// designation
// faculty_id
// password
//
// admin_section is NOT trusted from frontend.
// It is automatically set equal to department.
// =====================================================

router.post(
  "/admin",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {

    try {

      const {
        name,
        email,
        department,
        designation,
        faculty_id,
        password,
      } = req.body;


      // ============================================
      // BASIC VALIDATION
      // ============================================

      if (
        !name ||
        !email ||
        !department ||
        !designation ||
        !faculty_id ||
        !password
      ) {

        return res.status(400).json({
          message:
            "Name, email, department, designation, Faculty ID and password are required.",
        });

      }


      // ============================================
      // CLEAN VALUES
      // ============================================

      const cleanName =
        String(name).trim();

      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();

      const cleanDepartment =
        String(department)
          .trim()
          .toUpperCase();

      const cleanDesignation =
        String(designation).trim();

      const cleanFacultyId =
        String(faculty_id).trim();

      const cleanPassword =
        String(password);


      // ============================================
      // VALIDATE DEPARTMENT
      // ============================================

      if (
        !VALID_DEPARTMENTS.includes(
          cleanDepartment
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid department selected.",
          validDepartments:
            VALID_DEPARTMENTS.map(
              (id) => ({
                id,
                name:
                  DEPARTMENT_NAMES[id],
              })
            ),
        });

      }


      // ============================================
      // PASSWORD VALIDATION
      // ============================================

      if (
        cleanPassword.length < 6
      ) {

        return res.status(400).json({
          message:
            "Password must contain at least 6 characters.",
        });

      }


      // ============================================
      // FACULTY ID VALIDATION
      // ============================================

      if (
        cleanFacultyId.length < 3
      ) {

        return res.status(400).json({
          message:
            "Faculty ID must contain at least 3 characters.",
        });

      }


      // ============================================
      // CHECK EXISTING FACULTY ID
      // ============================================

      const [
        existingFaculty,
      ] = await db.query(
        `
        SELECT
          id,
          faculty_id,
          role
        FROM faculty
        WHERE faculty_id = ?
        LIMIT 1
        `,
        [cleanFacultyId]
      );


      if (
        existingFaculty.length > 0
      ) {

        return res.status(409).json({
          message:
            `Faculty ID ${cleanFacultyId} already exists.`,
        });

      }


      // ============================================
      // CHECK EMAIL
      // ============================================

      const [
        existingEmail,
      ] = await db.query(
        `
        SELECT
          id,
          faculty_id,
          email
        FROM faculty
        WHERE LOWER(email) = ?
        LIMIT 1
        `,
        [cleanEmail]
      );


      if (
        existingEmail.length > 0
      ) {

        return res.status(409).json({
          message:
            `Email ${cleanEmail} is already registered.`,
        });

      }


      // ============================================
      // HASH PASSWORD
      // ============================================

      const passwordHash =
        await bcrypt.hash(
          cleanPassword,
          10
        );


      // ============================================
      // INSERT ADMIN
      // ============================================
      //
      // IMPORTANT:
      //
      // department = selected department
      // admin_section = same department
      //
      // This keeps both existing database
      // fields synchronized.
      // ============================================

      const [
        result,
      ] = await db.query(
        `
        INSERT INTO faculty
        (
          faculty_id,
          name,
          email,
          password_hash,
          designation,
          department,
          role,
          admin_section,
          is_active
        )
        VALUES
        (?, ?, ?, ?, ?, ?, 'ADMIN', ?, TRUE)
        `,
        [
          cleanFacultyId,
          cleanName,
          cleanEmail,
          passwordHash,
          cleanDesignation,
          cleanDepartment,
          cleanDepartment,
        ]
      );


      // ============================================
      // SUCCESS
      // ============================================

      return res.status(201).json({

        success: true,

        message:
          "Admin created successfully.",

        admin: {

          id:
            result.insertId,

          faculty_id:
            cleanFacultyId,

          name:
            cleanName,

          email:
            cleanEmail,

          designation:
            cleanDesignation,

          department:
            cleanDepartment,

          departmentName:
            DEPARTMENT_NAMES[
              cleanDepartment
            ],

          admin_section:
            cleanDepartment,

          role:
            "ADMIN",

          is_active:
            true,

        },

      });

    } catch (error) {

      console.error(
        "Create Admin Error:",
        error
      );


      // ==========================================
      // DUPLICATE ENTRY
      // ==========================================

      if (
        error.code ===
        "ER_DUP_ENTRY"
      ) {

        return res.status(409).json({
          message:
            "Faculty ID or email already exists.",
        });

      }


      // ==========================================
      // DATABASE ERROR
      // ==========================================

      return res.status(500).json({
        message:
          "Server error while creating Admin.",
      });

    }

  }
);


// =====================================================
// GET VALID DEPARTMENTS
// =====================================================
// GET /api/faculty/departments
//
// This will be used by the Add Admin frontend
// to populate the Department dropdown.
// =====================================================

router.get(
  "/departments",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {

    try {

      const departments =
        VALID_DEPARTMENTS.map(
          (id) => ({
            id,
            name:
              DEPARTMENT_NAMES[id],
          })
        );


      return res.json({

        success: true,

        departments,

      });

    } catch (error) {

      console.error(
        "Get Departments Error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error while loading departments.",
      });

    }

  }
);


// =====================================================
// GET ALL ADMINS
// =====================================================
// GET /api/faculty/admins
//
// Only Super Admin can see all registered Admins.
// =====================================================

router.get(
  "/admins",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {

    try {

      const [
        admins,
      ] = await db.query(
        `
        SELECT
          id,
          faculty_id,
          name,
          email,
          designation,
          department,
          role,
          admin_section,
          is_active,
          created_at
        FROM faculty
        WHERE role = 'ADMIN'
        ORDER BY created_at DESC
        `
      );


      const formattedAdmins =
        admins.map(
          (admin) => ({

            ...admin,

            departmentName:
              DEPARTMENT_NAMES[
                admin.department
              ] ||
              admin.department,

          })
        );


      return res.json({

        success: true,

        admins:
          formattedAdmins,

      });

    } catch (error) {

      console.error(
        "Get Admins Error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error while loading Admins.",
      });

    }

  }
);


// =====================================================
// GET CURRENT ADMIN PROFILE
// =====================================================
// GET /api/faculty/me
//
// Returns the logged-in faculty information.
// Useful for department-based frontend permissions.
// =====================================================

router.get(
  "/me",
  authenticateToken,
  async (req, res) => {

    try {

      const facultyId =
        req.user.facultyId ||
        req.user.faculty_id;


      if (!facultyId) {

        return res.status(400).json({
          message:
            "Faculty ID not found in authentication token.",
        });

      }


      const [
        faculty,
      ] = await db.query(
        `
        SELECT
          id,
          faculty_id,
          name,
          email,
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
        [facultyId]
      );


      if (
        faculty.length === 0
      ) {

        return res.status(404).json({
          message:
            "Faculty account not found.",
        });

      }


      const user =
        faculty[0];


      return res.json({

        success: true,

        user: {

          ...user,

          departmentName:
            DEPARTMENT_NAMES[
              user.department
            ] ||
            user.department,

        },

      });

    } catch (error) {

      console.error(
        "Get Faculty Profile Error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error while loading faculty profile.",
      });

    }

  }
);


// =====================================================
// EXPORT
// =====================================================
// =====================================================
// DELETE ADMIN
// =====================================================
//
// Only SUPER_ADMIN can delete an ADMIN.
// SUPER_ADMIN cannot delete itself.
//
// =====================================================

router.delete(
  "/admin/:facultyId",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {

    const { facultyId } = req.params;

    try {

      // -----------------------------------------------
      // Prevent deleting the currently logged-in
      // Super Admin
      // -----------------------------------------------

      if (
        req.user.facultyId === facultyId ||
        req.user.faculty_id === facultyId
      ) {

        return res.status(400).json({
          success: false,
          message:
            "You cannot delete the currently logged-in Super Admin.",
        });

      }


      // -----------------------------------------------
      // Check that the Admin exists
      // -----------------------------------------------

      const [admins] = await db.query(
        `
        SELECT faculty_id, name, role
        FROM faculty
        WHERE faculty_id = ?
        `,
        [facultyId]
      );


      if (admins.length === 0) {

        return res.status(404).json({
          success: false,
          message: "Admin not found.",
        });

      }


      const admin = admins[0];


      // -----------------------------------------------
      // Only ADMIN accounts can be deleted here
      // -----------------------------------------------

      if (
        admin.role !== "ADMIN"
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Only normal Admin accounts can be deleted.",
        });

      }


      // -----------------------------------------------
      // Delete department assignments first
      // -----------------------------------------------

      await db.query(
        `
        DELETE FROM admin_departments
        WHERE faculty_id = ?
        `,
        [facultyId]
      );


      // -----------------------------------------------
      // Delete Admin
      // -----------------------------------------------

      const [result] = await db.query(
        `
        DELETE FROM faculty
        WHERE faculty_id = ?
          AND role = 'ADMIN'
        `,
        [facultyId]
      );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          success: false,
          message: "Admin could not be deleted.",
        });

      }


      return res.json({

        success: true,

        message:
          `Admin ${admin.name} (${facultyId}) deleted successfully.`,

        facultyId,

      });


    } catch (error) {

      console.error(
        "Delete Admin Error:",
        error
      );


      // ---------------------------------------------
      // Foreign key protection
      // ---------------------------------------------

      if (
        error.code ===
        "ER_ROW_IS_REFERENCED_2"
      ) {

        return res.status(409).json({
          success: false,
          message:
            "This Admin cannot be deleted because they are referenced by existing campus records.",
        });

      }


      return res.status(500).json({
        success: false,
        message:
          "Server error while deleting Admin.",
      });

    }

  }
);
module.exports = router;