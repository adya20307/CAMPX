import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  RefreshCw,
  User,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";
import { addNotification } from "../notificationStorage";

const REQUESTS_KEY = "campxRequests";



const ADMIN_REQUESTS_TRANSLATIONS = {
  en: {
    requestManagement: "Request Management",
    studentRequests: "Student Requests",
    description: "Review and process student service requests.",
    refresh: "Refresh",
    totalRequests: "Total Requests",
    liveCampusData: "Live campus data",
    submitted: "Submitted",
    awaitingAction: "Awaiting action",
    inProgress: "In Progress",
    beingProcessed: "Being processed",
    resolved: "Resolved",
    completedRequests: "Completed requests",
    all: "All",
    noRequestsFound: "No requests found",
    requestsAppear: "Student requests will appear here automatically.",
    student: "Student",
    studentId: "Student ID",
    requestType: "Request Type",
    submittedLabel: "Submitted",
    updateStatus: "Update status:",
    na: "N/A",
    request: "Request",
    now: "now",
  },
  hi: {
    requestManagement: "अनुरोध प्रबंधन",
    studentRequests: "छात्र अनुरोध",
    description: "छात्र सेवा अनुरोधों की समीक्षा और प्रक्रिया करें।",
    refresh: "रिफ्रेश",
    totalRequests: "कुल अनुरोध",
    liveCampusData: "लाइव कैंपस डेटा",
    submitted: "प्रस्तुत",
    awaitingAction: "कार्रवाई की प्रतीक्षा",
    inProgress: "प्रगति में",
    beingProcessed: "प्रक्रिया में",
    resolved: "समाधान किया गया",
    completedRequests: "पूर्ण अनुरोध",
    all: "सभी",
    noRequestsFound: "कोई अनुरोध नहीं मिला",
    requestsAppear: "छात्र अनुरोध यहां अपने आप दिखाई देंगे।",
    student: "छात्र",
    studentId: "छात्र ID",
    requestType: "अनुरोध प्रकार",
    submittedLabel: "प्रस्तुत",
    updateStatus: "स्थिति अपडेट करें:",
    na: "उपलब्ध नहीं",
    request: "अनुरोध",
    now: "अब",
  },
  or: {
    requestManagement: "ଅନୁରୋଧ ପରିଚାଳନା",
    studentRequests: "ଛାତ୍ର ଅନୁରୋଧ",
    description: "ଛାତ୍ର ସେବା ଅନୁରୋଧଗୁଡିକୁ ସମୀକ୍ଷା ଏବଂ ପ୍ରକ୍ରିୟାକରଣ କରନ୍ତୁ।",
    refresh: "ରିଫ୍ରେଶ୍",
    totalRequests: "ମୋଟ ଅନୁରୋଧ",
    liveCampusData: "ଲାଇଭ୍ କ୍ୟାମ୍ପସ୍ ଡାଟା",
    submitted: "ଦାଖଲ",
    awaitingAction: "କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଅପେକ୍ଷାରେ",
    inProgress: "ପ୍ରଗତିରେ",
    beingProcessed: "ପ୍ରକ୍ରିୟାକରଣ ହେଉଛି",
    resolved: "ସମାଧାନ ହୋଇଛି",
    completedRequests: "ସମ୍ପୂର୍ଣ୍ଣ ଅନୁରୋଧ",
    all: "ସମସ୍ତ",
    noRequestsFound: "କୌଣସି ଅନୁରୋଧ ମିଳିଲା ନାହିଁ",
    requestsAppear: "ଛାତ୍ର ଅନୁରୋଧଗୁଡିକ ଏଠାରେ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ଦେଖାଯିବ।",
    student: "ଛାତ୍ର",
    studentId: "ଛାତ୍ର ID",
    requestType: "ଅନୁରୋଧ ପ୍ରକାର",
    submittedLabel: "ଦାଖଲ",
    updateStatus: "ସ୍ଥିତି ଅପଡେଟ୍ କରନ୍ତୁ:",
    na: "ଉପଲବ୍ଧ ନାହିଁ",
    request: "ଅନୁରୋଧ",
    now: "ବର୍ତ୍ତମାନ",
  },
};

export default function AdminRequests() {
  const { language } = useLanguage();
  const t =
    ADMIN_REQUESTS_TRANSLATIONS[language] ||
    ADMIN_REQUESTS_TRANSLATIONS.en;

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  const loadRequests = () => {
    try {
      const saved = localStorage.getItem(REQUESTS_KEY);

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
        "Error loading requests:",
        error
      );

      setRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();

    window.addEventListener(
      "storage",
      loadRequests
    );

    window.addEventListener(
      "campx-request-updated",
      loadRequests
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadRequests
      );

      window.removeEventListener(
        "campx-request-updated",
        loadRequests
      );
    };
  }, []);

  const updateStatus = (id, newStatus) => {
    const request = requests.find(
      (item) => item.id === id
    );

    const updated = requests.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              updatedAt:
                new Date().toISOString(),
            }
          : item
    );

    setRequests(updated);

    localStorage.setItem(
      REQUESTS_KEY,
      JSON.stringify(updated)
    );

    if (request) {
      addNotification({
        audience: "student",
        studentId: request.studentId,
        type: "request",
        title: `${t.request} ${newStatus === "In Progress" ? t.inProgress : newStatus === "Resolved" ? t.resolved : t.submitted}`,
        message: `${t.request} ${request.type} (${request.id}) ${t.now} ${newStatus === "In Progress" ? t.inProgress : newStatus === "Resolved" ? t.resolved : t.submitted}.`,
        relatedId: request.id,
        status: newStatus,
      });
    }

    window.dispatchEvent(
      new Event("campx-request-updated")
    );
  };

  const total = requests.length;

  const submitted = requests.filter(
    (request) =>
      request.status === "Submitted"
  ).length;

  const inProgress = requests.filter(
    (request) =>
      request.status === "In Progress"
  ).length;

  const resolved = requests.filter(
    (request) =>
      request.status === "Resolved"
  ).length;

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter(
          (request) =>
            request.status === filter
        );

  return (
    <div className="app-layout">

      <Sidebar admin />

      <main className="main-content">

        <Topbar title={t.requestManagement} />

        <div className="page-content">

          {/* HEADER */}

          <div className="page-header">

            <div>

              <p className="eyebrow">
                CAMPX ADMINISTRATION
              </p>

              <h1>
                Student Requests
              </h1>

              <p>
                Review and process student
                service requests.
              </p>

            </div>

            <button
              className="secondary-btn"
              onClick={loadRequests}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>


          {/* STATISTICS */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon blue">
                  <FileText size={21} />
                </div>

                <span className="stat-title">
                  {t.totalRequests}
                </span>

              </div>

              <div className="stat-value">
                {total}
              </div>

              <div className="stat-subtitle">
                Live campus data
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon orange">
                  <Clock size={21} />
                </div>

                <span className="stat-title">
                  {t.submitted}
                </span>

              </div>

              <div className="stat-value">
                {submitted}
              </div>

              <div className="stat-subtitle">
                Awaiting action
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon orange">
                  <Clock size={21} />
                </div>

                <span className="stat-title">
                  {t.inProgress}
                </span>

              </div>

              <div className="stat-value">
                {inProgress}
              </div>

              <div className="stat-subtitle">
                Being processed
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon green">
                  <CheckCircle2 size={21} />
                </div>

                <span className="stat-title">
                  {t.resolved}
                </span>

              </div>

              <div className="stat-value">
                {resolved}
              </div>

              <div className="stat-subtitle">
                Completed requests
              </div>

            </div>

          </div>


          {/* FILTERS */}

          <div className="complaint-filters">

            {[
              "All",
              "Submitted",
              "In Progress",
              "Resolved",
            ].map((status) => (

              <button
                key={status}
                className={
                  filter === status
                    ? "filter-btn active"
                    : "filter-btn"
                }
                onClick={() =>
                  setFilter(status)
                }
              >
                {status === "All"
                  ? t.all
                  : status === "Submitted"
                  ? t.submitted
                  : status === "In Progress"
                  ? t.inProgress
                  : t.resolved}
              </button>

            ))}

          </div>


          {/* REQUEST LIST */}

          <div className="complaints-list">

            {filteredRequests.length ===
            0 ? (

              <div className="empty-state">

                <FileText size={38} />

                <h3>
                  {t.noRequestsFound}
                </h3>

                <p>
                  {t.requestsAppear}
                </p>

              </div>

            ) : (

              filteredRequests.map(
                (request) => (

                  <div
                    className="admin-complaint-card"
                    key={request.id}
                  >

                    {/* TOP */}

                    <div className="complaint-card-top">

                      <div>

                        <div className="complaint-title-row">

                          <h3>
                            {request.type}
                          </h3>

                        </div>

                        <p className="complaint-id">
                          {request.id}
                        </p>

                      </div>


                      <div className="complaint-status">

                        {request.status ===
                        "Resolved" ? (
                          <CheckCircle2
                            size={18}
                          />
                        ) : (
                          <Clock
                            size={18}
                          />
                        )}

                        <span>
                          {request.status === "In Progress"
                              ? t.inProgress
                              : request.status === "Resolved"
                              ? t.resolved
                              : t.submitted}
                        </span>

                      </div>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="complaint-description">
                      {request.purpose}
                    </p>


                    {/* DETAILS */}

                    <div className="complaint-details">

                      <div>

                        <strong>
                          {t.student}
                        </strong>

                        <span>
                          <User
                            size={13}
                          />{" "}
                          {request.studentName}
                        </span>

                      </div>


                      <div>

                        <strong>
                          {t.studentId}
                        </strong>

                        <span>
                          {request.studentId}
                        </span>

                      </div>


                      <div>

                        <strong>
                          {t.requestType}
                        </strong>

                        <span>
                          {request.type}
                        </span>

                      </div>


                      <div>

                        <strong>
                          {t.submitted}
                        </strong>

                        <span>
                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleString()
                            : t.na}
                        </span>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="complaint-actions">

                      <span>
                        Update status:
                      </span>


                      <button
                        className={
                          request.status ===
                          "Submitted"
                            ? "status-btn active"
                            : "status-btn"
                        }
                        onClick={() =>
                          updateStatus(
                            request.id,
                            "Submitted"
                          )
                        }
                      >
                        {t.submitted}
                      </button>


                      <button
                        className={
                          request.status ===
                          "In Progress"
                            ? "status-btn active"
                            : "status-btn"
                        }
                        onClick={() =>
                          updateStatus(
                            request.id,
                            "In Progress"
                          )
                        }
                      >
                        {t.inProgress}
                      </button>


                      <button
                        className={
                          request.status ===
                          "Resolved"
                            ? "status-btn active"
                            : "status-btn"
                        }
                        onClick={() =>
                          updateStatus(
                            request.id,
                            "Resolved"
                          )
                        }
                      >
                        {t.resolved}
                      </button>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </main>

    </div>
  );
}