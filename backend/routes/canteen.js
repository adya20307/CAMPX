const express = require("express");
const router = express.Router();

const db = require("../db");

// =====================================================
// GET TODAY'S MENU
// =====================================================

router.get("/today", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        meal_type,
        item_name,
        description,
        menu_date,
        is_available
      FROM canteen_menu
      WHERE menu_date = CURDATE()
        AND is_available = TRUE
      ORDER BY
        CASE meal_type
          WHEN 'BREAKFAST' THEN 1
          WHEN 'LUNCH' THEN 2
          WHEN 'SNACKS' THEN 3
          WHEN 'DINNER' THEN 4
        END,
        id ASC
      `
    );

    res.json({
      success: true,
      date: new Date()
        .toISOString()
        .split("T")[0],
      menu: rows,
    });
  } catch (error) {
    console.error(
      "Error fetching today's canteen menu:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch today's menu",
    });
  }
});

// =====================================================
// GET MENU FOR A SPECIFIC DATE
// =====================================================

router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        meal_type,
        item_name,
        description,
        menu_date,
        is_available
      FROM canteen_menu
      WHERE menu_date = ?
      ORDER BY
        CASE meal_type
          WHEN 'BREAKFAST' THEN 1
          WHEN 'LUNCH' THEN 2
          WHEN 'SNACKS' THEN 3
          WHEN 'DINNER' THEN 4
        END,
        id ASC
      `,
      [date]
    );

    res.json({
      success: true,
      date,
      menu: rows,
    });
  } catch (error) {
    console.error(
      "Error fetching canteen menu:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch canteen menu",
    });
  }
});

// =====================================================
// GET ALL MENU ITEMS
// ADMIN USE
// =====================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        meal_type,
        item_name,
        description,
        menu_date,
        is_available,
        created_at,
        updated_at
      FROM canteen_menu
      ORDER BY
        menu_date DESC,
        CASE meal_type
          WHEN 'BREAKFAST' THEN 1
          WHEN 'LUNCH' THEN 2
          WHEN 'SNACKS' THEN 3
          WHEN 'DINNER' THEN 4
        END,
        id ASC
      `
    );

    res.json({
      success: true,
      menu: rows,
    });
  } catch (error) {
    console.error(
      "Error fetching canteen menu:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch canteen menu",
    });
  }
});

// =====================================================
// ADD MENU ITEM
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      mealType,
      itemName,
      description,
      menuDate,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      !mealType ||
      !itemName ||
      !menuDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Meal type, item name and menu date are required",
      });
    }

    const allowedMealTypes = [
      "BREAKFAST",
      "LUNCH",
      "SNACKS",
      "DINNER",
    ];

    if (!allowedMealTypes.includes(mealType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal type",
      });
    }

    // -----------------------------------------------
    // INSERT
    // -----------------------------------------------

    const [result] = await db.query(
      `
      INSERT INTO canteen_menu
      (
        meal_type,
        item_name,
        description,
        menu_date,
        is_available
      )
      VALUES (?, ?, ?, ?, TRUE)
      `,
      [
        mealType,
        itemName.trim(),
        description
          ? description.trim()
          : null,
        menuDate,
      ]
    );

    // -----------------------------------------------
    // RETURN CREATED ITEM
    // -----------------------------------------------

    const [rows] = await db.query(
      `
      SELECT *
      FROM canteen_menu
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message:
        "Canteen menu item added successfully",
      menuItem: rows[0],
    });
  } catch (error) {
    console.error(
      "Error adding canteen menu item:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to add canteen menu item",
    });
  }
});

// =====================================================
// UPDATE MENU ITEM
// =====================================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      mealType,
      itemName,
      description,
      menuDate,
      isAvailable,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      !mealType ||
      !itemName ||
      !menuDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Meal type, item name and menu date are required",
      });
    }

    const allowedMealTypes = [
      "BREAKFAST",
      "LUNCH",
      "SNACKS",
      "DINNER",
    ];

    if (!allowedMealTypes.includes(mealType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal type",
      });
    }

    // -----------------------------------------------
    // UPDATE
    // -----------------------------------------------

    const [result] = await db.query(
      `
      UPDATE canteen_menu
      SET
        meal_type = ?,
        item_name = ?,
        description = ?,
        menu_date = ?,
        is_available = ?
      WHERE id = ?
      `,
      [
        mealType,
        itemName.trim(),
        description
          ? description.trim()
          : null,
        menuDate,
        isAvailable !== undefined
          ? Boolean(isAvailable)
          : true,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Canteen menu item not found",
      });
    }

    // -----------------------------------------------
    // RETURN UPDATED ITEM
    // -----------------------------------------------

    const [rows] = await db.query(
      `
      SELECT *
      FROM canteen_menu
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message:
        "Canteen menu item updated successfully",
      menuItem: rows[0],
    });
  } catch (error) {
    console.error(
      "Error updating canteen menu item:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update canteen menu item",
    });
  }
});

// =====================================================
// TOGGLE MENU ITEM AVAILABILITY
// =====================================================

router.patch(
  "/:id/toggle",
  async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await db.query(
        `
        UPDATE canteen_menu
        SET is_available =
          CASE
            WHEN is_available = TRUE
            THEN FALSE
            ELSE TRUE
          END
        WHERE id = ?
        `,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Canteen menu item not found",
        });
      }

      const [rows] = await db.query(
        `
        SELECT *
        FROM canteen_menu
        WHERE id = ?
        `,
        [id]
      );

      res.json({
        success: true,
        message:
          "Menu item availability updated",
        menuItem: rows[0],
      });
    } catch (error) {
      console.error(
        "Error toggling menu availability:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update availability",
      });
    }
  }
);

// =====================================================
// DELETE MENU ITEM
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM canteen_menu
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Canteen menu item not found",
      });
    }

    res.json({
      success: true,
      message:
        "Canteen menu item deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting canteen menu item:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete canteen menu item",
    });
  }
});

module.exports = router;