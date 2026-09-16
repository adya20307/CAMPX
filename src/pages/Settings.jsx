import React, { useState } from "react";

import {
  Settings as SettingsIcon,
  Bell,
  Globe,
  Shield,
  Save,
} from "lucide-react";

export default function Settings() {

  // =====================================================
  // CURRENT USER
  // =====================================================

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

  // =====================================================
  // USER TYPE
  // =====================================================

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN";

  // =====================================================
  // SETTINGS
  // =====================================================

  const [language, setLanguage] =
    useState(
      localStorage.getItem(
        "campx_language"
      ) || "English"
    );

  const [notifications, setNotifications] =
    useState(
      localStorage.getItem(
        "campx_notifications"
      ) !== "false"
    );

  const [saved, setSaved] =
    useState(false);

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = () => {

    localStorage.setItem(
      "campx_language",
      language
    );

    localStorage.setItem(
      "campx_notifications",
      String(notifications)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // =====================================================
  // ACCOUNT TYPE
  // =====================================================

  const accountType =
    user?.role === "SUPER_ADMIN"
      ? "Super Admin"
      : user?.role === "ADMIN"
      ? "Admin"
      : "Student";

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="page-container">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div className="eyebrow">
          CAMPX {isAdmin ? "ADMIN" : "STUDENT"} PORTAL
        </div>

        <h1>
          Settings
        </h1>

        <p>
          Manage your CampX preferences and account settings.
        </p>

      </div>


      <div className="settings-container">

        {/* =================================================
            GENERAL SETTINGS
        ================================================= */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <SettingsIcon size={21} />
            </div>

            <div>

              <h2>
                General Settings
              </h2>

              <p>
                Customize your CampX experience.
              </p>

            </div>

          </div>


          {/* =================================================
              LANGUAGE
          ================================================= */}

          <div className="setting-row">

            <div className="setting-info">

              <div className="setting-icon-small">
                <Globe size={19} />
              </div>

              <div>

                <h3>
                  Language
                </h3>

                <p>
                  Choose your preferred language.
                </p>

              </div>

            </div>


            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="settings-select"
            >

              <option value="English">
                English
              </option>

              <option value="Hindi">
                Hindi
              </option>

              <option value="Oriya">
                Oriya
              </option>

            </select>

          </div>


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="setting-row">

            <div className="setting-info">

              <div className="setting-icon-small">
                <Bell size={19} />
              </div>

              <div>

                <h3>
                  Notifications
                </h3>

                <p>
                  Receive important CampX notifications.
                </p>

              </div>

            </div>


            <label className="toggle-switch">

              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) =>
                  setNotifications(
                    e.target.checked
                  )
                }
              />

              <span className="toggle-slider"></span>

            </label>

          </div>

        </div>


        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <Shield size={21} />
            </div>

            <div>

              <h2>
                Account
              </h2>

              <p>
                Information about your current account.
              </p>

            </div>

          </div>


          <div className="account-settings-grid">

            <div className="account-setting">

              <span>
                Name
              </span>

              <strong>
                {user?.name || "N/A"}
              </strong>

            </div>


            <div className="account-setting">

              <span>
                Email
              </span>

              <strong>
                {user?.email || "N/A"}
              </strong>

            </div>


            <div className="account-setting">

              <span>
                Account Type
              </span>

              <strong>
                {accountType}
              </strong>

            </div>


            <div className="account-setting">

              <span>
                Account Status
              </span>

              <strong className="account-active">
                ● Active
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            SAVE
        ================================================= */}

        <div className="settings-actions">

          {saved && (
            <div className="settings-success">
              Settings saved successfully.
            </div>
          )}

          <button
            type="button"
            className="settings-save-btn"
            onClick={handleSave}
          >

            <Save size={18} />

            Save Settings

          </button>

        </div>

      </div>

    </div>
  );
}