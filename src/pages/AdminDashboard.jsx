import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw,
  MapPin,
  TrendingUp,
  BrainCircuit,
  Wrench,
  Wifi,
  Utensils,
  Zap,
  Sparkles,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";

const COMPLAINTS_KEY = "campxComplaints";

/* =========================================
   SMART SLA
   ========================================= */

const SLA_HOURS = {
  Critical: 1,
  High: 4,
  Medium: 24,
  Low: 48,
};

function getSlaHours(priority) {
  return SLA_HOURS[priority] || SLA_HOURS.Low;
}

function getSlaInfo(complaint, now = Date.now()) {
  if (!complaint?.createdAt) {
    return {
      hours: getSlaHours(complaint?.priority),
      deadline: null,
      ageHours: 0,
      remainingHours: null,
      status: "Unknown",
    };
  }

  const created = new Date(complaint.createdAt).getTime();
  const hours = getSlaHours(complaint.priority);
  const deadline = created + hours * 60 * 60 * 1000;
  const ageHours = Math.max(
    0,
    (now - created) / (60 * 60 * 1000)
  );
  const remainingHours =
    (deadline - now) / (60 * 60 * 1000);

  if (complaint.status === "Resolved") {
    return {
      hours,
      deadline,
      ageHours,
      remainingHours,
      status: "Resolved",
    };
  }

  if (remainingHours <= 0) {
    return {
      hours,
      deadline,
      ageHours,
      remainingHours,
      status: "Breached",
    };
  }

  if (
    remainingHours <= Math.min(
      2,
      hours * 0.25
    )
  ) {
    return {
      hours,
      deadline,
      ageHours,
      remainingHours,
      status: "Due Soon",
    };
  }

  return {
    hours,
    deadline,
    ageHours,
    remainingHours,
    status: "On Track",
  };
}

function formatDuration(hours) {
  if (hours < 1) {
    return `${Math.max(
      1,
      Math.round(hours * 60)
    )}m`;
  }

  if (hours < 24) {
    return `${Math.floor(hours)}h ${Math.round(
      (hours % 1) * 60
    )}m`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);

  return `${days}d ${remainingHours}h`;
}

function formatSlaDeadline(deadline) {
  if (!deadline) return "Not available";

  return new Date(deadline).toLocaleString(
    [],
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


/* =========================================
   ADMIN DASHBOARD
   ========================================= */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [now, setNow] = useState(Date.now());

  // Read the currently logged-in faculty account.
  // Super Admin and normal Admin use the same dashboard UI,
  // but Super Admin gets the extra Add Faculty option.
  const storedUser = localStorage.getItem("campx_user");

  let adminUser = {};

  try {
    adminUser = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Invalid CAMPX user data:", error);
  }

 const isSuperAdmin =
  adminUser?.role === "SUPER_ADMIN";

const adminSection =
  adminUser?.adminSection ||
  adminUser?.admin_section ||
  "Administration";

const adminName =
  adminUser?.name ||
  "Admin";

  /* =========================
     LOAD COMPLAINTS
  ========================= */

  const loadComplaints = () => {
    try {
      const saved =
        localStorage.getItem(
          COMPLAINTS_KEY
        );

      if (!saved) {
        setComplaints([]);
        return;
      }

      const parsed = JSON.parse(saved);

      setComplaints(
        Array.isArray(parsed)
          ? parsed
          : []
      );
    } catch (error) {
      console.error(
        "Error loading complaints:",
        error
      );

      setComplaints([]);
    }
  };

  /* =========================
     LIVE COMPLAINT UPDATES
  ========================= */

  useEffect(() => {
    loadComplaints();

    window.addEventListener(
      "storage",
      loadComplaints
    );

    window.addEventListener(
      "campx-complaint-updated",
      loadComplaints
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadComplaints
      );

      window.removeEventListener(
        "campx-complaint-updated",
        loadComplaints
      );
    };
  }, []);

  /* =========================
     SMART SLA CLOCK
     + AUTO ESCALATION
  ========================= */

  useEffect(() => {
    const timer = window.setInterval(
      () => {
        setNow(Date.now());
      },
      30000
    );

    return () =>
      window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!complaints.length) return;

    const escalations = [];
    let changed = false;

    const updated = complaints.map(
      (complaint) => {
        if (
          complaint.status ===
          "Resolved"
        ) {
          return complaint;
        }

        const sla = getSlaInfo(
          complaint,
          now
        );

        if (
          sla.status === "Breached" &&
          !complaint.slaBreached &&
          !complaint.slaEscalatedAt
        ) {
          changed = true;

          escalations.push(
            complaint
          );

          return {
            ...complaint,

            slaBreached: true,

            slaStatus: "Breached",

            slaEscalatedAt:
              new Date(
                now
              ).toISOString(),

            escalationLevel:
              "Admin Escalation",

            updatedAt:
              new Date(
                now
              ).toISOString(),
          };
        }

        if (
          complaint.slaBreached &&
          complaint.slaStatus !==
            "Breached"
        ) {
          changed = true;

          return {
            ...complaint,
            slaStatus: "Breached",
          };
        }

        return complaint;
      }
    );

    if (changed) {
      setComplaints(updated);

      localStorage.setItem(
        COMPLAINTS_KEY,
        JSON.stringify(updated)
      );

      window.dispatchEvent(
        new Event(
          "campx-complaint-updated"
        )
      );

      escalations.forEach(
        (complaint) => {
          addNotification({
            audience: "student",
            studentId:
              complaint.studentId,
            type: "complaint",
            title:
              "Complaint SLA Breached",
            message: `Your complaint ${complaint.id} has crossed its SLA deadline and has been escalated to the administration.`,
            relatedId:
              complaint.id,
            status: "Escalated",
          });
        }
      );
    }
  }, [complaints, now]);

  /* =========================
     UPDATE COMPLAINT STATUS
  ========================= */

  const updateStatus = (
    id,
    newStatus
  ) => {
    const complaint =
      complaints.find(
        (item) =>
          item.id === id
      );

    const updated =
      complaints.map(
        (complaint) =>
          complaint.id === id
            ? {
                ...complaint,
                status:
                  newStatus,
                updatedAt:
                  new Date().toISOString(),
              }
            : complaint
      );

    setComplaints(updated);

    localStorage.setItem(
      COMPLAINTS_KEY,
      JSON.stringify(updated)
    );

    if (complaint) {
      addNotification({
        audience: "student",
        studentId:
          complaint.studentId,
        type: "complaint",
        title: `Complaint ${newStatus}`,
        message: `Your complaint ${complaint.id} is now ${newStatus}.`,
        relatedId:
          complaint.id,
        status: newStatus,
      });
    }

    window.dispatchEvent(
      new Event(
        "campx-complaint-updated"
      )
    );
  };

  /* =========================
     BASIC STATISTICS
  ========================= */

  const total =
    complaints.length;

  const submitted =
    complaints.filter(
      (c) =>
        c.status === "Submitted"
    ).length;

  const inProgress =
    complaints.filter(
      (c) =>
        c.status ===
        "In Progress"
    ).length;

  const resolved =
    complaints.filter(
      (c) =>
        c.status === "Resolved"
    ).length;

  const highPriority =
    complaints.filter(
      (c) =>
        c.priority === "High" ||
        c.priority === "Critical"
    ).length;

  /* =========================
     RECURRING ISSUE DETECTION
  ========================= */

  const recurringIssues =
    useMemo(() => {
      const groups = {};

      complaints.forEach(
        (complaint) => {
          const key = `${complaint.issue}|${complaint.location}`;

          if (!groups[key]) {
            groups[key] = {
              issue:
                complaint.issue,
              location:
                complaint.location,
              department:
                complaint.department,
              count: 0,
              complaints: [],
            };
          }

          groups[key].count += 1;

          groups[key].complaints.push(
            complaint
          );
        }
      );

      return Object.values(
        groups
      )
        .filter(
          (group) =>
            group.count >= 2
        )
        .sort(
          (a, b) =>
            b.count - a.count
        );
    }, [complaints]);

  /* =========================
     CAMPUS HEATMAP
  ========================= */

  const heatmapData =
    useMemo(() => {
      const locations = [
        "Hostel A",
        "Hostel B",
        "Academic Block",
        "Library",
        "Main Mess",
      ];

      return locations.map(
        (location) => {
          const count =
            complaints.filter(
              (complaint) =>
                complaint.location ===
                location
            ).length;

          return {
            location,
            count,
          };
        }
      );
    }, [complaints]);

  const maxHeat = Math.max(
    ...heatmapData.map(
      (item) => item.count
    ),
    1
  );

  return (
    <div className="app-layout">

      <Sidebar admin />

      <main className="main-content">

        <Topbar
          title={
            isSuperAdmin
              ? "Super Admin Dashboard"
              : "Admin Dashboard"
          }
        />

        <div className="content">

          {/* =========================
              HEADER
          ========================= */}

          <section className="welcome-section">

            <div>

              <p className="eyebrow">
                CAMPX ADMINISTRATION
              </p>

              <h1>
                {isSuperAdmin
                  ? "Super Administration"
                  : adminSection}
              </h1>

              <p>
                Welcome, {adminName}. Manage complaints,
                requests and campus operations from one place.
              </p>

            </div>

            <div className="dashboard-actions">

  <button
    className="secondary-btn"
    onClick={loadComplaints}
  >
    <RefreshCw size={16} />
    Refresh
  </button>

  {isSuperAdmin ? (
    <button
      className="primary-btn"
      onClick={() => navigate("/admin/faculty/add")}
    >
      + Add Faculty
    </button>
  ) : (
    <button
      className="primary-btn"
      onClick={() => navigate("/admin/students")}
    >
      + Add Students
    </button>
  )}

</div>
          </section>


          {/* =========================
              STATISTICS
          ========================= */}

          <section className="stats-grid">

            <AdminStat
              icon={
                <ClipboardList
                  size={21}
                />
              }
              title="Total Complaints"
              value={total}
              type="blue"
            />

            <AdminStat
              icon={
                <Clock size={21} />
              }
              title="Pending"
              value={
                submitted +
                inProgress
              }
              type="orange"
            />

            <AdminStat
              icon={
                <AlertTriangle
                  size={21}
                />
              }
              title="High Priority"
              value={
                highPriority
              }
              type="red"
            />

            <AdminStat
              icon={
                <AlertTriangle
                  size={21}
                />
              }
              title="SLA Breached"
              value={
                complaints.filter(
                  (c) =>
                    getSlaInfo(
                      c,
                      now
                    ).status ===
                    "Breached"
                ).length
              }
              type="red"
            />

            <AdminStat
              icon={
                <Clock size={21} />
              }
              title="Due Soon"
              value={
                complaints.filter(
                  (c) =>
                    getSlaInfo(
                      c,
                      now
                    ).status ===
                    "Due Soon"
                ).length
              }
              type="orange"
            />

            <AdminStat
              icon={
                <CheckCircle2
                  size={21}
                />
              }
              title="Resolved"
              value={resolved}
              type="green"
            />

          </section>


          {/* =========================
              SMART SLA
          ========================= */}

          <section className="panel smart-sla-panel">

            <div className="panel-header">

              <div>

                <h3>
                  Smart SLA Monitor
                </h3>

                <p>
                  Automatic deadlines
                  and escalation for
                  complaints
                </p>

              </div>

              <Clock size={20} />

            </div>


            <div className="sla-summary-grid">

              {[
                [
                  "Critical",
                  "1 hour",
                ],
                [
                  "High",
                  "4 hours",
                ],
                [
                  "Medium",
                  "24 hours",
                ],
                [
                  "Low",
                  "48 hours",
                ],
              ].map(
                ([
                  priority,
                  deadline,
                ]) => (

                  <div
                    className="sla-rule"
                    key={priority}
                  >

                    <span
                      className={`priority-badge ${priority.toLowerCase()}`}
                    >
                      {priority}
                    </span>

                    <strong>
                      {deadline}
                    </strong>

                    <small>
                      resolution target
                    </small>

                  </div>

                )
              )}

            </div>


            <div className="sla-alert-banner">

              <AlertTriangle
                size={18}
              />

              <div>

                <strong>

                  {
                    complaints.filter(
                      (c) =>
                        getSlaInfo(
                          c,
                          now
                        ).status ===
                        "Breached"
                    ).length
                  }{" "}
                  complaint(s)
                  currently breached

                </strong>

                <p>
                  CampX automatically
                  flags overdue
                  complaints and
                  escalates them to
                  administration.
                </p>

              </div>

            </div>

          </section>


          {/* =========================
              OVERVIEW + CAMPUS PULSE
          ========================= */}

          <section className="dashboard-grid">

            <div className="panel">

              <div className="panel-header">

                <div>

                  <h3>
                    Complaint Overview
                  </h3>

                  <p>
                    Current campus
                    support workload
                  </p>

                </div>

                <ClipboardList
                  size={20}
                />

              </div>


              <div className="admin-overview">

                <div className="overview-row">

                  <span>
                    Submitted
                  </span>

                  <strong>
                    {submitted}
                  </strong>

                </div>


                <div className="overview-row">

                  <span>
                    In Progress
                  </span>

                  <strong>
                    {inProgress}
                  </strong>

                </div>


                <div className="overview-row">

                  <span>
                    Resolved
                  </span>

                  <strong>
                    {resolved}
                  </strong>

                </div>

              </div>

            </div>


            <div className="panel">

              <div className="panel-header">

                <div>

                  <h3>
                    Campus Pulse
                  </h3>

                  <p>
                    AI-generated
                    operational
                    insight
                  </p>

                </div>

                <Sparkles size={20} />

              </div>


              <div className="pulse-card">

                <div className="pulse-number">
                  {total}
                </div>

                <div>

                  <strong>
                    Active complaints
                  </strong>

                  <p>

                    {highPriority > 0
                      ? `${highPriority} high-priority issue${
                          highPriority >
                          1
                            ? "s"
                            : ""
                        } require attention.`
                      : "No high-priority complaints currently require attention."}

                  </p>

                </div>

              </div>


              <div className="insight">

                💡{" "}

                <strong>
                  CampX Insight:
                </strong>{" "}

                {recurringIssues.length >
                0
                  ? `A recurring issue has been detected in ${recurringIssues[0].location}.`
                  : total === 0
                  ? "No complaints have been submitted yet."
                  : "Review pending complaints and assign them to the appropriate department."}

              </div>

            </div>

          </section>


          {/* =========================
              AI RECURRING ISSUES
          ========================= */}

          <section className="panel intelligence-panel">

            <div className="panel-header">

              <div className="intelligence-heading">

                <div className="intelligence-icon">

                  <BrainCircuit
                    size={20}
                  />

                </div>

                <div>

                  <h3>
                    CampX Intelligence
                  </h3>

                  <p>
                    AI-powered recurring
                    issue detection
                  </p>

                </div>

              </div>


              <span className="ai-live-badge">

                <span className="live-dot"></span>

                LIVE

              </span>

            </div>


            {recurringIssues.length ===
            0 ? (

              <div className="no-recurring">

                <CheckCircle2
                  size={25}
                />

                <div>

                  <strong>
                    No recurring issues
                    detected
                  </strong>

                  <p>
                    CampX will
                    automatically
                    identify repeated
                    problems as
                    complaints are
                    submitted.
                  </p>

                </div>

              </div>

            ) : (

              <div className="recurring-list">

                {recurringIssues.map(
                  (
                    issue,
                    index
                  ) => (

                    <div
                      className="recurring-card"
                      key={`${issue.issue}-${issue.location}`}
                    >

                      <div className="recurring-left">

                        <div className="recurring-alert">

                          <TrendingUp
                            size={19}
                          />

                        </div>


                        <div>

                          <div className="recurring-title">

                            <strong>
                              Recurring Issue
                              Detected
                            </strong>

                            <span>
                              #{index + 1}
                            </span>

                          </div>


                          <h4>
                            {issue.issue}
                          </h4>


                          <div className="recurring-location">

                            <MapPin
                              size={13}
                            />

                            {issue.location}

                            <span>
                              •
                            </span>

                            {issue.department}

                          </div>

                        </div>

                      </div>


                      <div className="recurring-count">

                        <strong>
                          {issue.count}
                        </strong>

                        <span>
                          reports
                        </span>

                      </div>

                    </div>

                  )
                )}


                <div className="recommendation">

                  <BrainCircuit
                    size={17}
                  />

                  <div>

                    <strong>
                      CampX Recommendation
                    </strong>

                    <p>
                      Repeated complaints
                      at the same location
                      may indicate an
                      underlying
                      infrastructure
                      problem. Consider
                      inspecting the area
                      instead of resolving
                      each complaint
                      separately.
                    </p>

                  </div>

                </div>

              </div>

            )}

          </section>


          {/* =========================
              CAMPUS HEATMAP
          ========================= */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <h3>
                  Campus Problem
                  Heatmap
                </h3>

                <p>
                  Complaint concentration
                  by location
                </p>

              </div>

              <MapPin size={20} />

            </div>


            <div className="heatmap">

              {heatmapData.map(
                (item) => {

                  const percentage =
                    (item.count /
                      maxHeat) *
                    100;

                  return (

                    <div
                      className="heatmap-row"
                      key={item.location}
                    >

                      <div className="heatmap-location">

                        <LocationIcon
                          location={
                            item.location
                          }
                        />

                        <span>
                          {item.location}
                        </span>

                      </div>


                      <div className="heat-bar-container">

                        <div className="heat-bar">

                          <div
                            className={`heat-fill ${
                              item.count ===
                              0
                                ? "empty"
                                : item.count ===
                                  maxHeat
                                ? "hot"
                                : "warm"
                            }`}

                            style={{
                              width:
                                item.count ===
                                0
                                  ? "4%"
                                  : `${percentage}%`,
                            }}
                          />

                        </div>

                      </div>


                      <strong className="heat-count">
                        {item.count}
                      </strong>

                    </div>

                  );

                }
              )}

            </div>


            <div className="heat-legend">

              <span>
                <i className="legend-dot low"></i>
                Low
              </span>

              <span>
                <i className="legend-dot medium"></i>
                Moderate
              </span>

              <span>
                <i className="legend-dot high"></i>
                High
              </span>

            </div>

          </section>


          {/* =========================
              LIVE COMPLAINT QUEUE
          ========================= */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <h3>
                  Live Complaint Queue
                </h3>

                <p>
                  Complaints submitted
                  by students
                </p>

              </div>

              <Users size={20} />

            </div>


            {complaints.length ===
            0 ? (

              <div className="empty-state">

                <ClipboardList
                  size={35}
                />

                <h3>
                  No complaints yet
                </h3>

                <p>
                  Student complaints
                  will appear here
                  automatically.
                </p>

              </div>

            ) : (

              <div className="admin-complaints">

                {complaints.map(
                  (complaint) => (

                    <div
                      className="admin-complaint"
                      key={
                        complaint.id
                      }
                    >

                      <div className="complaint-main">

                        <div className="complaint-icon orange">

                          <AlertTriangle
                            size={18}
                          />

                        </div>


                        <div className="complaint-info">

                          <strong>

                            {complaint.issue ||
                              complaint.category ||
                              "Student Complaint"}

                          </strong>


                          <span>

                            {
                              complaint.studentName
                            }

                            {" • "}

                            {
                              complaint.location
                            }

                            {complaint.room &&
                            complaint.room !==
                              "Not detected"
                              ? ` • Room ${complaint.room}`
                              : ""}

                          </span>


                          <small>

                            ID:{" "}

                            {
                              complaint.id
                            }

                          </small>


                          {(() => {

                            const sla =
                              getSlaInfo(
                                complaint,
                                now
                              );

                            return (

                              <small className="sla-detail">

                                Age:{" "}
                                {formatDuration(
                                  sla.ageHours
                                )}

                                {" • Target: "}

                                {sla.hours}h

                                {" • Deadline: "}

                                {formatSlaDeadline(
                                  sla.deadline
                                )}

                              </small>

                            );

                          })()}

                        </div>

                      </div>


                      <div className="admin-meta">

                        {(() => {

                          const sla =
                            getSlaInfo(
                              complaint,
                              now
                            );

                          return (

                            <div
                              className={`sla-badge ${sla.status
                                .toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )}`}

                              title={
                                sla.status ===
                                "Breached"
                                  ? `SLA deadline: ${formatSlaDeadline(
                                      sla.deadline
                                    )}`
                                  : `SLA: ${sla.hours} hour(s)`
                              }
                            >

                              <Clock
                                size={13}
                              />

                              {sla.status ===
                              "Breached"
                                ? `Breached • ${formatDuration(
                                    Math.max(
                                      0,
                                      sla.ageHours -
                                        sla.hours
                                    )
                                  )} overdue`

                                : sla.status ===
                                  "Due Soon"

                                ? `Due soon • ${formatDuration(
                                    Math.max(
                                      0,
                                      sla.remainingHours
                                    )
                                  )}`

                                : sla.status ===
                                  "Resolved"

                                ? "SLA complete"

                                : `On track • ${formatDuration(
                                    Math.max(
                                      0,
                                      sla.remainingHours
                                    )
                                  )}`}

                            </div>

                          );

                        })()}


                        <span
                          className={`priority-badge ${
                            complaint.priority ===
                            "Critical"
                              ? "critical"
                              : complaint.priority ===
                                "High"
                              ? "high"
                              : "medium"
                          }`}
                        >

                          {complaint.priority ||
                            "Low"}

                        </span>


                        <span className="department-badge">

                          {complaint.department ||
                            "General"}

                        </span>


                        <select
                          value={
                            complaint.status ||
                            "Submitted"
                          }

                          onChange={(e) =>
                            updateStatus(
                              complaint.id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Submitted">
                            Submitted
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Resolved">
                            Resolved
                          </option>

                        </select>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}


/* =========================================
   ADMIN STAT
========================================= */

function AdminStat({
  icon,
  title,
  value,
  type,
}) {
  return (

    <div className="stat-card">

      <div className="stat-card-top">

        <div
          className={`stat-icon ${type}`}
        >
          {icon}
        </div>

        <span className="stat-title">
          {title}
        </span>

      </div>


      <div className="stat-value">
        {value}
      </div>


      <div className="stat-subtitle">
        Live campus data
      </div>

    </div>

  );
}


/* =========================================
   LOCATION ICON
========================================= */

function LocationIcon({
  location,
}) {

  if (
    location === "Hostel A" ||
    location === "Hostel B"
  ) {
    return (
      <Wrench size={17} />
    );
  }


  if (
    location ===
    "Academic Block"
  ) {
    return (
      <Zap size={17} />
    );
  }


  if (
    location === "Library"
  ) {
    return (
      <Wifi size={17} />
    );
  }


  if (
    location === "Main Mess"
  ) {
    return (
      <Utensils size={17} />
    );
  }


  return (
    <MapPin size={17} />
  );
}