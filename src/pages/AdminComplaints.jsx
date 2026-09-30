import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";
import { addNotification } from "../notificationStorage";

const COMPLAINTS_KEY = "campxComplaints";



const ADMIN_COMPLAINTS_TRANSLATIONS = {
  en: {
    complaints: "Complaints",
    management: "Complaints Management",
    description: "Review, assign and resolve student complaints.",
    totalComplaints: "Total Complaints",
    submitted: "Submitted",
    inProgress: "In Progress",
    resolved: "Resolved",
    all: "All",
    noComplaints: "No complaints found",
    noComplaintsCategory: "There are no complaints in this category.",
    studentComplaint: "Student Complaint",
    low: "Low",
    critical: "Critical",
    high: "High",
    medium: "Medium",
    student: "Student",
    unknownStudent: "Unknown Student",
    studentId: "Student ID",
    na: "N/A",
    department: "Department",
    general: "General",
    location: "Location",
    notSpecified: "Not specified",
    room: "Room",
    submittedLabel: "Submitted",
    updateStatus: "Update status:",
    complaintStatus: "Complaint",
    complaintNow: "Your complaint",
    isNow: "is now",
  },
  hi: {
    complaints: "शिकायतें",
    management: "शिकायत प्रबंधन",
    description: "छात्रों की शिकायतों की समीक्षा, आवंटन और समाधान करें।",
    totalComplaints: "कुल शिकायतें",
    submitted: "प्रस्तुत",
    inProgress: "प्रगति में",
    resolved: "समाधान किया गया",
    all: "सभी",
    noComplaints: "कोई शिकायत नहीं मिली",
    noComplaintsCategory: "इस श्रेणी में कोई शिकायत नहीं है।",
    studentComplaint: "छात्र शिकायत",
    low: "कम",
    critical: "गंभीर",
    high: "उच्च",
    medium: "मध्यम",
    student: "छात्र",
    unknownStudent: "अज्ञात छात्र",
    studentId: "छात्र ID",
    na: "उपलब्ध नहीं",
    department: "विभाग",
    general: "सामान्य",
    location: "स्थान",
    notSpecified: "निर्दिष्ट नहीं",
    room: "कमरा",
    submittedLabel: "प्रस्तुत",
    updateStatus: "स्थिति अपडेट करें:",
    complaintStatus: "शिकायत",
    complaintNow: "आपकी शिकायत",
    isNow: "अब",
  },
  or: {
    complaints: "ଅଭିଯୋଗ",
    management: "ଅଭିଯୋଗ ପରିଚାଳନା",
    description: "ଛାତ୍ରଛାତ୍ରୀଙ୍କ ଅଭିଯୋଗ ସମୀକ୍ଷା, ବଣ୍ଟନ ଏବଂ ସମାଧାନ କରନ୍ତୁ।",
    totalComplaints: "ମୋଟ ଅଭିଯୋଗ",
    submitted: "ଦାଖଲ",
    inProgress: "ପ୍ରଗତିରେ",
    resolved: "ସମାଧାନ ହୋଇଛି",
    all: "ସମସ୍ତ",
    noComplaints: "କୌଣସି ଅଭିଯୋଗ ମିଳିଲା ନାହିଁ",
    noComplaintsCategory: "ଏହି ବର୍ଗରେ କୌଣସି ଅଭିଯୋଗ ନାହିଁ।",
    studentComplaint: "ଛାତ୍ର ଅଭିଯୋଗ",
    low: "କମ୍",
    critical: "ଗୁରୁତର",
    high: "ଉଚ୍ଚ",
    medium: "ମଧ୍ୟମ",
    student: "ଛାତ୍ର",
    unknownStudent: "ଅଜଣା ଛାତ୍ର",
    studentId: "ଛାତ୍ର ID",
    na: "ଉପଲବ୍ଧ ନାହିଁ",
    department: "ବିଭାଗ",
    general: "ସାଧାରଣ",
    location: "ସ୍ଥାନ",
    notSpecified: "ନିର୍ଦ୍ଦିଷ୍ଟ ନୁହେଁ",
    room: "କୋଠରୀ",
    submittedLabel: "ଦାଖଲ",
    updateStatus: "ସ୍ଥିତି ଅପଡେଟ୍ କରନ୍ତୁ:",
    complaintStatus: "ଅଭିଯୋଗ",
    complaintNow: "ଆପଣଙ୍କ ଅଭିଯୋଗ",
    isNow: "ବର୍ତ୍ତମାନ",
  },
};

function AdminComplaints() {
  const { language } = useLanguage();
  const t =
    ADMIN_COMPLAINTS_TRANSLATIONS[language] ||
    ADMIN_COMPLAINTS_TRANSLATIONS.en;

  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");

  const loadComplaints = () => {
    try {
      const saved = localStorage.getItem(COMPLAINTS_KEY);

      if (!saved) {
        setComplaints([]);
        return;
      }

      const data = JSON.parse(saved);
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setComplaints([]);
    }
  };

  useEffect(() => {
    loadComplaints();

    window.addEventListener("storage", loadComplaints);
    window.addEventListener("campx-complaint-updated", loadComplaints);

    return () => {
      window.removeEventListener("storage", loadComplaints);
      window.removeEventListener(
        "campx-complaint-updated",
        loadComplaints
      );
    };
  }, []);

  const updateStatus = (complaintId, newStatus) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? {
            ...complaint,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : complaint
    );

    localStorage.setItem(
      COMPLAINTS_KEY,
      JSON.stringify(updatedComplaints)
    );

    setComplaints(updatedComplaints);

    const complaint = complaints.find(
      (item) => item.id === complaintId
    );

    if (complaint) {
      addNotification({
        audience: "student",
        studentId: complaint.studentId,
        type: "complaint",
        title: `${t.complaintStatus} ${newStatus === "In Progress" ? t.inProgress : newStatus === "Resolved" ? t.resolved : t.submitted}`,
        message: `${t.complaintNow} ${complaint.id} ${t.isNow} ${newStatus === "In Progress" ? t.inProgress : newStatus === "Resolved" ? t.resolved : t.submitted}.`,
        relatedId: complaint.id,
        status: newStatus,
      });
    }

    window.dispatchEvent(new Event("campx-complaint-updated"));
  };

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter(
          (complaint) => complaint.status === filter
        );

  const total = complaints.length;
  const submitted = complaints.filter(
    (c) => c.status === "Submitted"
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const getPriorityClass = (priority) => {
    if (priority === "Critical") return "priority-critical";
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  const getStatusIcon = (status) => {
    if (status === "Resolved") {
      return <CheckCircle size={18} />;
    }

    if (status === "In Progress") {
      return <Wrench size={18} />;
    }

    return <Clock size={18} />;
  };

  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">
        <Topbar title={t.management} />

        <div className="page-content">
          <div className="page-header">
            <div>
              <h1>{t.management}</h1>
              <p>
                {t.description}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon">
                <AlertCircle size={22} />
              </div>

              <div>
                <p>{t.totalComplaints}</p>
                <h2>{total}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">
                <Clock size={22} />
              </div>

              <div>
                <p>{t.submitted}</p>
                <h2>{submitted}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">
                <Wrench size={22} />
              </div>

              <div>
                <p>{t.inProgress}</p>
                <h2>{inProgress}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">
                <CheckCircle size={22} />
              </div>

              <div>
                <p>{t.resolved}</p>
                <h2>{resolved}</h2>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="complaint-filters">
            {["All", "Submitted", "In Progress", "Resolved"].map(
              (status) => (
                <button
                  key={status}
                  className={
                    filter === status
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* Complaints */}
          <div className="complaints-list">
            {filteredComplaints.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={40} />
                <h3>{t.noComplaints}</h3>
                <p>
                  {t.noComplaintsCategory}
                </p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  className="admin-complaint-card"
                  key={complaint.id}
                >
                  <div className="complaint-card-top">
                    <div>
                      <div className="complaint-title-row">
                        <h3>
                          {complaint.issue ||
                            complaint.category ||
                            t.studentComplaint}
                        </h3>

                        <span
                          className={`priority-badge ${getPriorityClass(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority === "Critical" ? t.critical : complaint.priority === "High" ? t.high : complaint.priority === "Medium" ? t.medium : t.low}
                        </span>
                      </div>

                      <p className="complaint-id">
                        {complaint.id}
                      </p>
                    </div>

                    <div className="complaint-status">
                      {getStatusIcon(complaint.status)}
                      <span>
                        {complaint.status === "In Progress"
                          ? t.inProgress
                          : complaint.status === "Resolved"
                          ? t.resolved
                          : t.submitted}
                      </span>
                    </div>
                  </div>

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  <div className="complaint-details">
                    <div>
                      <strong>{t.student}</strong>
                      <span>
                        {complaint.studentName || t.unknownStudent}
                      </span>
                    </div>

                    <div>
                      <strong>{t.studentId}</strong>
                      <span>
                        {complaint.studentId || t.na}
                      </span>
                    </div>

                    <div>
                      <strong>{t.department}</strong>
                      <span>
                        {complaint.department || t.general}
                      </span>
                    </div>

                    <div>
                      <strong>{t.location}</strong>
                      <span>
                        {complaint.location || t.notSpecified}
                      </span>
                    </div>

                    <div>
                      <strong>{t.room}</strong>
                      <span>
                        {complaint.room || t.na}
                      </span>
                    </div>

                    <div>
                      <strong>{t.submittedLabel}</strong>
                      <span>
                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="complaint-actions">
                    <span>{t.updateStatus}</span>

                    <button
                      className={
                        complaint.status === "Submitted"
                          ? "status-btn active"
                          : "status-btn"
                      }
                      onClick={() =>
                        updateStatus(
                          complaint.id,
                          "Submitted"
                        )
                      }
                    >
                      Submitted
                    </button>

                    <button
                      className={
                        complaint.status === "In Progress"
                          ? "status-btn active"
                          : "status-btn"
                      }
                      onClick={() =>
                        updateStatus(
                          complaint.id,
                          "In Progress"
                        )
                      }
                    >
                      In Progress
                    </button>

                    <button
                      className={
                        complaint.status === "Resolved"
                          ? "status-btn active"
                          : "status-btn"
                      }
                      onClick={() =>
                        updateStatus(
                          complaint.id,
                          "Resolved"
                        )
                      }
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminComplaints;