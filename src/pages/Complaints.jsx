import { useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

const COMPLAINTS_KEY = "campxComplaints";

function getCurrentStudentId() {
  try {
    const savedUser = localStorage.getItem("campx_user");
    const user = savedUser ? JSON.parse(savedUser) : {};

    return (
      user?.studentId ||
      user?.student_id ||
      user?.registrationNumber ||
      user?.registration_number ||
      ""
    );
  } catch (error) {
    console.error("Error reading logged-in student:", error);
    return "";
  }
}

export default function Complaints() {
  const { t, language } = useLanguage();

  const [complaints, setComplaints] = useState([]);

  // ==========================================
  // LANGUAGE HELPERS
  // ==========================================

  const translate = (english, hindi, odia) => {
    if (language === "hi") return hindi;
    if (language === "or") return odia;
    return english;
  };

  const getStatusText = (status) => {
    if (status === "Resolved") {
      return translate(
        "Resolved",
        "समाधान किया गया",
        "ସମାଧାନ ହୋଇଛି"
      );
    }

    if (
      status === "In Progress" ||
      status === "Processing"
    ) {
      return translate(
        "In Progress",
        "प्रगति में",
        "ପ୍ରଗତିରେ"
      );
    }

    if (status === "Rejected") {
      return translate(
        "Rejected",
        "अस्वीकृत",
        "ଅଗ୍ରାହ୍ୟ"
      );
    }

    return translate(
      "Submitted",
      "जमा किया गया",
      "ଦାଖଲ ହୋଇଛି"
    );
  };

  // ==========================================
  // LOAD COMPLAINTS
  // ==========================================

  const loadComplaints = () => {
    try {
      const saved = localStorage.getItem(
        COMPLAINTS_KEY
      );

      const allComplaints = saved
        ? JSON.parse(saved)
        : [];

      // Show only current student's complaints
      const studentComplaints =
        allComplaints.filter(
          (complaint) =>
            !complaint.studentId ||
            complaint.studentId === getCurrentStudentId()
        );

      setComplaints(studentComplaints);
    } catch (error) {
      console.error(
        "Unable to load complaints:",
        error
      );

      setComplaints([]);
    }
  };

  // ==========================================
  // LOAD + LIVE UPDATE
  // ==========================================

  useEffect(() => {
    loadComplaints();

    const handleStorageChange = (event) => {
      if (event.key === COMPLAINTS_KEY) {
        loadComplaints();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    // Refresh periodically for the demo
    const interval = setInterval(() => {
      loadComplaints();
    }, 1000);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // ICON
  // ==========================================

  const getIcon = (status) => {
    if (status === "Resolved") {
      return <CheckCircle size={21} />;
    }

    if (
      status === "In Progress" ||
      status === "Processing"
    ) {
      return <Clock size={21} />;
    }

    return <AlertCircle size={21} />;
  };

  // ==========================================
  // ICON CLASS
  // ==========================================

  const getIconClass = (status) => {
    if (status === "Resolved") {
      return "complaint-icon green";
    }

    if (
      status === "In Progress" ||
      status === "Processing"
    ) {
      return "complaint-icon orange";
    }

    return "complaint-icon blue";
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "status resolved";
    }

    if (
      status === "In Progress" ||
      status === "Processing"
    ) {
      return "status pending";
    }

    return "status submitted";
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "";
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Topbar
          title={translate(
            "My Complaints",
            "मेरी शिकायतें",
            "ମୋର ଅଭିଯୋଗ"
          )}
        />

        <div className="content">

          {/* ====================================
              HEADER
          ==================================== */}

          <section className="welcome-section">

            <div>

              <p className="eyebrow">
                {translate(
                  "CAMPUS SUPPORT",
                  "कैंपस सहायता",
                  "କ୍ୟାମ୍ପସ ସହାୟତା"
                )}
              </p>

              <h1>
                {translate(
                  "Your Complaints",
                  "आपकी शिकायतें",
                  "ଆପଣଙ୍କ ଅଭିଯୋଗ"
                )}
              </h1>

              <p>
                {translate(
                  "Track and manage the issues you've reported.",
                  "आपके द्वारा रिपोर्ट की गई समस्याओं को ट्रैक और प्रबंधित करें।",
                  "ଆପଣ ରିପୋର୍ଟ କରିଥିବା ସମସ୍ୟାଗୁଡ଼ିକୁ ଟ୍ରାକ୍ ଏବଂ ପରିଚାଳନା କରନ୍ତୁ।"
                )}
              </p>

            </div>

            <Link
              to="/ai-complaint"
              className="primary-btn compact"
            >
              <Plus size={18} />

              {translate(
                "New Complaint",
                "नई शिकायत",
                "ନୂତନ ଅଭିଯୋଗ"
              )}
            </Link>

          </section>


          {/* ====================================
              COMPLAINT LIST
          ==================================== */}

          <div className="complaints-list">

            {complaints.length === 0 ? (

              <div className="panel empty-state">

                <AlertCircle size={42} />

                <h3>
                  {translate(
                    "No complaints yet",
                    "अभी कोई शिकायत नहीं",
                    "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଅଭିଯୋଗ ନାହିଁ"
                  )}
                </h3>

                <p>
                  {translate(
                    "You haven't submitted any complaints.",
                    "आपने अभी तक कोई शिकायत जमा नहीं की है।",
                    "ଆପଣ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଅଭିଯୋଗ ଦାଖଲ କରିନାହାଁନ୍ତି।"
                  )}
                </p>

                <Link
                  to="/ai-complaint"
                  className="primary-btn compact"
                >
                  <Plus size={18} />

                  {translate(
                    "Submit a Complaint",
                    "शिकायत जमा करें",
                    "ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ"
                  )}
                </Link>

              </div>

            ) : (

              complaints.map((complaint) => (

                <div
                  className="panel complaint-card"
                  key={complaint.id}
                >

                  {/* ICON */}

                  <div
                    className={getIconClass(
                      complaint.status
                    )}
                  >
                    {getIcon(
                      complaint.status
                    )}
                  </div>


                  {/* INFORMATION */}

                  <div className="complaint-info">

                    <strong>
                      {complaint.issue ||
                        complaint.description}
                    </strong>

                    <span>
                      {complaint.location &&
                      complaint.location !==
                        "Not detected"
                        ? complaint.location
                        : complaint.category}

                      {complaint.room &&
                      complaint.room !==
                        "Not detected"
                        ? ` • ${translate(
                            "Room",
                            "कमरा",
                            "ରୁମ୍"
                          )} ${complaint.room}`
                        : ""}
                    </span>

                    <small>
                      {complaint.createdAt
                        ? `${translate(
                            "Submitted",
                            "जमा किया गया",
                            "ଦାଖଲ ହୋଇଛି"
                          )} ${formatDate(
                            complaint.createdAt
                          )}`
                        : translate(
                            "Recently submitted",
                            "हाल ही में जमा किया गया",
                            "ସମ୍ପ୍ରତି ଦାଖଲ ହୋଇଛି"
                          )}
                    </small>

                    <small>
                      {translate(
                        "Complaint ID:",
                        "शिकायत ID:",
                        "ଅଭିଯୋଗ ID:"
                      )}{" "}
                      {complaint.id}
                    </small>

                  </div>


                  {/* STATUS */}

                  <span
                    className={getStatusClass(
                      complaint.status
                    )}
                  >
                    {getStatusText(
                      complaint.status
                    )}
                  </span>

                </div>

              ))

            )}

          </div>

        </div>

      </main>

    </div>
  );
}