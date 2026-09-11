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
import { addNotification } from "../notificationStorage";

const REQUESTS_KEY = "campxRequests";

export default function AdminRequests() {
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
        title: `Request ${newStatus}`,
        message: `Your ${request.type} request (${request.id}) is now ${newStatus}.`,
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

        <Topbar title="Request Management" />

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
                  Total Requests
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
                  Submitted
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
                  In Progress
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
                  Resolved
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
                {status}
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
                  No requests found
                </h3>

                <p>
                  Student requests will
                  appear here automatically.
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
                          {request.status}
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
                          Student
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
                          Student ID
                        </strong>

                        <span>
                          {request.studentId}
                        </span>

                      </div>


                      <div>

                        <strong>
                          Request Type
                        </strong>

                        <span>
                          {request.type}
                        </span>

                      </div>


                      <div>

                        <strong>
                          Submitted
                        </strong>

                        <span>
                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleString()
                            : "N/A"}
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
                        Submitted
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
                        In Progress
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
                        Resolved
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