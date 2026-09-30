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
import { useLanguage } from "../context/LanguageContext";

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
========================================================= */

function calculateFine(attendancePercentage) {
  if (attendancePercentage >= 75) {
    return 0;
  }

  return (75 - attendancePercentage) * 50;
}

/* =========================================================
   GET CURRENT STUDENT ATTENDANCE
========================================================= */

function getCurrentStudentAttendance(savedData) {
  if (!Array.isArray(savedData) || savedData.length === 0) {
    return DEFAULT_ATTENDANCE;
  }

  /* NEW FORMAT */

  const studentRecord = savedData.find(
    (record) =>
      record &&
      record.studentId === CURRENT_STUDENT_ID &&
      Array.isArray(record.subjects)
  );

  if (studentRecord) {
    return studentRecord.subjects;
  }

  /* OLD FORMAT */

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

  return DEFAULT_ATTENDANCE;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Attendance() {
  const { language } = useLanguage();

  const [attendance, setAttendance] = useState(
    DEFAULT_ATTENDANCE
  );

  const [notifications, setNotifications] = useState([]);

  /* =========================================================
     TRANSLATIONS
  ========================================================= */

  const translations = {
    en: {
      academicServices: "ACADEMIC SERVICES",
      attendance: "Attendance",
      myAttendance: "My Attendance",

      trackAttendance:
        "Track subject-wise attendance, overall attendance and attendance fines.",

      attendanceAlert: "Attendance Alert",

      below75:
        "Your attendance is below 75% in",

      subject: "subject",
      subjects: "subjects",

      currentFine: "Your current fine is ₹",
      improveAttendance:
        "Improve your attendance to reduce the fine.",

      attendanceSafe:
        "Attendance is in the safe zone",

      overallAttendance:
        "Your overall attendance is",

      currentFineZero:
        "and your current fine is ₹0.",

      overall: "Overall Attendance",
      classes: "classes",

      subjectsTitle: "Subjects",
      currentlyEnrolled: "Currently enrolled",

      below75Title: "Below 75%",
      needImprovement: "Need improvement",

      currentFineTitle: "Current Fine",
      finePerPercent:
        "₹50 per 1% below 75%",

      subjectWise:
        "Subject-wise Attendance",

      maintain75:
        "Maintain at least 75% attendance in every subject.",

      fine: "Fine",
      minimum: "Minimum: 75%",

      attendanceFineRule:
        "Attendance Fine Rule",

      fineRuleDescription:
        "75% or above = ₹0. For every 1% below 75%, ₹50 is added to the fine.",

      safe: "Safe",
      low: "Low",

      attendanceNotification:
        "Attendance Notification",

      present: "Present",
      total: "Total",

      noAttendance:
        "No attendance data available.",

      academic: "Academic",

      dataBaseManagement:
        "Data Base Management System",

      computerNetworks:
        "Computer Networks",

      artificialIntelligence:
        "Artificial Intelligence",

      softwareEngineering:
        "Software Engineering",

      environmentalEngineering:
        "Environmental Engineering",
    },

    hi: {
      academicServices: "शैक्षणिक सेवाएँ",
      attendance: "उपस्थिति",
      myAttendance: "मेरी उपस्थिति",

      trackAttendance:
        "विषयवार उपस्थिति, कुल उपस्थिति और उपस्थिति जुर्माने को देखें।",

      attendanceAlert: "उपस्थिति चेतावनी",

      below75:
        "आपकी उपस्थिति 75% से कम है",

      subject: "विषय",
      subjects: "विषयों",

      currentFine: "आपका वर्तमान जुर्माना ₹",
      improveAttendance:
        "जुर्माना कम करने के लिए अपनी उपस्थिति सुधारें।",

      attendanceSafe:
        "उपस्थिति सुरक्षित स्तर पर है",

      overallAttendance:
        "आपकी कुल उपस्थिति",

      currentFineZero:
        "और आपका वर्तमान जुर्माना ₹0 है।",

      overall: "कुल उपस्थिति",
      classes: "कक्षाएँ",

      subjectsTitle: "विषय",
      currentlyEnrolled: "वर्तमान में नामांकित",

      below75Title: "75% से कम",
      needImprovement: "सुधार आवश्यक",

      currentFineTitle: "वर्तमान जुर्माना",
      finePerPercent:
        "75% से प्रत्येक 1% कम पर ₹50",

      subjectWise:
        "विषयवार उपस्थिति",

      maintain75:
        "प्रत्येक विषय में कम से कम 75% उपस्थिति बनाए रखें।",

      fine: "जुर्माना",
      minimum: "न्यूनतम: 75%",

      attendanceFineRule:
        "उपस्थिति जुर्माना नियम",

      fineRuleDescription:
        "75% या उससे अधिक = ₹0। 75% से प्रत्येक 1% कम होने पर ₹50 जुर्माने में जोड़ा जाता है।",

      safe: "सुरक्षित",
      low: "कम",

      attendanceNotification:
        "उपस्थिति सूचना",

      present: "उपस्थित",
      total: "कुल",

      noAttendance:
        "उपस्थिति का कोई डेटा उपलब्ध नहीं है।",

      academic: "शैक्षणिक",

      dataBaseManagement:
        "डेटाबेस मैनेजमेंट सिस्टम",

      computerNetworks:
        "कंप्यूटर नेटवर्क",

      artificialIntelligence:
        "आर्टिफिशियल इंटेलिजेंस",

      softwareEngineering:
        "सॉफ्टवेयर इंजीनियरिंग",

      environmentalEngineering:
        "पर्यावरण इंजीनियरिंग",
    },

    or: {
      academicServices: "ଶିକ୍ଷାଗତ ସେବା",
      attendance: "ଉପସ୍ଥାନ",
      myAttendance: "ମୋର ଉପସ୍ଥାନ",

      trackAttendance:
        "ବିଷୟଭିତ୍ତିକ ଉପସ୍ଥାନ, ସାମଗ୍ରିକ ଉପସ୍ଥାନ ଏବଂ ଉପସ୍ଥାନ ଜରିମାନା ଦେଖନ୍ତୁ।",

      attendanceAlert: "ଉପସ୍ଥାନ ସତର୍କତା",

      below75:
        "ଆପଣଙ୍କ ଉପସ୍ଥାନ 75% ରୁ କମ୍ ଅଛି",

      subject: "ବିଷୟ",
      subjects: "ବିଷୟଗୁଡ଼ିକ",

      currentFine: "ଆପଣଙ୍କ ବର୍ତ୍ତମାନ ଜରିମାନା ₹",
      improveAttendance:
        "ଜରିମାନା କମାଇବା ପାଇଁ ଆପଣଙ୍କ ଉପସ୍ଥାନ ଉନ୍ନତ କରନ୍ତୁ।",

      attendanceSafe:
        "ଉପସ୍ଥାନ ସୁରକ୍ଷିତ ସ୍ତରରେ ଅଛି",

      overallAttendance:
        "ଆପଣଙ୍କ ସାମଗ୍ରିକ ଉପସ୍ଥାନ",

      currentFineZero:
        "ଏବଂ ଆପଣଙ୍କ ବର୍ତ୍ତମାନ ଜରିମାନା ₹0 ଅଟେ।",

      overall: "ସାମଗ୍ରିକ ଉପସ୍ଥାନ",
      classes: "କ୍ଲାସ",

      subjectsTitle: "ବିଷୟ",
      currentlyEnrolled: "ବର୍ତ୍ତମାନ ନାମଲେଖା ହୋଇଛି",

      below75Title: "75% ରୁ କମ୍",
      needImprovement: "ଉନ୍ନତି ଆବଶ୍ୟକ",

      currentFineTitle: "ବର୍ତ୍ତମାନ ଜରିମାନା",
      finePerPercent:
        "75% ରୁ ପ୍ରତ୍ୟେକ 1% କମ୍ ପାଇଁ ₹50",

      subjectWise:
        "ବିଷୟଭିତ୍ତିକ ଉପସ୍ଥାନ",

      maintain75:
        "ପ୍ରତ୍ୟେକ ବିଷୟରେ ଅତି କମରେ 75% ଉପସ୍ଥାନ ରଖନ୍ତୁ।",

      fine: "ଜରିମାନା",
      minimum: "ସର୍ବନିମ୍ନ: 75%",

      attendanceFineRule:
        "ଉପସ୍ଥାନ ଜରିମାନା ନିୟମ",

      fineRuleDescription:
        "75% କିମ୍ବା ତାଠାରୁ ଅଧିକ = ₹0। 75% ରୁ ପ୍ରତ୍ୟେକ 1% କମ୍ ପାଇଁ ₹50 ଜରିମାନା ଯୋଗ ହେବ।",

      safe: "ସୁରକ୍ଷିତ",
      low: "କମ୍",

      attendanceNotification:
        "ଉପସ୍ଥାନ ସୂଚନା",

      present: "ଉପସ୍ଥିତ",
      total: "ମୋଟ",

      noAttendance:
        "କୌଣସି ଉପସ୍ଥାନ ତଥ୍ୟ ଉପଲବ୍ଧ ନାହିଁ।",

      academic: "ଶିକ୍ଷାଗତ",

      dataBaseManagement:
        "ଡାଟାବେସ୍ ମ୍ୟାନେଜମେଣ୍ଟ ସିଷ୍ଟମ୍",

      computerNetworks:
        "କମ୍ପ୍ୟୁଟର ନେଟୱାର୍କ",

      artificialIntelligence:
        "ଆର୍ଟିଫିସିଆଲ୍ ଇଣ୍ଟେଲିଜେନ୍ସ",

      softwareEngineering:
        "ସଫ୍ଟୱେର୍ ଇଞ୍ଜିନିୟରିଂ",

      environmentalEngineering:
        "ପରିବେଶ ଇଞ୍ଜିନିୟରିଂ",
    },
  };

  const t = (key) => {
    return (
      translations[language]?.[key] ||
      translations.en[key] ||
      key
    );
  };

  /* =========================================================
     SUBJECT TRANSLATION
  ========================================================= */

  const getSubjectName = (subject) => {
    const subjectNames = {
      "Data Base Management System":
        t("dataBaseManagement"),

      "Computer Networks":
        t("computerNetworks"),

      "Artificial Intelligence":
        t("artificialIntelligence"),

      "Software Engineering":
        t("softwareEngineering"),

      "Environmental Engineering":
        t("environmentalEngineering"),
    };

    return subjectNames[subject] || subject;
  };

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

        <Topbar title={t("attendance")} />

        <div className="content">

          {/* HEADER */}

          <section className="welcome-section">

            <div>

              <p className="eyebrow">
                {t("academicServices")}
              </p>

              <h1>
                {t("myAttendance")}
              </h1>

              <p>
                {t("trackAttendance")}
              </p>

            </div>

            <div className="attendance-header-icon">
              <CalendarDays size={28} />
            </div>

          </section>

          {/* BELOW 75% WARNING */}

          {subjectsBelow75.length > 0 && (

            <div className="attendance-warning">

              <div className="attendance-warning-icon">
                <AlertTriangle size={22} />
              </div>

              <div>

                <strong>
                  {t("attendanceAlert")}
                </strong>

                <p>
                  {t("below75")}{" "}
                  {subjectsBelow75.length}{" "}
                  {subjectsBelow75.length > 1
                    ? t("subjects")
                    : t("subject")}
                  .{" "}
                  {t("currentFine")}
                  {totalFine}.{" "}
                  {t("improveAttendance")}
                </p>

              </div>

            </div>

          )}

          {/* SAFE ATTENDANCE */}

          {subjectsBelow75.length === 0 && (

            <div className="attendance-success">

              <CheckCircle2 size={22} />

              <div>

                <strong>
                  {t("attendanceSafe")}
                </strong>

                <p>
                  {t("overallAttendance")}{" "}
                  {overallPercentage}%{" "}
                  {t("currentFineZero")}
                </p>

              </div>

            </div>

          )}

          {/* OVERVIEW CARDS */}

          <section className="attendance-overview-grid">

            {/* OVERALL */}

            <div className="attendance-overview-card">

              <div className="attendance-card-icon blue">
                <TrendingUp size={21} />
              </div>

              <span>
                {t("overall")}
              </span>

              <strong>
                {overallPercentage}%
              </strong>

              <small>
                {totalPresent} /{" "}
                {totalClasses}{" "}
                {t("classes")}
              </small>

            </div>

            {/* SUBJECTS */}

            <div className="attendance-overview-card">

              <div className="attendance-card-icon purple">
                <BookOpen size={21} />
              </div>

              <span>
                {t("subjectsTitle")}
              </span>

              <strong>
                {attendance.length}
              </strong>

              <small>
                {t("currentlyEnrolled")}
              </small>

            </div>

            {/* BELOW 75 */}

            <div className="attendance-overview-card">

              <div className="attendance-card-icon orange">
                <AlertTriangle size={21} />
              </div>

              <span>
                {t("below75Title")}
              </span>

              <strong>
                {subjectsBelow75.length}
              </strong>

              <small>
                {t("needImprovement")}
              </small>

            </div>

            {/* FINE */}

            <div className="attendance-overview-card">

              <div className="attendance-card-icon red">
                <IndianRupee size={21} />
              </div>

              <span>
                {t("currentFineTitle")}
              </span>

              <strong>
                ₹{totalFine}
              </strong>

              <small>
                {t("finePerPercent")}
              </small>

            </div>

          </section>

          {/* SUBJECT ATTENDANCE */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <h3>
                  {t("subjectWise")}
                </h3>

                <p>
                  {t("maintain75")}
                </p>

              </div>

              <BookOpen size={20} />

            </div>

            <div className="attendance-subject-list">

              {attendance.length === 0 ? (

                <div className="attendance-empty-state">
                  <BookOpen size={30} />

                  <p>
                    {t("noAttendance")}
                  </p>
                </div>

              ) : (

                attendance.map(
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
                              {getSubjectName(
                                subject.subject
                              )}
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
                              {t("classes")}
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

                                {t("fine")}: ₹
                                {fine}

                              </span>

                            ) : (

                              <span className="attendance-safe-text">

                                <CheckCircle2
                                  size={13}
                                />

                                {t("fine")}: ₹0

                              </span>

                            )}

                            <span>
                              {t("minimum")}
                            </span>

                          </div>

                        </div>

                      </div>

                    );
                  }
                )

              )}

            </div>

          </section>

          {/* FINE RULE */}

          <section className="attendance-fine-rule">

            <div className="attendance-fine-rule-icon">
              <IndianRupee size={20} />
            </div>

            <div>

              <strong>
                {t("attendanceFineRule")}
              </strong>

              <p>
                {t("fineRuleDescription")}
              </p>

            </div>

          </section>

          {/* LATEST NOTIFICATION */}

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