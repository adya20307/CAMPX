import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ============================================
// LANGUAGE
// ============================================

import { LanguageProvider } from "./context/LanguageContext";

// ============================================
// LOGIN
// ============================================

import Login from "./pages/Login";

// ============================================
// STUDENT PAGES
// ============================================

import StudentDashboard from "./pages/StudentDashboard";
import Complaints from "./pages/Complaints";
import AIComplaint from "./pages/AIComplaint";
import GatePass from "./pages/GatePass";
import Requests from "./pages/Requests";
import Timetable from "./pages/Timetable";
import Applications from "./pages/Applications";
import Attendance from "./pages/Attendance";
import Notifications from "./Notifications";
import Canteen from "./pages/Canteen";

// ============================================
// ADMIN PAGES
// ============================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import GatePassRequests from "./pages/GatePassRequests";
import AdminRequests from "./pages/AdminRequests";
import AdminNotifications from "./pages/AdminNotifications";
import AdminTimetable from "./pages/AdminTimetable";
import AdminApplications from "./pages/AdminApplications";
import AdminAttendance from "./pages/AdminAttendance";
import AdminStudents from "./pages/AdminStudents";

// ============================================
// ADMIN MANAGEMENT
// ============================================

import AddAdmin from "./pages/AddAdmin";
import AddStudent from "./pages/AddStudent";
import AdminList from "./pages/AdminList";

// ============================================
// COMMON PAGES
// ============================================

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// ============================================
// GET CURRENT USER
// ============================================

function getCurrentUser() {
  const storedUser =
    localStorage.getItem("campx_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Invalid CAMPX user:",
      error
    );

    localStorage.removeItem("campx_user");
    localStorage.removeItem("campx_token");

    return null;
  }
}

// ============================================
// NORMALIZE ROLE
// ============================================

function getUserRole(user) {
  return String(
    user?.role ||
      user?.userRole ||
      user?.user_role ||
      ""
  )
    .trim()
    .toUpperCase();
}

// ============================================
// HOSTELLER ROUTE PROTECTION
// ============================================

function HostellerRoute({ children }) {
  const token =
    localStorage.getItem("campx_token");

  const user = getCurrentUser();

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const role = getUserRole(user);

  // Admin users should never enter student
  // hosteller routes.
  if (
    role === "ADMIN" ||
    role === "SUPER_ADMIN"
  ) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  const isHosteller =
    user?.hostelStatus === "HOSTELLER" ||
    user?.hostel_status === "HOSTELLER";

  if (!isHosteller) {
    return (
      <Navigate
        to="/student"
        replace
      />
    );
  }

  return children;
}

// ============================================
// STUDENT ROUTE PROTECTION
// ============================================

function StudentRoute({ children }) {
  const token =
    localStorage.getItem("campx_token");

  const user = getCurrentUser();

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const role = getUserRole(user);

  // ==========================================
  // ADMIN USERS CANNOT ENTER STUDENT PORTAL
  // ==========================================

  if (
    role === "ADMIN" ||
    role === "SUPER_ADMIN"
  ) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return children;
}

// ============================================
// ADMIN ROUTE PROTECTION
// ============================================

function AdminRoute({ children }) {
  const token =
    localStorage.getItem("campx_token");

  const user = getCurrentUser();

  // ==========================================
  // NO LOGIN
  // ==========================================

  if (!token || !user) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  const role = getUserRole(user);

  // ==========================================
  // ADMIN / SUPER ADMIN ONLY
  // ==========================================

  if (
    role !== "ADMIN" &&
    role !== "SUPER_ADMIN"
  ) {
    // IMPORTANT:
    // An invalid/non-admin user attempting
    // an admin page goes to ADMIN LOGIN,
    // NOT STUDENT LOGIN.
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return children;
}

// ============================================
// SUPER ADMIN ROUTE PROTECTION
// ============================================

function SuperAdminRoute({ children }) {
  const token =
    localStorage.getItem("campx_token");

  const user = getCurrentUser();

  if (!token || !user) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  const role = getUserRole(user);

  if (role !== "SUPER_ADMIN") {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return children;
}

// ============================================
// APP
// ============================================

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>

        <Routes>

          {/* =====================================
              ROOT
          ===================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* =====================================
              STUDENT LOGIN
          ===================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* =====================================
              ADMIN / SUPER ADMIN LOGIN
          ===================================== */}

          <Route
            path="/admin"
            element={<Login />}
          />

          {/* =====================================
              STUDENT DASHBOARD
          ===================================== */}

          <Route
            path="/student"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />

          {/* =====================================
              STUDENT PROFILE
          ===================================== */}

          <Route
            path="/student/profile"
            element={
              <StudentRoute>
                <Profile />
              </StudentRoute>
            }
          />

          {/* =====================================
              STUDENT SETTINGS
          ===================================== */}

          <Route
            path="/student/settings"
            element={
              <StudentRoute>
                <Settings />
              </StudentRoute>
            }
          />

          {/* =====================================
              STUDENT COMPLAINTS
          ===================================== */}

          <Route
            path="/complaints"
            element={
              <StudentRoute>
                <Complaints />
              </StudentRoute>
            }
          />

          {/* =====================================
              AI COMPLAINT ASSISTANT
          ===================================== */}

          <Route
            path="/ai-complaint"
            element={
              <StudentRoute>
                <AIComplaint />
              </StudentRoute>
            }
          />

          {/* =====================================
              STUDENT TIMETABLE
          ===================================== */}

          <Route
            path="/timetable"
            element={
              <StudentRoute>
                <Timetable />
              </StudentRoute>
            }
          />

          {/* =====================================
              STUDENT REQUESTS
          ===================================== */}

          <Route
            path="/requests"
            element={
              <StudentRoute>
                <Requests />
              </StudentRoute>
            }
          />

          {/* =====================================
              STUDENT APPLICATIONS
          ===================================== */}

          <Route
            path="/applications"
            element={
              <StudentRoute>
                <Applications />
              </StudentRoute>
            }
          />

          {/* =====================================
              STUDENT ATTENDANCE
          ===================================== */}

          <Route
            path="/attendance"
            element={
              <StudentRoute>
                <Attendance />
              </StudentRoute>
            }
          />

          {/* =====================================
              STUDENT NOTIFICATIONS
          ===================================== */}

          <Route
            path="/notifications"
            element={
              <StudentRoute>
                <Notifications />
              </StudentRoute>
            }
          />

          {/* =====================================
              HOSTELLER - GATE PASS
          ===================================== */}

          <Route
            path="/gatepass"
            element={
              <StudentRoute>
                <HostellerRoute>
                  <GatePass />
                </HostellerRoute>
              </StudentRoute>
            }
          />

          {/* =====================================
              HOSTELLER - CANTEEN
          ===================================== */}

          <Route
            path="/canteen"
            element={
              <StudentRoute>
                <HostellerRoute>
                  <Canteen />
                </HostellerRoute>
              </StudentRoute>
            }
          />

          {/* =====================================
              ADMIN DASHBOARD
          ===================================== */}

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN PROFILE
          ===================================== */}

          <Route
            path="/admin/profile"
            element={
              <AdminRoute>
                <Profile />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN SETTINGS
          ===================================== */}

          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <Settings />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN STUDENTS
          ===================================== */}

          <Route
            path="/admin/students"
            element={
              <AdminRoute>
                <AdminStudents />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADD STUDENT
          ===================================== */}

          <Route
            path="/admin/students/add"
            element={
              <AdminRoute>
                <AddStudent />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADD STUDENT ALIAS
          ===================================== */}

          <Route
            path="/add-student"
            element={
              <AdminRoute>
                <AddStudent />
              </AdminRoute>
            }
          />

          {/* =====================================
              SUPER ADMIN - ADD ADMIN
          ===================================== */}

          <Route
            path="/admin/faculty/add"
            element={
              <SuperAdminRoute>
                <AddAdmin />
              </SuperAdminRoute>
            }
          />

          {/* =====================================
              SUPER ADMIN - ADMIN LIST
          ===================================== */}

          <Route
            path="/admin/faculty"
            element={
              <SuperAdminRoute>
                <AdminList />
              </SuperAdminRoute>
            }
          />

          {/* =====================================
              ADMIN COMPLAINTS
          ===================================== */}

          <Route
            path="/admin/complaints"
            element={
              <AdminRoute>
                <AdminComplaints />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN GATE PASS
          ===================================== */}

          <Route
            path="/admin/gatepass"
            element={
              <AdminRoute>
                <GatePassRequests />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN REQUESTS
          ===================================== */}

          <Route
            path="/admin/requests"
            element={
              <AdminRoute>
                <AdminRequests />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN APPLICATIONS
          ===================================== */}

          <Route
            path="/admin/applications"
            element={
              <AdminRoute>
                <AdminApplications />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN ATTENDANCE
          ===================================== */}

          <Route
            path="/admin/attendance"
            element={
              <AdminRoute>
                <AdminAttendance />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN TIMETABLE
          ===================================== */}

          <Route
            path="/admin/timetable"
            element={
              <AdminRoute>
                <AdminTimetable />
              </AdminRoute>
            }
          />

          {/* =====================================
              ADMIN NOTIFICATIONS
          ===================================== */}

          <Route
            path="/admin/notifications"
            element={
              <AdminRoute>
                <AdminNotifications />
              </AdminRoute>
            }
          />

          {/* =====================================
              FALLBACK
          ===================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>
    </LanguageProvider>
  );
}