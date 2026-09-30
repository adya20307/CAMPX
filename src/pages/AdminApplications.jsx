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
import { useLanguage } from "../context/LanguageContext";
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

const ADMIN_APPLICATIONS_TRANSLATIONS = {
  en: {
    admin: "CAMPX ADMINISTRATION", digital: "Digital Applications",
    verifyDesc: "Verify student applications and approve them through the appropriate authority.",
    total: "Total", pending: "Pending", approved: "Approved", rejected: "Rejected", all: "All",
    noApplications: "No applications found", applicationsAppear: "Student applications will appear here.",
    student: "Student", id: "ID", review: "Review", applicationReview: "APPLICATION REVIEW",
    to: "To,", concerned: "The Concerned Authority", respected: "Respected Sir/Madam,",
    requestText: "request you to kindly consider my application regarding the above-mentioned subject.",
    reason: "Reason:", additional: "Additional Details:", applicant: "Applicant",
    approvedBy: "Approved By", verification: "Verification & Approval",
    selectAuthority: "Select the authority who will approve this application.",
    selected: "Selected", selectedAuthority: "Selected Authority", note: "Verification Note",
    notePlaceholder: "Optional verification note...",
    requirement: "The selected authority's official stamp and signature will automatically appear on the approved application.",
    reject: "Reject", verifyApprove: "Verify & Approve", applicationApproved: "Application Approved",
    approvedByLabel: "Approved by", printApproved: "Print Approved Application", applicationRejected: "Application Rejected",
    selectAuthorityAlert: "Please select an approving authority.", rejectedNotification: "Application Rejected",
    approvedNotification: "Application Approved", yourApplication: "Your application", rejectedMessage: "has been rejected.",
    approvedMessage: "has been approved by the", principal: "Principal", hod: "HOD", mentor: "Mentor",
    hodDesignation: "Head of Department", mentorDesignation: "Faculty Mentor"
  },
  hi: {
    admin: "CAMPX प्रशासन", digital: "डिजिटल आवेदन",
    verifyDesc: "छात्र आवेदनों की जांच करें और उचित प्राधिकरण के माध्यम से अनुमोदित करें।",
    total: "कुल", pending: "लंबित", approved: "अनुमोदित", rejected: "अस्वीकृत", all: "सभी",
    noApplications: "कोई आवेदन नहीं मिला", applicationsAppear: "छात्र आवेदन यहां दिखाई देंगे।",
    student: "छात्र", id: "ID", review: "समीक्षा", applicationReview: "आवेदन समीक्षा",
    to: "प्रति,", concerned: "संबंधित प्राधिकरण", respected: "आदरणीय सर/मैडम,",
    requestText: "कृपया उपरोक्त विषय के संबंध में मेरे आवेदन पर विचार करने का अनुरोध है।",
    reason: "कारण:", additional: "अतिरिक्त विवरण:", applicant: "आवेदक",
    approvedBy: "अनुमोदित द्वारा", verification: "सत्यापन और अनुमोदन",
    selectAuthority: "इस आवेदन को अनुमोदित करने वाले प्राधिकरण का चयन करें।",
    selected: "चयनित", selectedAuthority: "चयनित प्राधिकरण", note: "सत्यापन टिप्पणी",
    notePlaceholder: "वैकल्पिक सत्यापन टिप्पणी...",
    requirement: "चयनित प्राधिकरण की आधिकारिक मुहर और हस्ताक्षर अनुमोदित आवेदन पर स्वतः दिखाई देंगे।",
    reject: "अस्वीकार करें", verifyApprove: "सत्यापित और अनुमोदित करें", applicationApproved: "आवेदन अनुमोदित",
    approvedByLabel: "अनुमोदित द्वारा", printApproved: "अनुमोदित आवेदन प्रिंट करें", applicationRejected: "आवेदन अस्वीकृत",
    selectAuthorityAlert: "कृपया अनुमोदन प्राधिकरण चुनें।", rejectedNotification: "आवेदन अस्वीकृत",
    approvedNotification: "आवेदन अनुमोदित", yourApplication: "आपका आवेदन", rejectedMessage: "अस्वीकृत कर दिया गया है।",
    approvedMessage: "द्वारा अनुमोदित किया गया है", principal: "प्राचार्य", hod: "विभागाध्यक्ष", mentor: "फैकल्टी मेंटर",
    hodDesignation: "विभागाध्यक्ष", mentorDesignation: "फैकल्टी मेंटर"
  },
  or: {
    admin: "CAMPX ପ୍ରଶାସନ", digital: "ଡିଜିଟାଲ୍ ଆବେଦନ",
    verifyDesc: "ଛାତ୍ର ଆବେଦନଗୁଡିକୁ ଯାଞ୍ଚ କରି ଉପଯୁକ୍ତ କର୍ତ୍ତୃପକ୍ଷଙ୍କ ମାଧ୍ୟମରେ ଅନୁମୋଦନ କରନ୍ତୁ।",
    total: "ମୋଟ", pending: "ବିଚାରାଧୀନ", approved: "ଅନୁମୋଦିତ", rejected: "ପ୍ରତ୍ୟାଖ୍ୟାନ", all: "ସମସ୍ତ",
    noApplications: "କୌଣସି ଆବେଦନ ମିଳିଲା ନାହିଁ", applicationsAppear: "ଛାତ୍ର ଆବେଦନଗୁଡିକ ଏଠାରେ ଦେଖାଯିବ।",
    student: "ଛାତ୍ର", id: "ID", review: "ସମୀକ୍ଷା", applicationReview: "ଆବେଦନ ସମୀକ୍ଷା",
    to: "ପ୍ରତି,", concerned: "ସମ୍ପୃକ୍ତ କର୍ତ୍ତୃପକ୍ଷ", respected: "ମାନ୍ୟବର ସାର୍/ମ୍ୟାଡାମ୍,",
    requestText: "ଉପରୋକ୍ତ ବିଷୟ ସମ୍ବନ୍ଧରେ ମୋର ଆବେଦନକୁ ବିଚାର କରିବାକୁ ଅନୁରୋଧ କରୁଛି।",
    reason: "କାରଣ:", additional: "ଅତିରିକ୍ତ ବିବରଣୀ:", applicant: "ଆବେଦନକାରୀ",
    approvedBy: "ଅନୁମୋଦନକାରୀ", verification: "ଯାଞ୍ଚ ଏବଂ ଅନୁମୋଦନ",
    selectAuthority: "ଏହି ଆବେଦନକୁ ଅନୁମୋଦନ କରିବାକୁ ଥିବା କର୍ତ୍ତୃପକ୍ଷ ଚୟନ କରନ୍ତୁ।",
    selected: "ଚୟନିତ", selectedAuthority: "ଚୟନିତ କର୍ତ୍ତୃପକ୍ଷ", note: "ଯାଞ୍ଚ ଟିପ୍ପଣୀ",
    notePlaceholder: "ବୈକଳ୍ପିକ ଯାଞ୍ଚ ଟିପ୍ପଣୀ...",
    requirement: "ଚୟନିତ କର୍ତ୍ତୃପକ୍ଷଙ୍କ ଅଧିକୃତ ମୋହର ଏବଂ ସ୍ୱାକ୍ଷର ଅନୁମୋଦିତ ଆବେଦନରେ ସ୍ୱୟଂଚାଳିତ ଭାବେ ଦେଖାଯିବ।",
    reject: "ପ୍ରତ୍ୟାଖ୍ୟାନ କରନ୍ତୁ", verifyApprove: "ଯାଞ୍ଚ ଏବଂ ଅନୁମୋଦନ କରନ୍ତୁ", applicationApproved: "ଆବେଦନ ଅନୁମୋଦିତ",
    approvedByLabel: "ଅନୁମୋଦନକାରୀ", printApproved: "ଅନୁମୋଦିତ ଆବେଦନ ପ୍ରିଣ୍ଟ କରନ୍ତୁ", applicationRejected: "ଆବେଦନ ପ୍ରତ୍ୟାଖ୍ୟାନ",
    selectAuthorityAlert: "ଦୟାକରି ଜଣେ ଅନୁମୋଦନ କର୍ତ୍ତୃପକ୍ଷ ଚୟନ କରନ୍ତୁ।", rejectedNotification: "ଆବେଦନ ପ୍ରତ୍ୟାଖ୍ୟାନ",
    approvedNotification: "ଆବେଦନ ଅନୁମୋଦିତ", yourApplication: "ଆପଣଙ୍କ ଆବେଦନ", rejectedMessage: "ପ୍ରତ୍ୟାଖ୍ୟାନ ହୋଇଛି।",
    approvedMessage: "ଙ୍କ ଦ୍ୱାରା ଅନୁମୋଦିତ ହୋଇଛି", principal: "ପ୍ରିନ୍ସିପାଲ୍", hod: "HOD", mentor: "ମେଣ୍ଟର୍",
    hodDesignation: "ବିଭାଗ ମୁଖ୍ୟ", mentorDesignation: "ଫ୍ୟାକଲ୍ଟି ମେଣ୍ଟର୍"
  }
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
  const { language } = useLanguage();
  const t =
    ADMIN_APPLICATIONS_TRANSLATIONS[language] ||
    ADMIN_APPLICATIONS_TRANSLATIONS.en;


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
      title: t.rejectedNotification,
      message: `${t.yourApplication} ${selectedApplication.id} ${t.rejectedMessage}`,
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
      alert(t.selectAuthorityAlert);
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

      title: t.approvedNotification,

      message:
        `${t.yourApplication} ${selectedApplication.id} ${t.approvedMessage} ${authority}.`,

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
        <Topbar title={t.digital} />

        <div className="page-content">

          {/* HEADER */}

          <div className="page-header">
            <div>
              <div className="page-eyebrow">
                {t.admin}
              </div>

              <h1>
                {t.digital}
              </h1>

              <p>
                {t.verifyDesc}
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
                <span>{t.total}</span>
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
                <span>{t.pending}</span>
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
                <span>{t.approved}</span>
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
                <span>{t.rejected}</span>
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
                {filter === "All"
                    ? t.all
                    : filter === "Submitted"
                    ? t.pending
                    : filter === "Approved"
                    ? t.approved
                    : t.rejected}
              </button>
            ))}

          </div>

          {/* APPLICATIONS */}

          <div className="admin-applications-list">

            {filteredApplications.length === 0 ? (
              <div className="empty-timetable">
                <FileText size={34} />

                <h3>
                  {t.noApplications}
                </h3>

                <p>
                  {t.applicationsAppear}
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
                          {application.status === "Submitted"
                            ? t.pending
                            : application.status === "Approved"
                            ? t.approved
                            : t.rejected}
                        </span>

                      </div>

                      <div className="admin-application-details">

                        <span>
                          {t.student}:{" "}
                          <strong>
                            {application.studentName}
                          </strong>
                        </span>

                        <span>
                          {t.id}:{" "}
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
                  {t.applicationReview}
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
                  {t.concerned}
                  <br />
                  {selectedApplication.department}
                </div>

                <h3>
                  Subject:{" "}
                  {selectedApplication.subject}
                </h3>

                <p>
                  {t.respected}
                </p>

                <p>
                  I,{" "}
                  <strong>
                    {selectedApplication.studentName}
                  </strong>{" "}
                  (
                  {selectedApplication.studentId}
                  ), {t.requestText}
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
                      {t.additional}
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
                          {t.approvedBy}
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
                        {t.verification}
                      </h3>

                      <p>
                        {t.selectAuthority}
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
                          key={authorityName === "Principal"
                              ? t.principal
                              : authorityName === "HOD"
                              ? t.hod
                              : t.mentor}
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
                                `${authorityName === "Principal"
                              ? t.principal
                              : authorityName === "HOD"
                              ? t.hod
                              : t.mentor} approval`
                              }
                            />

                          </div>

                          <strong>
                            {authorityName === "Principal"
                              ? t.principal
                              : authorityName === "HOD"
                              ? t.hod
                              : t.mentor}
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
                          {t.selectedAuthority}
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
                      {t.note}
                    </label>

                    <textarea
                      rows="3"
                      placeholder={t.notePlaceholder}
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
                      {t.requirement}
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
                        {t.applicationApproved}
                      </h3>

                      <p>
                        {t.approvedByLabel}{" "}
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

                        {t.printApproved}
                      </button>
                    </>
                  ) : (
                    <>
                      <XCircle
                        size={30}
                      />

                      <h3>
                        {t.applicationRejected}
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