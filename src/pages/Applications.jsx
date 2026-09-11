import { useEffect, useState } from "react";
import {
  FileText,
  Send,
  CheckCircle2,
  Printer,
  Eye,
  Clock3,
  XCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";

const APPLICATIONS_KEY = "campx_applications";

const CURRENT_STUDENT = {
  name: "Adya Dash",
  id: "CX2026001",
  department: "Computer Science & Engineering",
  semester: "6th Semester",
};

const applicationTypes = [
  "Leave Application",
  "Hostel Application",
  "Fee Related Application",
  "Academic Application",
  "Bonafide / Certificate Application",
  "Permission Application",
  "Internship / Training Application",
  "Event / Activity Permission",
  "Other",
];

function loadApplications() {
  try {
    const saved =
      localStorage.getItem(APPLICATIONS_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Error loading applications:",
      error
    );

    return [];
  }
}

function saveApplications(applications) {
  localStorage.setItem(
    APPLICATIONS_KEY,
    JSON.stringify(applications)
  );

  window.dispatchEvent(
    new Event("campx-application-updated")
  );
}

export default function Applications() {
  const [applications, setApplications] =
    useState([]);

  const [applicationType, setApplicationType] =
    useState("Leave Application");

  const [subject, setSubject] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [applicationDate, setApplicationDate] =
    useState("");

  const [additionalDetails, setAdditionalDetails] =
    useState("");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  useEffect(() => {
    const loadStudentApplications = () => {
      const allApplications =
        loadApplications();

      const studentApplications =
        allApplications.filter(
          (application) =>
            application.studentId ===
            CURRENT_STUDENT.id
        );

      setApplications(studentApplications);
    };

    loadStudentApplications();

    window.addEventListener(
      "storage",
      loadStudentApplications
    );

    window.addEventListener(
      "campx-application-updated",
      loadStudentApplications
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadStudentApplications
      );

      window.removeEventListener(
        "campx-application-updated",
        loadStudentApplications
      );
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !subject.trim() ||
      !reason.trim()
    ) {
      alert(
        "Please enter the subject and reason."
      );

      return;
    }

    const newApplication = {
      id: `APP-${Date.now()}`,

      studentName:
        CURRENT_STUDENT.name,

      studentId:
        CURRENT_STUDENT.id,

      department:
        CURRENT_STUDENT.department,

      semester:
        CURRENT_STUDENT.semester,

      type:
        applicationType,

      subject:
        subject.trim(),

      reason:
        reason.trim(),

      applicationDate,

      additionalDetails:
        additionalDetails.trim(),

      status:
        "Submitted",

      verificationStatus:
        "Pending",

      approvalAuthority:
        "",

      authorityName:
        "",

      authorityDesignation:
        "",

      approvalImage:
        "",

      verificationNote:
        "",

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    const allApplications =
      loadApplications();

    allApplications.unshift(
      newApplication
    );

    saveApplications(
      allApplications
    );

    addNotification({
      audience: "admin",

      type: "application",

      title:
        "New Application Submitted",

      message:
        `${newApplication.studentName} submitted a ${newApplication.type}.`,

      studentId:
        newApplication.studentId,

      relatedId:
        newApplication.id,

      status:
        "Submitted",
    });

    setSubject("");
    setReason("");
    setApplicationDate("");
    setAdditionalDetails("");

    alert(
      `Application submitted successfully.\n\nApplication ID: ${newApplication.id}`
    );
  };

  const printApplication = () => {
    window.print();
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Topbar />

        <div className="page-content">

          {/* HEADER */}

          <div className="page-header">
            <div>

              <div className="page-eyebrow">
                STUDENT SERVICES
              </div>

              <h1>
                Digital Applications
              </h1>

              <p>
                Submit applications and track
                their approval status.
              </p>

            </div>
          </div>

          {/* =================================================
              NEW APPLICATION
              ================================================= */}

          <div className="application-layout">

            <div className="application-form-card">

              <div className="application-card-heading">

                <div className="application-heading-icon">
                  <FileText size={22} />
                </div>

                <div>
                  <h2>
                    Create Application
                  </h2>

                  <p>
                    Fill in the details below.
                  </p>
                </div>

              </div>

              <form onSubmit={handleSubmit}>

                <div className="application-form-grid">

                  <div className="form-field">

                    <label>
                      Application Type
                    </label>

                    <select
                      value={applicationType}
                      onChange={(event) =>
                        setApplicationType(
                          event.target.value
                        )
                      }
                    >

                      {applicationTypes.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="form-field">

                    <label>
                      Application Date
                    </label>

                    <input
                      type="date"
                      value={applicationDate}
                      onChange={(event) =>
                        setApplicationDate(
                          event.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-field">

                  <label>
                    Subject <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Request for leave"
                    value={subject}
                    onChange={(event) =>
                      setSubject(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="form-field">

                  <label>
                    Reason / Application Content{" "}
                    <span>*</span>
                  </label>

                  <textarea
                    rows="7"
                    placeholder="Write your application reason..."
                    value={reason}
                    onChange={(event) =>
                      setReason(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="form-field">

                  <label>
                    Additional Details
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Any additional information..."
                    value={additionalDetails}
                    onChange={(event) =>
                      setAdditionalDetails(
                        event.target.value
                      )
                    }
                  />

                </div>

                {/* STUDENT INFORMATION */}

                <div className="application-student-info">

                  <h3>
                    Applicant Information
                  </h3>

                  <div className="student-info-grid">

                    <div>
                      <span>
                        Name
                      </span>

                      <strong>
                        {CURRENT_STUDENT.name}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Student ID
                      </span>

                      <strong>
                        {CURRENT_STUDENT.id}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Department
                      </span>

                      <strong>
                        {CURRENT_STUDENT.department}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Semester
                      </span>

                      <strong>
                        {CURRENT_STUDENT.semester}
                      </strong>
                    </div>

                  </div>

                </div>

                <div className="application-format-note">

                  <strong>
                    Standard Application Format
                  </strong>

                  <p>
                    To,
                    <br />
                    The Concerned Authority
                    <br />
                    {CURRENT_STUDENT.department}
                    <br />
                    <br />

                    <strong>
                      Subject:{" "}
                      {subject ||
                        "Application Subject"}
                    </strong>

                    <br />
                    <br />

                    Respected Sir/Madam,
                    <br />
                    <br />

                    I,{" "}
                    {CURRENT_STUDENT.name}{" "}
                    ({CURRENT_STUDENT.id}),
                    request you to kindly
                    consider my application.
                  </p>

                </div>

                <button
                  type="submit"
                  className="primary-btn application-submit-btn"
                >

                  <Send size={17} />

                  Submit Application

                </button>

              </form>

            </div>

            {/* =================================================
                MY APPLICATIONS
                ================================================= */}

            <div className="application-side-card">

              <div className="application-side-icon">
                <FileText size={22} />
              </div>

              <h2>
                My Applications
              </h2>

              <p className="my-applications-subtitle">
                Track your submitted applications
                and print approved applications.
              </p>

              {applications.length === 0 ? (

                <div className="my-applications-empty">

                  <FileText size={30} />

                  <strong>
                    No applications yet
                  </strong>

                  <span>
                    Your submitted applications
                    will appear here.
                  </span>

                </div>

              ) : (

                <div className="my-applications-list">

                  {applications.map(
                    (application) => (

                      <div
                        className="my-application-card"
                        key={application.id}
                      >

                        <div className="my-application-top">

                          <div>

                            <span>
                              {application.type}
                            </span>

                            <h3>
                              {application.subject}
                            </h3>

                          </div>

                          <span
                            className={
                              `my-application-status ` +
                              application.status.toLowerCase()
                            }
                          >

                            {application.status ===
                            "Approved" && (
                              <CheckCircle2
                                size={13}
                              />
                            )}

                            {application.status ===
                            "Submitted" && (
                              <Clock3
                                size={13}
                              />
                            )}

                            {application.status ===
                            "Rejected" && (
                              <XCircle
                                size={13}
                              />
                            )}

                            {application.status}

                          </span>

                        </div>

                        <div className="my-application-id">
                          {application.id}
                        </div>

                        <div className="my-application-actions">

                          <button
                            type="button"
                            className="application-view-btn"
                            onClick={() =>
                              setSelectedApplication(
                                application
                              )
                            }
                          >

                            <Eye size={15} />

                            View

                          </button>

                          {application.status ===
                            "Approved" && (

                            <button
                              type="button"
                              className="application-print-btn"
                              onClick={() =>
                                setSelectedApplication(
                                  application
                                )
                              }
                            >

                              <Printer size={15} />

                              Print

                            </button>

                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </main>

      {/* =====================================================
          APPLICATION VIEW / PRINT MODAL
          ===================================================== */}

      {selectedApplication && (

        <div className="application-modal-overlay">

          <div className="student-application-modal">

            <div className="student-application-modal-header">

              <div>

                <span>
                  {selectedApplication.status ===
                  "Approved"
                    ? "APPROVED APPLICATION"
                    : "APPLICATION DETAILS"}
                </span>

                <h2>
                  {selectedApplication.subject}
                </h2>

                <p>
                  {selectedApplication.id}
                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            {/* DOCUMENT */}

            <div
              className="student-print-document"
              id="print-application"
            >

              <div className="student-document-header">

                <h1>
                  CAMPX
                </h1>

                <p>
                  Digital Student Application
                </p>

              </div>

              <div className="document-to">

                To,
                <br />

                The Concerned Authority
                <br />

                {selectedApplication.department}

              </div>

              <div className="student-document-meta">

                <span>
                  Date:{" "}
                  {selectedApplication.applicationDate ||
                    new Date(
                      selectedApplication.createdAt
                    ).toLocaleDateString()}
                </span>

                <span>
                  Application ID:{" "}
                  {selectedApplication.id}
                </span>

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
                ), student of{" "}
                {selectedApplication.department},
                {` `}
                {selectedApplication.semester},
                request you to kindly consider
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

              <div className="student-document-signature">

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

              {/* APPROVAL */}

              {selectedApplication.status ===
                "Approved" && (

                <div className="student-approved-section">

                  <div className="student-approved-details">

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

                  {selectedApplication.approvalImage && (

                    <img
                      src={
                        selectedApplication.approvalImage
                      }
                      alt="Official approval stamp and signature"
                      className="student-approved-image"
                    />

                  )}

                </div>

              )}

              {selectedApplication.status !==
                "Approved" && (

                <div className="student-pending-notice">

                  <Clock3 size={17} />

                  <span>
                    This application is still
                    awaiting administrative
                    verification.
                  </span>

                </div>

              )}

            </div>

            {/* ACTIONS */}

            <div className="student-application-modal-actions">

              <button
                className="secondary-btn"
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
              >
                Close
              </button>

              {selectedApplication.status ===
                "Approved" && (

                <button
                  className="primary-btn"
                  onClick={printApplication}
                >

                  <Printer size={17} />

                  Print Approved Application

                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}