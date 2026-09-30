import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

const TIMETABLE_KEY = "campx_timetable";
const HOLIDAYS_KEY = "campx_academic_holidays";


const ADMIN_TIMETABLE_TRANSLATIONS = {
  en: {
    administration: "CAMPX ADMINISTRATION",
    academicControl: "Academic Control",
    manageDescription: "Manage class schedules, classroom changes, class status and academic holidays.",
    resetTimetable: "Reset Timetable",
    classSchedule: "Class Schedule",
    scheduleDescription: "Changes made here are immediately reflected on the student timetable.",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    scheduled: "Scheduled",
    ongoing: "Ongoing",
    suspended: "Suspended",
    cancelled: "Cancelled",
    resumeClass: "Resume Class",
    suspendClass: "Suspend Class",
    time: "Time",
    subject: "Subject",
    faculty: "Faculty",
    room: "Room",
    suspendedMessage: "This class is currently suspended.",
    ongoingMessage: "This class is currently ongoing.",
    cancelledMessage: "This class has been cancelled.",
    academicHolidays: "Academic Holidays",
    holidayDescription: "Add official holidays. CampX automatically detects the holiday when the date arrives.",
    resetHolidays: "Reset Holidays",
    holidayDate: "Holiday Date",
    holidayName: "Holiday Name",
    holidayPlaceholder: "e.g. Ganesh Chaturthi",
    addHoliday: "Add Holiday",
    noHolidays: "No academic holidays have been added.",
    delete: "Delete",
    smartControl: "Smart Academic Control",
    smartDescription: "Admin updates are automatically stored and reflected on the student timetable. When today's date matches an academic holiday, CampX automatically displays the holiday instead of the regular class schedule.",
    enterHoliday: "Please enter the holiday date and name.",
    confirmTimetable: "Do you want to reset the timetable to the default schedule?",
    confirmHolidays: "Reset the holiday list to the default holidays.",
  },
  hi: {
    administration: "CAMPX प्रशासन",
    academicControl: "शैक्षणिक नियंत्रण",
    manageDescription: "कक्षा समय-सारणी, कक्षा परिवर्तन, कक्षा स्थिति और शैक्षणिक अवकाश प्रबंधित करें।",
    resetTimetable: "समय-सारणी रीसेट करें",
    classSchedule: "कक्षा समय-सारणी",
    scheduleDescription: "यहां किए गए परिवर्तन छात्र समय-सारणी में तुरंत दिखाई देंगे।",
    monday: "सोमवार",
    tuesday: "मंगलवार",
    wednesday: "बुधवार",
    thursday: "गुरुवार",
    friday: "शुक्रवार",
    saturday: "शनिवार",
    scheduled: "निर्धारित",
    ongoing: "चल रही है",
    suspended: "निलंबित",
    cancelled: "रद्द",
    resumeClass: "कक्षा फिर शुरू करें",
    suspendClass: "कक्षा निलंबित करें",
    time: "समय",
    subject: "विषय",
    faculty: "फैकल्टी",
    room: "कक्ष",
    suspendedMessage: "यह कक्षा वर्तमान में निलंबित है।",
    ongoingMessage: "यह कक्षा वर्तमान में चल रही है।",
    cancelledMessage: "यह कक्षा रद्द कर दी गई है।",
    academicHolidays: "शैक्षणिक अवकाश",
    holidayDescription: "आधिकारिक अवकाश जोड़ें। तारीख आने पर CAMPX स्वतः अवकाश पहचान लेगा।",
    resetHolidays: "अवकाश रीसेट करें",
    holidayDate: "अवकाश की तारीख",
    holidayName: "अवकाश का नाम",
    holidayPlaceholder: "जैसे गणेश चतुर्थी",
    addHoliday: "अवकाश जोड़ें",
    noHolidays: "कोई शैक्षणिक अवकाश नहीं जोड़ा गया है।",
    delete: "हटाएं",
    smartControl: "स्मार्ट शैक्षणिक नियंत्रण",
    smartDescription: "एडमिन द्वारा किए गए अपडेट स्वतः सहेजे जाते हैं और छात्र समय-सारणी में दिखाई देते हैं। जब आज की तारीख किसी शैक्षणिक अवकाश से मेल खाती है, तो CAMPX नियमित कक्षा समय-सारणी के बजाय अवकाश दिखाता है।",
    enterHoliday: "कृपया अवकाश की तारीख और नाम दर्ज करें।",
    confirmTimetable: "क्या समय-सारणी को डिफ़ॉल्ट शेड्यूल पर रीसेट करना है?",
    confirmHolidays: "क्या अवकाश सूची को डिफ़ॉल्ट अवकाश पर रीसेट करना है?",
  },
  or: {
    administration: "CAMPX ପ୍ରଶାସନ",
    academicControl: "ଶିକ୍ଷାଗତ ନିୟନ୍ତ୍ରଣ",
    manageDescription: "କ୍ଲାସ୍ ସମୟସୂଚୀ, କ୍ଲାସ୍ ପରିବର୍ତ୍ତନ, କ୍ଲାସ୍ ସ୍ଥିତି ଏବଂ ଶିକ୍ଷାଗତ ଛୁଟି ପରିଚାଳନା କରନ୍ତୁ।",
    resetTimetable: "ସମୟସୂଚୀ ରିସେଟ୍ କରନ୍ତୁ",
    classSchedule: "କ୍ଲାସ୍ ସମୟସୂଚୀ",
    scheduleDescription: "ଏଠାରେ କରାଯାଇଥିବା ପରିବର୍ତ୍ତନ ଛାତ୍ର ସମୟସୂଚୀରେ ତୁରନ୍ତ ଦେଖାଯିବ।",
    monday: "ସୋମବାର",
    tuesday: "ମଙ୍ଗଳବାର",
    wednesday: "ବୁଧବାର",
    thursday: "ଗୁରୁବାର",
    friday: "ଶୁକ୍ରବାର",
    saturday: "ଶନିବାର",
    scheduled: "ନିର୍ଦ୍ଧାରିତ",
    ongoing: "ଚାଲୁଛି",
    suspended: "ସ୍ଥଗିତ",
    cancelled: "ବାତିଲ୍",
    resumeClass: "କ୍ଲାସ୍ ପୁନଃଆରମ୍ଭ କରନ୍ତୁ",
    suspendClass: "କ୍ଲାସ୍ ସ୍ଥଗିତ କରନ୍ତୁ",
    time: "ସମୟ",
    subject: "ବିଷୟ",
    faculty: "ଫ୍ୟାକଲ୍ଟି",
    room: "କୋଠରୀ",
    suspendedMessage: "ଏହି କ୍ଲାସ୍ ବର୍ତ୍ତମାନ ସ୍ଥଗିତ ଅଛି।",
    ongoingMessage: "ଏହି କ୍ଲାସ୍ ବର୍ତ୍ତମାନ ଚାଲୁଛି।",
    cancelledMessage: "ଏହି କ୍ଲାସ୍ ବାତିଲ୍ ହୋଇଛି।",
    academicHolidays: "ଶିକ୍ଷାଗତ ଛୁଟି",
    holidayDescription: "ସରକାରୀ/ଅଧିକୃତ ଛୁଟି ଯୋଡନ୍ତୁ। ତାରିଖ ଆସିଲେ CAMPX ସ୍ୱୟଂଚାଳିତ ଭାବରେ ଛୁଟି ଚିହ୍ନଟ କରିବ।",
    resetHolidays: "ଛୁଟି ରିସେଟ୍ କରନ୍ତୁ",
    holidayDate: "ଛୁଟି ତାରିଖ",
    holidayName: "ଛୁଟିର ନାମ",
    holidayPlaceholder: "ଯେପରିକି ଗଣେଶ ଚତୁର୍ଥୀ",
    addHoliday: "ଛୁଟି ଯୋଡନ୍ତୁ",
    noHolidays: "କୌଣସି ଶିକ୍ଷାଗତ ଛୁଟି ଯୋଡାଯାଇନାହିଁ।",
    delete: "ଡିଲିଟ୍",
    smartControl: "ସ୍ମାର୍ଟ ଶିକ୍ଷାଗତ ନିୟନ୍ତ୍ରଣ",
    smartDescription: "ଆଡମିନ୍ ଅପଡେଟ୍‌ଗୁଡିକ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ସଞ୍ଚିତ ହୋଇ ଛାତ୍ର ସମୟସୂଚୀରେ ଦେଖାଯାଏ। ଆଜିର ତାରିଖ କୌଣସି ଶିକ୍ଷାଗତ ଛୁଟି ସହିତ ମେଳିଲେ, CAMPX ନିୟମିତ କ୍ଲାସ୍ ସମୟସୂଚୀ ପରିବର୍ତ୍ତେ ଛୁଟି ଦେଖାଏ।",
    enterHoliday: "ଦୟାକରି ଛୁଟି ତାରିଖ ଏବଂ ନାମ ଦିଅନ୍ତୁ।",
    confirmTimetable: "ସମୟସୂଚୀକୁ ଡିଫଲ୍ଟ ସୂଚୀକୁ ରିସେଟ୍ କରିବେ କି?",
    confirmHolidays: "ଛୁଟି ତାଲିକାକୁ ଡିଫଲ୍ଟ ଛୁଟିକୁ ରିସେଟ୍ କରିବେ କି?",
  },
};


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
  const { language } = useLanguage();
  const t =
    ADMIN_TIMETABLE_TRANSLATIONS[language] ||
    ADMIN_TIMETABLE_TRANSLATIONS.en;

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
      alert(t.enterHoliday);
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
      t.confirmTimetable
    );

    if (!confirmReset) return;

    setTimetable(defaultTimetable);
  };

  const resetHolidays = () => {
    const confirmReset = window.confirm(
      t.confirmHolidays
    );

    if (!confirmReset) return;

    setHolidays(defaultHolidays);
  };

  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">
        <Topbar title={t.academicControl} />

        <div className="page-content">
          {/* HEADER */}

          <div className="page-header">
            <div>
              <div className="page-eyebrow">{t.administration}</div>

              <h1>{t.academicControl}</h1>

              <p>
                {t.manageDescription}
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
                <h2>{t.classSchedule}</h2>

                <p>
                  {t.scheduleDescription}
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
                  {{
                    Monday: t.monday,
                    Tuesday: t.tuesday,
                    Wednesday: t.wednesday,
                    Thursday: t.thursday,
                    Friday: t.friday,
                    Saturday: t.saturday,
                  }[day]}
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
                        <option value="Scheduled">{t.scheduled}</option>
                        <option value="Ongoing">{t.ongoing}</option>
                        <option value="Suspended">{t.suspended}</option>
                        <option value="Cancelled">{t.cancelled}</option>
                      </select>

                      <button
                        className={`suspend-class-btn ${
                          item.status === "Suspended" ? "active" : ""
                        }`}
                        onClick={() => toggleSuspend(selectedDay, item)}
                      >
                        {item.status === "Suspended"
                          ? t.resumeClass
                          : t.suspendClass}
                      </button>
                    </div>
                  </div>

                  {/* EDIT FIELDS */}

                  <div className="admin-class-fields">
                    <div>
                      <label>{t.time}</label>

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
                      <label>{t.subject}</label>

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
                      <label>{t.faculty}</label>

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
                      <label>{t.room}</label>

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
                      ⚠️ {t.suspendedMessage}
                    </div>
                  )}

                  {item.status === "Ongoing" && (
                    <div className="admin-status-message ongoing">
                      🟢 {t.ongoingMessage}
                    </div>
                  )}

                  {item.status === "Cancelled" && (
                    <div className="admin-status-message cancelled">
                      ❌ {t.cancelledMessage}
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
                <h2>{t.academicHolidays}</h2>

                <p>
                  {t.holidayDescription}
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
                <label>{t.holidayDate}</label>

                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(event) =>
                    setNewHolidayDate(event.target.value)
                  }
                />
              </div>

              <div>
                <label>{t.holidayName}</label>

                <input
                  type="text"
                  placeholder={t.holidayPlaceholder}
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
                  {t.noHolidays}
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
            <strong>💡 {t.smartControl}</strong>

            <span>
              {t.smartDescription}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}