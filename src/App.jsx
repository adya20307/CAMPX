import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
import AdminList from "./pages/AdminList";

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

// ============================================
// COMMON PAGES
// ============================================

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// ============================================
// HOSTELLER ROUTE PROTECTION
// ============================================

function HostellerRoute({ children }) {
  const storedUser =
    localStorage.getItem("campx_user");

  let user = {};

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : {};
  } catch (error) {
    console.error(
      "Invalid CAMPX user data:",
      error
    );
  }

  // If no user is logged in
  if (!storedUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Check both possible property names
  const isHosteller =
    user?.hostelStatus === "HOSTELLER" ||
    user?.hostel_status === "HOSTELLER";

  // Non-hostellers cannot access
  // Gate Pass or Canteen
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

  const storedUser =
    localStorage.getItem("campx_user");

  if (!token || !storedUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  let user = {};

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Invalid CAMPX user:",
      error
    );

    localStorage.removeItem("campx_token");
    localStorage.removeItem("campx_user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Do not allow admin users into student portal
  if (
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN"
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

  const storedUser =
    localStorage.getItem("campx_user");

  if (!token || !storedUser) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  let user = {};

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Invalid CAMPX user:",
      error
    );

    localStorage.removeItem("campx_token");
    localStorage.removeItem("campx_user");

    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // Only ADMIN and SUPER_ADMIN
  // can access admin portal
  if (
    user?.role !== "ADMIN" &&
    user?.role !== "SUPER_ADMIN"
  ) {
    return (
      <Navigate
        to="/login"
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

  const storedUser =
    localStorage.getItem("campx_user");

  if (!token || !storedUser) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  let user = {};

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Invalid CAMPX user:",
      error
    );

    localStorage.removeItem("campx_token");
    localStorage.removeItem("campx_user");

    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // Only Super Admin
  if (user?.role !== "SUPER_ADMIN") {
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
            LOGIN
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
            TIMETABLE
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
            REQUESTS
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
            APPLICATIONS
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
            ATTENDANCE
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
            NOTIFICATIONS
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
            HOSTELLER ONLY - GATE PASS
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
            HOSTELLER ONLY - CANTEEN
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
  );
}