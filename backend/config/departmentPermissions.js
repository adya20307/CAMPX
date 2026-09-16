// =====================================================
// CAMPX DEPARTMENT PERMISSIONS
// =====================================================
//
// Central source of truth for department-based access.
//
// SUPER_ADMIN = full access
// ADMIN       = access based on department
//
// =====================================================


// =====================================================
// DEPARTMENT NAMES
// =====================================================

const DEPARTMENTS = {

  DOCUMENTATION: "Documentation",

  ACCOUNTS: "Accounts",

  ACADEMIC: "Academic / Class",

  EXAMINATION: "Examination",

  NOTICE_COMMUNICATION:
    "Notice & Communication",

  HOSTEL: "Hostel",

  STUDENT_AFFAIRS:
    "Student Affairs",

  ADMINISTRATION: "Administration",

  LIBRARY: "Library",

  TRANSPORT: "Transport",

  IT: "IT Services",

  PLACEMENT: "Placement",

  DISCIPLINE: "Discipline",

  HEALTH_EMERGENCY:
    "Health & Emergency",

  INFRASTRUCTURE_MAINTENANCE:
    "Infrastructure & Maintenance",

  MESS_FOOD:
    "Mess / Food Services",

};


// =====================================================
// DEPARTMENT PERMISSIONS
// =====================================================

const DEPARTMENT_PERMISSIONS = {

  // ===================================================
  // DOCUMENTATION
  // ===================================================

  DOCUMENTATION: [

    "REQUESTS",

    "APPLICATIONS",

    "COMPLAINT_RECORDS",

    "STUDENT_DOCUMENTS",

  ],


  // ===================================================
  // ACCOUNTS
  // ===================================================

  ACCOUNTS: [

    "FEE_PAYMENT",

    "REFUND_REQUESTS",

    "SCHOLARSHIPS",

    "FINANCIAL_RECORDS",

  ],


  // ===================================================
  // ACADEMIC / CLASS
  // ===================================================

  ACADEMIC: [

    "ATTENDANCE",

    "TIMETABLE",

    "COURSE_REGISTRATION",

    "ACADEMIC_CONTROL",

  ],


  // ===================================================
  // EXAMINATION
  // ===================================================

  EXAMINATION: [

    "EXAM_FORMS",

    "ADMIT_CARDS",

    "RESULTS",

    "REVALUATION",

  ],


  // ===================================================
  // NOTICE & COMMUNICATION
  // ===================================================

  NOTICE_COMMUNICATION: [

    "NOTIFICATIONS",

    "CIRCULARS",

    "ANNOUNCEMENTS",

  ],


  // ===================================================
  // HOSTEL
  // ===================================================

  HOSTEL: [

    "HOSTEL_COMPLAINTS",

    "ROOM_ALLOCATION",

    "GATE_PASS_APPROVALS",

  ],


  // ===================================================
  // STUDENT AFFAIRS
  // ===================================================

  STUDENT_AFFAIRS: [

    "STUDENT_PROFILES",

    "STUDENT_SERVICES",

    "CLUBS_ACTIVITIES",

  ],


  // ===================================================
  // ADMINISTRATION
  // ===================================================

  ADMINISTRATION: [

    "DASHBOARD",

    "OVERVIEW",

    "USER_MANAGEMENT",

    "GATE_PASS_MONITORING",

  ],


  // ===================================================
  // LIBRARY
  // ===================================================

  LIBRARY: [

    "BOOK_ISSUE_RETURN",

    "FINE_MANAGEMENT",

  ],


  // ===================================================
  // TRANSPORT
  // ===================================================

  TRANSPORT: [

    "BUS_ROUTES",

    "TRANSPORT_REQUESTS",

  ],


  // ===================================================
  // IT SERVICES
  // ===================================================

  IT: [

    "SETTINGS",

    "TECHNICAL_SUPPORT",

    "SYSTEM_MAINTENANCE",

  ],


  // ===================================================
  // PLACEMENT
  // ===================================================

  PLACEMENT: [

    "JOB_POSTINGS",

    "COMPANY_DRIVES",

    "PLACEMENT_RECORDS",

  ],


  // ===================================================
  // DISCIPLINE
  // ===================================================

  DISCIPLINE: [

    "MISCONDUCT_REPORTS",

    "DISCIPLINARY_ACTIONS",

  ],


  // ===================================================
  // HEALTH & EMERGENCY
  // ===================================================

  HEALTH_EMERGENCY: [

    "MEDICAL_ASSISTANCE",

    "EMERGENCY_REPORTING",

  ],


  // ===================================================
  // INFRASTRUCTURE & MAINTENANCE
  // ===================================================

  INFRASTRUCTURE_MAINTENANCE: [

    "ELECTRICAL_COMPLAINTS",

    "WATER_ISSUES",

    "CLASSROOM_MAINTENANCE",

  ],


  // ===================================================
  // MESS / FOOD SERVICES
  // ===================================================

  MESS_FOOD: [

    "FOOD_COMPLAINTS",

    "MENU_MANAGEMENT",

    "MESS_FEEDBACK",

  ],

};


// =====================================================
// COMMON ADMIN PERMISSIONS
// =====================================================
//
// Every authenticated ADMIN gets these permissions.
//
// These are intentionally NOT department restricted.
//
// Therefore every Admin can:
//
// 1. View Overview
// 2. View Profile
// 3. Add Students
// 4. View Student Profiles
//
// =====================================================

const CORE_ADMIN_PERMISSIONS = [

  "OVERVIEW",

  "PROFILE",

  "ADD_STUDENTS",

  "STUDENT_PROFILES",

];


// =====================================================
// SUPER ADMIN
// =====================================================

const SUPER_ADMIN_PERMISSIONS = [

  "*",

];


// =====================================================
// NORMALIZE DEPARTMENT
// =====================================================

function normalizeDepartment(
  department
) {

  if (!department) {

    return "";

  }


  return String(department)
    .trim()
    .toUpperCase();

}


// =====================================================
// GET DEPARTMENT PERMISSIONS
// =====================================================

function getDepartmentPermissions(
  department
) {

  const normalizedDepartment =
    normalizeDepartment(
      department
    );


  if (!normalizedDepartment) {

    return [];

  }


  return (
    DEPARTMENT_PERMISSIONS[
      normalizedDepartment
    ] || []
  );

}


// =====================================================
// CHECK SUPER ADMIN
// =====================================================

function isSuperAdmin(
  user
) {

  return (
    user?.role ===
    "SUPER_ADMIN"
  );

}


// =====================================================
// CHECK ADMIN
// =====================================================

function isAdmin(
  user
) {

  return (
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN"
  );

}


// =====================================================
// CHECK PERMISSION
// =====================================================

function hasPermission(
  department,
  permission,
  user = null
) {

  // ---------------------------------------------------
  // SUPER ADMIN
  // ---------------------------------------------------
  // Super Admin has complete access.
  // ---------------------------------------------------

  if (
    user &&
    isSuperAdmin(user)
  ) {

    return true;

  }


  // ---------------------------------------------------
  // DEPARTMENT PERMISSIONS
  // ---------------------------------------------------

  const permissions =
    getDepartmentPermissions(
      department
    );


  // ---------------------------------------------------
  // COMMON ADMIN PERMISSIONS
  // ---------------------------------------------------
  //
  // These permissions are available to ALL Admins.
  //
  // ---------------------------------------------------

  if (
    CORE_ADMIN_PERMISSIONS.includes(
      permission
    )
  ) {

    return true;

  }


  // ---------------------------------------------------
  // DEPARTMENT-SPECIFIC PERMISSION
  // ---------------------------------------------------

  return permissions.includes(
    permission
  );

}


// =====================================================
// CHECK DEPARTMENT ACCESS
// =====================================================

function hasDepartmentAccess(
  user,
  department
) {

  // ---------------------------------------------------
  // SUPER ADMIN
  // ---------------------------------------------------

  if (
    isSuperAdmin(user)
  ) {

    return true;

  }


  // ---------------------------------------------------
  // NORMAL ADMIN
  // ---------------------------------------------------

  if (
    !user ||
    user.role !== "ADMIN"
  ) {

    return false;

  }


  const userDepartment =
    normalizeDepartment(
      user.department ||
      user.admin_section
    );


  const requestedDepartment =
    normalizeDepartment(
      department
    );


  return (
    userDepartment ===
    requestedDepartment
  );

}


// =====================================================
// GET USER PERMISSIONS
// =====================================================

function getUserPermissions(
  user
) {

  if (!user) {

    return [];

  }


  // ---------------------------------------------------
  // SUPER ADMIN
  // ---------------------------------------------------

  if (
    isSuperAdmin(user)
  ) {

    return [

      "*",

    ];

  }


  // ---------------------------------------------------
  // NORMAL ADMIN
  // ---------------------------------------------------

  const department =
    user.department ||
    user.admin_section;


  return [

    // Common permissions
    ...CORE_ADMIN_PERMISSIONS,

    // Department permissions
    ...getDepartmentPermissions(
      department
    ),

  ];

}


// =====================================================
// GET ALL DEPARTMENTS
// =====================================================

function getAllDepartments() {

  return Object.keys(
    DEPARTMENTS
  ).map(
    (id) => ({

      id,

      name:
        DEPARTMENTS[id],

      permissions:
        DEPARTMENT_PERMISSIONS[
          id
        ] || [],

    })
  );

}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  DEPARTMENTS,

  DEPARTMENT_PERMISSIONS,

  CORE_ADMIN_PERMISSIONS,

  SUPER_ADMIN_PERMISSIONS,

  normalizeDepartment,

  getDepartmentPermissions,

  isSuperAdmin,

  isAdmin,

  hasPermission,

  hasDepartmentAccess,

  getUserPermissions,

  getAllDepartments,

};