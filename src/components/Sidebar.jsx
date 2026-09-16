import {
  LayoutDashboard,
  ClipboardList,
  Bot,
  CalendarDays,
  FileText,
  DoorOpen,
  Bell,
  User,
  Settings,
  LogOut,
  ClipboardCheck,
  Users,
  UserPlus,
  Utensils,
  BookOpen,
  Bus,
  Briefcase,
  CreditCard,
  ShieldCheck,
  Building2,
  Wrench,
  HeartPulse,
} from "lucide-react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";


// =====================================================
// DEPARTMENT LINKS
// =====================================================

const DEPARTMENT_LINKS = {

  // ===================================================
  // DOCUMENTATION
  // ===================================================

  DOCUMENTATION: [

    {
      name: "Requests",
      path: "/admin/requests",
      icon: FileText,
    },

    {
      name: "Applications",
      path: "/admin/applications",
      icon: FileText,
    },

    {
      name: "Complaints",
      path: "/admin/complaints",
      icon: ClipboardList,
    },

  ],


  // ===================================================
  // ACCOUNTS
  // ===================================================

  ACCOUNTS: [

    {
      name: "Accounts",
      path: "/admin/accounts",
      icon: CreditCard,
    },

  ],


  // ===================================================
  // ACADEMIC / CLASS
  // ===================================================

  ACADEMIC: [

    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: ClipboardCheck,
    },

    {
      name: "Academic Control",
      path: "/admin/timetable",
      icon: CalendarDays,
    },

  ],


  // ===================================================
  // EXAMINATION
  // ===================================================

  EXAMINATION: [

    {
      name: "Applications",
      path: "/admin/applications",
      icon: FileText,
    },

  ],


  // ===================================================
  // NOTICE & COMMUNICATION
  // ===================================================

  NOTICE_COMMUNICATION: [

    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },

  ],


  // ===================================================
  // HOSTEL
  // ===================================================

  HOSTEL: [

    {
      name: "Hostel",
      path: "/admin/hostel",
      icon: Building2,
    },

    {
      name: "Gate Pass",
      path: "/admin/gatepass",
      icon: DoorOpen,
    },

  ],


  // ===================================================
  // STUDENT AFFAIRS
  // ===================================================

  STUDENT_AFFAIRS: [

    {
      name: "Students",
      path: "/admin/students",
      icon: Users,
    },

  ],


  // ===================================================
  // ADMINISTRATION
  // ===================================================

  ADMINISTRATION: [

    {
      name: "Students",
      path: "/admin/students",
      icon: Users,
    },

    {
      name: "Complaints",
      path: "/admin/complaints",
      icon: ClipboardList,
    },

    {
      name: "Gate Pass",
      path: "/admin/gatepass",
      icon: DoorOpen,
    },

  ],


  // ===================================================
  // LIBRARY
  // ===================================================

  LIBRARY: [

    {
      name: "Library",
      path: "/admin/library",
      icon: BookOpen,
    },

  ],


  // ===================================================
  // TRANSPORT
  // ===================================================

  TRANSPORT: [

    {
      name: "Transport",
      path: "/admin/transport",
      icon: Bus,
    },

  ],


  // ===================================================
  // IT SERVICES
  // ===================================================

  IT: [

    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },

  ],


  // ===================================================
  // PLACEMENT
  // ===================================================

  PLACEMENT: [

    {
      name: "Placement",
      path: "/admin/placement",
      icon: Briefcase,
    },

  ],


  // ===================================================
  // DISCIPLINE
  // ===================================================

  DISCIPLINE: [

    {
      name: "Discipline",
      path: "/admin/discipline",
      icon: ShieldCheck,
    },

  ],


  // ===================================================
  // HEALTH & EMERGENCY
  // ===================================================

  HEALTH_EMERGENCY: [

    {
      name: "Health & Emergency",
      path: "/admin/health",
      icon: HeartPulse,
    },

  ],


  // ===================================================
  // INFRASTRUCTURE & MAINTENANCE
  // ===================================================

  INFRASTRUCTURE_MAINTENANCE: [

    {
      name: "Infrastructure",
      path: "/admin/infrastructure",
      icon: Wrench,
    },

  ],


  // ===================================================
  // MESS / FOOD
  // ===================================================

  MESS_FOOD: [

    {
      name: "Canteen",
      path: "/admin/canteen",
      icon: Utensils,
    },

  ],

};


// =====================================================
// SUPER ADMIN LINKS
// =====================================================

const SUPER_ADMIN_LINKS = [

  {
    name: "Overview",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    name: "Add Admin",
    path: "/admin/faculty/add",
    icon: UserPlus,
  },
  {
  name: "Admins",
  path: "/admin/faculty",
  icon: Users,
},

  {
    name: "Students",
    path: "/admin/students",
    icon: Users,
  },

  {
    name: "Add Students",
    path: "/admin/students/add",
    icon: UserPlus,
  },

  {
    name: "Complaints",
    path: "/admin/complaints",
    icon: ClipboardList,
  },

  {
    name: "Gate Pass",
    path: "/admin/gatepass",
    icon: DoorOpen,
  },

  {
    name: "Requests",
    path: "/admin/requests",
    icon: FileText,
  },

  {
    name: "Applications",
    path: "/admin/applications",
    icon: FileText,
  },

  {
    name: "Attendance",
    path: "/admin/attendance",
    icon: ClipboardCheck,
  },

  {
    name: "Academic Control",
    path: "/admin/timetable",
    icon: CalendarDays,
  },

  {
    name: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
  },

  {
    name: "Library",
    path: "/admin/library",
    icon: BookOpen,
  },

  {
    name: "Hostel",
    path: "/admin/hostel",
    icon: Building2,
  },

  {
    name: "Transport",
    path: "/admin/transport",
    icon: Bus,
  },

  {
    name: "Placement",
    path: "/admin/placement",
    icon: Briefcase,
  },

  {
    name: "Accounts",
    path: "/admin/accounts",
    icon: CreditCard,
  },

  {
    name: "Canteen",
    path: "/admin/canteen",
    icon: Utensils,
  },

];


// =====================================================
// COMPONENT
// =====================================================

export default function Sidebar({
  admin = false,
}) {

  const location =
    useLocation();

  const navigate =
    useNavigate();


  // ===================================================
  // DETERMINE ADMIN
  // ===================================================

  const isAdmin =
    admin ||
    location.pathname.startsWith(
      "/admin"
    );


  // ===================================================
  // CURRENT USER
  // ===================================================

  const storedUser =
    localStorage.getItem(
      "campx_user"
    );


  let currentUser = {};

  try {

    currentUser =
      storedUser
        ? JSON.parse(
            storedUser
          )
        : {};

  } catch (error) {

    console.error(
      "Invalid CAMPX user data:",
      error
    );

  }


  // ===================================================
  // ROLE
  // ===================================================

  const isSuperAdmin =
    currentUser?.role ===
    "SUPER_ADMIN";


  // ===================================================
  // DEPARTMENT
  // ===================================================

  const adminDepartment =
    currentUser?.department ||
    currentUser?.admin_section ||
    "";


  const normalizedDepartment =
    String(
      adminDepartment
    )
      .trim()
      .toUpperCase();


  // ===================================================
  // HOSTELLER CHECK
  // ===================================================

  const isHosteller =
    currentUser?.hostelStatus ===
      "HOSTELLER" ||
    currentUser?.hostel_status ===
      "HOSTELLER";


  // ===================================================
  // STUDENT LINKS
  // ===================================================

  const studentLinks = [

    {
      name: "Dashboard",
      path: "/student",
      icon: LayoutDashboard,
    },

    {
      name: "Complaints",
      path: "/complaints",
      icon: ClipboardList,
    },

    {
      name: "AI Assistant",
      path: "/ai-complaint",
      icon: Bot,
    },

    {
      name: "Timetable",
      path: "/timetable",
      icon: CalendarDays,
    },

    {
      name: "Requests",
      path: "/requests",
      icon: FileText,
    },


    // =================================================
    // HOSTELLER ONLY
    // =================================================

    ...(isHosteller
      ? [

          {
            name: "Gate Pass",
            path: "/gatepass",
            icon: DoorOpen,
          },

          {
            name: "Canteen",
            path: "/canteen",
            icon: Utensils,
          },

        ]
      : []),


    {
      name: "Applications",
      path: "/applications",
      icon: FileText,
    },

    {
      name: "Attendance",
      path: "/attendance",
      icon: ClipboardCheck,
    },

    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },

  ];


  // ===================================================
  // ADMIN LINKS
  // ===================================================

  let adminLinks = [];


  if (isSuperAdmin) {

    // -------------------------------------------------
    // SUPER ADMIN
    // -------------------------------------------------

    adminLinks =
      SUPER_ADMIN_LINKS;

  } else {

    // -------------------------------------------------
    // NORMAL ADMIN
    // -------------------------------------------------

    const departmentLinks =
      DEPARTMENT_LINKS[
        normalizedDepartment
      ] || [];


    adminLinks = [

      // -----------------------------------------------
      // COMMON ADMIN
      // -----------------------------------------------

      {
        name: "Overview",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },


      // -----------------------------------------------
      // EVERY ADMIN CAN ADD STUDENTS
      // -----------------------------------------------

      {
        name: "Add Students",
        path: "/admin/students/add",
        icon: UserPlus,
      },


      // -----------------------------------------------
      // EVERY ADMIN CAN VIEW STUDENTS
      // -----------------------------------------------

      {
        name: "Students",
        path: "/admin/students",
        icon: Users,
      },


      // -----------------------------------------------
      // DEPARTMENT-SPECIFIC LINKS
      // -----------------------------------------------

      ...departmentLinks,

    ];

  }


  // ===================================================
  // REMOVE DUPLICATE LINKS
  // ===================================================

  adminLinks =
    adminLinks.filter(
      (link, index, array) =>
        index ===
        array.findIndex(
          (item) =>
            item.path ===
            link.path
        )
    );


  // ===================================================
  // FINAL LINKS
  // ===================================================

  const links =
    isAdmin
      ? adminLinks
      : studentLinks;


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {

    const wasAdmin =
      window.location.pathname.startsWith(
        "/admin"
      );


    localStorage.removeItem(
      "campx_token"
    );


    localStorage.removeItem(
      "campx_user"
    );


    if (wasAdmin) {

      navigate(
        "/admin",
        {
          replace: true,
        }
      );

    } else {

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    }

  };


  // ===================================================
  // SIDEBAR
  // ===================================================

  return (

    <aside className="sidebar">


      {/* =================================================
          LOGO
      ================================================= */}

      <div className="sidebar-logo">

        <div className="small-logo">
          CX
        </div>


        <div>

          <strong>
            CampX
          </strong>

          <span>

            {isAdmin

              ? isSuperAdmin
                ? "Super Admin Portal"
                : "Admin Portal"

              : "Student Portal"}

          </span>

        </div>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="sidebar-nav">

        {links.map(
          (link) => {

            const Icon =
              link.icon;


            return (

              <NavLink
                key={
                  link.path
                }

                to={
                  link.path
                }

                className={({
                  isActive,
                }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >

                <Icon
                  size={19}
                />

                <span>
                  {link.name}
                </span>

              </NavLink>

            );

          }
        )}

      </nav>


      {/* =================================================
          BOTTOM
      ================================================= */}

      <div className="sidebar-bottom">


        {/* =================================================
            PROFILE
        ================================================= */}

        <NavLink
          to={
            isAdmin
              ? "/admin/profile"
              : "/student/profile"
          }

          className={({
            isActive,
          }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >

          <User
            size={19}
          />

          <span>
            Profile
          </span>

        </NavLink>


        {/* =================================================
            SETTINGS
        ================================================= */}

        <NavLink
          to={
            isAdmin
              ? "/admin/settings"
              : "/student/settings"
          }

          className={({
            isActive,
          }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >

          <Settings
            size={19}
          />

          <span>
            Settings
          </span>

        </NavLink>


        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          type="button"
          className="nav-link logout"
          onClick={
            handleLogout
          }
        >

          <LogOut
            size={19}
          />

          <span>
            Logout
          </span>

        </button>


      </div>

    </aside>

  );

}