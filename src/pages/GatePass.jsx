import { addNotification } from "../notificationStorage";
import { useEffect, useState } from "react";
import {
  DoorOpen,
  MapPin,
  FileText,
  CalendarDays,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

const STORAGE_KEY = "campx_gate_passes";

export default function GatePass() {
  const { language } = useLanguage();

  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // ============================================
  // TRANSLATIONS
  // ============================================

  const translations = {
    en: {
      communication: "GATE PASS",
      newGatePass: "New Gate Pass",
      fillExitDetails: "Fill in your exit details",

      destination: "Destination",
      destinationPlaceholder:
        "e.g. Home, Hospital, Market",

      purpose: "Purpose",
      purposePlaceholder:
        "Why do you need to leave campus?",

      exitDate: "Exit Date",
      exitTime: "Exit Time",
      expectedReturn: "Expected Return",

      submitRequest: "Submit Gate Pass Request",

      myRequests: "My Gate Pass Requests",
      trackRequests: "Track your submitted requests",

      noRequests: "No gate pass requests yet.",

      requestId: "Request ID",

      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",

      submittedTitle:
        "Gate Pass request submitted!",
      submittedMessage:
        "Your request has been sent to the administration for approval.",

      approvedMessage:
        "Gate pass approved for",
      rejectedMessage:
        "Gate pass rejected for",
      statusUpdated:
        "Your gate pass status has been updated by the administration.",

      allFields:
        "Please fill all the fields.",
    },

    hi: {
      communication: "गेट पास",
      newGatePass: "नया गेट पास",
      fillExitDetails: "अपने बाहर जाने का विवरण भरें",

      destination: "गंतव्य",
      destinationPlaceholder:
        "जैसे घर, अस्पताल, बाजार",

      purpose: "उद्देश्य",
      purposePlaceholder:
        "आपको कैंपस से बाहर क्यों जाना है?",

      exitDate: "बाहर जाने की तारीख",
      exitTime: "बाहर जाने का समय",
      expectedReturn: "वापसी का अपेक्षित समय",

      submitRequest: "गेट पास अनुरोध भेजें",

      myRequests: "मेरे गेट पास अनुरोध",
      trackRequests: "अपने भेजे गए अनुरोधों की स्थिति देखें",

      noRequests: "अभी तक कोई गेट पास अनुरोध नहीं है।",

      requestId: "अनुरोध आईडी",

      pending: "लंबित",
      approved: "स्वीकृत",
      rejected: "अस्वीकृत",

      submittedTitle:
        "गेट पास अनुरोध भेज दिया गया!",
      submittedMessage:
        "आपका अनुरोध प्रशासन को अनुमोदन के लिए भेज दिया गया है।",

      approvedMessage:
        "गेट पास स्वीकृत किया गया है",
      rejectedMessage:
        "गेट पास अस्वीकृत किया गया है",
      statusUpdated:
        "आपके गेट पास की स्थिति प्रशासन द्वारा अपडेट कर दी गई है।",

      allFields:
        "कृपया सभी फ़ील्ड भरें।",
    },

    or: {
      communication: "ଗେଟ୍ ପାସ୍",
      newGatePass: "ନୂତନ ଗେଟ୍ ପାସ୍",
      fillExitDetails: "ଆପଣଙ୍କ ବାହାରିବା ବିବରଣୀ ପୂରଣ କରନ୍ତୁ",

      destination: "ଗନ୍ତବ୍ୟସ୍ଥଳ",
      destinationPlaceholder:
        "ଯଥା ଘର, ହସ୍ପିଟାଲ୍, ବଜାର",

      purpose: "ଉଦ୍ଦେଶ୍ୟ",
      purposePlaceholder:
        "ଆପଣଙ୍କୁ କ୍ୟାମ୍ପସରୁ ବାହାରକୁ କାହିଁକି ଯିବାକୁ ପଡ଼ିବ?",

      exitDate: "ବାହାରିବା ତାରିଖ",
      exitTime: "ବାହାରିବା ସମୟ",
      expectedReturn: "ଆଶା କରାଯାଉଥିବା ଫେରିବା ସମୟ",

      submitRequest: "ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ ପଠାନ୍ତୁ",

      myRequests: "ମୋର ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ",
      trackRequests: "ଆପଣଙ୍କ ପଠାଇଥିବା ଅନୁରୋଧଗୁଡ଼ିକର ସ୍ଥିତି ଦେଖନ୍ତୁ",

      noRequests: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ ନାହିଁ।",

      requestId: "ଅନୁରୋଧ ID",

      pending: "ବିଚାରାଧୀନ",
      approved: "ଅନୁମୋଦିତ",
      rejected: "ପ୍ରତ୍ୟାଖ୍ୟାନ",

      submittedTitle:
        "ଗେଟ୍ ପାସ୍ ଅନୁରୋଧ ପଠାଯାଇଛି!",
      submittedMessage:
        "ଆପଣଙ୍କ ଅନୁରୋଧ ଅନୁମୋଦନ ପାଇଁ ପ୍ରଶାସନକୁ ପଠାଯାଇଛି।",

      approvedMessage:
        "ଗେଟ୍ ପାସ୍ ଅନୁମୋଦିତ ହୋଇଛି",
      rejectedMessage:
        "ଗେଟ୍ ପାସ୍ ପ୍ରତ୍ୟାଖ୍ୟାନ ହୋଇଛି",
      statusUpdated:
        "ଆପଣଙ୍କ ଗେଟ୍ ପାସ୍ ସ୍ଥିତି ପ୍ରଶାସନ ଦ୍ୱାରା ଅପଡେଟ୍ କରାଯାଇଛି।",

      allFields:
        "ଦୟାକରି ସମସ୍ତ ଫିଲ୍ଡ ପୂରଣ କରନ୍ତୁ।",
    },
  };

  const t = translations[language] || translations.en;

  // ============================================
  // STATUS TRANSLATION
  // ============================================

  const translateStatus = (status) => {
    if (status === "Pending") return t.pending;
    if (status === "Approved") return t.approved;
    if (status === "Rejected") return t.rejected;

    return status;
  };

  // ============================================
  // LOAD REQUESTS
  // ============================================

  const loadRequests = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setRequests(JSON.parse(saved));
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error(
        "Unable to load gate pass requests:",
        error
      );
    }
  };

  // ============================================
  // SYNC WITH ADMIN PANEL
  // ============================================

  useEffect(() => {
    loadRequests();

    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY) {
        loadRequests();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    const interval = setInterval(() => {
      loadRequests();
    }, 1000);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      clearInterval(interval);
    };
  }, []);

  // ============================================
  // SUBMIT GATE PASS
  // ============================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !destination.trim() ||
      !purpose.trim() ||
      !exitDate ||
      !exitTime ||
      !returnTime
    ) {
      alert(t.allFields);
      return;
    }

    const newRequest = {
      id: `GP-${Date.now()}`,

      studentName: "Adya Dash",
      studentId: "CX2026001",

      destination: destination.trim(),
      purpose: purpose.trim(),

      exitDate,
      exitTime,
      returnTime,

      status: "Pending",

      createdAt: new Date().toISOString(),

      notification:
        "Your gate pass request is waiting for approval.",
    };

    const updatedRequests = [
      newRequest,
      ...requests,
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedRequests)
    );

    setRequests(updatedRequests);

    // ==========================================
    // NOTIFY ADMIN
    // ==========================================

    addNotification({
      audience: "admin",

      type: "gate-pass",

      title: "New Gate Pass Request",

      message: `${newRequest.studentName} has submitted a gate pass request for ${newRequest.destination}.`,

      studentId: newRequest.studentId,

      relatedId: newRequest.id,

      status: "Pending",
    });

    // ==========================================
    // CUSTOM EVENT
    // ==========================================

    window.dispatchEvent(
      new Event("campx-gatepass-updated")
    );

    // ==========================================
    // CLEAR FORM
    // ==========================================

    setDestination("");
    setPurpose("");
    setExitDate("");
    setExitTime("");
    setReturnTime("");

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  // ============================================
  // DETECT STATUS CHANGES
  // ============================================

  useEffect(() => {
    const previousStatuses = JSON.parse(
      sessionStorage.getItem(
        "campx_gatepass_statuses"
      ) || "{}"
    );

    const currentStatuses = {};

    requests.forEach((request) => {
      currentStatuses[request.id] =
        request.status;

      const previousStatus =
        previousStatuses[request.id];

      if (
        previousStatus &&
        previousStatus !== request.status
      ) {
        if (request.status === "Approved") {
          setStatusMessage(
            `${t.approvedMessage} ${request.destination}.`
          );
        }

        if (request.status === "Rejected") {
          setStatusMessage(
            `${t.rejectedMessage} ${request.destination}.`
          );
        }

        setTimeout(() => {
          setStatusMessage("");
        }, 5000);
      }
    });

    sessionStorage.setItem(
      "campx_gatepass_statuses",
      JSON.stringify(currentStatuses)
    );
  }, [requests, language]);

  // ============================================
  // UI
  // ============================================

  return (
    <div className="page-container">

      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

      {submitted && (
        <div className="success-message">

          <CheckCircle2 size={22} />

          <div>
            <strong>
              {t.submittedTitle}
            </strong>

            <p>
              {t.submittedMessage}
            </p>
          </div>

          <button
            onClick={() =>
              setSubmitted(false)
            }
          >
            ×
          </button>

        </div>
      )}


      {/* ======================================
          STATUS UPDATE MESSAGE
      ====================================== */}

      {statusMessage && (
        <div className="success-message">

          {statusMessage.includes(
            t.approvedMessage
          ) ? (
            <CheckCircle2 size={22} />
          ) : (
            <XCircle size={22} />
          )}

          <div>

            <strong>
              {statusMessage}
            </strong>

            <p>
              {t.statusUpdated}
            </p>

          </div>

          <button
            onClick={() =>
              setStatusMessage("")
            }
          >
            ×
          </button>

        </div>
      )}


      {/* ======================================
          NEW GATE PASS
      ====================================== */}

      <div className="card">

        <div className="page-title">

          <div className="title-icon">
            <DoorOpen size={25} />
          </div>

          <div>

            <h2>
              {t.newGatePass}
            </h2>

            <p>
              {t.fillExitDetails}
            </p>

          </div>

        </div>


        <form onSubmit={handleSubmit}>

          {/* DESTINATION */}

          <div className="form-group">

            <label>
              {t.destination}
            </label>

            <div className="input-icon">

              <MapPin size={19} />

              <input
                type="text"
                placeholder={
                  t.destinationPlaceholder
                }
                value={destination}
                onChange={(e) =>
                  setDestination(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* PURPOSE */}

          <div className="form-group">

            <label>
              {t.purpose}
            </label>

            <div className="textarea-icon">

              <FileText size={19} />

              <textarea
                placeholder={
                  t.purposePlaceholder
                }
                value={purpose}
                onChange={(e) =>
                  setPurpose(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* DATE + EXIT TIME */}

          <div className="form-row">

            <div className="form-group">

              <label>
                {t.exitDate}
              </label>

              <div className="input-icon">

                <CalendarDays size={19} />

                <input
                  type="date"
                  value={exitDate}
                  onChange={(e) =>
                    setExitDate(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                {t.exitTime}
              </label>

              <div className="input-icon">

                <Clock size={19} />

                <input
                  type="time"
                  value={exitTime}
                  onChange={(e) =>
                    setExitTime(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>


          {/* RETURN TIME */}

          <div className="form-group">

            <label>
              {t.expectedReturn}
            </label>

            <div className="input-icon">

              <Clock size={19} />

              <input
                type="time"
                value={returnTime}
                onChange={(e) =>
                  setReturnTime(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="primary-button gate-submit"
          >

            <Send size={18} />

            {t.submitRequest}

          </button>

        </form>

      </div>


      {/* ======================================
          REQUEST HISTORY
      ====================================== */}

      <div className="card">

        <div className="section-header">

          <div>

            <h2>
              {t.myRequests}
            </h2>

            <p>
              {t.trackRequests}
            </p>

          </div>

          <DoorOpen size={24} />

        </div>


        {requests.length === 0 ? (

          <div className="empty-state">

            <DoorOpen size={35} />

            <p>
              {t.noRequests}
            </p>

          </div>

        ) : (

          <div className="request-list">

            {requests.map((request) => (

              <div
                className="request-item"
                key={request.id}
              >

                <div className="request-icon">
                  <DoorOpen size={20} />
                </div>


                <div className="request-info">

                  <h3>
                    {request.destination}
                  </h3>

                  <p>
                    {request.purpose}
                  </p>

                  <small>
                    {request.exitDate} •{" "}
                    {request.exitTime} -{" "}
                    {request.returnTime}
                  </small>

                  <small
                    style={{
                      display: "block",
                      marginTop: "5px",
                      color: "#94a3b8",
                    }}
                  >
                    {t.requestId}:{" "}
                    {request.id}
                  </small>

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
                    "Approved" && (
                    <CheckCircle2 size={15} />
                  )}

                  {request.status ===
                    "Rejected" && (
                    <XCircle size={15} />
                  )}

                  {request.status ===
                    "Pending" && (
                    <Clock size={15} />
                  )}

                  {translateStatus(
                    request.status
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