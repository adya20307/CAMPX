const express = require("express");
const router = express.Router();

const db = require("../db");

// =====================================================
// HELPER
// =====================================================

const formatMenuRow = (row) => ({
  id: row.id,
  meal_type: row.meal_type,
  item_name: row.menu_items,
  menu_items: row.menu_items,
  description: null,
  menu_date: row.menu_date,
  is_available: true,
  created_by: row.created_by,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// =====================================================
// GET TODAY'S MENU
// =====================================================

router.get("/today", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        menu_date,
        meal_type,
        menu_items,
        created_by,
        created_at,
        updated_at
      FROM canteen_menu
      WHERE menu_date = CURDATE()
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
      date: new Date().toISOString().split("T")[0],
      menu: rows.map(formatMenuRow),
    });
  } catch (error) {
    console.error("Error fetching today's canteen menu:", error);

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
        menu_date,
        meal_type,
        menu_items,
        created_by,
        created_at,
        updated_at
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
      menu: rows.map(formatMenuRow),
    });
  } catch (error) {
    console.error("Error fetching canteen menu:", error);

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
        menu_date,
        meal_type,
        menu_items,
        created_by,
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
      menu: rows.map(formatMenuRow),
    });
  } catch (error) {
    console.error("Error fetching canteen menu:", error);

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

    if (!mealType || !itemName || !menuDate) {
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

    /*
      Your existing database has only one text field:
      menu_items

      Therefore we store the item name there.

      If a description is supplied, we append it to the
      same text field so no database structure change
      is required.
    */

    let menuText = itemName.trim();

    if (description && description.trim()) {
      menuText += ` - ${description.trim()}`;
    }

    const [result] = await db.query(
      `
      INSERT INTO canteen_menu
      (
        menu_date,
        meal_type,
        menu_items
      )
      VALUES (?, ?, ?)
      `,
      [
        menuDate,
        mealType,
        menuText,
      ]
    );

    const [rows] = await db.query(
      `
      SELECT
        id,
        menu_date,
        meal_type,
        menu_items,
        created_by,
        created_at,
        updated_at
      FROM canteen_menu
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Canteen menu item added successfully",
      menuItem: formatMenuRow(rows[0]),
    });
  } catch (error) {
    console.error("Error adding canteen menu item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add canteen menu item",
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
    } = req.body;

    if (!mealType || !itemName || !menuDate) {
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

    let menuText = itemName.trim();

    if (description && description.trim()) {
      menuText += ` - ${description.trim()}`;
    }

    const [result] = await db.query(
      `
      UPDATE canteen_menu
      SET
        meal_type = ?,
        menu_items = ?,
        menu_date = ?
      WHERE id = ?
      `,
      [
        mealType,
        menuText,
        menuDate,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Canteen menu item not found",
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        menu_date,
        meal_type,
        menu_items,
        created_by,
        created_at,
        updated_at
      FROM canteen_menu
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Canteen menu item updated successfully",
      menuItem: formatMenuRow(rows[0]),
    });
  } catch (error) {
    console.error("Error updating canteen menu item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update canteen menu item",
    });
  }
});

// =====================================================
// TOGGLE MENU ITEM AVAILABILITY
// =====================================================

router.patch("/:id/toggle", async (req, res) => {
  /*
    The current canteen_menu table does not contain an
    is_available column.

    Therefore availability cannot actually be toggled
    without changing the database structure.

    We return a clear response instead of generating a
    database error.
  */

  res.status(400).json({
    success: false,
    message:
      "Availability toggle is not available because the canteen_menu table does not have an is_available column.",
  });
});

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
        message: "Canteen menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Canteen menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting canteen menu item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete canteen menu item",
    });
  }
});

// =====================================================
// EXPORT
// =====================================================

module.exports = router;