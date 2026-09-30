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
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getNotifications } from "../notificationStorage";

const COMPLAINTS_KEY = "campxComplaints";
const REQUESTS_KEY = "campxRequests";
const GATEPASS_KEY = "campx_gate_passes";
const API_URL = import.meta.env.VITE_API_URL || "/api";


export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [requests, setRequests] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticesError, setNoticesError] = useState("");

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
    }
  };

  /* =====================================================
     LOAD OFFICIAL NOTICES
  ===================================================== */

  const loadNotices = async () => {
    try {
      const token = localStorage.getItem("campx_token");

      if (!token) {
        setNotices([]);
        setNoticesError("Please login again to view notices.");
        return;
      }

      setNoticesLoading(true);
      setNoticesError("");

      const response = await fetch(
        `${API_URL}/notices/student`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load notices."
        );
      }

      setNotices(
        Array.isArray(data.notices)
          ? data.notices
          : []
      );
    } catch (error) {
      console.error("Error loading student notices:", error);
      setNotices([]);
      setNoticesError(
        error.message || "Unable to load notices."
      );
    } finally {
      setNoticesLoading(false);
    }
  };

  const downloadNotice = async (noticeId, title) => {
    try {
      const token = localStorage.getItem("campx_token");

      if (!token) {
        alert("Your session has expired. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/notices/${noticeId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message = "Unable to download notice.";
        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // Keep the default message.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const contentDisposition =
        response.headers.get("content-disposition") || "";

      const filenameMatch =
        contentDisposition.match(/filename="?([^"]+)"?/i);

      const fallbackName =
        String(title || "Notice")
          .replace(/[^a-zA-Z0-9-_]/g, "_");

      link.href = url;
      link.download =
        filenameMatch?.[1] || fallbackName;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Notice download error:", error);
      alert(error.message || "Unable to download notice.");
    }
  };

  /* =====================================================
     LIVE UPDATES
  ===================================================== */

  useEffect(() => {
    loadDashboardData();
    loadNotices();

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
      () => {
        loadDashboardData();
        loadNotices();
      },
      10000
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

              <Link
                to="/student/fees"
                className="quick-action-card"
              >
                <div className="quick-action-icon fee">
                  <CreditCard size={21} />
                </div>

                <div>
                  <strong>
                    My Fees
                  </strong>

                  <span>
                    View fees, payments and receipts
                  </span>
                </div>

                <ArrowRight size={16} />
              </Link>

            </div>

          </section>


          {/* =================================================
              OFFICIAL NOTICES
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>
                <h2>
                  Official Notices
                </h2>

                <p>
                  Important notices from CAMPX administration
                </p>
              </div>

              <Link
                to="/notifications"
                className="dashboard-view-link"
              >
                View all
                <ArrowRight size={15} />
              </Link>

            </div>

            <div className="panel">

              {noticesLoading ? (
                <div className="student-empty-state">
                  <FileText size={30} />
                  <strong>Loading notices...</strong>
                  <p>Please wait while we fetch your batch notices.</p>
                </div>
              ) : noticesError ? (
                <div className="student-empty-state">
                  <AlertTriangle size={30} />
                  <strong>Unable to load notices</strong>
                  <p>{noticesError}</p>
                  <button
                    className="secondary-btn"
                    onClick={loadNotices}
                  >
                    <RefreshCw size={16} />
                    Retry
                  </button>
                </div>
              ) : notices.length === 0 ? (
                <div className="student-empty-state">
                  <FileText size={30} />
                  <strong>No official notices</strong>
                  <p>New notices for your batch will appear here.</p>
                </div>
              ) : (
                <div className="student-dashboard-list">
                  {notices.slice(0, 5).map((notice) => (
                    <div
                      className="student-dashboard-list-item"
                      key={notice.id}
                    >
                      <div className="dashboard-list-icon notification-list-icon">
                        <FileText size={17} />
                      </div>

                      <div className="dashboard-list-info">
                        <strong>{notice.title}</strong>
                        <span>
                          {notice.message}
                        </span>
                        <small>
                          {notice.created_at
                            ? new Date(notice.created_at).toLocaleDateString("en-IN")
                            : ""}
                        </small>
                      </div>

                      {notice.file_path && (
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() =>
                            downloadNotice(
                              notice.id,
                              notice.title
                            )
                          }
                          title="Download notice"
                        >
                          Download
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

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