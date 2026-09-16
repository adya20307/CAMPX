import { useEffect, useState } from "react";
import {
  Bot,
  Bell,
  ClipboardList,
  Clock3,
  FileText,
  DoorOpen,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  BookOpen,
  MapPin,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getNotifications } from "../notificationStorage";

const COMPLAINTS_KEY = "campxComplaints";
const REQUESTS_KEY = "campxRequests";
const GATEPASS_KEY = "campx_gate_passes";
const ATTENDANCE_KEY = "campx_attendance";
const TIMETABLE_KEY = "campx_timetable";

const DEFAULT_ATTENDANCE = [
  { id: "sub1", subject: "Data Base Management System", code: "DBMS", present: 28, total: 32 },
  { id: "sub2", subject: "Computer Networks", code: "CN", present: 24, total: 30 },
  { id: "sub3", subject: "Artificial Intelligence", code: "AI", present: 27, total: 30 },
  { id: "sub4", subject: "Software Engineering", code: "SE", present: 21, total: 30 },
  { id: "sub5", subject: "Environmental Engineering", code: "EE", present: 25, total: 30 },
];

const DEFAULT_TIMETABLE = {
  Monday: [
    { id: "MON-1", time: "09:00 AM - 10:00 AM", subject: "Artificial Intelligence", faculty: "Dr. Sharma", room: "Room 201", status: "Scheduled" },
    { id: "MON-2", time: "10:00 AM - 11:00 AM", subject: "Computer Networks", faculty: "Prof. Das", room: "Room 204", status: "Scheduled" },
    { id: "MON-3", time: "11:30 AM - 12:30 PM", subject: "Database Management", faculty: "Dr. Patnaik", room: "Lab 2", status: "Scheduled" },
  ],
  Tuesday: [
    { id: "TUE-1", time: "09:00 AM - 10:00 AM", subject: "Operating Systems", faculty: "Prof. Mishra", room: "Room 202", status: "Scheduled" },
    { id: "TUE-2", time: "10:00 AM - 11:00 AM", subject: "Machine Learning", faculty: "Dr. Sharma", room: "Lab 3", status: "Scheduled" },
  ],
  Wednesday: [
    { id: "WED-1", time: "09:00 AM - 10:00 AM", subject: "Computer Networks", faculty: "Prof. Das", room: "Room 204", status: "Scheduled" },
    { id: "WED-2", time: "11:00 AM - 12:00 PM", subject: "Artificial Intelligence", faculty: "Dr. Sharma", room: "Room 201", status: "Scheduled" },
  ],
  Thursday: [
    { id: "THU-1", time: "10:00 AM - 11:00 AM", subject: "Database Management", faculty: "Dr. Patnaik", room: "Room 205", status: "Scheduled" },
  ],
  Friday: [
    { id: "FRI-1", time: "09:00 AM - 10:00 AM", subject: "Operating Systems", faculty: "Prof. Mishra", room: "Room 202", status: "Scheduled" },
    { id: "FRI-2", time: "11:00 AM - 12:00 PM", subject: "Machine Learning", faculty: "Dr. Sharma", room: "Lab 3", status: "Scheduled" },
  ],
  Saturday: [
    { id: "SAT-1", time: "09:00 AM - 10:00 AM", subject: "Project / Practical", faculty: "Department Faculty", room: "Lab 1", status: "Scheduled" },
  ],
};

function readLocalData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed || fallback;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return fallback;
  }
}

function getStudentAttendance(savedData, studentId) {
  if (!Array.isArray(savedData) || savedData.length === 0) {
    return DEFAULT_ATTENDANCE;
  }

  const studentRecord = savedData.find(
    (record) =>
      record &&
      record.studentId === studentId &&
      Array.isArray(record.subjects)
  );

  if (studentRecord) {
    return studentRecord.subjects;
  }

  const looksLikeSubjectArray = savedData.every(
    (item) =>
      item &&
      typeof item === "object" &&
      ("subject" in item || "code" in item) &&
      ("present" in item || "total" in item)
  );

  return looksLikeSubjectArray ? savedData : DEFAULT_ATTENDANCE;
}

function attendancePercentage(present, total) {
  if (!Number(total)) return 0;
  return Math.round((Number(present) / Number(total)) * 100);
}


export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [requests, setRequests] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [attendance, setAttendance] = useState(DEFAULT_ATTENDANCE);
  const [timetable, setTimetable] = useState(DEFAULT_TIMETABLE);

  // =====================================================
  // CURRENT LOGGED-IN STUDENT
  // =====================================================

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("campx_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Invalid CAMPX user data:", error);
      return null;
    }
  });

  const currentStudentId =
    currentUser?.studentId ||
    currentUser?.student_id ||
    "";

  const isHosteller =
    currentUser?.hostelStatus === "HOSTELLER" ||
    currentUser?.hostel_status === "HOSTELLER";

  const studentName = currentUser?.name || "Student";
  const studentBranch = currentUser?.branch || "—";
  const studentSemester = currentUser?.semester || "—";

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadDashboardData = () => {
    try {
      const savedAttendance = readLocalData(
        ATTENDANCE_KEY,
        DEFAULT_ATTENDANCE
      );

      setAttendance(
        getStudentAttendance(
          savedAttendance,
          currentStudentId
        )
      );

      setTimetable(
        readLocalData(
          TIMETABLE_KEY,
          DEFAULT_TIMETABLE
        )
      );

      const savedComplaints =
        JSON.parse(
          localStorage.getItem(COMPLAINTS_KEY) || "[]"
        );

      const savedRequests =
        JSON.parse(
          localStorage.getItem(REQUESTS_KEY) || "[]"
        );

      const savedGatePasses =
        JSON.parse(
          localStorage.getItem(GATEPASS_KEY) || "[]"
        );

      setComplaints(
        Array.isArray(savedComplaints)
          ? savedComplaints.filter(
              (item) =>
                currentStudentId &&
                item.studentId === currentStudentId
            )
          : []
      );

      setRequests(
        Array.isArray(savedRequests)
          ? savedRequests.filter(
              (item) =>
                currentStudentId &&
                item.studentId === currentStudentId
            )
          : []
      );

      setGatePasses(
        Array.isArray(savedGatePasses)
          ? savedGatePasses.filter(
              (item) =>
                currentStudentId &&
                item.studentId === currentStudentId
            )
          : []
      );

      setNotifications(
        getNotifications("student").filter(
          (notification) =>
            !notification.studentId ||
            notification.studentId === currentStudentId
        )
      );
    } catch (error) {
      console.error(
        "Error loading student dashboard:",
        error
      );

      setComplaints([]);
      setRequests([]);
      setGatePasses([]);
      setNotifications([]);
      setAttendance(DEFAULT_ATTENDANCE);
      setTimetable(DEFAULT_TIMETABLE);
    }
  };

  /* =====================================================
     LIVE UPDATES
  ===================================================== */

  useEffect(() => {
    loadDashboardData();

    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener(
      "storage",
      handleUpdate
    );

    window.addEventListener(
      "campx-complaint-updated",
      handleUpdate
    );

    window.addEventListener(
      "campx-request-updated",
      handleUpdate
    );

    window.addEventListener(
      "campx-gatepass-updated",
      handleUpdate
    );

    window.addEventListener(
      "campx-notification",
      handleUpdate
    );

    const interval = setInterval(
      loadDashboardData,
      2000
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleUpdate
      );

      window.removeEventListener(
        "campx-complaint-updated",
        handleUpdate
      );

      window.removeEventListener(
        "campx-request-updated",
        handleUpdate
      );

      window.removeEventListener(
        "campx-gatepass-updated",
        handleUpdate
      );

      window.removeEventListener(
        "campx-notification",
        handleUpdate
      );

      clearInterval(interval);
    };
  }, []);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const pendingComplaints =
    complaints.filter(
      (item) =>
        item.status !== "Resolved" &&
        item.status !== "Rejected"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (item) =>
        item.status === "Resolved"
    ).length;

  const pendingRequests =
    requests.filter(
      (item) =>
        item.status !== "Resolved" &&
        item.status !== "Approved" &&
        item.status !== "Rejected"
    ).length;

  const approvedGatePasses =
    gatePasses.filter(
      (item) =>
        item.status === "Approved"
    ).length;

  const unreadNotifications =
    notifications.filter(
      (item) => !item.read
    ).length;

  // =====================================================
  // ACADEMIC DASHBOARD
  // =====================================================

  const totalPresent = attendance.reduce(
    (sum, subject) =>
      sum + Number(subject.present || 0),
    0
  );

  const totalClasses = attendance.reduce(
    (sum, subject) =>
      sum + Number(subject.total || 0),
    0
  );

  const overallAttendance = attendancePercentage(
    totalPresent,
    totalClasses
  );

  const todayDay = new Date().toLocaleDateString(
    "en-US",
    { weekday: "long" }
  );

  const todayClasses = timetable[todayDay] || [];

  const recentComplaints =
    complaints.slice(0, 3);

  /* =====================================================
     RETURN
  ===================================================== */

  if (!currentUser || currentUser.role !== "student") {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Topbar title="Student Dashboard" />

          <div className="content">
            <section className="dashboard-section">
              <div className="panel">
                <div className="student-empty-state">
                  <AlertTriangle size={30} />

                  <strong>
                    Student session not found
                  </strong>

                  <p>
                    Please log in again using your student registration number.
                  </p>

                  <Link
                    to="/login"
                    className="campy-dashboard-btn"
                  >
                    Go to Student Login
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Topbar title="Student Dashboard" />

        <div className="content">

          {/* =================================================
              WELCOME HEADER
          ================================================= */}

          <section className="welcome-section">

            <div>
              <p className="eyebrow">
                CAMPX STUDENT PORTAL
              </p>

              <h1>
                {`Good morning, ${studentName} 👋`}
              </h1>

              <p>
                Manage your campus life from one
                place.
              </p>
            </div>

            <button
              className="secondary-btn"
              onClick={loadDashboardData}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </section>


          {/* =================================================
              STUDENT PROFILE
          ================================================= */}

          <section className="student-profile-card">

            <div className="student-avatar">
              {studentName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </div>

            <div className="student-profile-info">

              <h3>
                {studentName}
              </h3>

              <p>
                {currentStudentId || "—"} • {studentBranch} • {studentSemester}
              </p>

            </div>

            <div className="student-profile-status">
              <span className="profile-status-dot"></span>
              Student Account
            </div>

          </section>


          {/* =================================================
              CAMPY AI ASSISTANT
          ================================================= */}

          <section className="campy-dashboard-card">

            <div className="campy-dashboard-left">

              <div className="campy-dashboard-icon">
                <Bot size={30} />
              </div>

              <div className="campy-ai-badge">
                <Sparkles size={13} />
                CAMPX AI
              </div>

            </div>

            <div className="campy-dashboard-content">

              <h2>
                Meet CAMPY 🤖
              </h2>

              <p className="campy-subtitle">
                Your Campus AI Assistant
              </p>

              <p className="campy-description">
                Tell CAMPY what you need in your
                own words. Get help with complaints,
                applications, timetable, gate passes,
                documents and campus services.
              </p>

              <Link
                to="/ai-complaint"
                className="campy-dashboard-btn"
              >
                Ask CAMPY
                <ArrowRight size={17} />
              </Link>

            </div>

            <div className="campy-floating-sparkle">
              <Sparkles size={22} />
            </div>

          </section>


          {/* =================================================
              QUICK STATS
          ================================================= */}

          <section className="student-stats-grid">

            <DashboardStat
              icon={<ClipboardList size={21} />}
              title="My Complaints"
              value={complaints.length}
              subtitle={
                pendingComplaints > 0
                  ? `${pendingComplaints} pending`
                  : "All resolved"
              }
              type="blue"
            />

            <DashboardStat
              icon={<Clock3 size={21} />}
              title="Pending Requests"
              value={pendingRequests}
              subtitle="Awaiting action"
              type="orange"
            />

            <DashboardStat
              icon={<DoorOpen size={21} />}
              title="Gate Passes"
              value={isHosteller ? approvedGatePasses : 0}
              subtitle={isHosteller ? "Approved passes" : "Not applicable"}
              type="purple"
            />

            <DashboardStat
              icon={<Bell size={21} />}
              title="Notifications"
              value={unreadNotifications}
              subtitle={
                unreadNotifications > 0
                  ? "Need your attention"
                  : "All caught up"
              }
              type="green"
            />

          </section>


          {/* =================================================
              ACADEMIC OVERVIEW
          ================================================= */}

          <section
            className="dashboard-section"
            style={{ marginTop: "24px" }}
          >
            <div
              className="dashboard-grid"
              style={{
                gridTemplateColumns:
                  "minmax(0, 0.85fr) minmax(0, 1.15fr)",
                alignItems: "stretch",
              }}
            >

              {/* OVERALL ATTENDANCE */}

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Overall Attendance</h3>
                    <p>Your attendance across all subjects</p>
                  </div>

                  <BookOpen size={20} />
                </div>

                <div style={{ padding: "10px 4px 20px" }}>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          display: "block",
                          fontSize: "42px",
                          lineHeight: 1,
                          color: "#102d52",
                        }}
                      >
                        {overallAttendance}%
                      </strong>

                      <span
                        style={{
                          display: "block",
                          marginTop: "10px",
                          color: "#71829a",
                          fontSize: "14px",
                        }}
                      >
                        {totalPresent} / {totalClasses} classes attended
                      </span>
                    </div>

                    <div
                      style={{
                        width: "78px",
                        height: "78px",
                        borderRadius: "50%",
                        border: "8px solid #edf4ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2866b3",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      {overallAttendance}%
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "24px",
                      height: "10px",
                      background: "#edf1f6",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(overallAttendance, 100)}%`,
                        height: "100%",
                        background: "#2866b3",
                        borderRadius: "10px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                      fontSize: "13px",
                      color: "#71829a",
                    }}
                  >
                    <span>Minimum required: 75%</span>

                    <span
                      style={{
                        fontWeight: "600",
                        color:
                          overallAttendance >= 75
                            ? "#238b4d"
                            : "#d13b3b",
                      }}
                    >
                      {overallAttendance >= 75
                        ? "Attendance is safe"
                        : "Needs improvement"}
                    </span>
                  </div>

                  <Link
                    to="/attendance"
                    className="dashboard-view-link"
                    style={{
                      display: "inline-flex",
                      marginTop: "20px",
                    }}
                  >
                    View detailed attendance
                    <ArrowRight size={15} />
                  </Link>

                </div>
              </div>


              {/* TODAY'S CLASS SCHEDULE */}

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Today's Class Schedule</h3>
                    <p>
                      {todayDay} • {todayClasses.length}{" "}
                      {todayClasses.length === 1
                        ? "class"
                        : "classes"}
                    </p>
                  </div>

                  <CalendarDays size={20} />
                </div>

                {todayClasses.length === 0 ? (
                  <div
                    className="student-empty-state"
                    style={{ minHeight: "220px" }}
                  >
                    <CalendarDays size={30} />
                    <strong>No classes scheduled</strong>
                    <p>
                      There are no classes scheduled for
                      today.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "4px 0 8px",
                      maxHeight: "330px",
                      overflowY: "auto",
                    }}
                  >
                    {todayClasses.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: "15px 4px",
                          borderBottom:
                            "1px solid #edf0f5",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "14px",
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "7px",
                                color: "#2866b3",
                                fontSize: "13px",
                                fontWeight: "600",
                              }}
                            >
                              <Clock3 size={14} />
                              {item.time}
                            </div>

                            <strong
                              style={{
                                display: "block",
                                marginTop: "7px",
                                color: "#102d52",
                                fontSize: "15px",
                              }}
                            >
                              {item.subject}
                            </strong>

                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                                marginTop: "7px",
                                color: "#71829a",
                                fontSize: "12px",
                              }}
                            >
                              <span>
                                <UserRound
                                  size={12}
                                  style={{
                                    verticalAlign:
                                      "middle",
                                    marginRight: "4px",
                                  }}
                                />
                                {item.faculty}
                              </span>

                              <span>
                                <MapPin
                                  size={12}
                                  style={{
                                    verticalAlign:
                                      "middle",
                                    marginRight: "4px",
                                  }}
                                />
                                {item.room}
                              </span>
                            </div>
                          </div>

                          <span
                            style={{
                              flexShrink: 0,
                              padding: "5px 9px",
                              borderRadius: "20px",
                              background:
                                item.status ===
                                "Cancelled"
                                  ? "#fff0f0"
                                  : item.status ===
                                    "Suspended"
                                  ? "#fff5e8"
                                  : "#eaf8ef",
                              color:
                                item.status ===
                                "Cancelled"
                                  ? "#d13b3b"
                                  : item.status ===
                                    "Suspended"
                                  ? "#c56b12"
                                  : "#238b4d",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  to="/timetable"
                  className="dashboard-view-link"
                  style={{
                    display: "inline-flex",
                    marginTop: "10px",
                  }}
                >
                  View full timetable
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>
          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>
                <h2>
                  Quick Actions
                </h2>

                <p>
                  Frequently used campus services
                </p>
              </div>

            </div>


            <div className="student-quick-actions">

              <Link
                to="/complaints"
                className="quick-action-card"
              >
                <div className="quick-action-icon complaint">
                  <ClipboardList size={21} />
                </div>

                <div>
                  <strong>
                    Complaints
                  </strong>

                  <span>
                    Report or track an issue
                  </span>
                </div>

                <ArrowRight size={16} />
              </Link>


              <Link
                to="/requests"
                className="quick-action-card"
              >
                <div className="quick-action-icon request">
                  <FileText size={21} />
                </div>

                <div>
                  <strong>
                    Requests
                  </strong>

                  <span>
                    Certificates and documents
                  </span>
                </div>

                <ArrowRight size={16} />
              </Link>


              {isHosteller && (
                <Link
                  to="/gatepass"
                  className="quick-action-card"
                >
                  <div className="quick-action-icon gatepass">
                    <DoorOpen size={21} />
                  </div>

                  <div>
                    <strong>
                      Gate Pass
                    </strong>

                    <span>
                      Apply for a gate pass
                    </span>
                  </div>

                  <ArrowRight size={16} />
                </Link>
              )}


              <Link
                to="/timetable"
                className="quick-action-card"
              >
                <div className="quick-action-icon timetable">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <strong>
                    Timetable
                  </strong>

                  <span>
                    Check today's classes
                  </span>
                </div>

                <ArrowRight size={16} />
              </Link>


              <Link
                to="/applications"
                className="quick-action-card"
              >
                <div className="quick-action-icon application">
                  <FileText size={21} />
                </div>

                <div>
                  <strong>
                    Applications
                  </strong>

                  <span>
                    Submit official applications
                  </span>
                </div>

                <ArrowRight size={16} />
              </Link>


              <Link
                to="/notifications"
                className="quick-action-card"
              >
                <div className="quick-action-icon notification">
                  <Bell size={21} />
                </div>

                <div>
                  <strong>
                    Notifications
                  </strong>

                  <span>
                    View latest updates
                  </span>
                </div>

                <ArrowRight size={16} />
              </Link>

            </div>

          </section>


          {/* =================================================
              CAMPUS SERVICES
          ================================================= */}

          <section className="dashboard-grid">

            {/* Recent Complaints */}

            <div className="panel">

              <div className="panel-header">

                <div>
                  <h3>
                    Recent Complaints
                  </h3>

                  <p>
                    Track your reported issues
                  </p>
                </div>

                <ClipboardList size={20} />

              </div>


              {recentComplaints.length === 0 ? (

                <div className="student-empty-state">

                  <CheckCircle2 size={30} />

                  <strong>
                    No complaints yet
                  </strong>

                  <p>
                    Everything looks good!
                  </p>

                </div>

              ) : (

                <div className="student-dashboard-list">

                  {recentComplaints.map(
                    (complaint) => (

                      <div
                        className="student-dashboard-list-item"
                        key={complaint.id}
                      >

                        <div className="dashboard-list-icon">
                          <AlertTriangle size={17} />
                        </div>

                        <div className="dashboard-list-info">

                          <strong>
                            {complaint.issue ||
                              complaint.category ||
                              "Campus Complaint"}
                          </strong>

                          <span>
                            {complaint.location ||
                              "Campus"}
                          </span>

                        </div>

                        <span
                          className={`dashboard-status ${
                            String(
                              complaint.status ||
                                "Submitted"
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >
                          {complaint.status ||
                            "Submitted"}
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

              <Link
                to="/complaints"
                className="dashboard-view-link"
              >
                View all complaints
                <ArrowRight size={15} />
              </Link>

            </div>


            {/* Notifications */}

            <div className="panel">

              <div className="panel-header">

                <div>
                  <h3>
                    Latest Notifications
                  </h3>

                  <p>
                    Important campus updates
                  </p>
                </div>

                <Bell size={20} />

              </div>


              {notifications.length === 0 ? (

                <div className="student-empty-state">

                  <Bell size={30} />

                  <strong>
                    No new notifications
                  </strong>

                  <p>
                    You're all caught up.
                  </p>

                </div>

              ) : (

                <div className="student-dashboard-list">

                  {notifications
                    .slice(0, 3)
                    .map((notification) => (

                      <div
                        className={`student-dashboard-list-item ${
                          !notification.read
                            ? "unread"
                            : ""
                        }`}
                        key={notification.id}
                      >

                        <div className="dashboard-list-icon notification-list-icon">
                          <Bell size={17} />
                        </div>

                        <div className="dashboard-list-info">

                          <strong>
                            {notification.title}
                          </strong>

                          <span>
                            {notification.message}
                          </span>

                        </div>

                        {!notification.read && (
                          <span className="unread-dot"></span>
                        )}

                      </div>

                    ))}

                </div>

              )}

              <Link
                to="/notifications"
                className="dashboard-view-link"
              >
                View notifications
                <ArrowRight size={15} />
              </Link>

            </div>

          </section>


          {/* =================================================
              CAMPY PROMO
          ================================================= */}

          <section className="campy-bottom-banner">

            <div className="campy-bottom-icon">
              <Bot size={25} />
            </div>

            <div>

              <strong>
                Need help navigating campus?
              </strong>

              <p>
                Just ask CAMPY. No complicated forms.
              </p>

            </div>

            <Link
              to="/ai-complaint"
              className="campy-bottom-btn"
            >
              Talk to CAMPY
              <ArrowRight size={16} />
            </Link>

          </section>

        </div>
      </main>
    </div>
  );
}


/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  icon,
  title,
  value,
  subtitle,
  type,
}) {
  return (
    <div className="student-dashboard-stat">

      <div className="student-stat-top">

        <div
          className={`student-stat-icon ${type}`}
        >
          {icon}
        </div>

        <span>
          {title}
        </span>

      </div>

      <strong className="student-stat-value">
        {value}
      </strong>

      <small>
        {subtitle}
      </small>

    </div>
  );
}