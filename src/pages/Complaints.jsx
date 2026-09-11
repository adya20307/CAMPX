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

const COMPLAINTS_KEY = "campxComplaints";

const CURRENT_STUDENT_ID = "CX2026001";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);

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
            complaint.studentId === CURRENT_STUDENT_ID
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

        <Topbar title="My Complaints" />

        <div className="content">

          {/* ====================================
              HEADER
          ==================================== */}

          <section className="welcome-section">

            <div>

              <p className="eyebrow">
                CAMPUS SUPPORT
              </p>

              <h1>
                Your Complaints
              </h1>

              <p>
                Track and manage the issues
                you've reported.
              </p>

            </div>

            <Link
              to="/ai-complaint"
              className="primary-btn compact"
            >
              <Plus size={18} />
              New Complaint
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
                  No complaints yet
                </h3>

                <p>
                  You haven't submitted any
                  complaints.
                </p>

                <Link
                  to="/ai-complaint"
                  className="primary-btn compact"
                >
                  <Plus size={18} />
                  Submit a Complaint
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
                        ? ` • Room ${complaint.room}`
                        : ""}
                    </span>

                    <small>
                      {complaint.createdAt
                        ? `Submitted ${formatDate(
                            complaint.createdAt
                          )}`
                        : "Recently submitted"}
                    </small>

                    <small>
                      Complaint ID:{" "}
                      {complaint.id}
                    </small>

                  </div>


                  {/* STATUS */}

                  <span
                    className={getStatusClass(
                      complaint.status
                    )}
                  >
                    {complaint.status ||
                      "Submitted"}
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