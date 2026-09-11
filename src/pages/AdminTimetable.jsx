import { useEffect, useState } from "react";
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

export default function AdminTimetable() {
  const [timetable, setTimetable] = useState(() =>
    loadData(TIMETABLE_KEY, defaultTimetable)
  );

  const [holidays, setHolidays] = useState(() =>
    loadData(HOLIDAYS_KEY, defaultHolidays)
  );

  const [selectedDay, setSelectedDay] = useState("Monday");

  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayName, setNewHolidayName] = useState("");

  const days = Object.keys(defaultTimetable);

  useEffect(() => {
    localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));

    window.dispatchEvent(new Event("campx-timetable-updated"));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(HOLIDAYS_KEY, JSON.stringify(holidays));

    window.dispatchEvent(new Event("campx-holiday-updated"));
  }, [holidays]);

  const updateClass = (day, classId, field, value) => {
    setTimetable((previous) => ({
      ...previous,
      [day]: previous[day].map((item) =>
        item.id === classId
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const toggleSuspend = (day, item) => {
    updateClass(
      day,
      item.id,
      "status",
      item.status === "Suspended" ? "Scheduled" : "Suspended"
    );
  };

  const addHoliday = () => {
    if (!newHolidayDate || !newHolidayName.trim()) {
      alert("Please enter the holiday date and name.");
      return;
    }

    const dateObject = new Date(`${newHolidayDate}T00:00:00`);

    const formattedDate = formatDate(dateObject);

    const newHoliday = {
      id: `HOL-${Date.now()}`,
      date: formattedDate,
      name: newHolidayName.trim(),
      reason: newHolidayName.trim(),
    };

    setHolidays((previous) => [...previous, newHoliday]);

    setNewHolidayDate("");
    setNewHolidayName("");
  };

  const deleteHoliday = (holidayId) => {
    setHolidays((previous) =>
      previous.filter((holiday) => holiday.id !== holidayId)
    );
  };

  const resetTimetable = () => {
    const confirmReset = window.confirm(
      "Reset the timetable to the default schedule?"
    );

    if (!confirmReset) return;

    setTimetable(defaultTimetable);
  };

  const resetHolidays = () => {
    const confirmReset = window.confirm(
      "Reset the holiday list to the default holidays?"
    );

    if (!confirmReset) return;

    setHolidays(defaultHolidays);
  };

  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">
        <Topbar />

        <div className="page-content">
          {/* HEADER */}

          <div className="page-header">
            <div>
              <div className="page-eyebrow">CAMPX ADMINISTRATION</div>

              <h1>Academic Control</h1>

              <p>
                Manage class schedules, classroom changes, class status and
                academic holidays.
              </p>
            </div>

            <button className="primary-btn" onClick={resetTimetable}>
              Reset Timetable
            </button>
          </div>

          {/* CLASS SCHEDULE */}

          <div className="admin-section-card">
            <div className="section-heading">
              <div>
                <h2>Class Schedule</h2>

                <p>
                  Changes made here are immediately reflected on the student
                  timetable.
                </p>
              </div>
            </div>

            {/* DAYS */}

            <div className="day-tabs">
              {days.map((day) => (
                <button
                  key={day}
                  className={`day-tab ${
                    selectedDay === day ? "active" : ""
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* CLASSES */}

            <div className="admin-class-list">
              {(timetable[selectedDay] || []).map((item) => (
                <div className="admin-class-card" key={item.id}>
                  <div className="admin-class-main">
                    <div>
                      <span className="class-time">{item.time}</span>

                      <h3>{item.subject}</h3>

                      <p>
                        {item.faculty} • {item.room}
                      </p>
                    </div>

                    <div className="class-status-actions">
                      <select
                        value={item.status}
                        onChange={(event) =>
                          updateClass(
                            selectedDay,
                            item.id,
                            "status",
                            event.target.value
                          )
                        }
                        className={`status-select ${item.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        className={`suspend-class-btn ${
                          item.status === "Suspended" ? "active" : ""
                        }`}
                        onClick={() => toggleSuspend(selectedDay, item)}
                      >
                        {item.status === "Suspended"
                          ? "Resume Class"
                          : "Suspend Class"}
                      </button>
                    </div>
                  </div>

                  {/* EDIT FIELDS */}

                  <div className="admin-class-fields">
                    <div>
                      <label>Time</label>

                      <input
                        value={item.time}
                        onChange={(event) =>
                          updateClass(
                            selectedDay,
                            item.id,
                            "time",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label>Subject</label>

                      <input
                        value={item.subject}
                        onChange={(event) =>
                          updateClass(
                            selectedDay,
                            item.id,
                            "subject",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label>Faculty</label>

                      <input
                        value={item.faculty}
                        onChange={(event) =>
                          updateClass(
                            selectedDay,
                            item.id,
                            "faculty",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label>Room</label>

                      <input
                        value={item.room}
                        onChange={(event) =>
                          updateClass(
                            selectedDay,
                            item.id,
                            "room",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* STATUS MESSAGE */}

                  {item.status === "Suspended" && (
                    <div className="admin-status-message suspended">
                      ⚠️ This class is currently suspended.
                    </div>
                  )}

                  {item.status === "Ongoing" && (
                    <div className="admin-status-message ongoing">
                      🟢 This class is currently ongoing.
                    </div>
                  )}

                  {item.status === "Cancelled" && (
                    <div className="admin-status-message cancelled">
                      ❌ This class has been cancelled.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HOLIDAYS */}

          <div className="admin-section-card">
            <div className="section-heading">
              <div>
                <h2>Academic Holidays</h2>

                <p>
                  Add official holidays. CampX automatically detects the
                  holiday when the date arrives.
                </p>
              </div>

              <button
                className="secondary-btn"
                onClick={resetHolidays}
              >
                Reset Holidays
              </button>
            </div>

            {/* ADD HOLIDAY */}

            <div className="holiday-form">
              <div>
                <label>Holiday Date</label>

                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(event) =>
                    setNewHolidayDate(event.target.value)
                  }
                />
              </div>

              <div>
                <label>Holiday Name</label>

                <input
                  type="text"
                  placeholder="e.g. Ganesh Chaturthi"
                  value={newHolidayName}
                  onChange={(event) =>
                    setNewHolidayName(event.target.value)
                  }
                />
              </div>

              <button className="primary-btn" onClick={addHoliday}>
                Add Holiday
              </button>
            </div>

            {/* HOLIDAY LIST */}

            <div className="admin-holiday-list">
              {holidays.length === 0 ? (
                <p className="empty-message">
                  No academic holidays added.
                </p>
              ) : (
                holidays.map((holiday) => (
                  <div
                    className="admin-holiday-card"
                    key={holiday.id}
                  >
                    <div>
                      <strong>{holiday.name}</strong>

                      <span>{holiday.date}</span>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => deleteHoliday(holiday.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* INFORMATION */}

          <div className="academic-control-note">
            <strong>💡 Smart Academic Control</strong>

            <span>
              Admin updates are automatically stored and reflected on the
              student timetable. When today's date matches an academic
              holiday, CampX automatically displays the holiday instead of
              the regular class schedule.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}