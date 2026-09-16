import React, { useState } from "react";

import {
  Settings as SettingsIcon,
  Bell,
  Globe,
  Shield,
  Save,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

export default function Settings() {

  // =====================================================
  // LANGUAGE CONTEXT
  // =====================================================

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

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
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] =
    useState(
      localStorage.getItem(
        "campx_notifications"
      ) !== "false"
    );

  // =====================================================
  // SAVE STATUS
  // =====================================================

  const [saved, setSaved] =
    useState(false);

  // =====================================================
  // LANGUAGE CHANGE
  // =====================================================

  const handleLanguageChange = (event) => {
    const newLanguage =
      event.target.value;

    changeLanguage(newLanguage);
  };

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
      ? (
        language === "hi"
          ? "सुपर एडमिन"
          : language === "or"
          ? "ସୁପର ଆଡମିନ୍"
          : "Super Admin"
      )
      : user?.role === "ADMIN"
      ? (
        language === "hi"
          ? "एडमिन"
          : language === "or"
          ? "ଆଡମିନ୍"
          : "Admin"
      )
      : (
        language === "hi"
          ? "छात्र"
          : language === "or"
          ? "ଛାତ୍ର"
          : "Student"
      );

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
          CAMPX{" "}
          {isAdmin
            ? language === "hi"
              ? "एडमिन पोर्टल"
              : language === "or"
              ? "ଆଡମିନ୍ ପୋର୍ଟାଲ୍"
              : "ADMIN PORTAL"
            : language === "hi"
            ? "छात्र पोर्टल"
            : language === "or"
            ? "ଛାତ୍ର ପୋର୍ଟାଲ୍"
            : "STUDENT PORTAL"}
        </div>

        <h1>
          {language === "hi"
            ? "सेटिंग्स"
            : language === "or"
            ? "ସେଟିଂସ୍"
            : "Settings"}
        </h1>

        <p>
          {language === "hi"
            ? "अपनी CampX प्राथमिकताओं और अकाउंट सेटिंग्स को प्रबंधित करें।"
            : language === "or"
            ? "ଆପଣଙ୍କର CampX ପସନ୍ଦ ଏବଂ ଆକାଉଣ୍ଟ ସେଟିଂସ୍ ପରିଚାଳନା କରନ୍ତୁ।"
            : "Manage your CampX preferences and account settings."}
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
                {language === "hi"
                  ? "सामान्य सेटिंग्स"
                  : language === "or"
                  ? "ସାଧାରଣ ସେଟିଂସ୍"
                  : "General Settings"}
              </h2>

              <p>
                {language === "hi"
                  ? "अपने CampX अनुभव को अनुकूलित करें।"
                  : language === "or"
                  ? "ଆପଣଙ୍କର CampX ଅନୁଭୂତିକୁ ଅନୁକୂଳ କରନ୍ତୁ।"
                  : "Customize your CampX experience."}
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
                  {t("language")}
                </h3>

                <p>
                  {language === "hi"
                    ? "अपनी पसंदीदा भाषा चुनें।"
                    : language === "or"
                    ? "ଆପଣଙ୍କର ପସନ୍ଦର ଭାଷା ବାଛନ୍ତୁ।"
                    : "Choose your preferred language."}
                </p>

              </div>

            </div>

            <select
              value={language}
              onChange={handleLanguageChange}
              className="settings-select"
            >

              <option value="en">
                {t("english")}
              </option>

              <option value="hi">
                {t("hindi")}
              </option>

              <option value="or">
                {t("odia")}
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
                  {t("notifications")}
                </h3>

                <p>
                  {language === "hi"
                    ? "महत्वपूर्ण CampX सूचनाएँ प्राप्त करें।"
                    : language === "or"
                    ? "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ CampX ବିଜ୍ଞପ୍ତି ପାଆନ୍ତୁ।"
                    : "Receive important CampX notifications."}
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
                {language === "hi"
                  ? "अकाउंट"
                  : language === "or"
                  ? "ଆକାଉଣ୍ଟ"
                  : "Account"}
              </h2>

              <p>
                {language === "hi"
                  ? "आपके वर्तमान अकाउंट की जानकारी।"
                  : language === "or"
                  ? "ଆପଣଙ୍କର ବର୍ତ୍ତମାନ ଆକାଉଣ୍ଟ ବିଷୟରେ ସୂଚନା।"
                  : "Information about your current account."}
              </p>

            </div>

          </div>

          <div className="account-settings-grid">

            {/* NAME */}

            <div className="account-setting">

              <span>
                {language === "hi"
                  ? "नाम"
                  : language === "or"
                  ? "ନାମ"
                  : "Name"}
              </span>

              <strong>
                {user?.name || "N/A"}
              </strong>

            </div>

            {/* EMAIL */}

            <div className="account-setting">

              <span>
                {language === "hi"
                  ? "ईमेल"
                  : language === "or"
                  ? "ଇମେଲ୍"
                  : "Email"}
              </span>

              <strong>
                {user?.email || "N/A"}
              </strong>

            </div>

            {/* ACCOUNT TYPE */}

            <div className="account-setting">

              <span>
                {language === "hi"
                  ? "अकाउंट प्रकार"
                  : language === "or"
                  ? "ଆକାଉଣ୍ଟ ପ୍ରକାର"
                  : "Account Type"}
              </span>

              <strong>
                {accountType}
              </strong>

            </div>

            {/* ACCOUNT STATUS */}

            <div className="account-setting">

              <span>
                {language === "hi"
                  ? "अकाउंट स्थिति"
                  : language === "or"
                  ? "ଆକାଉଣ୍ଟ ସ୍ଥିତି"
                  : "Account Status"}
              </span>

              <strong className="account-active">

                {language === "hi"
                  ? "● सक्रिय"
                  : language === "or"
                  ? "● ସକ୍ରିୟ"
                  : "● Active"}

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

              {language === "hi"
                ? "सेटिंग्स सफलतापूर्वक सहेजी गईं।"
                : language === "or"
                ? "ସେଟିଂସ୍ ସଫଳତାର ସହିତ ସେଭ୍ ହୋଇଛି।"
                : "Settings saved successfully."}

            </div>
          )}

          <button
            type="button"
            className="settings-save-btn"
            onClick={handleSave}
          >

            <Save size={18} />

            {language === "hi"
              ? "सेटिंग्स सहेजें"
              : language === "or"
              ? "ସେଟିଂସ୍ ସେଭ୍ କରନ୍ତୁ"
              : "Save Settings"}

          </button>

        </div>

      </div>

    </div>
  );
}