// =====================================================
// CAMPX DEPARTMENT PERMISSIONS
// =====================================================
//
// SUPER_ADMIN = Full access
// ADMIN       = Common permissions + department permissions
//
// =====================================================


// =====================================================
// DEPARTMENT NAMES
// =====================================================

const DEPARTMENTS = {

  ACADEMICS_STUDENT_AFFAIRS:
    "Academics & Student Affairs",

  HOSTEL_MANAGEMENT:
    "Hostel Management",

  DOCUMENTATION:
    "Documentation",

  TEACHING_FACULTY:
    "Teaching Faculty",

  ACCOUNTS:
    "Accounts",

};


// =====================================================
// DEPARTMENT PERMISSIONS
// =====================================================

const DEPARTMENT_PERMISSIONS = {


  // ===================================================
  // ACADEMICS & STUDENT AFFAIRS
  // ===================================================

  ACADEMICS_STUDENT_AFFAIRS: [

    "STUDENT_PROFILES",

    "STUDENT_SERVICES",

    "STUDENT_LIST",

    "TIMETABLE",

    "COURSE_REGISTRATION",

    "ACADEMIC_CONTROL",

    "NOTIFICATIONS",

    "CIRCULARS",

    "ANNOUNCEMENTS",

    "BATCH_NOTICES",

    "CLUBS_ACTIVITIES",

    "ACADEMIC_REQUESTS",

  ],


  // ===================================================
  // HOSTEL MANAGEMENT
  // ===================================================

  HOSTEL_MANAGEMENT: [

    "HOSTEL_DETAILS",

    "HOSTEL_COMPLAINTS",

    "ROOM_ALLOCATION",

    "HOSTELLER_MANAGEMENT",

    "GATE_PASS_APPROVALS",

    "GATE_PASS_MONITORING",

    "MENU_MANAGEMENT",

    "FOOD_COMPLAINTS",

    "MESS_FEEDBACK",

    "CANTEEN_FEEDBACK",

    "HOSTELLER_PROFILES",

  ],


  // ===================================================
  // DOCUMENTATION
  // ===================================================

  DOCUMENTATION: [

    "STUDENT_DOCUMENTS",

    "REQUESTS",

    "APPLICATIONS",

    "COMPLAINT_RECORDS",

    "DOCUMENTATION_COMPLAINTS",

  ],


  // ===================================================
  // TEACHING FACULTY
  // ===================================================

  TEACHING_FACULTY: [

    "CLASS_STUDENTS",

    "ATTENDANCE",

    "TIMETABLE",

    "ASSIGNED_SUBJECTS",

    "ACADEMIC_CONTROL",

  ],


  // ===================================================
  // ACCOUNTS
  // ===================================================

  ACCOUNTS: [

    "FEE_MANAGEMENT",

    "FEE_STRUCTURES",

    "STUDENT_FEES",

    "FEE_PAYMENTS",

    "PAYMENT_HISTORY",

    "FEE_RECEIPTS",

    "SCHOLARSHIPS",

    "REFUND_REQUESTS",

    "FINANCIAL_RECORDS",

    "FINANCIAL_REPORTS",

    "FEE_DUE_MANAGEMENT",

  ],

};


// =====================================================
// COMMON ADMIN PERMISSIONS
// =====================================================
//
// Every normal Admin gets these permissions.
//
// =====================================================

const CORE_ADMIN_PERMISSIONS = [

  "OVERVIEW",

  "PROFILE",

  "ADD_STUDENTS",

  "STUDENT_PROFILES",

];


// =====================================================
// SUPER ADMIN PERMISSIONS
// =====================================================

const SUPER_ADMIN_PERMISSIONS = [

  "*",

];


// =====================================================
// NORMALIZE DEPARTMENT
// =====================================================

function normalizeDepartment(department) {

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

function getDepartmentPermissions(department) {

  const normalizedDepartment =
    normalizeDepartment(department);

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

function isSuperAdmin(user) {

  return (
    user?.role ===
    "SUPER_ADMIN"
  );

}


// =====================================================
// CHECK ADMIN
// =====================================================

function isAdmin(user) {

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

  if (
    user &&
    isSuperAdmin(user)
  ) {

    return true;

  }


  // ---------------------------------------------------
  // COMMON ADMIN PERMISSIONS
  // ---------------------------------------------------

  if (
    CORE_ADMIN_PERMISSIONS.includes(
      permission
    )
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

function getUserPermissions(user) {

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

    ...CORE_ADMIN_PERMISSIONS,

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