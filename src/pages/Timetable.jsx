import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  GraduationCap,
  PartyPopper,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

const TIMETABLE_KEY = "campx_timetable";
const HOLIDAYS_KEY = "campx_academic_holidays";

const defaultTimetable = {
  Monday: [
    {
      id: "MON-1",
      time: "09:00 AM - 10:00 AM",
      subject: "Artificial Intelligence",
      faculty: "Dr. Sharma",
      room: "Room 201",
      status: "Scheduled",
    },
    {
      id: "MON-2",
      time: "10:00 AM - 11:00 AM",
      subject: "Computer Networks",
      faculty: "Prof. Das",
      room: "Room 204",
      status: "Scheduled",
    },
    {
      id: "MON-3",
      time: "11:30 AM - 12:30 PM",
      subject: "Database Management",
      faculty: "Dr. Patnaik",
      room: "Lab 2",
      status: "Scheduled",
    },
  ],

  Tuesday: [
    {
      id: "TUE-1",
      time: "09:00 AM - 10:00 AM",
      subject: "Operating Systems",
      faculty: "Prof. Mishra",
      room: "Room 202",
      status: "Scheduled",
    },
    {
      id: "TUE-2",
      time: "10:00 AM - 11:00 AM",
      subject: "Machine Learning",
      faculty: "Dr. Sharma",
      room: "Lab 3",
      status: "Scheduled",
    },
  ],

  Wednesday: [
    {
      id: "WED-1",
      time: "09:00 AM - 10:00 AM",
      subject: "Computer Networks",
      faculty: "Prof. Das",
      room: "Room 204",
      status: "Scheduled",
    },
    {
      id: "WED-2",
      time: "11:00 AM - 12:00 PM",
      subject: "Artificial Intelligence",
      faculty: "Dr. Sharma",
      room: "Room 201",
      status: "Scheduled",
    },
  ],

  Thursday: [
    {
      id: "THU-1",
      time: "10:00 AM - 11:00 AM",
      subject: "Database Management",
      faculty: "Dr. Patnaik",
      room: "Room 205",
      status: "Scheduled",
    },
  ],

  Friday: [
    {
      id: "FRI-1",
      time: "09:00 AM - 10:00 AM",
      subject: "Operating Systems",
      faculty: "Prof. Mishra",
      room: "Room 202",
      status: "Scheduled",
    },
    {
      id: "FRI-2",
      time: "11:00 AM - 12:00 PM",
      subject: "Machine Learning",
      faculty: "Dr. Sharma",
      room: "Lab 3",
      status: "Scheduled",
    },
  ],

  Saturday: [
    {
      id: "SAT-1",
      time: "09:00 AM - 10:00 AM",
      subject: "Project / Practical",
      faculty: "Department Faculty",
      room: "Lab 1",
      status: "Scheduled",
    },
  ],
};

const defaultHolidays = [
  {
    id: "HOL-1",
    date: "14 September 2026",
    name: "Ganesh Chaturthi",
    reason: "Ganesh Chaturthi",
  },
];

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);

    return parsed || fallback;
  } catch (error) {
    console.error("Error loading data:", error);

    return fallback;
  }
}

function formatDate(date, language) {
  const locale =
    language === "hi"
      ? "hi-IN"
      : language === "or"
      ? "or-IN"
      : "en-GB";

  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getDayName(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function getStatusIcon(status) {
  if (status === "Ongoing") {
    return <CheckCircle2 size={16} />;
  }

  if (status === "Suspended") {
    return <AlertTriangle size={16} />;
  }

  if (status === "Cancelled") {
    return <XCircle size={16} />;
  }

  return <CheckCircle2 size={16} />;
}

export default function Timetable() {
  const { language } = useLanguage();

  const [timetable, setTimetable] = useState(() =>
    loadData(TIMETABLE_KEY, defaultTimetable)
  );

  const [holidays, setHolidays] = useState(() =>
    loadData(HOLIDAYS_KEY, defaultHolidays)
  );

  const today = new Date();

  const todayFormatted = formatDate(today, language);

  const todayDay = getDayName(today);

  const [selectedDay, setSelectedDay] = useState(todayDay);

  const translations = {
    en: {
      studentAcademics: "STUDENT ACADEMICS",
      myTimetable: "My Timetable",
      timetableDescription:
        "View your classes, classroom, faculty and live academic status.",

      academicHoliday: "ACADEMIC HOLIDAY",
      noClassesHoliday:
        "There are no regular classes today because of",
      noClassesToday:
        "No classes are scheduled today due to",

      todaysAcademicStatus:
        "Today's Academic Status",
      regularClasses: "Regular Classes",

      today: "Today",
      classes: "Classes",
      ongoing: "Ongoing",
      suspended: "Suspended",

      weeklySchedule: "Weekly Schedule",
      selectDay:
        "Select a day to view your class schedule.",

      noClassesScheduled: "No classes scheduled",
      noClassesFor:
        "There are no classes scheduled for",

      scheduled: "Scheduled",
      cancelled: "Cancelled",

      currentlyOngoing:
        "This class is currently ongoing.",
      suspendedByAdmin:
        "This class has been suspended by the administration.",
      classCancelled:
        "This class has been cancelled.",

      academicHolidays: "Academic Holidays",
      upcomingHolidays:
        "Upcoming holidays and institutional closures.",
      noHolidays:
        "No academic holidays have been announced.",

      date: "Date",
      reason: "Reason",

      projectPractical: "Project / Practical",
      departmentFaculty: "Department Faculty",

      artificialIntelligence:
        "Artificial Intelligence",
      computerNetworks: "Computer Networks",
      databaseManagement: "Database Management",
      operatingSystems: "Operating Systems",
      machineLearning: "Machine Learning",

      room: "Room",
      faculty: "Faculty",

      legendScheduled: "Scheduled",
      legendOngoing: "Ongoing",
      legendSuspended: "Suspended",
      legendCancelled: "Cancelled",
    },

    hi: {
      studentAcademics: "छात्र शैक्षणिक",
      myTimetable: "मेरी समय सारणी",
      timetableDescription:
        "अपनी कक्षाएँ, कक्षा कक्ष, शिक्षक और वर्तमान शैक्षणिक स्थिति देखें।",

      academicHoliday: "शैक्षणिक अवकाश",
      noClassesHoliday:
        "आज कोई नियमित कक्षाएँ नहीं हैं क्योंकि",
      noClassesToday:
        "आज कोई कक्षा निर्धारित नहीं है क्योंकि",

      todaysAcademicStatus:
        "आज की शैक्षणिक स्थिति",
      regularClasses: "नियमित कक्षाएँ",

      today: "आज",
      classes: "कक्षाएँ",
      ongoing: "चल रही",
      suspended: "निलंबित",

      weeklySchedule: "साप्ताहिक समय सारणी",
      selectDay:
        "अपनी कक्षा की समय सारणी देखने के लिए दिन चुनें।",

      noClassesScheduled: "कोई कक्षा निर्धारित नहीं है",
      noClassesFor:
        "के लिए कोई कक्षा निर्धारित नहीं है",

      scheduled: "निर्धारित",
      cancelled: "रद्द",

      currentlyOngoing:
        "यह कक्षा वर्तमान में चल रही है।",
      suspendedByAdmin:
        "इस कक्षा को प्रशासन द्वारा निलंबित कर दिया गया है।",
      classCancelled:
        "यह कक्षा रद्द कर दी गई है।",

      academicHolidays: "शैक्षणिक अवकाश",
      upcomingHolidays:
        "आगामी अवकाश और संस्थान बंद रहने की तिथियाँ।",
      noHolidays:
        "अभी तक कोई शैक्षणिक अवकाश घोषित नहीं किया गया है।",

      date: "तारीख",
      reason: "कारण",

      projectPractical: "प्रोजेक्ट / प्रैक्टिकल",
      departmentFaculty: "विभाग के शिक्षक",

      artificialIntelligence:
        "आर्टिफिशियल इंटेलिजेंस",
      computerNetworks: "कंप्यूटर नेटवर्क",
      databaseManagement:
        "डेटाबेस मैनेजमेंट",
      operatingSystems:
        "ऑपरेटिंग सिस्टम",
      machineLearning:
        "मशीन लर्निंग",

      room: "कक्ष",
      faculty: "शिक्षक",

      legendScheduled: "निर्धारित",
      legendOngoing: "चल रही",
      legendSuspended: "निलंबित",
      legendCancelled: "रद्द",
    },

    or: {
      studentAcademics: "ଛାତ୍ର ଶିକ୍ଷାଗତ",
      myTimetable: "ମୋର ସମୟ ସାରଣୀ",
      timetableDescription:
        "ଆପଣଙ୍କ କ୍ଲାସ୍, କ୍ଲାସ୍‌ରୁମ୍, ଶିକ୍ଷକ ଏବଂ ବର୍ତ୍ତମାନର ଶିକ୍ଷାଗତ ସ୍ଥିତି ଦେଖନ୍ତୁ।",

      academicHoliday: "ଶିକ୍ଷାଗତ ଛୁଟି",
      noClassesHoliday:
        "ଆଜି କୌଣସି ନିୟମିତ କ୍ଲାସ୍ ନାହିଁ କାରଣ",
      noClassesToday:
        "ଆଜି କୌଣସି କ୍ଲାସ୍ ନିର୍ଦ୍ଧାରିତ ନାହିଁ କାରଣ",

      todaysAcademicStatus:
        "ଆଜିର ଶିକ୍ଷାଗତ ସ୍ଥିତି",
      regularClasses: "ନିୟମିତ କ୍ଲାସ୍",

      today: "ଆଜି",
      classes: "କ୍ଲାସ୍",
      ongoing: "ଚାଲୁଛି",
      suspended: "ସ୍ଥଗିତ",

      weeklySchedule: "ସାପ୍ତାହିକ ସମୟ ସାରଣୀ",
      selectDay:
        "ଆପଣଙ୍କ କ୍ଲାସ୍ ସମୟ ସାରଣୀ ଦେଖିବା ପାଇଁ ଦିନ ବାଛନ୍ତୁ।",

      noClassesScheduled:
        "କୌଣସି କ୍ଲାସ୍ ନିର୍ଦ୍ଧାରିତ ନାହିଁ",
      noClassesFor:
        "ପାଇଁ କୌଣସି କ୍ଲାସ୍ ନିର୍ଦ୍ଧାରିତ ନାହିଁ",

      scheduled: "ନିର୍ଦ୍ଧାରିତ",
      cancelled: "ବାତିଲ",

      currentlyOngoing:
        "ଏହି କ୍ଲାସ୍ ବର୍ତ୍ତମାନ ଚାଲୁଛି।",
      suspendedByAdmin:
        "ଏହି କ୍ଲାସ୍ ପ୍ରଶାସନ ଦ୍ୱାରା ସ୍ଥଗିତ କରାଯାଇଛି।",
      classCancelled:
        "ଏହି କ୍ଲାସ୍ ବାତିଲ ହୋଇଛି।",

      academicHolidays: "ଶିକ୍ଷାଗତ ଛୁଟି",
      upcomingHolidays:
        "ଆଗାମୀ ଛୁଟି ଏବଂ ପ୍ରତିଷ୍ଠାନ ବନ୍ଦ ଦିନଗୁଡ଼ିକ।",
      noHolidays:
        "କୌଣସି ଶିକ୍ଷାଗତ ଛୁଟି ଘୋଷଣା କରାଯାଇନାହିଁ।",

      date: "ତାରିଖ",
      reason: "କାରଣ",

      projectPractical: "ପ୍ରୋଜେକ୍ଟ / ପ୍ରାକ୍ଟିକାଲ୍",
      departmentFaculty: "ବିଭାଗୀୟ ଶିକ୍ଷକ",

      artificialIntelligence:
        "ଆର୍ଟିଫିସିଆଲ୍ ଇଣ୍ଟେଲିଜେନ୍ସ",
      computerNetworks:
        "କମ୍ପ୍ୟୁଟର ନେଟୱାର୍କ",
      databaseManagement:
        "ଡାଟାବେସ୍ ମ୍ୟାନେଜମେଣ୍ଟ",
      operatingSystems:
        "ଅପରେଟିଂ ସିଷ୍ଟମ୍",
      machineLearning:
        "ମେସିନ୍ ଲର୍ଣ୍ଣିଂ",

      room: "କକ୍ଷ",
      faculty: "ଶିକ୍ଷକ",

      legendScheduled: "ନିର୍ଦ୍ଧାରିତ",
      legendOngoing: "ଚାଲୁଛି",
      legendSuspended: "ସ୍ଥଗିତ",
      legendCancelled: "ବାତିଲ",
    },
  };

  const t = (key) => {
    return (
      translations[language]?.[key] ||
      translations.en[key] ||
      key
    );
  };

  const dayTranslations = {
    Monday: {
      en: "Monday",
      hi: "सोमवार",
      or: "ସୋମବାର",
    },
    Tuesday: {
      en: "Tuesday",
      hi: "मंगलवार",
      or: "ମଙ୍ଗଳବାର",
    },
    Wednesday: {
      en: "Wednesday",
      hi: "बुधवार",
      or: "ବୁଧବାର",
    },
    Thursday: {
      en: "Thursday",
      hi: "गुरुवार",
      or: "ଗୁରୁବାର",
    },
    Friday: {
      en: "Friday",
      hi: "शुक्रवार",
      or: "ଶୁକ୍ରବାର",
    },
    Saturday: {
      en: "Saturday",
      hi: "शनिवार",
      or: "ଶନିବାର",
    },
    Sunday: {
      en: "Sunday",
      hi: "रविवार",
      or: "ରବିବାର",
    },
  };

  const getDayLabel = (day) => {
    return (
      dayTranslations[day]?.[language] ||
      dayTranslations[day]?.en ||
      day
    );
  };

  const getSubjectLabel = (subject) => {
    const subjectTranslations = {
      "Artificial Intelligence":
        t("artificialIntelligence"),

      "Computer Networks":
        t("computerNetworks"),

      "Database Management":
        t("databaseManagement"),

      "Operating Systems":
        t("operatingSystems"),

      "Machine Learning":
        t("machineLearning"),

      "Project / Practical":
        t("projectPractical"),
    };

    return (
      subjectTranslations[subject] ||
      subject
    );
  };

  const getStatusLabel = (status) => {
    const statusTranslations = {
      Scheduled: t("scheduled"),
      Ongoing: t("ongoing"),
      Suspended: t("suspended"),
      Cancelled: t("cancelled"),
    };

    return (
      statusTranslations[status] ||
      status
    );
  };

  /* -----------------------------------------
     LOAD UPDATED TIMETABLE
  ----------------------------------------- */

  const loadTimetable = () => {
    setTimetable(
      loadData(
        TIMETABLE_KEY,
        defaultTimetable
      )
    );
  };

  const loadHolidays = () => {
    setHolidays(
      loadData(
        HOLIDAYS_KEY,
        defaultHolidays
      )
    );
  };

  useEffect(() => {
    loadTimetable();
    loadHolidays();

    const handleUpdate = () => {
      loadTimetable();
      loadHolidays();
    };

    window.addEventListener(
      "campx-timetable-updated",
      handleUpdate
    );

    window.addEventListener(
      "campx-holiday-updated",
      handleUpdate
    );

    window.addEventListener(
      "storage",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "campx-timetable-updated",
        handleUpdate
      );

      window.removeEventListener(
        "campx-holiday-updated",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleUpdate
      );
    };
  }, []);

  /* -----------------------------------------
     AUTOMATIC HOLIDAY DETECTION
  ----------------------------------------- */

  const todayHoliday = holidays.find(
    (holiday) =>
      holiday.date === todayFormatted
  );

  /* -----------------------------------------
     TODAY'S CLASSES
  ----------------------------------------- */

  const todayClasses =
    timetable[todayDay] || [];

  /* -----------------------------------------
     SELECTED DAY CLASSES
  ----------------------------------------- */

  const selectedClasses =
    timetable[selectedDay] || [];

  /* -----------------------------------------
     COUNTS
  ----------------------------------------- */

  const totalClasses =
    selectedClasses.length;

  const ongoingClasses =
    selectedClasses.filter(
      (item) =>
        item.status === "Ongoing"
    ).length;

  const suspendedClasses =
    selectedClasses.filter(
      (item) =>
        item.status === "Suspended"
    ).length;

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Topbar title={t("myTimetable")} />

        <div className="page-content">

          {/* HEADER */}

          <div className="page-header">

            <div>

              <div className="page-eyebrow">
                {t("studentAcademics")}
              </div>

              <h1>
                {t("myTimetable")}
              </h1>

              <p>
                {t("timetableDescription")}
              </p>

            </div>

            <div className="timetable-date">

              <CalendarDays size={18} />

              <span>
                {todayFormatted}
              </span>

            </div>

          </div>

          {/* AUTOMATIC HOLIDAY */}

          {todayHoliday ? (

            <div className="automatic-holiday-card">

              <div className="holiday-icon-large">
                <PartyPopper size={30} />
              </div>

              <div className="holiday-content">

                <span className="holiday-label">
                  {t("academicHoliday")}
                </span>

                <h2>
                  {todayHoliday.name}
                </h2>

                <p>
                  {t("noClassesHoliday")}{" "}
                  <strong>
                    {todayHoliday.name}
                  </strong>.
                </p>

                <div className="holiday-date">

                  <CalendarDays size={15} />

                  <span>
                    {todayHoliday.date}
                  </span>

                </div>

              </div>

            </div>

          ) : (

            <>
              {/* TODAY STATUS */}

              <div className="today-status-banner">

                <div className="today-status-icon">
                  <GraduationCap size={22} />
                </div>

                <div>

                  <span>
                    {t("todaysAcademicStatus")}
                  </span>

                  <strong>
                    {t("regularClasses")} —{" "}
                    {getDayLabel(todayDay)}
                  </strong>

                </div>

              </div>

              {/* OVERVIEW */}

              <div className="schedule-overview">

                <div className="schedule-overview-card">

                  <div className="overview-icon">
                    <CalendarDays size={20} />
                  </div>

                  <div>

                    <span>
                      {t("today")}
                    </span>

                    <strong>
                      {getDayLabel(todayDay)}
                    </strong>

                  </div>

                </div>

                <div className="schedule-overview-card">

                  <div className="overview-icon">
                    <Clock3 size={20} />
                  </div>

                  <div>

                    <span>
                      {t("classes")}
                    </span>

                    <strong>
                      {todayClasses.length}
                    </strong>

                  </div>

                </div>

                <div className="schedule-overview-card">

                  <div className="overview-icon">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>

                    <span>
                      {t("ongoing")}
                    </span>

                    <strong>
                      {ongoingClasses}
                    </strong>

                  </div>

                </div>

                <div className="schedule-overview-card">

                  <div className="overview-icon">
                    <AlertTriangle size={20} />
                  </div>

                  <div>

                    <span>
                      {t("suspended")}
                    </span>

                    <strong>
                      {suspendedClasses}
                    </strong>

                  </div>

                </div>

              </div>
            </>

          )}

          {/* DAY SELECTOR */}

          <div className="timetable-section-card">

            <div className="section-heading">

              <div>

                <h2>
                  {t("weeklySchedule")}
                </h2>

                <p>
                  {t("selectDay")}
                </p>

              </div>

            </div>

            <div className="day-tabs student-day-tabs">

              {Object.keys(defaultTimetable).map(
                (day) => (

                  <button
                    key={day}
                    className={`day-tab ${
                      selectedDay === day
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedDay(day)
                    }
                  >

                    {getDayLabel(day)}

                    {day === todayDay && (

                      <span className="today-dot">
                        {t("today")}
                      </span>

                    )}

                  </button>

                )
              )}

            </div>

            {/* HOLIDAY FOR SELECTED DATE */}

            {selectedDay === todayDay &&
            todayHoliday ? (

              <div className="automatic-holiday-card">

                <div className="holiday-icon-large">
                  <PartyPopper size={30} />
                </div>

                <div className="holiday-content">

                  <span className="holiday-label">
                    {t("academicHoliday")}
                  </span>

                  <h2>
                    {todayHoliday.name}
                  </h2>

                  <p>
                    {t("noClassesToday")}{" "}
                    <strong>
                      {todayHoliday.name}
                    </strong>.
                  </p>

                </div>

              </div>

            ) : (

              <div className="student-class-list">

                {selectedClasses.length === 0 ? (

                  <div className="empty-timetable">

                    <CalendarDays size={32} />

                    <h3>
                      {t("noClassesScheduled")}
                    </h3>

                    <p>
                      {t("noClassesFor")}{" "}
                      {getDayLabel(selectedDay)}.
                    </p>

                  </div>

                ) : (

                  selectedClasses.map(
                    (item) => (

                      <div
                        className={`student-class-card ${String(
                          item.status || ""
                        )
                          .toLowerCase()
                          .replace(
                            " ",
                            "-"
                          )}`}
                        key={item.id}
                      >

                        <div className="student-class-top">

                          <div className="student-class-info">

                            <span className="class-time">

                              <Clock3 size={15} />

                              {item.time}

                            </span>

                            <h3>
                              {getSubjectLabel(
                                item.subject
                              )}
                            </h3>

                            <div className="class-details">

                              <span>

                                <UserRound size={14} />

                                {item.faculty}

                              </span>

                              <span>

                                <MapPin size={14} />

                                {item.room}

                              </span>

                            </div>

                          </div>

                          <div
                            className={`class-status-badge ${String(
                              item.status || ""
                            )
                              .toLowerCase()
                              .replace(
                                " ",
                                "-"
                              )}`}
                          >

                            {getStatusIcon(
                              item.status
                            )}

                            {getStatusLabel(
                              item.status
                            )}

                          </div>

                        </div>

                        {/* STATUS INFORMATION */}

                        {item.status ===
                          "Ongoing" && (

                          <div className="class-status-message ongoing">

                            <CheckCircle2 size={17} />

                            <span>
                              {t(
                                "currentlyOngoing"
                              )}
                            </span>

                          </div>

                        )}

                        {item.status ===
                          "Suspended" && (

                          <div className="class-status-message suspended">

                            <AlertTriangle size={17} />

                            <span>
                              {t(
                                "suspendedByAdmin"
                              )}
                            </span>

                          </div>

                        )}

                        {item.status ===
                          "Cancelled" && (

                          <div className="class-status-message cancelled">

                            <XCircle size={17} />

                            <span>
                              {t(
                                "classCancelled"
                              )}
                            </span>

                          </div>

                        )}

                      </div>

                    )
                  )

                )}

              </div>

            )}

          </div>

          {/* HOLIDAY LIST */}

          <div className="timetable-section-card">

            <div className="section-heading">

              <div>

                <h2>
                  {t("academicHolidays")}
                </h2>

                <p>
                  {t("upcomingHolidays")}
                </p>

              </div>

            </div>

            {holidays.length === 0 ? (

              <div className="empty-timetable">

                <CalendarDays size={30} />

                <p>
                  {t("noHolidays")}
                </p>

              </div>

            ) : (

              <div className="student-holiday-list">

                {holidays.map(
                  (holiday) => (

                    <div
                      className="student-holiday-card"
                      key={holiday.id}
                    >

                      <div className="student-holiday-icon">
                        <PartyPopper size={20} />
                      </div>

                      <div>

                        <strong>
                          {holiday.name}
                        </strong>

                        <span>
                          {holiday.date}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* LEGEND */}

          <div className="timetable-legend">

            <span>

              <i className="legend-dot scheduled"></i>

              {t("legendScheduled")}

            </span>

            <span>

              <i className="legend-dot ongoing"></i>

              {t("legendOngoing")}

            </span>

            <span>

              <i className="legend-dot suspended"></i>

              {t("legendSuspended")}

            </span>

            <span>

              <i className="legend-dot cancelled"></i>

              {t("legendCancelled")}

            </span>

          </div>

        </div>

      </main>

    </div>
  );
}