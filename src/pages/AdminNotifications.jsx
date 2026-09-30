import { useEffect, useState } from "react";
import {
  Bell,
  ClipboardList,
  FileText,
  DoorOpen,
  CheckCircle2,
  Info,
  ArrowRight,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Paperclip,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../notificationStorage";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const BATCH_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];

const ADMIN_NOTIFICATIONS_TRANSLATIONS = {
  en: {
    adminNotifications: "Admin Notifications",
    administration: "ADMINISTRATION",
    description: "Notifications and requests from students.",
    panelDescription: "Stay updated about student requests and campus activity.",
    unread: "unread",
    markAllRead: "Mark all as read",
    noNotifications: "No notifications",
    emptyDescription: "New student activity will appear here automatically.",
    new: "NEW",
    clickToView: "Click to view",
    notices: "Notices",
    noticesDescription: "Upload notices and target them to a specific batch.",
    createNotice: "Create Notice",
    title: "Notice Title",
    message: "Notice Message",
    targetBatch: "Target Batch",
    allBatches: "All Batches",
    chooseFile: "Choose File",
    uploadNotice: "Upload Notice",
    uploading: "Uploading...",
    uploadedNotices: "Uploaded Notices",
    noNotices: "No notices uploaded yet.",
    download: "Download",
    delete: "Delete",
    refresh: "Refresh",
    selectFile: "Please select a PDF, DOC, or DOCX file.",
    fileLimit: "File size cannot exceed 10 MB.",
    noticeRequired: "Please enter the notice title and message.",
    uploadSuccess: "Notice uploaded successfully.",
    deleteConfirm: "Are you sure you want to delete this notice?",
  },
  hi: {
    adminNotifications: "व्यवस्थापक सूचनाएं",
    administration: "प्रशासन",
    description: "छात्रों से प्राप्त सूचनाएं और अनुरोध।",
    panelDescription: "छात्र अनुरोधों और कैंपस गतिविधियों की जानकारी रखें।",
    unread: "अपठित",
    markAllRead: "सभी को पढ़ा हुआ चिह्नित करें",
    noNotifications: "कोई सूचना नहीं",
    emptyDescription: "नई छात्र गतिविधि यहां अपने आप दिखाई देगी।",
    new: "नया",
    clickToView: "देखने के लिए क्लिक करें",
    notices: "सूचनाएं",
    noticesDescription: "सूचनाएं अपलोड करें और उन्हें किसी विशेष बैच के लिए लक्षित करें।",
    createNotice: "सूचना बनाएं",
    title: "सूचना शीर्षक",
    message: "सूचना संदेश",
    targetBatch: "लक्षित बैच",
    allBatches: "सभी बैच",
    chooseFile: "फाइल चुनें",
    uploadNotice: "सूचना अपलोड करें",
    uploading: "अपलोड हो रहा है...",
    uploadedNotices: "अपलोड की गई सूचनाएं",
    noNotices: "अभी तक कोई सूचना अपलोड नहीं हुई है।",
    download: "डाउनलोड",
    delete: "हटाएं",
    refresh: "रिफ्रेश",
    selectFile: "कृपया PDF, DOC या DOCX फाइल चुनें।",
    fileLimit: "फाइल का आकार 10 MB से अधिक नहीं होना चाहिए।",
    noticeRequired: "कृपया सूचना का शीर्षक और संदेश दर्ज करें।",
    uploadSuccess: "सूचना सफलतापूर्वक अपलोड हुई।",
    deleteConfirm: "क्या आप इस सूचना को हटाना चाहते हैं?",
  },
  or: {
    adminNotifications: "ପ୍ରଶାସକ ସୂଚନା",
    administration: "ପ୍ରଶାସନ",
    description: "ଛାତ୍ରଛାତ୍ରୀଙ୍କଠାରୁ ସୂଚନା ଏବଂ ଅନୁରୋଧ।",
    panelDescription: "ଛାତ୍ର ଅନୁରୋଧ ଏବଂ କ୍ୟାମ୍ପସ୍ କାର୍ଯ୍ୟକଳାପ ବିଷୟରେ ଅପଡେଟ୍ ରୁହନ୍ତୁ।",
    unread: "ଅପଠିତ",
    markAllRead: "ସମସ୍ତଙ୍କୁ ପଢ଼ା ହୋଇଛି ବୋଲି ଚିହ୍ନିତ କରନ୍ତୁ",
    noNotifications: "କୌଣସି ସୂଚନା ନାହିଁ",
    emptyDescription: "ନୂଆ ଛାତ୍ର କାର୍ଯ୍ୟକଳାପ ଏଠାରେ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ଦେଖାଯିବ।",
    new: "ନୂଆ",
    clickToView: "ଦେଖିବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ",
    notices: "ସୂଚନା",
    noticesDescription: "ସୂଚନା ଅପଲୋଡ୍ କରନ୍ତୁ ଏବଂ ନିର୍ଦ୍ଦିଷ୍ଟ ବ୍ୟାଚ୍ ପାଇଁ ଲକ୍ଷ୍ୟ କରନ୍ତୁ।",
    createNotice: "ସୂଚନା ସୃଷ୍ଟି କରନ୍ତୁ",
    title: "ସୂଚନା ଶୀର୍ଷକ",
    message: "ସୂଚନା ବାର୍ତ୍ତା",
    targetBatch: "ଲକ୍ଷ୍ୟ ବ୍ୟାଚ୍",
    allBatches: "ସମସ୍ତ ବ୍ୟାଚ୍",
    chooseFile: "ଫାଇଲ୍ ବାଛନ୍ତୁ",
    uploadNotice: "ସୂଚନା ଅପଲୋଡ୍ କରନ୍ତୁ",
    uploading: "ଅପଲୋଡ୍ ହେଉଛି...",
    uploadedNotices: "ଅପଲୋଡ୍ ହୋଇଥିବା ସୂଚନା",
    noNotices: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସୂଚନା ଅପଲୋଡ୍ ହୋଇନାହିଁ।",
    download: "ଡାଉନଲୋଡ୍",
    delete: "ଡିଲିଟ୍",
    refresh: "ରିଫ୍ରେଶ୍",
    selectFile: "ଦୟାକରି PDF, DOC କିମ୍ବା DOCX ଫାଇଲ୍ ବାଛନ୍ତୁ।",
    fileLimit: "ଫାଇଲ୍ 10 MB ଠାରୁ ଅଧିକ ହେବା ଉଚିତ୍ ନୁହେଁ।",
    noticeRequired: "ଦୟାକରି ସୂଚନା ଶୀର୍ଷକ ଏବଂ ବାର୍ତ୍ତା ଦିଅନ୍ତୁ।",
    uploadSuccess: "ସୂଚନା ସଫଳତାର ସହିତ ଅପଲୋଡ୍ ହୋଇଛି।",
    deleteConfirm: "ଆପଣ ଏହି ସୂଚନାକୁ ଡିଲିଟ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
  },
};

export default function AdminNotifications() {
  const navigate = useNavigate();

  const { language } = useLanguage();
  const t =
    ADMIN_NOTIFICATIONS_TRANSLATIONS[language] ||
    ADMIN_NOTIFICATIONS_TRANSLATIONS.en;

  const [notifications, setNotifications] = useState([]);

  // =====================================================
  // NOTICE STATE
  // =====================================================

  const [notices, setNotices] = useState([]);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [targetBatch, setTargetBatch] = useState("");
  const [noticeFile, setNoticeFile] = useState(null);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [noticeRefreshing, setNoticeRefreshing] = useState(false);
  const [noticeError, setNoticeError] = useState("");
  const [noticeSuccess, setNoticeSuccess] = useState("");

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("campx_user") || "{}");
    } catch {
      return {};
    }
  })();

  const currentDepartment =
    currentUser?.department ||
    currentUser?.admin_section ||
    "General";

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

  // =====================================================
  // LOAD DATABASE NOTICES
  // =====================================================

  const loadNotices = async (showRefresh = false) => {
    try {
      if (showRefresh) setNoticeRefreshing(true);
      setNoticeError("");

      const token = localStorage.getItem("campx_token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${API_URL}/notices/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notices.");
      }

      setNotices(Array.isArray(data.notices) ? data.notices : []);
    } catch (error) {
      console.error("Load notices error:", error);
      setNoticeError(error.message || "Unable to load notices.");
    } finally {
      setNoticeRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // =====================================================
  // UPLOAD NOTICE
  // =====================================================

  const handleNoticeSubmit = async (event) => {
    event.preventDefault();
    setNoticeError("");
    setNoticeSuccess("");

    if (!noticeTitle.trim() || !noticeMessage.trim()) {
      setNoticeError(t.noticeRequired);
      return;
    }

    if (!noticeFile) {
      setNoticeError(t.selectFile);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const extension = noticeFile.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!allowedTypes.includes(noticeFile.type) && !["pdf", "doc", "docx"].includes(extension)) {
      setNoticeError(t.selectFile);
      return;
    }

    if (noticeFile.size > 10 * 1024 * 1024) {
      setNoticeError(t.fileLimit);
      return;
    }

    try {
      setNoticeLoading(true);

      const token = localStorage.getItem("campx_token");
      if (!token) {
        throw new Error("Your session has expired. Please login again.");
      }

      const formData = new FormData();
      formData.append("title", noticeTitle.trim());
      formData.append("message", noticeMessage.trim());
      formData.append("department", currentDepartment);
      formData.append("noticeFile", noticeFile);

      if (targetBatch) {
        formData.append("targetBatch", targetBatch);
      }

      const response = await fetch(`${API_URL}/notices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload notice.");
      }

      setNoticeTitle("");
      setNoticeMessage("");
      setTargetBatch("");
      setNoticeFile(null);

      const fileInput = document.getElementById("campx-notice-file");
      if (fileInput) fileInput.value = "";

      setNoticeSuccess(data.message || t.uploadSuccess);
      await loadNotices();
    } catch (error) {
      console.error("Upload notice error:", error);
      setNoticeError(error.message || "Unable to upload notice.");
    } finally {
      setNoticeLoading(false);
    }
  };

  // =====================================================
  // DOWNLOAD NOTICE
  // =====================================================

  const handleDownloadNotice = async (notice) => {
    try {
      const token = localStorage.getItem("campx_token");
      if (!token) {
        throw new Error("Your session has expired. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/notices/${notice.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let data = {};
        try { data = await response.json(); } catch {}
        throw new Error(data.message || "Failed to download notice.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = notice.title || "notice";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download notice error:", error);
      alert(error.message || "Unable to download notice.");
    }
  };

  // =====================================================
  // DELETE NOTICE
  // =====================================================

  const handleDeleteNotice = async (notice) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      setNoticeError("");
      const token = localStorage.getItem("campx_token");

      const response = await fetch(
        `${API_URL}/notices/${notice.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete notice.");
      }

      await loadNotices();
    } catch (error) {
      console.error("Delete notice error:", error);
      setNoticeError(error.message || "Unable to delete notice.");
    }
  };

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
    if (!notification.read) {
      markNotificationRead(notification.id);
    }

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
        language === "hi"
          ? "hi-IN"
          : language === "or"
          ? "or-IN"
          : "en-IN",
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

        <Topbar title={t.adminNotifications} />

        <div className="content">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="welcome-section">

            <div>
              <p className="eyebrow">
                {t.administration}
              </p>

              <h1>
                {t.adminNotifications}
              </h1>

              <p>
                {t.description}
              </p>
            </div>

            <div className="notification-header-icon">
              <Bell size={28} />
            </div>

          </section>


          {/* =================================================
              NOTICE MANAGEMENT
          ================================================= */}

          <section className="panel" style={{ marginBottom: "24px" }}>
            <div className="panel-header">
              <div>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={21} />
                  {t.notices}
                </h3>
                <p>{t.noticesDescription}</p>
              </div>

              <button
                type="button"
                onClick={() => loadNotices(true)}
                disabled={noticeRefreshing}
                style={{
                  border: "none",
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  cursor: noticeRefreshing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "600",
                }}
              >
                <RefreshCw size={16} />
                {t.refresh}
              </button>
            </div>

            {noticeError && (
              <div style={{ margin: "16px 20px 0", padding: "12px 14px", borderRadius: "8px", background: "#fef2f2", color: "#b91c1c" }}>
                {noticeError}
              </div>
            )}

            {noticeSuccess && (
              <div style={{ margin: "16px 20px 0", padding: "12px 14px", borderRadius: "8px", background: "#ecfdf5", color: "#047857" }}>
                {noticeSuccess}
              </div>
            )}

            <form onSubmit={handleNoticeSubmit} style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>{t.title}</label>
                  <input
                    type="text"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder={t.title}
                    maxLength={200}
                    style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", border: "1px solid #d1d5db", borderRadius: "8px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>{t.targetBatch}</label>
                  <select
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", border: "1px solid #d1d5db", borderRadius: "8px", background: "white" }}
                  >
                    <option value="">{t.allBatches}</option>
                    {BATCH_YEARS.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>{t.message}</label>
                <textarea
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder={t.message}
                  rows={4}
                  style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", border: "1px solid #d1d5db", borderRadius: "8px", resize: "vertical" }}
                />
              </div>

              <div style={{ marginTop: "16px" }}>
                <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>{t.chooseFile}</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <label
                    htmlFor="campx-notice-file"
                    style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", fontWeight: "600", background: "#f9fafb" }}
                  >
                    <Paperclip size={17} />
                    {t.chooseFile}
                  </label>
                  <input
                    id="campx-notice-file"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setNoticeFile(e.target.files?.[0] || null)}
                    style={{ display: "none" }}
                  />
                  {noticeFile && (
                    <span style={{ fontSize: "14px", color: "#4b5563" }}>
                      {noticeFile.name}
                    </span>
                  )}
                </div>
                <small style={{ display: "block", marginTop: "6px", color: "#6b7280" }}>PDF, DOC, DOCX • Maximum 10 MB</small>
              </div>

              <button
                type="submit"
                disabled={noticeLoading}
                style={{ marginTop: "18px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 18px", border: "none", borderRadius: "8px", background: "#2563eb", color: "white", cursor: noticeLoading ? "not-allowed" : "pointer", fontWeight: "700" }}
              >
                <Upload size={17} />
                {noticeLoading ? t.uploading : t.uploadNotice}
              </button>
            </form>

            <div style={{ padding: "0 20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <h4 style={{ margin: 0 }}>{t.uploadedNotices}</h4>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>{notices.length}</span>
              </div>

              {notices.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", border: "1px dashed #d1d5db", borderRadius: "10px", color: "#6b7280" }}>
                  {t.noNotices}
                </div>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {notices.map((notice) => (
                    <div key={notice.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "14px", border: "1px solid #e5e7eb", borderRadius: "10px", background: "#fafafa" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <strong style={{ display: "block", marginBottom: "4px" }}>{notice.title}</strong>
                        <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "5px" }}>
                          Batch: {notice.target_batch ?? t.allBatches} • {notice.department || "General"}
                        </div>
                        <p style={{ margin: 0, color: "#4b5563", whiteSpace: "pre-wrap" }}>{notice.message}</p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => handleDownloadNotice(notice)}
                          title={t.download}
                          style={{ display: "inline-flex", alignItems: "center", gap: "5px", border: "1px solid #d1d5db", background: "white", padding: "8px 10px", borderRadius: "7px", cursor: "pointer" }}
                        >
                          <Download size={16} />
                          {t.download}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNotice(notice)}
                          title={t.delete}
                          style={{ display: "inline-flex", alignItems: "center", gap: "5px", border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", padding: "8px 10px", borderRadius: "7px", cursor: "pointer" }}
                        >
                          <Trash2 size={16} />
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              NOTIFICATION PANEL
          ================================================= */}

          <section className="panel admin-notification-panel">

            <div className="panel-header">

              <div>
                <h3>
                  {t.adminNotifications}
                </h3>

                <p>
                  {t.panelDescription}
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
                  {t.unread}
                </span>

                <button
                  onClick={handleMarkAllRead}
                >
                  {t.markAllRead}
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
                  {t.noNotifications}
                </h3>

                <p>
                  {t.emptyDescription}
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
                              {t.new}
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
                          {t.clickToView}
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
