import { useEffect, useState } from "react";

import {
  DoorOpen,
  MapPin,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
} from "lucide-react";

import { addNotification } from "../notificationStorage";
import { useLanguage } from "../context/LanguageContext";

const GATEPASS_KEY = "campx_gate_passes";


const GATEPASS_TRANSLATIONS = {
  en: {
    administration: "CAMPX ADMINISTRATION",
    title: "Gate Pass Requests",
    description: "Review and manage student gate pass requests.",
    refresh: "Refresh",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    totalRequests: "Total Requests",
    studentRequests: "Student Requests",
    reviewApplications: "Review submitted gate pass applications.",
    noRequests: "No gate pass requests",
    newRequests: "New student requests will appear here.",
    student: "Student",
    na: "N/A",
    destination: "Destination",
    purpose: "Purpose",
    date: "Date",
    time: "Time",
    notSpecified: "Not specified",
    requestId: "Request ID",
    reject: "Reject",
    approve: "Approve",
    approvedSuccessfully: "Gate pass approved successfully.",
    requestRejected: "Gate pass request rejected.",
    approvedNotification: "Gate Pass Approved",
    rejectedNotification: "Gate Pass Rejected",
    approvedMessage: (destination, date) =>
      `Your gate pass for ${destination} on ${date} has been approved by the administration.`,
    rejectedMessage: (destination, date) =>
      `Your gate pass request for ${destination} on ${date} has been rejected by the administration.`,
  },
  hi: {
    administration: "CAMPX प्रशासन",
    title: "गेट पास अनुरोध",
    description: "छात्रों के गेट पास अनुरोधों की समीक्षा और प्रबंधन करें।",
    refresh: "रिफ्रेश",
    pending: "लंबित",
    approved: "स्वीकृत",
    rejected: "अस्वीकृत",
    totalRequests: "कुल अनुरोध",
    studentRequests: "छात्र अनुरोध",
    reviewApplications: "प्रस्तुत गेट पास आवेदनों की समीक्षा करें।",
    noRequests: "कोई गेट पास अनुरोध नहीं",
    newRequests: "नए छात्र अनुरोध यहां दिखाई देंगे।",
    student: "छात्र",
    na: "उपलब्ध नहीं",
    destination: "गंतव्य",
    purpose: "उद्देश्य",
    date: "तारीख",
    time: "समय",
    notSpecified: "निर्दिष्ट नहीं",
    requestId: "अनुरोध ID",
    reject: "अस्वीकार करें",
    approve: "स्वीकृत करें",
    approvedSuccessfully: "गेट पास सफलतापूर्वक स्वीकृत हुआ।",
    requestRejected: "गेट पास अनुरोध अस्वीकार कर दिया गया।",
    approvedNotification: "गेट पास स्वीकृत",
    rejectedNotification: "गेट पास अस्वीकृत",
    approvedMessage: (destination, date) =>
      `आपका ${destination} के लिए ${date} का गेट पास प्रशासन द्वारा स्वीकृत किया गया है।`,
    rejectedMessage: (destination, date) =>
      `आपका ${destination} के लिए ${date} का गेट पास अनुरोध प्रशासन द्वारा अस्वीकार किया गया है।`,
  },
  or: {
    administration: "CAMPX ପ୍ରଶାସନ",
    title: "ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ",
    description: "ଛାତ୍ରଛାତ୍ରୀଙ୍କ ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ ସମୀକ୍ଷା ଏବଂ ପରିଚାଳନା କରନ୍ତୁ।",
    refresh: "ରିଫ୍ରେଶ୍",
    pending: "ବିଚାରାଧୀନ",
    approved: "ଅନୁମୋଦିତ",
    rejected: "ପ୍ରତ୍ୟାଖ୍ୟାନ",
    totalRequests: "ମୋଟ ଅନୁରୋଧ",
    studentRequests: "ଛାତ୍ର ଅନୁରୋଧ",
    reviewApplications: "ଦାଖଲ ହୋଇଥିବା ଗେଟ୍ ପାସ୍ ଆବେଦନଗୁଡ଼ିକ ସମୀକ୍ଷା କରନ୍ତୁ।",
    noRequests: "କୌଣସି ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ ନାହିଁ",
    newRequests: "ନୂତନ ଛାତ୍ର ଅନୁରୋଧ ଏଠାରେ ଦେଖାଯିବ।",
    student: "ଛାତ୍ର",
    na: "ଉପଲବ୍ଧ ନାହିଁ",
    destination: "ଗନ୍ତବ୍ୟସ୍ଥଳ",
    purpose: "ଉଦ୍ଦେଶ୍ୟ",
    date: "ତାରିଖ",
    time: "ସମୟ",
    notSpecified: "ନିର୍ଦ୍ଦିଷ୍ଟ ନୁହେଁ",
    requestId: "ଅନୁରୋଧ ID",
    reject: "ପ୍ରତ୍ୟାଖ୍ୟାନ କରନ୍ତୁ",
    approve: "ଅନୁମୋଦନ କରନ୍ତୁ",
    approvedSuccessfully: "ଗେଟ୍ ପାସ୍ ସଫଳତାର ସହ ଅନୁମୋଦିତ ହୋଇଛି।",
    requestRejected: "ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ ପ୍ରତ୍ୟାଖ୍ୟାନ ହୋଇଛି।",
    approvedNotification: "ଗେଟ୍ ପାସ୍ ଅନୁମୋଦିତ",
    rejectedNotification: "ଗେଟ୍ ପାସ୍ ପ୍ରତ୍ୟାଖ୍ୟାନ",
    approvedMessage: (destination, date) =>
      `${destination} ପାଇଁ ${date}ର ଆପଣଙ୍କ ଗେଟ୍ ପାସ୍ ପ୍ରଶାସନ ଦ୍ୱାରା ଅନୁମୋଦିତ ହୋଇଛି।`,
    rejectedMessage: (destination, date) =>
      `${destination} ପାଇଁ ${date}ର ଆପଣଙ୍କ ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ ପ୍ରଶାସନ ଦ୍ୱାରା ପ୍ରତ୍ୟାଖ୍ୟାନ ହୋଇଛି।`,
  },
};

export default function GatePassRequests() {
  const { language } = useLanguage();
  const t =
    GATEPASS_TRANSLATIONS[language] ||
    GATEPASS_TRANSLATIONS.en;

  const [requests, setRequests] = useState([]);

  // ==================================================
  // LOAD REQUESTS
  // ==================================================

  const loadRequests = () => {
    try {
      const saved =
        localStorage.getItem(GATEPASS_KEY);

      if (!saved) {
        setRequests([]);
        return;
      }

      const parsed = JSON.parse(saved);

      setRequests(
        Array.isArray(parsed) ? parsed : []
      );
    } catch (error) {
      console.error(
        "Unable to load gate pass requests:",
        error
      );

      setRequests([]);
    }
  };

  // ==================================================
  // INITIAL LOAD + SYNC
  // ==================================================

  useEffect(() => {
    loadRequests();

    const handleStorageChange = (event) => {
      if (event.key === GATEPASS_KEY) {
        loadRequests();
      }
    };

    const handleGatePassUpdate = () => {
      loadRequests();
    };

    // Other browser tabs
    window.addEventListener(
      "storage",
      handleStorageChange
    );

    // Same browser tab
    window.addEventListener(
      "campx-gatepass-updated",
      handleGatePassUpdate
    );

    // Backup refresh
    const interval = setInterval(() => {
      loadRequests();
    }, 1000);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "campx-gatepass-updated",
        handleGatePassUpdate
      );

      clearInterval(interval);
    };
  }, []);

  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const updateStatus = (id, status) => {
    const request = requests.find(
      (item) => item.id === id
    );

    if (!request) {
      return;
    }

    // Prevent duplicate status updates
    if (request.status === status) {
      return;
    }

    const updatedRequests = requests.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              status,
              updatedAt:
                new Date().toISOString(),
            }
          : item
    );

    setRequests(updatedRequests);

    localStorage.setItem(
      GATEPASS_KEY,
      JSON.stringify(updatedRequests)
    );

    // ==================================================
    // STUDENT NOTIFICATION
    // ==================================================

    addNotification({
      audience: "student",
      studentId: request.studentId,
      type: "gate-pass",

      title:
        status === "Approved"
          ? t.approvedNotification
          : t.rejectedNotification,

      message:
        status === "Approved"
          ? t.approvedMessage(request.destination, request.exitDate)
          : t.rejectedMessage(request.destination, request.exitDate),

      status,
      relatedId: request.id,
    });

    // ==================================================
    // UPDATE OTHER COMPONENTS
    // ==================================================

    window.dispatchEvent(
      new Event("campx-gatepass-updated")
    );
  };

  // ==================================================
  // COUNTS
  // ==================================================

  const pendingCount = requests.filter(
    (request) =>
      request.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (request) =>
      request.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) =>
      request.status === "Rejected"
  ).length;

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="page-container">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>

          <div className="eyebrow">
            {t.administration}
          </div>

          <h1>
            {t.title}
          </h1>

          <p>
            {t.description}
          </p>

        </div>

        <button
          type="button"
          className="secondary-btn"
          onClick={loadRequests}
        >
          <RefreshCw size={17} />
          {t.refresh}
        </button>

      </div>


      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="gate-pass-stats">

        {/* PENDING */}

        <div className="gate-stat">

          <div className="stat-icon pending-icon">
            <Clock size={20} />
          </div>

          <div>
            <span>{t.pending}</span>

            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>


        {/* APPROVED */}

        <div className="gate-stat">

          <div className="stat-icon approved-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>{t.approved}</span>

            <strong>
              {approvedCount}
            </strong>
          </div>

        </div>


        {/* REJECTED */}

        <div className="gate-stat">

          <div className="stat-icon rejected-icon">
            <XCircle size={20} />
          </div>

          <div>
            <span>{t.rejected}</span>

            <strong>
              {rejectedCount}
            </strong>
          </div>

        </div>


        {/* TOTAL */}

        <div className="gate-stat">

          <div className="stat-icon total-icon">
            <FileText size={20} />
          </div>

          <div>
            <span>{t.totalRequests}</span>

            <strong>
              {requests.length}
            </strong>
          </div>

        </div>

      </div>


      {/* ==================================================
          REQUEST LIST
      ================================================== */}

      <div className="card">

        <div className="section-header">

          <div>

            <h2>
              {t.studentRequests}
            </h2>

            <p>
              {t.reviewApplications}
            </p>

          </div>

          <DoorOpen size={24} />

        </div>


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {requests.length === 0 ? (

          <div className="empty-state">

            <DoorOpen size={42} />

            <h3>
              {t.noRequests}
            </h3>

            <p>
              {t.newRequests}
            </p>

          </div>

        ) : (

          <div className="admin-request-list">

            {requests.map((request) => (

              <div
                className="admin-request"
                key={request.id}
              >

                {/* REQUEST ICON */}

                <div className="admin-request-icon">
                  <DoorOpen size={22} />
                </div>


                {/* REQUEST INFORMATION */}

                <div className="admin-request-info">

                  {/* TOP ROW */}

                  <div className="request-top">

                    <div>

                      <h3>
                        {request.studentName ||
                          t.student}
                      </h3>

                      <span className="student-id">
                        {request.studentId ||
                          t.na}
                      </span>

                    </div>


                    {/* STATUS */}

                    <div
                      className={`status-badge ${
                        request.status
                          ? request.status.toLowerCase()
                          : "pending"
                      }`}
                    >

                      {request.status ===
                        "Pending" && (
                        <Clock size={14} />
                      )}

                      {request.status ===
                        "Approved" && (
                        <CheckCircle2
                          size={14}
                        />
                      )}

                      {request.status ===
                        "Rejected" && (
                        <XCircle size={14} />
                      )}

                      {request.status === "Approved"
                        ? t.approved
                        : request.status === "Rejected"
                        ? t.rejected
                        : t.pending}

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="request-details">

                    {/* DESTINATION */}

                    <div>

                      <MapPin size={16} />

                      <span>

                        <small>
                          Destination
                        </small>

                        {request.destination ||
                          t.notSpecified}

                      </span>

                    </div>


                    {/* PURPOSE */}

                    <div>

                      <FileText size={16} />

                      <span>

                        <small>
                          Purpose
                        </small>

                        {request.purpose ||
                          t.notSpecified}

                      </span>

                    </div>


                    {/* DATE */}

                    <div>

                      <CalendarDays
                        size={16}
                      />

                      <span>

                        <small>
                          {t.date}
                        </small>

                        {request.exitDate ||
                          t.na}

                      </span>

                    </div>


                    {/* TIME */}

                    <div>

                      <Clock size={16} />

                      <span>

                        <small>
                          {t.time}
                        </small>

                        {request.exitTime ||
                          t.na}

                        {" → "}

                        {request.returnTime ||
                          t.na}

                      </span>

                    </div>

                  </div>


                  {/* REQUEST ID */}

                  <small
                    style={{
                      display: "block",
                      marginTop: "10px",
                      color: "#94a3b8",
                    }}
                  >
                    Request ID: {request.id}
                  </small>


                  {/* ==================================================
                      ACTION BUTTONS
                  ================================================== */}

                  {request.status ===
                    "Pending" && (

                    <div className="request-actions">

                      {/* REJECT */}

                      <button
                        type="button"
                        className="reject-button"
                        onClick={() =>
                          updateStatus(
                            request.id,
                            "Rejected"
                          )
                        }
                      >

                        <XCircle size={17} />

                        Reject

                      </button>


                      {/* APPROVE */}

                      <button
                        type="button"
                        className="approve-button"
                        onClick={() =>
                          updateStatus(
                            request.id,
                            "Approved"
                          )
                        }
                      >

                        <CheckCircle2
                          size={17}
                        />

                        Approve

                      </button>

                    </div>

                  )}


                  {/* APPROVED MESSAGE */}

                  {request.status ===
                    "Approved" && (

                    <div className="approved-message">

                      <CheckCircle2
                        size={16}
                      />

                      {t.approvedSuccessfully}

                    </div>

                  )}


                  {/* REJECTED MESSAGE */}

                  {request.status ===
                    "Rejected" && (

                    <div className="rejected-message">

                      <XCircle size={16} />

                      {t.requestRejected}

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}