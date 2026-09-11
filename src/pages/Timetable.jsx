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

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
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
  const [timetable, setTimetable] = useState(() =>
    loadData(TIMETABLE_KEY, defaultTimetable)
  );

  const [holidays, setHolidays] = useState(() =>
    loadData(HOLIDAYS_KEY, defaultHolidays)
  );

  const today = new Date();

  const todayFormatted = formatDate(today);

  const todayDay = getDayName(today);

  const [selectedDay, setSelectedDay] = useState(todayDay);

  /* -----------------------------------------
     LOAD UPDATED TIMETABLE
     ----------------------------------------- */

  const loadTimetable = () => {
    setTimetable(loadData(TIMETABLE_KEY, defaultTimetable));
  };

  const loadHolidays = () => {
    setHolidays(loadData(HOLIDAYS_KEY, defaultHolidays));
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

    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(
        "campx-timetable-updated",
        handleUpdate
      );

      window.removeEventListener(
        "campx-holiday-updated",
        handleUpdate
      );

      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  /* -----------------------------------------
     AUTOMATIC HOLIDAY DETECTION
     ----------------------------------------- */

  const todayHoliday = holidays.find(
    (holiday) => holiday.date === todayFormatted
  );

  /* -----------------------------------------
     TODAY'S CLASSES
     ----------------------------------------- */

  const todayClasses = timetable[todayDay] || [];

  /* -----------------------------------------
     SELECTED DAY CLASSES
     ----------------------------------------- */

  const selectedClasses = timetable[selectedDay] || [];

  /* -----------------------------------------
     COUNTS
     ----------------------------------------- */

  const totalClasses = selectedClasses.length;

  const ongoingClasses = selectedClasses.filter(
    (item) => item.status === "Ongoing"
  ).length;

  const suspendedClasses = selectedClasses.filter(
    (item) => item.status === "Suspended"
  ).length;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <div className="page-content">
          {/* HEADER */}

          <div className="page-header">
            <div>
              <div className="page-eyebrow">
                STUDENT ACADEMICS
              </div>

              <h1>My Timetable</h1>

              <p>
                View your classes, classroom, faculty and live academic
                status.
              </p>
            </div>

            <div className="timetable-date">
              <CalendarDays size={18} />

              <span>{todayFormatted}</span>
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
                  ACADEMIC HOLIDAY
                </span>

                <h2>{todayHoliday.name}</h2>

                <p>
                  There are no regular classes today because of{" "}
                  <strong>{todayHoliday.name}</strong>.
                </p>

                <div className="holiday-date">
                  <CalendarDays size={15} />

                  <span>{todayHoliday.date}</span>
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
                  <span>Today's Academic Status</span>

                  <strong>
                    Regular Classes — {todayDay}
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
                    <span>Today</span>

                    <strong>{todayDay}</strong>
                  </div>
                </div>

                <div className="schedule-overview-card">
                  <div className="overview-icon">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <span>Classes</span>

                    <strong>{todayClasses.length}</strong>
                  </div>
                </div>

                <div className="schedule-overview-card">
                  <div className="overview-icon">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <span>Ongoing</span>

                    <strong>{ongoingClasses}</strong>
                  </div>
                </div>

                <div className="schedule-overview-card">
                  <div className="overview-icon">
                    <AlertTriangle size={20} />
                  </div>

                  <div>
                    <span>Suspended</span>

                    <strong>{suspendedClasses}</strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DAY SELECTOR */}

          <div className="timetable-section-card">
            <div className="section-heading">
              <div>
                <h2>Weekly Schedule</h2>

                <p>
                  Select a day to view your class schedule.
                </p>
              </div>
            </div>

            <div className="day-tabs student-day-tabs">
              {Object.keys(defaultTimetable).map((day) => (
                <button
                  key={day}
                  className={`day-tab ${
                    selectedDay === day ? "active" : ""
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}

                  {day === todayDay && (
                    <span className="today-dot">Today</span>
                  )}
                </button>
              ))}
            </div>

            {/* HOLIDAY FOR SELECTED DATE */}

            {selectedDay === todayDay && todayHoliday ? (
              <div className="automatic-holiday-card">
                <div className="holiday-icon-large">
                  <PartyPopper size={30} />
                </div>

                <div className="holiday-content">
                  <span className="holiday-label">
                    ACADEMIC HOLIDAY
                  </span>

                  <h2>{todayHoliday.name}</h2>

                  <p>
                    No classes are scheduled today due to{" "}
                    <strong>{todayHoliday.name}</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="student-class-list">
                {selectedClasses.length === 0 ? (
                  <div className="empty-timetable">
                    <CalendarDays size={32} />

                    <h3>No classes scheduled</h3>

                    <p>
                      There are no classes scheduled for{" "}
                      {selectedDay}.
                    </p>
                  </div>
                ) : (
                  selectedClasses.map((item) => (
                    <div
                      className={`student-class-card ${item.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      key={item.id}
                    >
                      <div className="student-class-top">
                        <div className="student-class-info">
                          <span className="class-time">
                            <Clock3 size={15} />

                            {item.time}
                          </span>

                          <h3>{item.subject}</h3>

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
                          className={`class-status-badge ${item.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {getStatusIcon(item.status)}

                          {item.status}
                        </div>
                      </div>

                      {/* STATUS INFORMATION */}

                      {item.status === "Ongoing" && (
                        <div className="class-status-message ongoing">
                          <CheckCircle2 size={17} />

                          <span>
                            This class is currently ongoing.
                          </span>
                        </div>
                      )}

                      {item.status === "Suspended" && (
                        <div className="class-status-message suspended">
                          <AlertTriangle size={17} />

                          <span>
                            This class has been suspended by the
                            administration.
                          </span>
                        </div>
                      )}

                      {item.status === "Cancelled" && (
                        <div className="class-status-message cancelled">
                          <XCircle size={17} />

                          <span>
                            This class has been cancelled.
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* HOLIDAY LIST */}

          <div className="timetable-section-card">
            <div className="section-heading">
              <div>
                <h2>Academic Holidays</h2>

                <p>
                  Upcoming holidays and institutional closures.
                </p>
              </div>
            </div>

            {holidays.length === 0 ? (
              <div className="empty-timetable">
                <CalendarDays size={30} />

                <p>No academic holidays have been announced.</p>
              </div>
            ) : (
              <div className="student-holiday-list">
                {holidays.map((holiday) => (
                  <div
                    className="student-holiday-card"
                    key={holiday.id}
                  >
                    <div className="student-holiday-icon">
                      <PartyPopper size={20} />
                    </div>

                    <div>
                      <strong>{holiday.name}</strong>

                      <span>{holiday.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LEGEND */}

          <div className="timetable-legend">
            <span>
              <i className="legend-dot scheduled"></i>
              Scheduled
            </span>

            <span>
              <i className="legend-dot ongoing"></i>
              Ongoing
            </span>

            <span>
              <i className="legend-dot suspended"></i>
              Suspended
            </span>

            <span>
              <i className="legend-dot cancelled"></i>
              Cancelled
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}