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
  CreditCard,
  Building2,
} from "lucide-react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";


// =====================================================
// SIDEBAR TRANSLATIONS
// =====================================================

const SIDEBAR_TRANSLATIONS = {

  en: {
    dashboard: "Dashboard",
    overview: "Overview",
    addAdmin: "Add Admin",
    admins: "Admins",
    students: "Students",
    addStudents: "Add Students",
    complaints: "Complaints",
    gatePass: "Gate Pass",
    requests: "Requests",
    applications: "Applications",
    attendance: "Attendance",
    academicControl: "Academic Control",
    notifications: "Notifications",
    hostel: "Hostel",
    canteen: "Canteen",
    accounts: "Accounts",
    myFees: "My Fees",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    superAdminPortal: "Super Admin Portal",
    adminPortal: "Admin Portal",
    studentPortal: "Student Portal",
    academicsStudentAffairs:
      "Academics & Student Affairs",
    hostelManagement:
      "Hostel Management",
    documentation:
      "Documentation",
    teachingFaculty:
      "Teaching Faculty",
  },

  hi: {
    dashboard: "डैशबोर्ड",
    overview: "अवलोकन",
    addAdmin: "एडमिन जोड़ें",
    admins: "एडमिन",
    students: "छात्र",
    addStudents: "छात्र जोड़ें",
    complaints: "शिकायतें",
    gatePass: "गेट पास",
    requests: "अनुरोध",
    applications: "आवेदन",
    attendance: "उपस्थिति",
    academicControl: "शैक्षणिक नियंत्रण",
    notifications: "सूचनाएं",
    hostel: "हॉस्टल",
    canteen: "कैंटीन",
    accounts: "अकाउंट्स",
    myFees: "मेरी फीस",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    superAdminPortal: "सुपर एडमिन पोर्टल",
    adminPortal: "एडमिन पोर्टल",
    studentPortal: "छात्र पोर्टल",
    academicsStudentAffairs:
      "शैक्षणिक एवं छात्र मामले",
    hostelManagement:
      "हॉस्टल प्रबंधन",
    documentation:
      "दस्तावेज़ीकरण",
    teachingFaculty:
      "शिक्षण फैकल्टी",
  },

  or: {
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    overview: "ସମୀକ୍ଷା",
    addAdmin: "ଆଡମିନ୍ ଯୋଡନ୍ତୁ",
    admins: "ଆଡମିନ୍",
    students: "ଛାତ୍ରଛାତ୍ରୀ",
    addStudents: "ଛାତ୍ରଛାତ୍ରୀ ଯୋଡନ୍ତୁ",
    complaints: "ଅଭିଯୋଗ",
    gatePass: "ଗେଟ୍ ପାସ୍",
    requests: "ଅନୁରୋଧ",
    applications: "ଆବେଦନ",
    attendance: "ଉପସ୍ଥାନ",
    academicControl: "ଶିକ୍ଷାଗତ ନିୟନ୍ତ୍ରଣ",
    notifications: "ବିଜ୍ଞପ୍ତି",
    hostel: "ହଷ୍ଟେଲ୍",
    canteen: "କ୍ୟାଣ୍ଟିନ୍",
    accounts: "ଆକାଉଣ୍ଟସ୍",
    myFees: "ମୋ ଫିସ୍",
    profile: "ପ୍ରୋଫାଇଲ୍",
    settings: "ସେଟିଂସ୍",
    logout: "ଲଗଆଉଟ୍",
    superAdminPortal: "ସୁପର୍ ଆଡମିନ୍ ପୋର୍ଟାଲ୍",
    adminPortal: "ଆଡମିନ୍ ପୋର୍ଟାଲ୍",
    studentPortal: "ଛାତ୍ର ପୋର୍ଟାଲ୍",
    academicsStudentAffairs:
      "ଶିକ୍ଷା ଓ ଛାତ୍ର ବ୍ୟାପାର",
    hostelManagement:
      "ହଷ୍ଟେଲ୍ ପରିଚାଳନା",
    documentation:
      "ଦଲିଲପତ୍ର",
    teachingFaculty:
      "ଶିକ୍ଷକ ଫ୍ୟାକଲ୍ଟି",
  },

};


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

  const {
    language,
  } = useLanguage();


  // ===================================================
  // TRANSLATION HELPER
  // ===================================================

  const currentTranslations =
    SIDEBAR_TRANSLATIONS[
      language
    ] ||
    SIDEBAR_TRANSLATIONS.en;

  const translate =
    (key) =>
      currentTranslations[key] ||
      SIDEBAR_TRANSLATIONS.en[key] ||
      key;


  // ===================================================
  // DETERMINE PORTAL
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
        ? JSON.parse(storedUser)
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

  const userRole =
    String(
      currentUser?.role ||
      currentUser?.userRole ||
      currentUser?.user_role ||
      ""
    )
      .trim()
      .toUpperCase();


  const isSuperAdmin =
    userRole ===
    "SUPER_ADMIN";


  // ===================================================
  // ADMIN DEPARTMENT
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
  // HOSTELLER
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
      nameKey: "dashboard",
      path: "/student",
      icon: LayoutDashboard,
    },

    {
      nameKey: "myFees",
      path: "/student/fees",
      icon: CreditCard,
    },

    {
      nameKey: "complaints",
      path: "/complaints",
      icon: ClipboardList,
    },

    {
      nameKey: "aiAssistant",
      path: "/ai-complaint",
      icon: Bot,
    },

    {
      nameKey: "timetable",
      path: "/timetable",
      icon: CalendarDays,
    },

    {
      nameKey: "requests",
      path: "/requests",
      icon: FileText,
    },

    ...(isHosteller
      ? [

          {
            nameKey: "gatePass",
            path: "/gatepass",
            icon: DoorOpen,
          },

          {
            nameKey: "canteen",
            path: "/canteen",
            icon: Utensils,
          },

        ]
      : []),

    {
      nameKey: "applications",
      path: "/applications",
      icon: FileText,
    },

    {
      nameKey: "attendance",
      path: "/attendance",
      icon: ClipboardCheck,
    },

    {
      nameKey: "notifications",
      path: "/notifications",
      icon: Bell,
    },


  ];


  // ===================================================
  // SUPER ADMIN LINKS
  // ===================================================

  const superAdminLinks = [

    {
      nameKey: "overview",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },

    {
      nameKey: "addAdmin",
      path: "/admin/faculty/add",
      icon: UserPlus,
    },

    {
      nameKey: "admins",
      path: "/admin/faculty",
      icon: Users,
    },

    {
      nameKey: "students",
      path: "/admin/students",
      icon: Users,
    },

    {
      nameKey: "addStudents",
      path: "/admin/students/add",
      icon: UserPlus,
    },

    {
      nameKey: "complaints",
      path: "/admin/complaints",
      icon: ClipboardList,
    },

    {
      nameKey: "gatePass",
      path: "/admin/gatepass",
      icon: DoorOpen,
    },

    {
      nameKey: "requests",
      path: "/admin/requests",
      icon: FileText,
    },

    {
      nameKey: "applications",
      path: "/admin/applications",
      icon: FileText,
    },

    {
      nameKey: "attendance",
      path: "/admin/attendance",
      icon: ClipboardCheck,
    },

    {
      nameKey: "academicControl",
      path: "/admin/timetable",
      icon: CalendarDays,
    },

    {
      nameKey: "notifications",
      path: "/admin/notifications",
      icon: Bell,
    },

    {
      nameKey: "hostel",
      path: "/admin/hostel",
      icon: Building2,
    },

    {
      nameKey: "canteen",
      path: "/admin/canteen",
      icon: Utensils,
    },

    {
      nameKey: "accounts",
      path: "/admin/accounts",
      icon: CreditCard,
    },

  ];


  // ===================================================
  // NORMAL ADMIN LINKS
  // ===================================================

  let departmentLinks = [];


  // ===================================================
  // ACADEMICS & STUDENT AFFAIRS
  // ===================================================

  if (
    normalizedDepartment ===
    "ACADEMICS_STUDENT_AFFAIRS"
  ) {

    departmentLinks = [

      {
        nameKey: "students",
        path: "/admin/students",
        icon: Users,
      },

      {
        nameKey: "attendance",
        path: "/admin/attendance",
        icon: ClipboardCheck,
      },

      {
        nameKey: "academicControl",
        path: "/admin/timetable",
        icon: CalendarDays,
      },

      {
        nameKey: "notifications",
        path: "/admin/notifications",
        icon: Bell,
      },

      {
        nameKey: "complaints",
        path: "/admin/complaints",
        icon: ClipboardList,
      },

    ];

  }


  // ===================================================
  // HOSTEL MANAGEMENT
  // ===================================================

  else if (
    normalizedDepartment ===
    "HOSTEL_MANAGEMENT"
  ) {

    departmentLinks = [

      {
        nameKey: "hostel",
        path: "/admin/hostel",
        icon: Building2,
      },

      {
        nameKey: "gatePass",
        path: "/admin/gatepass",
        icon: DoorOpen,
      },

      {
        nameKey: "canteen",
        path: "/admin/canteen",
        icon: Utensils,
      },

      {
        nameKey: "complaints",
        path: "/admin/complaints",
        icon: ClipboardList,
      },

    ];

  }


  // ===================================================
  // DOCUMENTATION
  // ===================================================

  else if (
    normalizedDepartment ===
    "DOCUMENTATION"
  ) {

    departmentLinks = [

      {
        nameKey: "requests",
        path: "/admin/requests",
        icon: FileText,
      },

      {
        nameKey: "applications",
        path: "/admin/applications",
        icon: FileText,
      },

      {
        nameKey: "complaints",
        path: "/admin/complaints",
        icon: ClipboardList,
      },

    ];

  }


  // ===================================================
  // TEACHING FACULTY
  // ===================================================

  else if (
    normalizedDepartment ===
    "TEACHING_FACULTY"
  ) {

    departmentLinks = [

      {
        nameKey: "attendance",
        path: "/admin/attendance",
        icon: ClipboardCheck,
      },

      {
        nameKey: "academicControl",
        path: "/admin/timetable",
        icon: CalendarDays,
      },

    ];

  }


  // ===================================================
  // ACCOUNTS
  // ===================================================

  else if (
    normalizedDepartment ===
    "ACCOUNTS"
  ) {

    departmentLinks = [

      {
        nameKey: "accounts",
        path: "/admin/accounts",
        icon: CreditCard,
      },

      {
        nameKey: "students",
        path: "/admin/students",
        icon: Users,
      },

    ];

  }


  // ===================================================
  // COMMON ADMIN LINKS
  // ===================================================

  const normalAdminLinks = [

    {
      nameKey: "overview",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },

    {
      nameKey: "addStudents",
      path: "/admin/students/add",
      icon: UserPlus,
    },

    ...departmentLinks,

  ];


  // ===================================================
  // FINAL ADMIN LINKS
  // ===================================================

  let adminLinks =
    isSuperAdmin
      ? superAdminLinks
      : normalAdminLinks;


  // ===================================================
  // REMOVE DUPLICATES
  // ===================================================

  adminLinks =
    adminLinks.filter(
      (
        link,
        index,
        array
      ) =>
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
  // LINK LABELS
  // ===================================================

  const getLinkLabel =
    (nameKey) => {

      // Student-specific labels
      if (
        nameKey ===
        "dashboard"
      ) {
        return translate(
          "dashboard"
        );
      }

      if (
        nameKey ===
        "aiAssistant"
      ) {
        if (
          language === "hi"
        ) {
          return "AI सहायक";
        }

        if (
          language === "or"
        ) {
          return "AI ସହାୟକ";
        }

        return "AI Assistant";
      }

      if (
        nameKey ===
        "timetable"
      ) {
        if (
          language === "hi"
        ) {
          return "समय सारणी";
        }

        if (
          language === "or"
        ) {
          return "ସମୟ ସାରଣୀ";
        }

        return "Timetable";
      }

      return translate(
        nameKey
      );
    };


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout =
    () => {

      const wasAdmin =
        isAdmin ||
        userRole === "ADMIN" ||
        userRole === "SUPER_ADMIN";


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

        return;
      }


      navigate(
        "/login",
        {
          replace: true,
        }
      );

    };


  // ===================================================
  // PORTAL TITLE
  // ===================================================

  let portalTitle =
    translate(
      "studentPortal"
    );


  if (isAdmin) {

    portalTitle =
      isSuperAdmin
        ? translate(
            "superAdminPortal"
          )
        : translate(
            "adminPortal"
          );

  }


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
            {portalTitle}
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
                  {
                    getLinkLabel(
                      link.nameKey
                    )
                  }
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
            {
              translate(
                "profile"
              )
            }
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
            {
              translate(
                "settings"
              )
            }
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
            {
              translate(
                "logout"
              )
            }
          </span>

        </button>


      </div>

    </aside>

  );

}