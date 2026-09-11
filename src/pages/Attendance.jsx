import { useEffect, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  BookOpen,
  Bell,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getNotifications } from "../notificationStorage";

const ATTENDANCE_KEY = "campx_attendance";
const CURRENT_STUDENT_ID = "CX2026001";

/* =========================================================
   DEFAULT ATTENDANCE
========================================================= */

const DEFAULT_ATTENDANCE = [
  {
    id: "sub1",
    subject: "Data Base Management System",
    code: "DBMS",
    faculty: "Prof. S. Das",
    present: 28,
    total: 32,
  },
  {
    id: "sub2",
    subject: "Computer Networks",
    code: "CN",
    faculty: "Prof. R. Mishra",
    present: 24,
    total: 30,
  },
  {
    id: "sub3",
    subject: "Artificial Intelligence",
    code: "AI",
    faculty: "Prof. P. Sahu",
    present: 27,
    total: 30,
  },
  {
    id: "sub4",
    subject: "Software Engineering",
    code: "SE",
    faculty: "Prof. A. Rout",
    present: 21,
    total: 30,
  },
  {
    id: "sub5",
    subject: "Environmental Engineering",
    code: "EE",
    faculty: "Prof. M. Panda",
    present: 25,
    total: 30,
  },
];

/* =========================================================
   CALCULATE ATTENDANCE %
========================================================= */

function calculatePercentage(present, total) {
  if (!total) return 0;

  return Math.round(
    (Number(present) / Number(total)) * 100
  );
}

/* =========================================================
   CALCULATE FINE

   75% or above = ₹0
   Every 1% below 75% = ₹50

   74% = ₹50
   73% = ₹100
   72% = ₹150
   70% = ₹250
   60% = ₹750
========================================================= */

function calculateFine(attendancePercentage) {
  if (attendancePercentage >= 75) {
    return 0;
  }

  return (75 - attendancePercentage) * 50;
}

/* =========================================================
   GET CURRENT STUDENT ATTENDANCE

   Supports:
   1. New multi-student format
   2. Old single-student format
========================================================= */

function getCurrentStudentAttendance(savedData) {
  if (!Array.isArray(savedData) || savedData.length === 0) {
    return DEFAULT_ATTENDANCE;
  }

  /* -------------------------------------------------------
     NEW FORMAT

     [
       {
         studentId: "CX2026001",
         subjects: [...]
       }
     ]
  ------------------------------------------------------- */

  const studentRecord = savedData.find(
    (record) =>
      record &&
      record.studentId === CURRENT_STUDENT_ID &&
      Array.isArray(record.subjects)
  );

  if (studentRecord) {
    return studentRecord.subjects;
  }

  /* -------------------------------------------------------
     OLD FORMAT

     [
       {
         id,
         subject,
         code,
         present,
         total
       }
     ]
  ------------------------------------------------------- */

  const looksLikeSubjectArray = savedData.every(
    (item) =>
      item &&
      typeof item === "object" &&
      ("subject" in item || "code" in item) &&
      ("present" in item || "total" in item)
  );

  if (looksLikeSubjectArray) {
    return savedData;
  }

  /* -------------------------------------------------------
     If current student has no attendance record yet
  ------------------------------------------------------- */

  return DEFAULT_ATTENDANCE;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Attendance() {
  const [attendance, setAttendance] = useState(
    DEFAULT_ATTENDANCE
  );

  const [notifications, setNotifications] = useState([]);

  /* =========================================================
     LOAD ATTENDANCE
  ========================================================= */

  const loadAttendance = () => {
    try {
      const saved = localStorage.getItem(
        ATTENDANCE_KEY
      );

      if (!saved) {
        setAttendance(DEFAULT_ATTENDANCE);
        return;
      }

      const parsed = JSON.parse(saved);

      const currentStudentAttendance =
        getCurrentStudentAttendance(parsed);

      setAttendance(currentStudentAttendance);
    } catch (error) {
      console.error(
        "Error loading attendance:",
        error
      );

      setAttendance(DEFAULT_ATTENDANCE);
    }
  };

  /* =========================================================
     LOAD NOTIFICATIONS
  ========================================================= */

  const loadNotifications = () => {
    try {
      const studentNotifications =
        getNotifications("student").filter(
          (notification) =>
            notification.studentId ===
            CURRENT_STUDENT_ID
        );

      setNotifications(studentNotifications);
    } catch (error) {
      console.error(
        "Error loading notifications:",
        error
      );

      setNotifications([]);
    }
  };

  /* =========================================================
     INITIAL LOAD + LIVE UPDATE
  ========================================================= */

  useEffect(() => {
    loadAttendance();
    loadNotifications();

    const handleUpdate = () => {
      loadAttendance();
      loadNotifications();
    };

    window.addEventListener(
      "storage",
      handleUpdate
    );

    window.addEventListener(
      "campx-attendance-updated",
      handleUpdate
    );

    window.addEventListener(
      "campx-notification",
      handleUpdate
    );

    const interval = setInterval(
      handleUpdate,
      2000
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleUpdate
      );

      window.removeEventListener(
        "campx-attendance-updated",
        handleUpdate
      );

      window.removeEventListener(
        "campx-notification",
        handleUpdate
      );

      clearInterval(interval);
    };
  }, []);

  /* =========================================================
     TOTAL PRESENT
  ========================================================= */

  const totalPresent = attendance.reduce(
    (sum, subject) =>
      sum + Number(subject.present || 0),
    0
  );

  /* =========================================================
     TOTAL CLASSES
  ========================================================= */

  const totalClasses = attendance.reduce(
    (sum, subject) =>
      sum + Number(subject.total || 0),
    0
  );

  /* =========================================================
     OVERALL ATTENDANCE
  ========================================================= */

  const overallPercentage =
    calculatePercentage(
      totalPresent,
      totalClasses
    );

  /* =========================================================
     TOTAL FINE

     Fine is calculated subject-wise.
  ========================================================= */

  const totalFine = attendance.reduce(
    (sum, subject) => {
      const percentage =
        calculatePercentage(
          subject.present,
          subject.total
        );

      return (
        sum + calculateFine(percentage)
      );
    },
    0
  );

  /* =========================================================
     SUBJECTS BELOW 75%
  ========================================================= */

  const subjectsBelow75 =
    attendance.filter(
      (subject) =>
        calculatePercentage(
          subject.present,
          subject.total
        ) < 75
    );

  /* =========================================================
     ATTENDANCE NOTIFICATIONS
  ========================================================= */

  const attendanceNotifications =
    notifications.filter(
      (notification) =>
        notification.type === "attendance"
    );

  const latestAttendanceNotification =
    attendanceNotifications[0];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Topbar title="Attendance" />

        <div className="content">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="welcome-section">

            <div>

              <p className="eyebrow">
                ACADEMIC SERVICES
              </p>

              <h1>
                My Attendance
              </h1>

              <p>
                Track subject-wise attendance,
                overall attendance and
                attendance fines.
              </p>

            </div>

            <div className="attendance-header-icon">
              <CalendarDays size={28} />
            </div>

          </section>


          {/* =================================================
              BELOW 75% WARNING
          ================================================= */}

          {subjectsBelow75.length > 0 && (

            <div className="attendance-warning">

              <div className="attendance-warning-icon">
                <AlertTriangle size={22} />
              </div>

              <div>

                <strong>
                  Attendance Alert
                </strong>

                <p>
                  Your attendance is below
                  {" "}75% in{" "}
                  {subjectsBelow75.length}{" "}
                  subject
                  {subjectsBelow75.length > 1
                    ? "s"
                    : ""}
                  . Your current fine is ₹
                  {totalFine}.
                  Improve your attendance
                  to reduce the fine.
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              SAFE ATTENDANCE
          ================================================= */}

          {subjectsBelow75.length === 0 && (

            <div className="attendance-success">

              <CheckCircle2 size={22} />

              <div>

                <strong>
                  Attendance is in the
                  safe zone
                </strong>

                <p>
                  Your overall attendance is{" "}
                  {overallPercentage}% and
                  your current fine is ₹0.
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              OVERVIEW CARDS
          ================================================= */}

          <section className="attendance-overview-grid">

            {/* OVERALL */}

            <div className="attendance-overview-card">

              <div className="attendance-card-icon blue">
                <TrendingUp size={21} />
              </div>

              <span>
                Overall Attendance
              </span>

              <strong>
                {overallPercentage}%
              </strong>

              <small>
                {totalPresent} /{" "}
                {totalClasses} classes
              </small>

            </div>


            {/* SUBJECTS */}

            <div className="attendance-overview-card">

              <div className="attendance-card-icon purple">
                <BookOpen size={21} />
              </div>

              <span>
                Subjects
              </span>

              <strong>
                {attendance.length}
              </strong>

              <small>
                Currently enrolled
              </small>

            </div>


            {/* BELOW 75 */}

            <div className="attendance-overview-card">

              <div className="attendance-card-icon orange">
                <AlertTriangle size={21} />
              </div>

              <span>
                Below 75%
              </span>

              <strong>
                {subjectsBelow75.length}
              </strong>

              <small>
                Need improvement
              </small>

            </div>


            {/* FINE */}

            <div className="attendance-overview-card">

              <div className="attendance-card-icon red">
                <IndianRupee size={21} />
              </div>

              <span>
                Current Fine
              </span>

              <strong>
                ₹{totalFine}
              </strong>

              <small>
                ₹50 per 1% below 75%
              </small>

            </div>

          </section>


          {/* =================================================
              SUBJECT ATTENDANCE
          ================================================= */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <h3>
                  Subject-wise Attendance
                </h3>

                <p>
                  Maintain at least 75%
                  attendance in every
                  subject.
                </p>

              </div>

              <BookOpen size={20} />

            </div>


            <div className="attendance-subject-list">

              {attendance.map(
                (subject) => {

                  const percentage =
                    calculatePercentage(
                      subject.present,
                      subject.total
                    );

                  const fine =
                    calculateFine(
                      percentage
                    );

                  const isLow =
                    percentage < 75;

                  return (

                    <div
                      className={`attendance-subject-card ${
                        isLow
                          ? "attendance-low"
                          : "attendance-safe"
                      }`}
                      key={subject.id}
                    >

                      {/* SUBJECT */}

                      <div className="attendance-subject-main">

                        <div className="subject-icon">
                          <BookOpen size={19} />
                        </div>

                        <div>

                          <strong>
                            {subject.subject}
                          </strong>

                          <span>
                            {subject.code}
                            {" • "}
                            {subject.faculty}
                          </span>

                        </div>

                      </div>


                      {/* PROGRESS */}

                      <div className="attendance-progress-section">

                        <div className="attendance-progress-top">

                          <span>
                            {subject.present} /{" "}
                            {subject.total}{" "}
                            classes
                          </span>

                          <strong
                            className={
                              isLow
                                ? "percentage-danger"
                                : "percentage-safe"
                            }
                          >
                            {percentage}%
                          </strong>

                        </div>


                        <div className="attendance-progress-bar">

                          <div
                            className={
                              isLow
                                ? "attendance-progress-fill low"
                                : "attendance-progress-fill"
                            }
                            style={{
                              width: `${Math.min(
                                percentage,
                                100
                              )}%`,
                            }}
                          />

                        </div>


                        <div className="attendance-meta">

                          {isLow ? (

                            <span className="attendance-fine-warning">

                              <AlertTriangle
                                size={13}
                              />

                              Fine: ₹{fine}

                            </span>

                          ) : (

                            <span className="attendance-safe-text">

                              <CheckCircle2
                                size={13}
                              />

                              Fine: ₹0

                            </span>

                          )}

                          <span>
                            Minimum: 75%
                          </span>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          </section>


          {/* =================================================
              FINE RULE
          ================================================= */}

          <section className="attendance-fine-rule">

            <div className="attendance-fine-rule-icon">
              <IndianRupee size={20} />
            </div>

            <div>

              <strong>
                Attendance Fine Rule
              </strong>

              <p>
                75% or above = ₹0. For every
                1% below 75%, ₹50 is added
                to the fine.
              </p>

            </div>

          </section>


          {/* =================================================
              LATEST NOTIFICATION
          ================================================= */}

          {latestAttendanceNotification && (

            <section className="attendance-notification-preview">

              <div className="attendance-notification-icon">
                <Bell size={19} />
              </div>

              <div>

                <strong>
                  {latestAttendanceNotification.title}
                </strong>

                <p>
                  {latestAttendanceNotification.message}
                </p>

              </div>

            </section>

          )}

        </div>

      </main>

    </div>
  );
}