import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";

const COMPLAINTS_KEY = "campxComplaints";
const REQUESTS_KEY = "campxRequests";

const CURRENT_STUDENT = {
  name: "Adya Dash",
  id: "CX2026001",
  department: "CSE",
  semester: "6th Semester",
};

/* =========================================================
   CAMPY AI ANALYSIS
========================================================= */

function analyzeComplaint(text) {
  const value = text.toLowerCase();

  /* ---------- ACADEMIC / TIMETABLE REQUEST ---------- */

  const academicKeywords = [
    "timetable",
    "time table",
    "time-table",
    "class schedule",
    "class timetable",
    "my classes",
    "next class",
    "classes tomorrow",
    "class tomorrow",
    "today's class",
    "tomorrow's class",
    "tomorrow class",
    "schedule tomorrow",
    "academic schedule",
  ];

  if (academicKeywords.some((word) => value.includes(word))) {
    return {
      type: "request",
      category: "Academic Services",
      issue: "Timetable Request",
      location: "Academic Block",
      room: "Not detected",
      priority: "Low",
      duration: "Not specified",
      department: "Academic Office",
      action: "Check the student's timetable and provide the class schedule.",
    };
  }

  /* ---------- DOCUMENT REQUEST ---------- */

  const documentKeywords = [
    "bonafide",
    "certificate",
    "document",
    "documents",
    "fee receipt",
    "character certificate",
    "academic document",
    "transcript",
  ];

  if (documentKeywords.some((word) => value.includes(word))) {
    return {
      type: "request",
      category: "Student Services",
      issue: "Document / Certificate Request",
      location: "Administration Office",
      room: "Not detected",
      priority: "Low",
      duration: "Not specified",
      department: "Student Administration",
      action: "Verify the student's request and process the required document.",
    };
  }

  /* ---------- COMPLAINT CATEGORY ---------- */

  let category = "General Campus";
  let issue = "General Complaint";
  let department = "Campus Administration";

  if (
    value.includes("tap") ||
    value.includes("leak") ||
    value.includes("water") ||
    value.includes("plumb")
  ) {
    category = "Hostel Maintenance";
    issue = "Water / Plumbing Issue";
    department = "Maintenance";
  } else if (
    value.includes("wifi") ||
    value.includes("internet") ||
    value.includes("network")
  ) {
    category = "IT Support";
    issue = "Internet / Wi-Fi Issue";
    department = "IT Support";
  } else if (
    value.includes("food") ||
    value.includes("mess") ||
    value.includes("meal")
  ) {
    category = "Mess & Food";
    issue = "Mess / Food Issue";
    department = "Mess Management";
  } else if (
    value.includes("light") ||
    value.includes("fan") ||
    value.includes("electric")
  ) {
    category = "Electrical Maintenance";
    issue = "Electrical Issue";
    department = "Electrical Maintenance";
  } else if (
    value.includes("clean") ||
    value.includes("garbage") ||
    value.includes("dirty")
  ) {
    category = "Cleanliness";
    issue = "Cleanliness Issue";
    department = "Housekeeping";
  }

  /* ---------- LOCATION ---------- */

  let location = "Not detected";

  if (value.includes("hostel a")) {
    location = "Hostel A";
  } else if (value.includes("hostel b")) {
    location = "Hostel B";
  } else if (value.includes("hostel")) {
    location = "Hostel";
  } else if (value.includes("academic block")) {
    location = "Academic Block";
  } else if (value.includes("library")) {
    location = "Library";
  } else if (value.includes("mess")) {
    location = "Main Mess";
  }

  /* ---------- ROOM ---------- */

  const roomMatch = value.match(
    /(?:room|rm)\s*([a-z]?\s*-?\s*\d{1,4})/i
  );

  const room = roomMatch
    ? roomMatch[1].replace(/\s+/g, "")
    : "Not detected";

  /* ---------- DURATION ---------- */

  const durationMatch = value.match(
    /(\d+)\s*(hour|hours|day|days|week|weeks)/
  );

  const duration = durationMatch
    ? `${durationMatch[1]} ${durationMatch[2]}`
    : "Not specified";

  /* ---------- PRIORITY ---------- */

  let priority = "Medium";

  if (
    value.includes("urgent") ||
    value.includes("emergency") ||
    value.includes("danger") ||
    value.includes("flood") ||
    value.includes("fire")
  ) {
    priority = "Critical";
  } else if (
    value.includes("4 days") ||
    value.includes("5 days") ||
    value.includes("week") ||
    value.includes("weeks") ||
    value.includes("cannot") ||
    value.includes("not working")
  ) {
    priority = "High";
  }

  return {
    type: "complaint",
    category,
    issue,
    location,
    room,
    priority,
    duration,
    department,
    action: `Route the complaint to ${department} for resolution.`,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AIComplaint() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState("");

  const handleAnalyze = () => {
    if (!text.trim()) return;

    const result = analyzeComplaint(text.trim());
    setAnalysis(result);
  };

  const handleSubmit = () => {
    if (!analysis || !text.trim()) return;

    const now = new Date().toISOString();

    /* =====================================================
       REQUEST
    ===================================================== */

    if (analysis.type === "request") {
      const newRequest = {
        id: `REQ-${Date.now()}`,
        studentName: CURRENT_STUDENT.name,
        studentId: CURRENT_STUDENT.id,
        type: analysis.issue,
        purpose: text.trim(),
        category: analysis.category,
        department: analysis.department,
        status: "Submitted",
        createdAt: now,
      };

      const existing = JSON.parse(
        localStorage.getItem(REQUESTS_KEY) || "[]"
      );

      localStorage.setItem(
        REQUESTS_KEY,
        JSON.stringify([newRequest, ...existing])
      );

      addNotification({
        audience: "admin",
        type: "request",
        title: "New Student Request",
        message: `${newRequest.studentName} submitted a ${newRequest.type} request.`,
        studentId: newRequest.studentId,
        relatedId: newRequest.id,
        status: "Submitted",
      });

      window.dispatchEvent(new Event("campx-request-updated"));

      setSubmittedId(newRequest.id);
      setSubmitted(true);
      return;
    }

    /* =====================================================
       COMPLAINT
    ===================================================== */

    const newComplaint = {
      id: `CMP-${Date.now()}`,
      studentName: CURRENT_STUDENT.name,
      studentId: CURRENT_STUDENT.id,

      complaint: text.trim(),
      description: text.trim(),

      category: analysis.category,
      issue: analysis.issue,
      location: analysis.location,
      room: analysis.room,

      priority: analysis.priority,
      duration: analysis.duration,
      department: analysis.department,

      status: "Submitted",

      createdAt: now,
      updatedAt: now,
    };

    const existing = JSON.parse(
      localStorage.getItem(COMPLAINTS_KEY) || "[]"
    );

    localStorage.setItem(
      COMPLAINTS_KEY,
      JSON.stringify([newComplaint, ...existing])
    );

    addNotification({
      audience: "admin",
      type: "complaint",
      title: "New AI Complaint",
      message: `${newComplaint.studentName} submitted a ${newComplaint.issue} complaint.`,
      studentId: newComplaint.studentId,
      relatedId: newComplaint.id,
      status: "Submitted",
    });

    window.dispatchEvent(new Event("campx-complaint-updated"));

    setSubmittedId(newComplaint.id);
    setSubmitted(true);
  };

  /* =====================================================
     SUCCESS SCREEN
  ===================================================== */

  if (submitted) {
    const isRequest = analysis?.type === "request";

    return (
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Topbar title="CAMPY AI Assistant" />

          <div className="content">
            <div className="ai-success-card">
              <div className="success-icon">
                <CheckCircle2 size={42} />
              </div>

              <p className="eyebrow">CAMPY AI ASSISTANT</p>

              <h1>
                {isRequest
                  ? "Request submitted successfully"
                  : "Complaint submitted successfully"}
              </h1>

              <p>
                CAMPY has analyzed your submission and routed it to the
                appropriate campus department.
              </p>

              <div className="success-id">
                <span>
                  {isRequest ? "Request ID" : "Complaint ID"}
                </span>

                <strong>{submittedId}</strong>
              </div>

              <div className="success-actions">
                <Link
                  to={isRequest ? "/requests" : "/complaints"}
                  className="primary-btn"
                >
                  View {isRequest ? "Requests" : "Complaints"}
                  <ArrowRight size={17} />
                </Link>

                <button
                  className="secondary-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setText("");
                    setAnalysis(null);
                    setSubmittedId("");
                  }}
                >
                  Submit Another
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     MAIN SCREEN
  ===================================================== */

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Topbar title="CAMPY AI Assistant" />

        <div className="content">
          <section className="ai-assistant-header">
            <div className="ai-avatar">
              <Bot size={32} />
            </div>

            <div>
              <p className="eyebrow">CAMPX AI</p>

              <h1>
                Meet <span>CAMPY</span>
              </h1>

              <p>
                Your Campus AI Assistant
              </p>
            </div>
          </section>

          <section className="campy-welcome-card">
            <div className="campy-welcome-icon">
              <Sparkles size={23} />
            </div>

            <div>
              <h3>Hi! I'm CAMPY 👋</h3>

              <p>
                Tell me what you need in your own words. I can understand
                complaints and requests and route them to the right campus
                department.
              </p>
            </div>
          </section>

          <section className="ai-complaint-layout">
            {/* LEFT */}

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Tell CAMPY what you need</h3>

                  <p>
                    No complicated forms. Just describe your problem.
                  </p>
                </div>

                <Bot size={21} />
              </div>

              <textarea
                className="ai-textarea"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setAnalysis(null);
                }}
                placeholder="Example: The Wi-Fi has not been working in Hostel A Room 204 since morning..."
              />

              <div className="ai-examples">
                <span>Try:</span>

                <button
                  onClick={() =>
                    setText(
                      "The Wi-Fi has not been working in Hostel A Room 204 since morning."
                    )
                  }
                >
                  Wi-Fi problem
                </button>

                <button
                  onClick={() =>
                    setText(
                      "I need a bonafide certificate for my internship."
                    )
                  }
                >
                  Bonafide certificate
                </button>

                <button
                  onClick={() =>
                    setText(
                      "Show me my class timetable for tomorrow."
                    )
                  }
                >
                  Timetable
                </button>
              </div>

              <button
                className="primary-btn ai-analyze-btn"
                onClick={handleAnalyze}
                disabled={!text.trim()}
              >
                <Send size={17} />
                Ask CAMPY
              </button>
            </div>

            {/* RIGHT */}

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>CAMPY Analysis</h3>

                  <p>
                    AI-detected information
                  </p>
                </div>

                <Sparkles size={20} />
              </div>

              {!analysis ? (
                <div className="ai-empty">
                  <Bot size={42} />

                  <h3>Waiting for your message</h3>

                  <p>
                    CAMPY will identify the type, category, priority and
                    responsible department.
                  </p>
                </div>
              ) : (
                <div className="ai-analysis">
                  <div className="analysis-type">
                    {analysis.type === "request" ? (
                      <FileText size={19} />
                    ) : (
                      <Wrench size={19} />
                    )}

                    <strong>
                      {analysis.type === "request"
                        ? "Student Request"
                        : "Campus Complaint"}
                    </strong>
                  </div>

                  <AnalysisRow
                    label="Category"
                    value={analysis.category}
                  />

                  <AnalysisRow
                    label="Issue"
                    value={analysis.issue}
                  />

                  <AnalysisRow
                    label="Location"
                    value={analysis.location}
                  />

                  <AnalysisRow
                    label="Room"
                    value={analysis.room}
                  />

                  <AnalysisRow
                    label="Department"
                    value={analysis.department}
                  />

                  {analysis.type === "complaint" && (
                    <>
                      <AnalysisRow
                        label="Priority"
                        value={analysis.priority}
                        priority
                      />

                      <AnalysisRow
                        label="Duration"
                        value={analysis.duration}
                      />
                    </>
                  )}

                  <div className="ai-action-box">
                    <AlertTriangle size={17} />

                    <div>
                      <strong>CAMPY Action</strong>

                      <p>{analysis.action}</p>
                    </div>
                  </div>

                  <button
                    className="primary-btn"
                    onClick={handleSubmit}
                  >
                    <CheckCircle2 size={17} />

                    {analysis.type === "request"
                      ? "Submit Request"
                      : "Submit Complaint"}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   ANALYSIS ROW
========================================================= */

function AnalysisRow({ label, value, priority = false }) {
  return (
    <div className="analysis-row">
      <span>{label}</span>

      <strong
        className={
          priority
            ? `analysis-priority ${String(value).toLowerCase()}`
            : ""
        }
      >
        {value}
      </strong>
    </div>
  );
}