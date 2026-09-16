import {
  Search,
  Bell,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

export default function Topbar({ title }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // LANGUAGE
  // ============================================

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

  // ============================================
  // DETERMINE PORTAL
  // ============================================

  const isAdmin =
    location.pathname.startsWith("/admin");

  // ============================================
  // NOTIFICATION
  // ============================================

  const handleNotificationClick = () => {
    if (isAdmin) {
      navigate("/admin/notifications");
    } else {
      navigate("/notifications");
    }
  };

  // ============================================
  // LANGUAGE CHANGE
  // ============================================

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  // ============================================
  // TOPBAR
  // ============================================

  return (
    <header className="topbar">

      {/* ========================================
          PAGE TITLE
      ======================================== */}

      <div>
        <h2>{title}</h2>
      </div>

      {/* ========================================
          TOPBAR ACTIONS
      ======================================== */}

      <div className="topbar-actions">

        {/* ======================================
            SEARCH
        ====================================== */}

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder={t("search")}
          />

        </div>

        {/* ======================================
            LANGUAGE SELECTOR
        ====================================== */}

        <div
          className="language-selector"
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "10px",
          }}
        >

          <select
            value={language}
            onChange={handleLanguageChange}
            title={t("language")}
            aria-label={t("language")}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#1f2937",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              outline: "none",
            }}
          >

            <option value="en">
              English
            </option>

            <option value="hi">
              हिंदी
            </option>

            <option value="or">
              ଓଡ଼ିଆ
            </option>

          </select>

        </div>

        {/* ======================================
            NOTIFICATION BUTTON
        ====================================== */}

        <button
          className="notification-btn"
          onClick={handleNotificationClick}
          title={t("notifications")}
          aria-label={t("notifications")}
        >

          <Bell size={20} />

          <span className="notification-dot"></span>

        </button>

        {/* ======================================
            AVATAR
        ====================================== */}

        <div className="avatar">
          AD
        </div>

      </div>

    </header>
  );
}