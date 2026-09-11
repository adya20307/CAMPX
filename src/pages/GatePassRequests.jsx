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

const GATEPASS_KEY = "campx_gate_passes";

export default function GatePassRequests() {
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
          ? "Gate Pass Approved"
          : "Gate Pass Rejected",

      message:
        status === "Approved"
          ? `Your gate pass for ${request.destination} on ${request.exitDate} has been approved by the administration.`
          : `Your gate pass request for ${request.destination} on ${request.exitDate} has been rejected by the administration.`,

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
            CAMPX ADMINISTRATION
          </div>

          <h1>
            Gate Pass Requests
          </h1>

          <p>
            Review and manage student gate pass
            requests.
          </p>

        </div>

        <button
          type="button"
          className="secondary-btn"
          onClick={loadRequests}
        >
          <RefreshCw size={17} />
          Refresh
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
            <span>Pending</span>

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
            <span>Approved</span>

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
            <span>Rejected</span>

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
            <span>Total Requests</span>

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
              Student Requests
            </h2>

            <p>
              Review submitted gate pass
              applications.
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
              No gate pass requests
            </h3>

            <p>
              New student requests will
              appear here.
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
                          "Student"}
                      </h3>

                      <span className="student-id">
                        {request.studentId ||
                          "N/A"}
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

                      {request.status ||
                        "Pending"}

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
                          "Not specified"}

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
                          "Not specified"}

                      </span>

                    </div>


                    {/* DATE */}

                    <div>

                      <CalendarDays
                        size={16}
                      />

                      <span>

                        <small>
                          Date
                        </small>

                        {request.exitDate ||
                          "N/A"}

                      </span>

                    </div>


                    {/* TIME */}

                    <div>

                      <Clock size={16} />

                      <span>

                        <small>
                          Time
                        </small>

                        {request.exitTime ||
                          "N/A"}

                        {" → "}

                        {request.returnTime ||
                          "N/A"}

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

                      Gate pass approved
                      successfully.

                    </div>

                  )}


                  {/* REJECTED MESSAGE */}

                  {request.status ===
                    "Rejected" && (

                    <div className="rejected-message">

                      <XCircle size={16} />

                      Gate pass request
                      rejected.

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