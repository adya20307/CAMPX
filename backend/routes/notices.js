const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../db");
const {
  authenticateToken,
  requirePermission,
} = require("../middleware/departmentAuth");

const router = express.Router();

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "notices"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .substring(0, 80);

    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${extension}`;

    cb(null, uniqueName);
  },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error(
        "Only PDF, DOC, and DOCX files are allowed."
      )
    );
  }

  cb(null, true);
};

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =====================================================
// HELPERS
// =====================================================

const getFacultyId = (req) => {
  return (
    req.user?.facultyId ||
    req.user?.faculty_id ||
    req.user?.id ||
    null
  );
};

const getStudentId = (req) => {
  return (
    req.user?.studentId ||
    req.user?.student_id ||
    req.user?.registrationNumber ||
    null
  );
};

// =====================================================
// GET ALL NOTICES FOR ADMIN
// =====================================================

router.get(
  "/admin",
  authenticateToken,
  requirePermission("NOTIFICATIONS"),
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `
        SELECT
          id,
          title,
          message,
          file_path,
          department,
          target_batch,
          created_by,
          is_active,
          created_at,
          updated_at
        FROM department_notices
        ORDER BY created_at DESC
        `
      );

      res.json({
        success: true,
        notices: rows,
      });
    } catch (error) {
      console.error(
        "Get admin notices error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to load notices.",
      });
    }
  }
);

// =====================================================
// GET NOTICES FOR STUDENT
// =====================================================

router.get(
  "/student",
  authenticateToken,
  async (req, res) => {
    try {
      const studentId = getStudentId(req);

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Student information not found.",
        });
      }

      const [students] = await db.query(
        `
        SELECT
          student_id,
          batch_year
        FROM students
        WHERE student_id = ?
        LIMIT 1
        `,
        [studentId]
      );

      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const batchYear = students[0].batch_year;

      const [notices] = await db.query(
        `
        SELECT
          id,
          title,
          message,
          file_path,
          department,
          target_batch,
          created_by,
          created_at,
          updated_at
        FROM department_notices
        WHERE is_active = 1
          AND (
            target_batch IS NULL
            OR target_batch = ?
          )
        ORDER BY created_at DESC
        `,
        [batchYear]
      );

      res.json({
        success: true,
        batchYear,
        notices,
      });
    } catch (error) {
      console.error(
        "Get student notices error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to load student notices.",
      });
    }
  }
);

// =====================================================
// CREATE / UPLOAD NOTICE
// =====================================================

router.post(
  "/",
  authenticateToken,
  requirePermission("NOTIFICATIONS"),
  upload.single("noticeFile"),
  async (req, res) => {
    let uploadedFilePath = null;

    try {
      const {
        title,
        message,
        targetBatch,
        department,
      } = req.body;

      const cleanTitle = String(
        title || ""
      ).trim();

      const cleanMessage = String(
        message || ""
      ).trim();

      const cleanDepartment = String(
        department || "General"
      ).trim();

      if (!cleanTitle) {
        return res.status(400).json({
          success: false,
          message: "Notice title is required.",
        });
      }

      if (!cleanMessage) {
        return res.status(400).json({
          success: false,
          message: "Notice message is required.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a notice file.",
        });
      }

      uploadedFilePath = req.file.path;

      let batch = null;

      if (
        targetBatch !== undefined &&
        targetBatch !== null &&
        String(targetBatch).trim() !== ""
      ) {
        batch = Number(targetBatch);

        if (
          !Number.isInteger(batch) ||
          batch < 2020 ||
          batch > 2028
        ) {
          fs.unlinkSync(uploadedFilePath);
          uploadedFilePath = null;

          return res.status(400).json({
            success: false,
            message:
              "Target batch must be between 2020 and 2028.",
          });
        }
      }

      const createdBy = getFacultyId(req);

      if (!createdBy) {
        fs.unlinkSync(uploadedFilePath);
        uploadedFilePath = null;

        return res.status(401).json({
          success: false,
          message:
            "Admin information was not found.",
        });
      }

      const relativeFilePath = path
        .relative(
          path.join(__dirname, ".."),
          uploadedFilePath
        )
        .replace(/\\/g, "/");

      const [result] = await db.query(
        `
        INSERT INTO department_notices
        (
          title,
          message,
          file_path,
          department,
          target_batch,
          created_by,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, 1)
        `,
        [
          cleanTitle,
          cleanMessage,
          relativeFilePath,
          cleanDepartment,
          batch,
          createdBy,
        ]
      );

      const [rows] = await db.query(
        `
        SELECT
          id,
          title,
          message,
          file_path,
          department,
          target_batch,
          created_by,
          is_active,
          created_at,
          updated_at
        FROM department_notices
        WHERE id = ?
        LIMIT 1
        `,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message:
          "Notice uploaded successfully.",
        notice: rows[0],
      });
    } catch (error) {
      console.error(
        "Create notice error:",
        error
      );

      if (
        uploadedFilePath &&
        fs.existsSync(uploadedFilePath)
      ) {
        try {
          fs.unlinkSync(uploadedFilePath);
        } catch (fileError) {
          console.error(
            "Unable to remove uploaded file:",
            fileError
          );
        }
      }

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to upload notice.",
      });
    }
  }
);

// =====================================================
// DOWNLOAD NOTICE FILE
// =====================================================

router.get(
  "/:id/download",
  authenticateToken,
  async (req, res) => {
    try {
      const noticeId = Number(req.params.id);

      if (!Number.isInteger(noticeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notice ID.",
        });
      }

      const [rows] = await db.query(
        `
        SELECT
          id,
          title,
          file_path,
          is_active,
          target_batch
        FROM department_notices
        WHERE id = ?
        LIMIT 1
        `,
        [noticeId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Notice not found.",
        });
      }

      const notice = rows[0];

      if (!notice.is_active) {
        return res.status(404).json({
          success: false,
          message: "Notice is no longer active.",
        });
      }

      if (!notice.file_path) {
        return res.status(404).json({
          success: false,
          message:
            "No file is attached to this notice.",
        });
      }

      // -------------------------------------------------
      // STUDENT BATCH SECURITY
      // -------------------------------------------------

      const userRole =
        req.user?.role ||
        req.user?.userType ||
        req.user?.type;

      const isStudent =
        userRole === "STUDENT" ||
        req.user?.studentId ||
        req.user?.student_id ||
        req.user?.registrationNumber;

      if (isStudent) {
        const studentId = getStudentId(req);

        const [students] = await db.query(
          `
          SELECT batch_year
          FROM students
          WHERE student_id = ?
          LIMIT 1
          `,
          [studentId]
        );

        if (students.length === 0) {
          return res.status(403).json({
            success: false,
            message:
              "Student profile not found.",
          });
        }

        const studentBatch =
          students[0].batch_year;

        if (
          notice.target_batch !== null &&
          Number(notice.target_batch) !==
            Number(studentBatch)
        ) {
          return res.status(403).json({
            success: false,
            message:
              "You are not authorized to download this notice.",
          });
        }
      }

      const absolutePath = path.resolve(
        path.join(
          __dirname,
          "..",
          notice.file_path
        )
      );

      const uploadRoot = path.resolve(
        uploadDirectory
      );

      if (
        !absolutePath.startsWith(
          uploadRoot + path.sep
        )
      ) {
        return res.status(403).json({
          success: false,
          message: "Invalid file path.",
        });
      }

      if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({
          success: false,
          message:
            "Notice file is missing from the server.",
        });
      }

      const extension = path.extname(
        absolutePath
      );

      const downloadName =
        `${notice.title.replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        )}${extension}`;

      res.download(
        absolutePath,
        downloadName
      );
    } catch (error) {
      console.error(
        "Download notice error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to download notice.",
      });
    }
  }
);

// =====================================================
// DELETE NOTICE
// =====================================================

router.delete(
  "/:id",
  authenticateToken,
  requirePermission("NOTIFICATIONS"),
  async (req, res) => {
    try {
      const noticeId = Number(req.params.id);

      if (!Number.isInteger(noticeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notice ID.",
        });
      }

      const [rows] = await db.query(
        `
        SELECT
          id,
          file_path
        FROM department_notices
        WHERE id = ?
        LIMIT 1
        `,
        [noticeId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Notice not found.",
        });
      }

      const notice = rows[0];

      await db.query(
        `
        DELETE FROM department_notices
        WHERE id = ?
        `,
        [noticeId]
      );

      if (notice.file_path) {
        const absolutePath = path.resolve(
          path.join(
            __dirname,
            "..",
            notice.file_path
          )
        );

        const uploadRoot = path.resolve(
          uploadDirectory
        );

        if (
          absolutePath.startsWith(
            uploadRoot + path.sep
          ) &&
          fs.existsSync(absolutePath)
        ) {
          try {
            fs.unlinkSync(absolutePath);
          } catch (fileError) {
            console.error(
              "Unable to delete notice file:",
              fileError
            );
          }
        }
      }

      res.json({
        success: true,
        message:
          "Notice deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete notice error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete notice.",
      });
    }
  }
);

// =====================================================
// MULTER / FILE ERROR HANDLER
// =====================================================

router.use(
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message:
            "File size cannot exceed 10 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  }
);

module.exports = router;