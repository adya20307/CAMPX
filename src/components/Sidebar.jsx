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
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

export default function Sidebar({ admin = false }) {

  // Get current URL
  const location = useLocation();

  // Automatically detect admin pages
  const isAdmin =
    admin ||
    location.pathname.startsWith("/admin");


  // ==========================================
  // STUDENT LINKS
  // ==========================================

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
    {
      name: "Gate Pass",
      path: "/gatepass",
      icon: DoorOpen,
    },
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


  // ==========================================
  // ADMIN LINKS
  // ==========================================

  const adminLinks = [
    {
      name: "Overview",
      path: "/admin",
      icon: LayoutDashboard,
    },
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
  ];


  // Choose correct links
  const links = isAdmin
    ? adminLinks
    : studentLinks;


  return (
    <aside className="sidebar">

      {/* ======================================
          LOGO
      ======================================= */}

      <div className="sidebar-logo">

        <div className="small-logo">
          CX
        </div>

        <div>
          <strong>CampX</strong>

          <span>
            {isAdmin
              ? "Admin Portal"
              : "Student Portal"}
          </span>
        </div>

      </div>


      {/* ======================================
          MAIN NAVIGATION
      ======================================= */}

      <nav className="sidebar-nav">

        {links.map((link) => {

          const Icon = link.icon;

          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >

              <Icon size={19} />

              <span>
                {link.name}
              </span>

            </NavLink>
          );

        })}

      </nav>


      {/* ======================================
          BOTTOM NAVIGATION
      ======================================= */}

      <div className="sidebar-bottom">

        {/* PROFILE */}

        <NavLink
          className="nav-link"
          to={
            isAdmin
              ? "/admin"
              : "/student"
          }
        >

          <User size={19} />

          <span>
            Profile
          </span>

        </NavLink>


        {/* SETTINGS */}

        <NavLink
          className="nav-link"
          to={
            isAdmin
              ? "/admin"
              : "/student"
          }
        >

          <Settings size={19} />

          <span>
            Settings
          </span>

        </NavLink>


        {/* LOGOUT */}

        <NavLink
          className="nav-link logout"
          to="/login"
        >

          <LogOut size={19} />

          <span>
            Logout
          </span>

        </NavLink>

      </div>

    </aside>
  );
}