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

const STORAGE_KEY = "campx_gate_passes";

export default function GatePass() {
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

  // --------------------------------------------------
  // LOAD REQUESTS
  // --------------------------------------------------

  const loadRequests = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setRequests(JSON.parse(saved));
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Unable to load gate pass requests:", error);
    }
  };

  // --------------------------------------------------
  // SYNC WITH ADMIN PANEL
  // --------------------------------------------------

  useEffect(() => {
    // Check for changes when page loads
    loadRequests();

    // Detect changes made from another browser tab
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY) {
        loadRequests();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically.
    // This makes the demo work even when student/admin
    // pages are opened in the same browser environment.
    const interval = setInterval(() => {
      loadRequests();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // --------------------------------------------------
  // SUBMIT GATE PASS
  // --------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !destination.trim() ||
      !purpose.trim() ||
      !exitDate ||
      !exitTime ||
      !returnTime
    ) {
      alert("Please fill all the fields.");
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

      // Useful for future notification system
      notification: "Your gate pass request is waiting for approval.",
    };

    const updatedRequests = [newRequest, ...requests];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedRequests)
    );

    setRequests(updatedRequests);
    // 🔔 Notify ADMIN about new gate pass

addNotification({
  audience: "admin",

  type: "gate-pass",

  title: "New Gate Pass Request",

  message: `${newRequest.studentName} has submitted a gate pass request for ${newRequest.destination}.`,

  studentId: newRequest.studentId,

  relatedId: newRequest.id,

  status: "Pending",
});
    // Custom event for same-page communication
    window.dispatchEvent(
      new Event("campx-gatepass-updated")
    );

    // Clear form
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

  // --------------------------------------------------
  // DETECT STATUS CHANGES
  // --------------------------------------------------

  useEffect(() => {
    const previousStatuses = JSON.parse(
      sessionStorage.getItem("campx_gatepass_statuses") || "{}"
    );

    const currentStatuses = {};

    requests.forEach((request) => {
      currentStatuses[request.id] = request.status;

      const previousStatus = previousStatuses[request.id];

      if (
        previousStatus &&
        previousStatus !== request.status
      ) {
        if (request.status === "Approved") {
          setStatusMessage(
            `Gate pass approved for ${request.destination}.`
          );
        }

        if (request.status === "Rejected") {
          setStatusMessage(
            `Gate pass rejected for ${request.destination}.`
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
  }, [requests]);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="page-container">

      {/* SUCCESS MESSAGE */}
      {submitted && (
        <div className="success-message">

          <CheckCircle2 size={22} />

          <div>
            <strong>
              Gate Pass request submitted!
            </strong>

            <p>
              Your request has been sent to the
              administration for approval.
            </p>
          </div>

          <button
            onClick={() => setSubmitted(false)}
          >
            ×
          </button>

        </div>
      )}

      {/* STATUS UPDATE MESSAGE */}
      {statusMessage && (
        <div className="success-message">

          {statusMessage.includes("approved") ? (
            <CheckCircle2 size={22} />
          ) : (
            <XCircle size={22} />
          )}

          <div>
            <strong>
              {statusMessage}
            </strong>

            <p>
              Your gate pass status has been updated
              by the administration.
            </p>
          </div>

          <button
            onClick={() => setStatusMessage("")}
          >
            ×
          </button>

        </div>
      )}

      {/* NEW GATE PASS */}
      <div className="card">

        <div className="page-title">

          <div className="title-icon">
            <DoorOpen size={25} />
          </div>

          <div>
            <h2>New Gate Pass</h2>
            <p>
              Fill in your exit details
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* DESTINATION */}
          <div className="form-group">

            <label>
              Destination
            </label>

            <div className="input-icon">

              <MapPin size={19} />

              <input
                type="text"
                placeholder="e.g. Home, Hospital, Market"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
              />

            </div>

          </div>

          {/* PURPOSE */}
          <div className="form-group">

            <label>
              Purpose
            </label>

            <div className="textarea-icon">

              <FileText size={19} />

              <textarea
                placeholder="Why do you need to leave campus?"
                value={purpose}
                onChange={(e) =>
                  setPurpose(e.target.value)
                }
              />

            </div>

          </div>

          {/* DATE + EXIT TIME */}
          <div className="form-row">

            <div className="form-group">

              <label>
                Exit Date
              </label>

              <div className="input-icon">

                <CalendarDays size={19} />

                <input
                  type="date"
                  value={exitDate}
                  onChange={(e) =>
                    setExitDate(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Exit Time
              </label>

              <div className="input-icon">

                <Clock size={19} />

                <input
                  type="time"
                  value={exitTime}
                  onChange={(e) =>
                    setExitTime(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* RETURN TIME */}
          <div className="form-group">

            <label>
              Expected Return
            </label>

            <div className="input-icon">

              <Clock size={19} />

              <input
                type="time"
                value={returnTime}
                onChange={(e) =>
                  setReturnTime(e.target.value)
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

            Submit Gate Pass Request

          </button>

        </form>

      </div>

      {/* REQUEST HISTORY */}
      <div className="card">

        <div className="section-header">

          <div>
            <h2>
              My Gate Pass Requests
            </h2>

            <p>
              Track your submitted requests
            </p>
          </div>

          <DoorOpen size={24} />

        </div>

        {requests.length === 0 ? (

          <div className="empty-state">

            <DoorOpen size={35} />

            <p>
              No gate pass requests yet.
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
                    Request ID: {request.id}
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

                  {request.status === "Approved" && (
                    <CheckCircle2 size={15} />
                  )}

                  {request.status === "Rejected" && (
                    <XCircle size={15} />
                  )}

                  {request.status === "Pending" && (
                    <Clock size={15} />
                  )}

                  {request.status}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}