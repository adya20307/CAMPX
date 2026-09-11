import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import Complaints from "./pages/Complaints";
import AIComplaint from "./pages/AIComplaint";

import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";

import GatePass from "./pages/GatePass";
import GatePassRequests from "./pages/GatePassRequests";

import Notifications from "./Notifications";
import AdminNotifications from "./pages/AdminNotifications";

import Requests from "./pages/Requests";
import AdminRequests from "./pages/AdminRequests";
import Timetable from "./pages/Timetable";
import AdminTimetable from "./pages/AdminTimetable";
import Applications from "./pages/Applications";
import AdminApplications from "./pages/AdminApplications";
import Attendance from "./pages/Attendance";
import AdminAttendance from "./pages/AdminAttendance";
import AdminStudents from "./pages/AdminStudents";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            DEFAULT
        ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================
            STUDENT
        ========================= */}

        <Route
          path="/student"
          element={<StudentDashboard />}
        />
        <Route
  path="/applications"
  element={<Applications />}
/>

<Route
  path="/admin/applications"
  element={<AdminApplications />}
/>
<Route
  path="/attendance"
  element={<Attendance />}
/>

<Route
  path="/admin/attendance"
  element={<AdminAttendance />}
/>
<Route
  path="/admin/students"
  element={<AdminStudents />}
/>

        <Route
          path="/complaints"
          element={<Complaints />}
        />

        <Route
          path="/ai-complaint"
          element={<AIComplaint />}
        />

        {/* Student Gate Pass */}

        <Route
          path="/gatepass"
          element={<GatePass />}
        />

        <Route
          path="/student/gatepass"
          element={<GatePass />}
        />

        {/* Student Requests */}

        <Route
          path="/requests"
          element={<Requests />}
        />

        {/* Student Notifications */}

        <Route
          path="/notifications"
          element={<Notifications />}
        />


        {/* =========================
            ADMIN
        ========================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* Admin Complaints */}

        <Route
          path="/admin/complaints"
          element={<AdminComplaints />}
        />

        {/* Admin Gate Pass */}

        <Route
          path="/admin/gatepass"
          element={<GatePassRequests />}
        />

        {/* Admin Requests */}

        <Route
          path="/admin/requests"
          element={<AdminRequests />}
        />

        {/* Admin Notifications */}

        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />
        <Route
  path="/timetable"
  element={<Timetable />}
/>
<Route path="/admin/timetable" element={<AdminTimetable />} />


        {/* =========================
            FALLBACK
        ========================= */}

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

export default App;