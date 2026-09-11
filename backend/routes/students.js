const express = require("express");

const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [students] = await db.query(
      `SELECT
        student_id AS id,
        name,
        email,
        phone,
        branch,
        semester,
        section,
        hostel,
        room
       FROM students
       ORDER BY id`
    );

    res.json({
      success: true,
      students: students.map((student) => ({
        ...student,
        status: "Active",
      })),
    });
  } catch (error) {
    console.error("Student list error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load students",
    });
  }
});

module.exports = router;
