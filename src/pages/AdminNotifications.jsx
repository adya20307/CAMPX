import { useEffect, useState } from "react";
import {
  Bell,
  ClipboardList,
  FileText,
  DoorOpen,
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../notificationStorage";

export default function AdminNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  /* =====================================================
     LOAD NOTIFICATIONS
  ===================================================== */

  const loadNotifications = () => {
    const adminNotifications =
      getNotifications("admin");

    setNotifications(adminNotifications);
  };

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

  /* =====================================================
     GET ICON
  ===================================================== */

  const getNotificationIcon = (type, status) => {
    if (
      status === "Approved" ||
      status === "Resolved"
    ) {
      return (
        <CheckCircle2
          size={20}
          className="notification-success-icon"
        />
      );
    }

    switch (type) {
      case "complaint":
        return <ClipboardList size={20} />;

      case "request":
        return <FileText size={20} />;

      case "application":
        return <FileText size={20} />;

      case "gate-pass":
        return <DoorOpen size={20} />;

      default:
        return <Info size={20} />;
    }
  };

  /* =====================================================
     GET DESTINATION
  ===================================================== */

  const getNotificationDestination = (
    notification
  ) => {
    switch (notification.type) {
      case "complaint":
        return "/admin/complaints";

      case "request":
        return "/admin/requests";

      case "application":
        return "/admin/applications";

      case "gate-pass":
        return "/admin/gatepass";

      default:
        return "/admin";
    }
  };

  /* =====================================================
     CLICK NOTIFICATION
  ===================================================== */

  const handleNotificationClick = (
    notification
  ) => {
    /* Mark as read */
    if (!notification.read) {
      markNotificationRead(notification.id);
    }

    /* Go to related admin section */
    const destination =
      getNotificationDestination(
        notification
      );

    navigate(destination);
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "";
    }
  };

  /* =====================================================
     MARK ALL
  ===================================================== */

  const handleMarkAllRead = () => {
    markAllNotificationsRead("admin");
    loadNotifications();
  };

  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">

        <Topbar title="Admin Notifications" />

        <div className="content">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="welcome-section">

            <div>
              <p className="eyebrow">
                ADMINISTRATION
              </p>

              <h1>
                Admin Notifications
              </h1>

              <p>
                Notifications and requests from
                students.
              </p>
            </div>

            <div className="notification-header-icon">
              <Bell size={28} />
            </div>

          </section>


          {/* =================================================
              NOTIFICATION PANEL
          ================================================= */}

          <section className="panel admin-notification-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Admin Notifications
                </h3>

                <p>
                  Stay updated about student
                  requests and campus activity.
                </p>
              </div>

              <Bell size={21} />

            </div>


            {/* MARK ALL */}

            {notifications.length > 0 && (
              <div className="admin-notification-actions">

                <span>
                  {notifications.filter(
                    (notification) =>
                      !notification.read
                  ).length}{" "}
                  unread
                </span>

                <button
                  onClick={handleMarkAllRead}
                >
                  Mark all as read
                </button>

              </div>
            )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {notifications.length === 0 ? (

              <div className="admin-notification-empty">

                <Bell size={38} />

                <h3>
                  No notifications
                </h3>

                <p>
                  New student activity will
                  appear here automatically.
                </p>

              </div>

            ) : (

              <div className="admin-notification-list">

                {notifications.map(
                  (notification) => (

                    <button
                      key={notification.id}
                      className={`admin-notification-item ${
                        !notification.read
                          ? "unread"
                          : ""
                      }`}
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                    >

                      {/* ICON */}

                      <div
                        className={`admin-notification-icon ${
                          notification.type ||
                          "info"
                        }`}
                      >
                        {getNotificationIcon(
                          notification.type,
                          notification.status
                        )}
                      </div>


                      {/* CONTENT */}

                      <div className="admin-notification-content">

                        <div className="admin-notification-title-row">

                          <strong>
                            {notification.title}
                          </strong>

                          {!notification.read && (
                            <span className="admin-unread-badge">
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


                        <span className="notification-click-hint">
                          Click to view
                          <ArrowRight size={13} />
                        </span>

                      </div>


                      {/* ARROW */}

                      <ArrowRight
                        size={18}
                        className="admin-notification-arrow"
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </main>
    </div>
  );
}