import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";

const COMPLAINTS_KEY = "campxComplaints";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");

  const loadComplaints = () => {
    try {
      const saved = localStorage.getItem(COMPLAINTS_KEY);

      if (!saved) {
        setComplaints([]);
        return;
      }

      const data = JSON.parse(saved);
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setComplaints([]);
    }
  };

  useEffect(() => {
    loadComplaints();

    window.addEventListener("storage", loadComplaints);
    window.addEventListener("campx-complaint-updated", loadComplaints);

    return () => {
      window.removeEventListener("storage", loadComplaints);
      window.removeEventListener(
        "campx-complaint-updated",
        loadComplaints
      );
    };
  }, []);

  const updateStatus = (complaintId, newStatus) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? {
            ...complaint,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : complaint
    );

    localStorage.setItem(
      COMPLAINTS_KEY,
      JSON.stringify(updatedComplaints)
    );

    setComplaints(updatedComplaints);

    const complaint = complaints.find(
      (item) => item.id === complaintId
    );

    if (complaint) {
      addNotification({
        audience: "student",
        studentId: complaint.studentId,
        type: "complaint",
        title: `Complaint ${newStatus}`,
        message: `Your complaint ${complaint.id} is now ${newStatus}.`,
        relatedId: complaint.id,
        status: newStatus,
      });
    }

    window.dispatchEvent(new Event("campx-complaint-updated"));
  };

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter(
          (complaint) => complaint.status === filter
        );

  const total = complaints.length;
  const submitted = complaints.filter(
    (c) => c.status === "Submitted"
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const getPriorityClass = (priority) => {
    if (priority === "Critical") return "priority-critical";
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  const getStatusIcon = (status) => {
    if (status === "Resolved") {
      return <CheckCircle size={18} />;
    }

    if (status === "In Progress") {
      return <Wrench size={18} />;
    }

    return <Clock size={18} />;
  };

  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">
        <Topbar />

        <div className="page-content">
          <div className="page-header">
            <div>
              <h1>Complaints Management</h1>
              <p>
                Review, assign and resolve student complaints.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon">
                <AlertCircle size={22} />
              </div>

              <div>
                <p>Total Complaints</p>
                <h2>{total}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">
                <Clock size={22} />
              </div>

              <div>
                <p>Submitted</p>
                <h2>{submitted}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">
                <Wrench size={22} />
              </div>

              <div>
                <p>In Progress</p>
                <h2>{inProgress}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">
                <CheckCircle size={22} />
              </div>

              <div>
                <p>Resolved</p>
                <h2>{resolved}</h2>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="complaint-filters">
            {["All", "Submitted", "In Progress", "Resolved"].map(
              (status) => (
                <button
                  key={status}
                  className={
                    filter === status
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* Complaints */}
          <div className="complaints-list">
            {filteredComplaints.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={40} />
                <h3>No complaints found</h3>
                <p>
                  There are no complaints in this category.
                </p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  className="admin-complaint-card"
                  key={complaint.id}
                >
                  <div className="complaint-card-top">
                    <div>
                      <div className="complaint-title-row">
                        <h3>
                          {complaint.issue ||
                            complaint.category ||
                            "Student Complaint"}
                        </h3>

                        <span
                          className={`priority-badge ${getPriorityClass(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority || "Low"}
                        </span>
                      </div>

                      <p className="complaint-id">
                        {complaint.id}
                      </p>
                    </div>

                    <div className="complaint-status">
                      {getStatusIcon(complaint.status)}
                      <span>{complaint.status}</span>
                    </div>
                  </div>

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  <div className="complaint-details">
                    <div>
                      <strong>Student</strong>
                      <span>
                        {complaint.studentName || "Unknown Student"}
                      </span>
                    </div>

                    <div>
                      <strong>Student ID</strong>
                      <span>
                        {complaint.studentId || "N/A"}
                      </span>
                    </div>

                    <div>
                      <strong>Department</strong>
                      <span>
                        {complaint.department || "General"}
                      </span>
                    </div>

                    <div>
                      <strong>Location</strong>
                      <span>
                        {complaint.location || "Not specified"}
                      </span>
                    </div>

                    <div>
                      <strong>Room</strong>
                      <span>
                        {complaint.room || "N/A"}
                      </span>
                    </div>

                    <div>
                      <strong>Submitted</strong>
                      <span>
                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="complaint-actions">
                    <span>Update status:</span>

                    <button
                      className={
                        complaint.status === "Submitted"
                          ? "status-btn active"
                          : "status-btn"
                      }
                      onClick={() =>
                        updateStatus(
                          complaint.id,
                          "Submitted"
                        )
                      }
                    >
                      Submitted
                    </button>

                    <button
                      className={
                        complaint.status === "In Progress"
                          ? "status-btn active"
                          : "status-btn"
                      }
                      onClick={() =>
                        updateStatus(
                          complaint.id,
                          "In Progress"
                        )
                      }
                    >
                      In Progress
                    </button>

                    <button
                      className={
                        complaint.status === "Resolved"
                          ? "status-btn active"
                          : "status-btn"
                      }
                      onClick={() =>
                        updateStatus(
                          complaint.id,
                          "Resolved"
                        )
                      }
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminComplaints;