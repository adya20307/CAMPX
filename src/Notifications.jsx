import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Info,
  CheckCheck,
} from "lucide-react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./notificationStorage";

// Current logged-in student
const CURRENT_STUDENT_ID = "CX2026001";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  // ============================================
  // LOAD STUDENT NOTIFICATIONS ONLY
  // ============================================

  const loadNotifications = () => {
    const studentNotifications =
      getNotifications("student");

    const filteredNotifications =
      studentNotifications.filter(
        (notification) => {
          if (
            notification.studentId &&
            notification.studentId !==
              CURRENT_STUDENT_ID
          ) {
            return false;
          }

          return true;
        }
      );

    setNotifications(filteredNotifications);
  };

  // ============================================
  // LOAD NOTIFICATIONS + LISTEN FOR UPDATES
  // ============================================

  useEffect(() => {
    loadNotifications();

    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener(
      "campx-notification",
      handleNotificationUpdate
    );

    window.addEventListener(
      "storage",
      handleNotificationUpdate
    );

    return () => {
      window.removeEventListener(
        "campx-notification",
        handleNotificationUpdate
      );

      window.removeEventListener(
        "storage",
        handleNotificationUpdate
      );
    };
  }, []);

  // ============================================
  // HANDLE NOTIFICATION CLICK
  // ============================================

  const handleNotificationClick = (
    notification
  ) => {
    // Mark notification as read
    markNotificationRead(notification.id);

    loadNotifications();

    // Navigate according to notification type
    if (notification.type === "complaint") {
      navigate("/complaints");
      return;
    }

    if (notification.type === "request") {
      navigate("/requests");
      return;
    }

    if (notification.type === "gate-pass") {
      navigate("/gatepass");
      return;
    }
  };

  // ============================================
  // MARK ALL STUDENT NOTIFICATIONS AS READ
  // ============================================

  const handleMarkAllRead = () => {
    markAllNotificationsRead("student");
    loadNotifications();
  };

  // ============================================
  // COUNT UNREAD NOTIFICATIONS
  // ============================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // ============================================
  // GET NOTIFICATION ICON
  // ============================================

  const getIcon = (notification) => {
    if (notification.status === "Approved") {
      return <CheckCircle2 size={20} />;
    }

    if (notification.status === "Rejected") {
      return <XCircle size={20} />;
    }

    if (notification.status === "Resolved") {
      return <CheckCircle2 size={20} />;
    }

    if (notification.type === "gate-pass") {
      return <Clock size={20} />;
    }

    if (notification.type === "complaint") {
      return <FileText size={20} />;
    }

    if (notification.type === "request") {
      return <FileText size={20} />;
    }

    return <Info size={20} />;
  };

  // ============================================
  // GET ICON STYLE
  // ============================================

  const getIconClass = (notification) => {
    if (notification.status === "Approved") {
      return "notification-icon approved";
    }

    if (notification.status === "Rejected") {
      return "notification-icon rejected";
    }

    if (notification.status === "Resolved") {
      return "notification-icon approved";
    }

    return "notification-icon";
  };

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  // ============================================
  // PAGE UI
  // ============================================

  return (
    <div className="page-container">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="admin-page-header">

        <div>

          <div className="eyebrow">
            COMMUNICATION
          </div>

          <h1>
            Notifications
          </h1>

          <p>
            Important updates from your campus.
          </p>

        </div>

        <div className="gate-pass-header-icon">
          <Bell size={28} />
        </div>

      </div>


      {/* ======================================
          NOTIFICATION CARD
      ====================================== */}

      <div className="card">

        <div className="section-header">

          <div>

            <h2>
              Your Notifications
            </h2>

            <p>
              Stay updated with campus
              activities and requests.
            </p>

          </div>


          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >

            {/* MARK ALL READ */}

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  border: "none",
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "9px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "600",
                }}
              >
                <CheckCheck size={16} />

                Mark all read
              </button>
            )}

            <Bell size={24} />

          </div>

        </div>


        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {notifications.length === 0 ? (

          <div className="empty-state">

            <Bell size={42} />

            <h3>
              No notifications
            </h3>

            <p>
              You're all caught up.
            </p>

          </div>

        ) : (

          /* ====================================
             NOTIFICATION LIST
          ==================================== */

          <div className="notification-list">

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read
                      ? "unread"
                      : ""
                  }`}
                  onClick={() =>
                    handleNotificationClick(
                      notification
                    )
                  }
                  style={{
                    cursor:
                      notification.type ===
                        "complaint" ||
                      notification.type ===
                        "request" ||
                      notification.type ===
                        "gate-pass"
                        ? "pointer"
                        : "default",
                  }}
                >

                  {/* ICON */}

                  <div
                    className={getIconClass(
                      notification
                    )}
                  >
                    {getIcon(notification)}
                  </div>


                  {/* CONTENT */}

                  <div className="notification-content">

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "12px",
                      }}
                    >

                      <h3>
                        {notification.title}
                      </h3>

                      {!notification.read && (
                        <span className="notification-new">
                          NEW
                        </span>
                      )}

                    </div>


                    <p>
                      {notification.message}
                    </p>


                    <small>
                      {formatDate(
                        notification.createdAt
                      )}
                    </small>


                    {/* CLICK HINT */}

                    {(notification.type ===
                      "complaint" ||
                      notification.type ===
                        "request" ||
                      notification.type ===
                        "gate-pass") && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "6px",
                          color: "#2563eb",
                          fontWeight: "600",
                        }}
                      >
                        Click to view →
                      </small>
                    )}

                  </div>


                  {/* UNREAD DOT */}

                  {!notification.read && (
                    <span className="unread" />
                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}