import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock3,
  Eye,
  XCircle,
  ShieldCheck,
  Printer,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";

import mentorApproval from "../assets/authorities/mentor.png";
import hodApproval from "../assets/authorities/hod.png";
import principalApproval from "../assets/authorities/principa.png";

const APPLICATIONS_KEY = "campx_applications";

const AUTHORITIES = {
  Principal: {
    name: "Dr. A. K. Mohanty",
    designation: "Principal",
    image: principalApproval,
  },

  HOD: {
    name: "Dr. S. R. Das",
    designation: "Head of Department",
    image: hodApproval,
  },

  Mentor: {
    name: "Prof. P. Sahu",
    designation: "Faculty Mentor",
    image: mentorApproval,
  },
};

function loadApplications() {
  try {
    const saved = localStorage.getItem(APPLICATIONS_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading applications:", error);
    return [];
  }
}

export default function AdminApplications() {
  const [applications, setApplications] =
    useState(loadApplications);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [authority, setAuthority] =
    useState("HOD");

  const [verificationNote, setVerificationNote] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState("All");

  const refreshApplications = () => {
    setApplications(loadApplications());
  };

  useEffect(() => {
    refreshApplications();

    const handleUpdate = () => {
      refreshApplications();
    };

    window.addEventListener(
      "storage",
      handleUpdate
    );

    window.addEventListener(
      "campx-application-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleUpdate
      );

      window.removeEventListener(
        "campx-application-updated",
        handleUpdate
      );
    };
  }, []);

  const updateApplications = (updated) => {
    localStorage.setItem(
      APPLICATIONS_KEY,
      JSON.stringify(updated)
    );

    setApplications(updated);

    window.dispatchEvent(
      new Event("campx-application-updated")
    );
  };

  const openApplication = (application) => {
    setSelectedApplication(application);

    setAuthority(
      application.approvalAuthority || "HOD"
    );

    setVerificationNote(
      application.verificationNote || ""
    );
  };

  const closeApplication = () => {
    setSelectedApplication(null);
    setVerificationNote("");
  };

  const selectAuthority = (authorityName) => {
    setAuthority(authorityName);
  };

  const rejectApplication = () => {
    if (!selectedApplication) return;

    const updated = applications.map(
      (application) =>
        application.id === selectedApplication.id
          ? {
              ...application,
              status: "Rejected",
              verificationStatus: "Rejected",
              verificationNote,
              updatedAt:
                new Date().toISOString(),
            }
          : application
    );

    updateApplications(updated);

    addNotification({
      audience: "student",
      studentId: selectedApplication.studentId,
      type: "application",
      title: "Application Rejected",
      message: `Your application ${selectedApplication.id} has been rejected.`,
      relatedId: selectedApplication.id,
      status: "Rejected",
    });

    closeApplication();
  };

  const approveApplication = () => {
    if (!selectedApplication) return;

    const selectedAuthority =
      AUTHORITIES[authority];

    if (!selectedAuthority) {
      alert(
        "Please select an approving authority."
      );
      return;
    }

    const updated = applications.map(
      (application) =>
        application.id === selectedApplication.id
          ? {
              ...application,

              status: "Approved",

              verificationStatus: "Verified",

              approvalAuthority: authority,

              authorityName:
                selectedAuthority.name,

              authorityDesignation:
                selectedAuthority.designation,

              approvalImage:
                selectedAuthority.image,

              verificationNote,

              approvedAt:
                new Date().toISOString(),

              updatedAt:
                new Date().toISOString(),
            }
          : application
    );

    updateApplications(updated);

    addNotification({
      audience: "student",

      studentId:
        selectedApplication.studentId,

      type: "application",

      title: "Application Approved",

      message:
        `Your application ${selectedApplication.id} ` +
        `has been approved by the ${authority}.`,

      relatedId:
        selectedApplication.id,

      status: "Approved",
    });

    closeApplication();
  };

  const filteredApplications =
    activeFilter === "All"
      ? applications
      : applications.filter(
          (application) =>
            application.status === activeFilter
        );

  const submittedCount =
    applications.filter(
      (application) =>
        application.status === "Submitted"
    ).length;

  const approvedCount =
    applications.filter(
      (application) =>
        application.status === "Approved"
    ).length;

  const rejectedCount =
    applications.filter(
      (application) =>
        application.status === "Rejected"
    ).length;

  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">
        <Topbar />

        <div className="page-content">

          {/* HEADER */}

          <div className="page-header">
            <div>
              <div className="page-eyebrow">
                CAMPX ADMINISTRATION
              </div>

              <h1>
                Digital Applications
              </h1>

              <p>
                Verify student applications and
                approve them through the appropriate
                authority.
              </p>
            </div>
          </div>

          {/* STATS */}

          <div className="application-admin-stats">

            <div className="application-admin-stat">
              <div className="application-stat-icon">
                <FileText size={20} />
              </div>

              <div>
                <span>Total</span>
                <strong>
                  {applications.length}
                </strong>
              </div>
            </div>

            <div className="application-admin-stat">
              <div className="application-stat-icon pending">
                <Clock3 size={20} />
              </div>

              <div>
                <span>Pending</span>
                <strong>
                  {submittedCount}
                </strong>
              </div>
            </div>

            <div className="application-admin-stat">
              <div className="application-stat-icon approved">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <span>Approved</span>
                <strong>
                  {approvedCount}
                </strong>
              </div>
            </div>

            <div className="application-admin-stat">
              <div className="application-stat-icon rejected">
                <XCircle size={20} />
              </div>

              <div>
                <span>Rejected</span>
                <strong>
                  {rejectedCount}
                </strong>
              </div>
            </div>

          </div>

          {/* FILTER */}

          <div className="application-filter-bar">

            {[
              "All",
              "Submitted",
              "Approved",
              "Rejected",
            ].map((filter) => (
              <button
                key={filter}
                className={
                  activeFilter === filter
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(filter)
                }
              >
                {filter}
              </button>
            ))}

          </div>

          {/* APPLICATIONS */}

          <div className="admin-applications-list">

            {filteredApplications.length === 0 ? (
              <div className="empty-timetable">
                <FileText size={34} />

                <h3>
                  No applications found
                </h3>

                <p>
                  Student applications will
                  appear here.
                </p>
              </div>
            ) : (
              filteredApplications.map(
                (application) => (
                  <div
                    className="admin-application-card"
                    key={application.id}
                  >
                    <div className="admin-application-icon">
                      <FileText size={22} />
                    </div>

                    <div className="admin-application-main">

                      <div className="admin-application-header">

                        <div>
                          <span className="application-type">
                            {application.type}
                          </span>

                          <h3>
                            {application.subject}
                          </h3>
                        </div>

                        <span
                          className={
                            `application-status-badge ` +
                            application.status.toLowerCase()
                          }
                        >
                          {application.status}
                        </span>

                      </div>

                      <div className="admin-application-details">

                        <span>
                          Student:{" "}
                          <strong>
                            {application.studentName}
                          </strong>
                        </span>

                        <span>
                          ID:{" "}
                          <strong>
                            {application.studentId}
                          </strong>
                        </span>

                        <span>
                          {application.id}
                        </span>

                      </div>

                    </div>

                    <button
                      className="view-application-btn"
                      onClick={() =>
                        openApplication(
                          application
                        )
                      }
                    >
                      <Eye size={17} />

                      Review
                    </button>

                  </div>
                )
              )
            )}

          </div>
        </div>
      </main>

      {/* =====================================================
          REVIEW MODAL
          ===================================================== */}

      {selectedApplication && (
        <div className="application-modal-overlay">

          <div className="application-review-modal">

            {/* MODAL HEADER */}

            <div className="application-modal-header">

              <div>

                <span>
                  APPLICATION REVIEW
                </span>

                <h2>
                  {selectedApplication.subject}
                </h2>

                <p>
                  {selectedApplication.id}
                  {" • "}
                  {selectedApplication.studentName}
                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={closeApplication}
              >
                ×
              </button>

            </div>

            <div className="application-review-content">

              {/* =================================================
                  DOCUMENT
                  ================================================= */}

              <div className="application-document-preview">

                <div className="document-to">
                  To,
                  <br />
                  The Concerned Authority
                  <br />
                  {selectedApplication.department}
                </div>

                <h3>
                  Subject:{" "}
                  {selectedApplication.subject}
                </h3>

                <p>
                  Respected Sir/Madam,
                </p>

                <p>
                  I,{" "}
                  <strong>
                    {selectedApplication.studentName}
                  </strong>{" "}
                  (
                  {selectedApplication.studentId}
                  ), request you to kindly consider
                  my application regarding the
                  above-mentioned subject.
                </p>

                <p>
                  <strong>
                    Reason:
                  </strong>
                </p>

                <p>
                  {selectedApplication.reason}
                </p>

                {selectedApplication.additionalDetails && (
                  <p>
                    <strong>
                      Additional Details:
                    </strong>
                    <br />

                    {
                      selectedApplication.additionalDetails
                    }
                  </p>
                )}

                <div className="document-student-sign">

                  <strong>
                    Applicant
                  </strong>

                  <span>
                    {selectedApplication.studentName}
                  </span>

                  <span>
                    {selectedApplication.studentId}
                  </span>

                </div>

                {/* ==============================================
                    APPROVAL STAMP + SIGNATURE
                    ============================================== */}

                {selectedApplication.status ===
                  "Approved" &&
                  selectedApplication.approvalImage && (
                    <div className="approved-authority-section">

                      <div className="approved-authority-label">
                        <strong>
                          Approved By
                        </strong>

                        <span>
                          {
                            selectedApplication.authorityName
                          }
                        </span>

                        <small>
                          {
                            selectedApplication.authorityDesignation
                          }
                        </small>
                      </div>

                      <img
                        src={
                          selectedApplication.approvalImage
                        }
                        alt={
                          `${selectedApplication.approvalAuthority} approval`
                        }
                        className="authority-approval-image"
                      />

                    </div>
                  )}

              </div>

              {/* =================================================
                  VERIFICATION PANEL
                  ================================================= */}

              {selectedApplication.status ===
              "Submitted" ? (
                <div className="verification-panel">

                  <div className="verification-panel-heading">

                    <ShieldCheck size={20} />

                    <div>
                      <h3>
                        Verification & Approval
                      </h3>

                      <p>
                        Select the authority who
                        will approve this application.
                      </p>
                    </div>

                  </div>

                  {/* ============================================
                      THREE CLICKABLE AUTHORITY BUTTONS
                      ============================================ */}

                  <div className="authority-selection">

                    {Object.entries(
                      AUTHORITIES
                    ).map(
                      ([
                        authorityName,
                        authorityData,
                      ]) => (
                        <button
                          type="button"
                          key={authorityName}
                          className={
                            `authority-card ` +
                            (
                              authority ===
                              authorityName
                                ? "selected"
                                : ""
                            )
                          }
                          onClick={() =>
                            selectAuthority(
                              authorityName
                            )
                          }
                        >

                          <div className="authority-image-box">

                            <img
                              src={
                                authorityData.image
                              }
                              alt={
                                `${authorityName} approval`
                              }
                            />

                          </div>

                          <strong>
                            {authorityName}
                          </strong>

                          <span>
                            {
                              authorityData.designation
                            }
                          </span>

                          {authority ===
                            authorityName && (
                            <div className="authority-selected-badge">
                              <CheckCircle2
                                size={14}
                              />

                              Selected
                            </div>
                          )}

                        </button>
                      )
                    )}

                  </div>

                  {/* SELECTED AUTHORITY */}

                  <div className="selected-authority-preview">

                    <div>
                      <ShieldCheck
                        size={18}
                      />

                      <div>
                        <strong>
                          Selected Authority
                        </strong>

                        <span>
                          {
                            AUTHORITIES[
                              authority
                            ].name
                          }
                          {" — "}
                          {
                            AUTHORITIES[
                              authority
                            ].designation
                          }
                        </span>
                      </div>
                    </div>

                    <img
                      src={
                        AUTHORITIES[
                          authority
                        ].image
                      }
                      alt="Selected approval"
                    />

                  </div>

                  {/* NOTE */}

                  <div className="form-field">

                    <label>
                      Verification Note
                    </label>

                    <textarea
                      rows="3"
                      placeholder="Optional verification note..."
                      value={
                        verificationNote
                      }
                      onChange={(event) =>
                        setVerificationNote(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  {/* REQUIREMENT */}

                  <div className="approval-requirement">

                    <CheckCircle2 size={17} />

                    <span>
                      The selected authority's
                      official stamp and signature
                      will automatically appear on
                      the approved application.
                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div className="verification-actions">

                    <button
                      className="reject-application-btn"
                      onClick={
                        rejectApplication
                      }
                    >
                      <XCircle size={17} />

                      Reject
                    </button>

                    <button
                      className="approve-application-btn"
                      onClick={
                        approveApplication
                      }
                    >
                      <CheckCircle2 size={17} />

                      Verify & Approve
                    </button>

                  </div>

                </div>
              ) : (
                <div className="already-processed-panel">

                  {selectedApplication.status ===
                  "Approved" ? (
                    <>
                      <CheckCircle2
                        size={30}
                      />

                      <h3>
                        Application Approved
                      </h3>

                      <p>
                        Approved by{" "}
                        {
                          selectedApplication.authorityName
                        }
                      </p>

                      <p>
                        {
                          selectedApplication.authorityDesignation
                        }
                      </p>

                      <button
                        className="primary-btn"
                        onClick={() =>
                          window.print()
                        }
                      >
                        <Printer size={17} />

                        Print Approved
                        Application
                      </button>
                    </>
                  ) : (
                    <>
                      <XCircle
                        size={30}
                      />

                      <h3>
                        Application Rejected
                      </h3>

                      {selectedApplication.verificationNote && (
                        <p>
                          {
                            selectedApplication.verificationNote
                          }
                        </p>
                      )}
                    </>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}