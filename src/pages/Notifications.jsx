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
} from "../notificationStorage";

import { useLanguage } from "../context/LanguageContext";

// Current logged-in student
const CURRENT_STUDENT_ID = "CX2026001";

export default function Notifications() {
  const { language, t } = useLanguage();

  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  // ============================================
  // TRANSLATIONS
  // ============================================

  const translations = {
    en: {
      communication: "COMMUNICATION",
      notifications: "Notifications",
      description: "Important updates from your campus.",
      yourNotifications: "Your Notifications",
      stayUpdated: "Stay updated with campus activities and requests.",
      markAllRead: "Mark all read",
      noNotifications: "No notifications",
      caughtUp: "You're all caught up.",
      new: "NEW",
      clickToView: "Click to view →",
      approved: "Approved",
      rejected: "Rejected",
      resolved: "Resolved",
    },

    hi: {
      communication: "संचार",
      notifications: "सूचनाएं",
      description: "आपके कैंपस से महत्वपूर्ण अपडेट।",
      yourNotifications: "आपकी सूचनाएं",
      stayUpdated: "कैंपस गतिविधियों और अनुरोधों से अपडेट रहें।",
      markAllRead: "सभी को पढ़ा हुआ करें",
      noNotifications: "कोई सूचना नहीं",
      caughtUp: "आप सभी सूचनाओं से अपडेट हैं।",
      new: "नई",
      clickToView: "देखने के लिए क्लिक करें →",
      approved: "स्वीकृत",
      rejected: "अस्वीकृत",
      resolved: "समाधान किया गया",
    },

    or: {
      communication: "ଯୋଗାଯୋଗ",
      notifications: "ବିଜ୍ଞପ୍ତି",
      description: "ଆପଣଙ୍କ କ୍ୟାମ୍ପସରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଅପଡେଟ୍।",
      yourNotifications: "ଆପଣଙ୍କ ବିଜ୍ଞପ୍ତି",
      stayUpdated: "କ୍ୟାମ୍ପସ କାର୍ଯ୍ୟକଳାପ ଏବଂ ଅନୁରୋଧ ବିଷୟରେ ଅପଡେଟ୍ ରୁହନ୍ତୁ।",
      markAllRead: "ସମସ୍ତଙ୍କୁ ପଢ଼ା ହୋଇଛି ବୋଲି ଚିହ୍ନଟ କରନ୍ତୁ",
      noNotifications: "କୌଣସି ବିଜ୍ଞପ୍ତି ନାହିଁ",
      caughtUp: "ଆପଣ ସମସ୍ତ ବିଜ୍ଞପ୍ତି ଦେଖିସାରିଛନ୍ତି।",
      new: "ନୂଆ",
      clickToView: "ଦେଖିବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ →",
      approved: "ଅନୁମୋଦିତ",
      rejected: "ପ୍ରତ୍ୟାଖ୍ୟାନ",
      resolved: "ସମାଧାନ ହୋଇଛି",
    },
  };

  const local = translations[language] || translations.en;

  // ============================================
  // TRANSLATE NOTIFICATION STATUS
  // ============================================

  const translateStatus = (status) => {
    if (!status) return "";

    if (status === "Approved") {
      return local.approved;
    }

    if (status === "Rejected") {
      return local.rejected;
    }

    if (status === "Resolved") {
      return local.resolved;
    }

    return status;
  };

  // ============================================
  // LOAD STUDENT NOTIFICATIONS ONLY
  // ============================================

  const loadNotifications = () => {
    const studentNotifications = getNotifications("student");

    const filteredNotifications = studentNotifications.filter(
      (notification) => {
        if (
          notification.studentId &&
          notification.studentId !== CURRENT_STUDENT_ID
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
  // RELOAD WHEN LANGUAGE CHANGES
  // ============================================

  useEffect(() => {
    loadNotifications();
  }, [language]);

  // ============================================
  // HANDLE NOTIFICATION CLICK
  // ============================================

  const handleNotificationClick = (notification) => {
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
      const locale =
        language === "hi"
          ? "hi-IN"
          : language === "or"
          ? "or-IN"
          : "en-IN";

      return new Date(date).toLocaleString(locale);
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
            {local.communication}
          </div>

          <h1>
            {local.notifications}
          </h1>

          <p>
            {local.description}
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
              {local.yourNotifications}
            </h2>

            <p>
              {local.stayUpdated}
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

                {local.markAllRead}

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
              {local.noNotifications}
            </h3>

            <p>
              {local.caughtUp}
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
                          {local.new}
                        </span>
                      )}

                    </div>


                    <p>
                      {notification.message}
                    </p>


                    {notification.status && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "4px",
                          fontWeight: "600",
                        }}
                      >
                        {translateStatus(
                          notification.status
                        )}
                      </small>
                    )}


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
                        {local.clickToView}
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