// =====================================================
// CAMPX DEPARTMENT AUTHORIZATION MIDDLEWARE
// =====================================================
//
// This middleware protects Admin APIs according to
// their assigned department.
//
// SUPER_ADMIN:
//     Full access
//
// ADMIN:
//     Only access to permissions belonging to
//     their assigned department.
//
// =====================================================

const jwt = require("jsonwebtoken");

const {
  hasPermission,
  hasDepartmentAccess,
  isSuperAdmin,
} = require("../config/departmentPermissions");


// =====================================================
// JWT AUTHENTICATION
// =====================================================

function authenticateToken(req, res, next) {

  const authHeader =
    req.headers.authorization;


  // No Authorization header
  if (!authHeader) {

    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });

  }


  // Expected format:
  //
  // Authorization: Bearer TOKEN

  const parts =
    authHeader.split(" ");


  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {

    return res.status(401).json({
      success: false,
      message: "Invalid authorization format.",
    });

  }


  const token =
    parts[1];


  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // Store authenticated user
    // inside req.user

    req.user =
      decoded;


    next();

  } catch (error) {

    console.error(
      "JWT authentication error:",
      error.message
    );


    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });

  }

}


// =====================================================
// REQUIRE ADMIN
// =====================================================
//
// Allows:
// ADMIN
// SUPER_ADMIN
//
// Blocks:
// STUDENT
// unauthenticated users
//
// =====================================================

function requireAdmin(
  req,
  res,
  next
) {

  if (!req.user) {

    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });

  }


  const role =
    req.user.role;


  if (
    role !== "ADMIN" &&
    role !== "SUPER_ADMIN"
  ) {

    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });

  }


  next();

}


// =====================================================
// REQUIRE SUPER ADMIN
// =====================================================
//
// Only SUPER_ADMIN can continue.
//
// =====================================================

function requireSuperAdmin(
  req,
  res,
  next
) {

  if (!req.user) {

    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });

  }


  if (
    !isSuperAdmin(
      req.user
    )
  ) {

    return res.status(403).json({
      success: false,
      message: "Super Admin access required.",
    });

  }


  next();

}


// =====================================================
// REQUIRE PERMISSION
// =====================================================
//
// Usage:
//
// router.get(
//   "/attendance",
//   authenticateToken,
//   requirePermission("ATTENDANCE"),
//   controller
// );
//
// SUPER_ADMIN automatically passes.
//
// Normal ADMIN must have the permission
// assigned to their department.
//
// =====================================================

function requirePermission(
  permission
) {

  return (
    req,
    res,
    next
  ) => {

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

    }


    // -----------------------------------------------
    // SUPER ADMIN
    // -----------------------------------------------

    if (
      isSuperAdmin(
        req.user
      )
    ) {

      return next();

    }


    // -----------------------------------------------
    // NORMAL ADMIN
    // -----------------------------------------------

    if (
      req.user.role !==
      "ADMIN"
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Admin access required.",
      });

    }


    const department =
      req.user.department ||
      req.user.admin_section;


    const allowed =
      hasPermission(
        department,
        permission,
        req.user
      );


    if (!allowed) {

      return res.status(403).json({
        success: false,

        message:
          `Access denied. Your department does not have permission: ${permission}.`,

      });

    }


    next();

  };

}


// =====================================================
// REQUIRE DEPARTMENT
// =====================================================
//
// Usage:
//
// router.get(
//   "/accounts",
//   authenticateToken,
//   requireDepartment("ACCOUNTS"),
//   controller
// );
//
// SUPER_ADMIN automatically passes.
//
// =====================================================

function requireDepartment(
  department
) {

  return (
    req,
    res,
    next
  ) => {

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

    }


    // Super Admin
    if (
      isSuperAdmin(
        req.user
      )
    ) {

      return next();

    }


    const allowed =
      hasDepartmentAccess(
        req.user,
        department
      );


    if (!allowed) {

      return res.status(403).json({

        success: false,

        message:
          `Access denied. This section is restricted to the ${department} department.`,

      });

    }


    next();

  };

}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  authenticateToken,

  requireAdmin,

  requireSuperAdmin,

  requirePermission,

  requireDepartment,

};