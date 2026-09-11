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
} from "lucide-react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getNotifications } from "../notificationStorage";

const COMPLAINTS_KEY = "campxComplaints";
const REQUESTS_KEY = "campxRequests";
const GATEPASS_KEY = "campx_gate_passes";

const CURRENT_STUDENT_ID = "CX2026001";

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [requests, setRequests] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);
  const [notifications, setNotifications] = useState([]);

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
                !item.studentId ||
                item.studentId === CURRENT_STUDENT_ID
            )
          : []
      );

      setRequests(
        Array.isArray(savedRequests)
          ? savedRequests.filter(
              (item) =>
                !item.studentId ||
                item.studentId === CURRENT_STUDENT_ID
            )
          : []
      );

      setGatePasses(
        Array.isArray(savedGatePasses)
          ? savedGatePasses.filter(
              (item) =>
                !item.studentId ||
                item.studentId === CURRENT_STUDENT_ID
            )
          : []
      );

      setNotifications(
        getNotifications("student").filter(
          (notification) =>
            !notification.studentId ||
            notification.studentId === CURRENT_STUDENT_ID
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

  const recentComplaints =
    complaints.slice(0, 3);

  /* =====================================================
     RETURN
  ===================================================== */

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
                Good morning, Adya 👋
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
              AD
            </div>

            <div className="student-profile-info">

              <h3>
                Adya Dash
              </h3>

              <p>
                CX2026001 • CSE • 6th Semester
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
              value={approvedGatePasses}
              subtitle="Approved passes"
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