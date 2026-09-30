import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  Plus,
  Minus,
  Save,
  ChevronDown,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";
import { addNotification } from "../notificationStorage";

const STUDENTS_KEY = "campx_students";
const ATTENDANCE_KEY = "campx_attendance";

const DEFAULT_STUDENTS = [
  {
    id: "CX2026001",
    name: "Adya Dash",
    branch: "CSE",
    semester: "6th",
    section: "A",
    hostel: "Hostel A",
    room: "A-204",
    status: "Active",
  },
  {
    id: "CX2026002",
    name: "Rahul Kumar",
    branch: "CSE",
    semester: "6th",
    section: "A",
    hostel: "Hostel B",
    room: "B-108",
    status: "Active",
  },
  {
    id: "CX2026003",
    name: "Priya Das",
    branch: "ECE",
    semester: "4th",
    section: "B",
    hostel: "Hostel A",
    room: "A-116",
    status: "Active",
  },
  {
    id: "CX2026004",
    name: "Ankit Sahu",
    branch: "CSE",
    semester: "6th",
    section: "B",
    hostel: "Hostel C",
    room: "C-302",
    status: "Active",
  },
  {
    id: "CX2026005",
    name: "Sneha Mohanty",
    branch: "EEE",
    semester: "4th",
    section: "A",
    hostel: "Hostel B",
    room: "B-214",
    status: "Active",
  },
];

const DEFAULT_SUBJECTS = [
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
   HELPERS
========================================================= */

function calculatePercentage(present, total) {
  if (!total) return 0;

  return Math.round(
    (Number(present) / Number(total)) * 100
  );
}

function calculateFine(percentage) {
  if (percentage >= 75) {
    return 0;
  }

  return (75 - percentage) * 50;
}

/* =========================================================
   STUDENTS
========================================================= */

function loadStudents() {
  try {
    const saved = localStorage.getItem(STUDENTS_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Student loading error:", error);
  }

  localStorage.setItem(
    STUDENTS_KEY,
    JSON.stringify(DEFAULT_STUDENTS)
  );

  return DEFAULT_STUDENTS;
}

/* =========================================================
   ATTENDANCE
========================================================= */

function loadAttendance() {
  try {
    const saved = localStorage.getItem(ATTENDANCE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    /*
      Support the old attendance format:

      [
        {
          id: "sub1",
          subject: "...",
          present: 28,
          total: 32
        }
      ]

      Convert it into:

      [
        {
          studentId: "CX2026001",
          subjects: [...]
        }
      ]
    */

    if (
      parsed.length > 0 &&
      parsed[0].studentId
    ) {
      return parsed;
    }

    if (
      parsed.length > 0 &&
      parsed[0].subject
    ) {
      return [
        {
          studentId: "CX2026001",
          subjects: parsed,
        },
      ];
    }

    return [];
  } catch (error) {
    console.error(
      "Attendance loading error:",
      error
    );

    return [];
  }
}

function saveAttendance(data) {
  localStorage.setItem(
    ATTENDANCE_KEY,
    JSON.stringify(data)
  );

  window.dispatchEvent(
    new Event("campx-attendance-updated")
  );
}

/* =========================================================
   GET OR CREATE ATTENDANCE FOR STUDENT
========================================================= */

function getSubjectsForStudent(
  attendance,
  studentId
) {
  const record = attendance.find(
    (item) =>
      item.studentId === studentId
  );

  if (record && Array.isArray(record.subjects)) {
    return record.subjects;
  }

  /*
    New students get a copy of the default
    subject structure.
  */

  return DEFAULT_SUBJECTS.map((subject) => ({
    ...subject,
    present: 0,
    total: 0,
  }));
}

/* =========================================================
   COMPONENT
========================================================= */



const ADMIN_ATTENDANCE_TRANSLATIONS = {
  en: {
    attendanceControl: "Attendance Control",
    administration: "ADMINISTRATION",
    manageAttendance: "Manage attendance for individual students.",
    selectStudent: "Select Student",
    chooseStudent: "Choose the student whose attendance you want to manage.",
    searchStudent: "Search student...",
    overallAttendance: "Overall Attendance",
    classes: "classes",
    below75: "Below 75%",
    subjects: "Subjects",
    totalFine: "Total Fine",
    dynamicFine: "Dynamic fine",
    required: "Required",
    minimumAttendance: "Minimum attendance",
    smartFine: "Smart Attendance Fine",
    fineRule: "75% or above = ₹0. Every 1% below 75% adds ₹50. When attendance improves, the fine decreases automatically.",
    subjectAttendance: "Subject Attendance",
    recordFor: "Record attendance for",
    fine: "Fine",
    absent: "Absent",
    present: "Present",
    saveAttendance: "Save Attendance",
    attendanceSaved: "Attendance saved",
    semester: "Semester",
    section: "Section",
    noStudent: "No student selected",
    attendanceAlert: "Attendance Alert",
    attendanceFineIncreased: "Attendance Fine Increased",
    attendanceFineDecreased: "Attendance Fine Decreased",
    attendanceRestored: "Attendance Restored",
    attendanceDropped: "Your attendance has fallen below 75%.",
    fineIncreasedMessage: "Your attendance fine has increased.",
    fineDecreasedMessage: "Your attendance fine has decreased.",
    fineRestoredMessage: "Your attendance fine is now ₹0.",
  },
  hi: {
    attendanceControl: "उपस्थिति नियंत्रण",
    administration: "प्रशासन",
    manageAttendance: "व्यक्तिगत छात्रों की उपस्थिति प्रबंधित करें।",
    selectStudent: "छात्र चुनें",
    chooseStudent: "जिस छात्र की उपस्थिति प्रबंधित करनी है, उसे चुनें।",
    searchStudent: "छात्र खोजें...",
    overallAttendance: "कुल उपस्थिति",
    classes: "कक्षाएं",
    below75: "75% से कम",
    subjects: "विषय",
    totalFine: "कुल जुर्माना",
    dynamicFine: "गतिशील जुर्माना",
    required: "आवश्यक",
    minimumAttendance: "न्यूनतम उपस्थिति",
    smartFine: "स्मार्ट उपस्थिति जुर्माना",
    fineRule: "75% या अधिक = ₹0। 75% से नीचे प्रत्येक 1% पर ₹50 जुर्माना जुड़ता है। उपस्थिति बढ़ने पर जुर्माना अपने आप कम हो जाता है।",
    subjectAttendance: "विषयवार उपस्थिति",
    recordFor: "उपस्थिति दर्ज करें:",
    fine: "जुर्माना",
    absent: "अनुपस्थित",
    present: "उपस्थित",
    saveAttendance: "उपस्थिति सहेजें",
    attendanceSaved: "उपस्थिति सहेजी गई",
    semester: "सेमेस्टर",
    section: "सेक्शन",
    noStudent: "कोई छात्र चयनित नहीं है",
    attendanceAlert: "उपस्थिति चेतावनी",
    attendanceFineIncreased: "उपस्थिति जुर्माना बढ़ा",
    attendanceFineDecreased: "उपस्थिति जुर्माना घटा",
    attendanceRestored: "उपस्थिति बहाल",
    attendanceDropped: "आपकी उपस्थिति 75% से नीचे चली गई है।",
    fineIncreasedMessage: "आपका उपस्थिति जुर्माना बढ़ गया है।",
    fineDecreasedMessage: "आपका उपस्थिति जुर्माना कम हो गया है।",
    fineRestoredMessage: "आपका उपस्थिति जुर्माना अब ₹0 है।",
  },
  or: {
    attendanceControl: "ଉପସ୍ଥାନ ନିୟନ୍ତ୍ରଣ",
    administration: "ପ୍ରଶାସନ",
    manageAttendance: "ବ୍ୟକ୍ତିଗତ ଛାତ୍ରଛାତ୍ରୀଙ୍କ ଉପସ୍ଥାନ ପରିଚାଳନା କରନ୍ତୁ।",
    selectStudent: "ଛାତ୍ର ଚୟନ କରନ୍ତୁ",
    chooseStudent: "ଯାହାର ଉପସ୍ଥାନ ପରିଚାଳନା କରିବେ ସେହି ଛାତ୍ରଙ୍କୁ ଚୟନ କରନ୍ତୁ।",
    searchStudent: "ଛାତ୍ର ଖୋଜନ୍ତୁ...",
    overallAttendance: "ମୋଟ ଉପସ୍ଥାନ",
    classes: "କ୍ଲାସ୍",
    below75: "75% ରୁ କମ୍",
    subjects: "ବିଷୟ",
    totalFine: "ମୋଟ ଜରିମାନା",
    dynamicFine: "ଗତିଶୀଳ ଜରିମାନା",
    required: "ଆବଶ୍ୟକ",
    minimumAttendance: "ସର୍ବନିମ୍ନ ଉପସ୍ଥାନ",
    smartFine: "ସ୍ମାର୍ଟ ଉପସ୍ଥାନ ଜରିମାନା",
    fineRule: "75% କିମ୍ବା ଅଧିକ = ₹0। 75% ରୁ କମ୍ ପ୍ରତ୍ୟେକ 1% ପାଇଁ ₹50 ଜରିମାନା ଯୋଗ ହୁଏ। ଉପସ୍ଥାନ ବଢ଼ିଲେ ଜରିମାନା ସ୍ୱୟଂଚାଳିତ ଭାବେ କମିଯାଏ।",
    subjectAttendance: "ବିଷୟ ଅନୁଯାୟୀ ଉପସ୍ଥାନ",
    recordFor: "ଉପସ୍ଥାନ ରେକର୍ଡ କରନ୍ତୁ:",
    fine: "ଜରିମାନା",
    absent: "ଅନୁପସ୍ଥିତ",
    present: "ଉପସ୍ଥିତ",
    saveAttendance: "ଉପସ୍ଥାନ ସଂରକ୍ଷଣ କରନ୍ତୁ",
    attendanceSaved: "ଉପସ୍ଥାନ ସଂରକ୍ଷିତ ହୋଇଛି",
    semester: "ସେମିଷ୍ଟର",
    section: "ସେକ୍ସନ୍",
    noStudent: "କୌଣସି ଛାତ୍ର ଚୟନ ହୋଇନାହାନ୍ତି",
    attendanceAlert: "ଉପସ୍ଥାନ ସତର୍କତା",
    attendanceFineIncreased: "ଉପସ୍ଥାନ ଜରିମାନା ବଢ଼ିଛି",
    attendanceFineDecreased: "ଉପସ୍ଥାନ ଜରିମାନା କମିଛି",
    attendanceRestored: "ଉପସ୍ଥାନ ପୁନଃସ୍ଥାପିତ",
    attendanceDropped: "ଆପଣଙ୍କ ଉପସ୍ଥାନ 75% ରୁ କମିଯାଇଛି।",
    fineIncreasedMessage: "ଆପଣଙ୍କ ଉପସ୍ଥାନ ଜରିମାନା ବଢ଼ିଛି।",
    fineDecreasedMessage: "ଆପଣଙ୍କ ଉପସ୍ଥାନ ଜରିମାନା କମିଛି।",
    fineRestoredMessage: "ଆପଣଙ୍କ ଉପସ୍ଥାନ ଜରିମାନା ବର୍ତ୍ତମାନ ₹0 ଅଟେ।",
  },
};

export default function AdminAttendance() {
  const { language } = useLanguage();
  const t = ADMIN_ATTENDANCE_TRANSLATIONS[language] || ADMIN_ATTENDANCE_TRANSLATIONS.en;

  const [students, setStudents] = useState([]);

  const [attendance, setAttendance] = useState([]);

  const [selectedStudentId, setSelectedStudentId] =
    useState("CX2026001");

  const [studentSearch, setStudentSearch] =
    useState("");

  const [showStudentList, setShowStudentList] =
    useState(false);

  const [subjects, setSubjects] = useState([]);

  const [lastSaved, setLastSaved] =
    useState(false);

  /* =========================================================
     LOAD EVERYTHING
  ========================================================= */

  const loadData = () => {
    const studentData = loadStudents();

    let attendanceData = loadAttendance();

    /*
      Make sure every student has an
      attendance record.
    */

    let changed = false;

    studentData.forEach((student) => {
      const exists = attendanceData.some(
        (item) =>
          item.studentId === student.id
      );

      if (!exists) {
        attendanceData.push({
          studentId: student.id,
          subjects:
            student.id === "CX2026001"
              ? DEFAULT_SUBJECTS.map(
                  (subject) => ({
                    ...subject,
                  })
                )
              : DEFAULT_SUBJECTS.map(
                  (subject) => ({
                    ...subject,
                    present: 0,
                    total: 0,
                  })
                ),
        });

        changed = true;
      }
    });

    if (changed) {
      saveAttendance(attendanceData);
    }

    setStudents(studentData);
    setAttendance(attendanceData);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener(
      "storage",
      handleUpdate
    );

    window.addEventListener(
      "campx-attendance-updated",
      handleUpdate
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
    };
  }, []);

  /* =========================================================
     SELECTED STUDENT
  ========================================================= */

  const selectedStudent =
    students.find(
      (student) =>
        student.id === selectedStudentId
    ) || students[0];

  /* =========================================================
     UPDATE SUBJECTS WHEN STUDENT CHANGES
  ========================================================= */

  useEffect(() => {
    if (!selectedStudent) {
      setSubjects([]);
      return;
    }

    setSubjects(
      getSubjectsForStudent(
        attendance,
        selectedStudent.id
      )
    );

    setLastSaved(false);
  }, [
    selectedStudentId,
    attendance,
  ]);

  /* =========================================================
     FILTER STUDENTS
  ========================================================= */

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query =
        studentSearch
          .toLowerCase()
          .trim();

      if (!query) {
        return true;
      }

      return (
        student.name
          .toLowerCase()
          .includes(query) ||
        student.id
          .toLowerCase()
          .includes(query) ||
        student.branch
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    students,
    studentSearch,
  ]);

  /* =========================================================
     SELECT STUDENT
  ========================================================= */

  const selectStudent = (student) => {
    setSelectedStudentId(student.id);
    setShowStudentList(false);
    setStudentSearch("");
  };

  /* =========================================================
     RECORD ATTENDANCE

     Present:
       present +1
       total +1

     Absent:
       present stays same
       total +1
  ========================================================= */

  const recordAttendance = (
    subjectId,
    attended
  ) => {
    if (!selectedStudent) return;

    const currentSubject =
      subjects.find(
        (subject) =>
          subject.id === subjectId
      );

    if (!currentSubject) return;

    const oldPercentage =
      calculatePercentage(
        currentSubject.present,
        currentSubject.total
      );

    const newTotal =
      Number(currentSubject.total) + 1;

    const newPresent =
      attended
        ? Number(currentSubject.present) + 1
        : Number(currentSubject.present);

    const newPercentage =
      calculatePercentage(
        newPresent,
        newTotal
      );

    const oldFine =
      calculateFine(oldPercentage);

    const newFine =
      calculateFine(newPercentage);

    const updatedSubjects =
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              present: newPresent,
              total: newTotal,
            }
          : subject
      );

    setSubjects(updatedSubjects);

    /*
      Update only this student's record.
    */

    const updatedAttendance =
      attendance.map((record) =>
        record.studentId ===
        selectedStudent.id
          ? {
              ...record,
              subjects:
                updatedSubjects,
            }
          : record
      );

    setAttendance(
      updatedAttendance
    );

    saveAttendance(
      updatedAttendance
    );

    setLastSaved(true);

    /* =======================================================
       SEND STUDENT-SPECIFIC NOTIFICATION
    ======================================================= */

    if (
      newPercentage < 75 &&
      oldPercentage >= 75
    ) {
      addNotification({
        audience: "student",
        studentId:
          selectedStudent.id,
        type: "attendance",
        title: t.attendanceAlert,
        message:
          `${currentSubject.code}: ${t.attendanceDropped} Current attendance: ${newPercentage}%. Current fine: ₹${newFine}.`,
        status: "Warning",
        relatedId:
          currentSubject.id,
      });
    }

    /*
      Fine increased.
    */

    else if (
      newFine > oldFine
    ) {
      addNotification({
        audience: "student",
        studentId:
          selectedStudent.id,
        type: "attendance",
        title:
          "Attendance Fine Increased",
        message:
          `${currentSubject.code}: ${t.fineIncreasedMessage} Current attendance: ${newPercentage}%. Current fine: ₹${newFine}.`,
        status: "Warning",
        relatedId:
          currentSubject.id,
      });
    }

    /*
      Fine decreased but attendance
      is still below 75%.
    */

    else if (
      newFine < oldFine &&
      newPercentage < 75
    ) {
      addNotification({
        audience: "student",
        studentId:
          selectedStudent.id,
        type: "attendance",
        title:
          "Attendance Fine Decreased",
        message:
          `${currentSubject.code}: ${t.fineDecreasedMessage} Current attendance: ${newPercentage}%. Current fine: ₹${newFine}.`,
        status: "Updated",
        relatedId:
          currentSubject.id,
      });
    }

    /*
      Attendance reaches 75%.
    */

    else if (
      oldPercentage < 75 &&
      newPercentage >= 75
    ) {
      addNotification({
        audience: "student",
        studentId:
          selectedStudent.id,
        type: "attendance",
        title: t.attendanceRestored,
        message:
          `${currentSubject.code}: ${t.fineRestoredMessage} Current attendance: ${newPercentage}%.`,
        status: "Resolved",
        relatedId:
          currentSubject.id,
      });
    }
  };

  /* =========================================================
     SAVE BUTTON
  ========================================================= */

  const handleSave = () => {
    if (!selectedStudent) return;

    const updatedAttendance =
      attendance.map((record) =>
        record.studentId ===
        selectedStudent.id
          ? {
              ...record,
              subjects,
            }
          : record
      );

    /*
      If the student doesn't have a record,
      create one.
    */

    const exists =
      updatedAttendance.some(
        (record) =>
          record.studentId ===
          selectedStudent.id
      );

    if (!exists) {
      updatedAttendance.push({
        studentId:
          selectedStudent.id,
        subjects,
      });
    }

    setAttendance(
      updatedAttendance
    );

    saveAttendance(
      updatedAttendance
    );

    setLastSaved(true);

    setTimeout(() => {
      setLastSaved(false);
    }, 2500);
  };

  /* =========================================================
     TOTAL ATTENDANCE
  ========================================================= */

  const totalPresent =
    subjects.reduce(
      (sum, subject) =>
        sum +
        Number(subject.present || 0),
      0
    );

  const totalClasses =
    subjects.reduce(
      (sum, subject) =>
        sum +
        Number(subject.total || 0),
      0
    );

  const overallPercentage =
    calculatePercentage(
      totalPresent,
      totalClasses
    );

  const totalFine =
    subjects.reduce(
      (sum, subject) =>
        sum +
        calculateFine(
          calculatePercentage(
            subject.present,
            subject.total
          )
        ),
      0
    );

  const subjectsBelow75 =
    subjects.filter(
      (subject) =>
        calculatePercentage(
          subject.present,
          subject.total
        ) < 75
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Topbar title={t.attendanceControl} />

        <div className="content">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="welcome-section">

            <div>

              <p className="eyebrow">
                {t.administration}
              </p>

              <h1>
                {t.attendanceControl}
              </h1>

              <p>
                {t.manageAttendance}
              </p>

            </div>

            <div className="attendance-header-icon">
              <BookOpen size={28} />
            </div>

          </section>


          {/* =================================================
              STUDENT SELECTOR
          ================================================= */}

          <section className="student-selector-card">

            <div className="student-selector-title">

              <div className="student-selector-icon">
                <Users size={20} />
              </div>

              <div>

                <strong>
                  {t.selectStudent}
                </strong>

                <span>
                  {t.chooseStudent}
                </span>

              </div>

            </div>


            <div className="student-selector">

              <button
                className="student-selector-button"
                onClick={() =>
                  setShowStudentList(
                    !showStudentList
                  )
                }
              >

                <div className="selected-student-avatar">
                  {selectedStudent?.name
                    ?.split(" ")
                    .map(
                      (word) =>
                        word[0]
                    )
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="selected-student-text">

                  <strong>
                    {selectedStudent?.name}
                  </strong>

                  <span>
                    {selectedStudent?.id}
                    {" • "}
                    {selectedStudent?.branch}
                    {" • "}
                    {selectedStudent?.semester}
                  </span>

                </div>

                <ChevronDown
                  size={18}
                />

              </button>


              {showStudentList && (

                <div className="student-selector-dropdown">

                  <div className="student-selector-search">

                    <Search size={16} />

                    <input
                      autoFocus
                      placeholder={t.searchStudent}
                      value={studentSearch}
                      onChange={(e) =>
                        setStudentSearch(
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <div className="student-selector-results">

                    {filteredStudents.map(
                      (student) => {

                        const studentRecord =
                          attendance.find(
                            (record) =>
                              record.studentId ===
                              student.id
                          );

                        const studentSubjects =
                          studentRecord?.subjects ||
                          [];

                        const present =
                          studentSubjects.reduce(
                            (sum, subject) =>
                              sum +
                              Number(
                                subject.present ||
                                  0
                              ),
                            0
                          );

                        const total =
                          studentSubjects.reduce(
                            (sum, subject) =>
                              sum +
                              Number(
                                subject.total ||
                                  0
                              ),
                            0
                          );

                        const percentage =
                          calculatePercentage(
                            present,
                            total
                          );

                        return (

                          <button
                            key={student.id}
                            className={
                              student.id ===
                              selectedStudentId
                                ? "student-selector-option selected"
                                : "student-selector-option"
                            }
                            onClick={() =>
                              selectStudent(
                                student
                              )
                            }
                          >

                            <div className="selector-avatar">
                              {student.name
                                .split(" ")
                                .map(
                                  (word) =>
                                    word[0]
                                )
                                .join("")
                                .slice(0, 2)}
                            </div>

                            <div className="selector-student-info">

                              <strong>
                                {student.name}
                              </strong>

                              <span>
                                {student.id}
                                {" • "}
                                {student.branch}
                                {" • "}
                                {student.semester}
                              </span>

                            </div>

                            <span
                              className={
                                percentage < 75
                                  ? "selector-percentage danger"
                                  : "selector-percentage"
                              }
                            >
                              {total > 0
                                ? `${percentage}%`
                                : "--"}
                            </span>

                          </button>

                        );
                      }
                    )}

                  </div>

                </div>

              )}

            </div>

          </section>


          {/* =================================================
              SELECTED STUDENT
          ================================================= */}

          {selectedStudent && (

            <section className="attendance-admin-student">

              <div className="attendance-admin-avatar">
                {selectedStudent.name
                  .split(" ")
                  .map(
                    (word) =>
                      word[0]
                  )
                  .join("")
                  .slice(0, 2)}
              </div>

              <div>

                <strong>
                  {selectedStudent.name}
                </strong>

                <p>
                  {selectedStudent.id}
                  {" • "}
                  {selectedStudent.branch}
                  {" • "}
                  {selectedStudent.semester}
                  {" Semester • Section "}
                  {selectedStudent.section}
                  {" • "}
                  {selectedStudent.hostel}
                  {" • "}
                  {selectedStudent.room}
                </p>

              </div>

            </section>

          )}


          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="attendance-overview-grid">

            <div className="attendance-overview-card">

              <div className="attendance-card-icon blue">
                <BookOpen size={21} />
              </div>

              <span>
                {t.overallAttendance}
              </span>

              <strong>
                {overallPercentage}%
              </strong>

              <small>
                {totalPresent} /{" "}
                {totalClasses} classes
              </small>

            </div>


            <div className="attendance-overview-card">

              <div className="attendance-card-icon orange">
                <AlertTriangle size={21} />
              </div>

              <span>
                {t.below75}
              </span>

              <strong>
                {subjectsBelow75.length}
              </strong>

              <small>
                Subjects
              </small>

            </div>


            <div className="attendance-overview-card">

              <div className="attendance-card-icon red">
                <IndianRupee size={21} />
              </div>

              <span>
                {t.totalFine}
              </span>

              <strong>
                ₹{totalFine}
              </strong>

              <small>
                {t.dynamicFine}
              </small>

            </div>


            <div className="attendance-overview-card">

              <div className="attendance-card-icon green">
                <CheckCircle2 size={21} />
              </div>

              <span>
                {t.required}
              </span>

              <strong>
                75%
              </strong>

              <small>
                {t.minimumAttendance}
              </small>

            </div>

          </section>


          {/* =================================================
              FINE RULE
          ================================================= */}

          <div className="attendance-admin-info">

            <IndianRupee size={19} />

            <div>

              <strong>
                {t.smartFine}
              </strong>

              <p>
                75% or above = ₹0. Every 1%
                below 75% adds ₹50. When
                attendance improves, the fine
                decreases automatically.
              </p>

            </div>

          </div>


          {/* =================================================
              SUBJECTS
          ================================================= */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <h3>
                  {t.subjectAttendance}
                </h3>

                <p>
                  {t.recordFor}{" "}
                  {selectedStudent?.name}.
                </p>

              </div>

              <BookOpen size={20} />

            </div>


            <div className="admin-attendance-list">

              {subjects.map(
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

                  const low =
                    percentage < 75;

                  return (

                    <div
                      className="admin-attendance-row"
                      key={subject.id}
                    >

                      {/* SUBJECT */}

                      <div className="admin-attendance-subject">

                        <div className="subject-icon">
                          <BookOpen size={18} />
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


                      {/* ATTENDANCE */}

                      <div className="admin-attendance-numbers">

                        <strong>
                          {subject.present}/
                          {subject.total}
                        </strong>

                        <span
                          className={
                            low
                              ? "percentage-danger"
                              : "percentage-safe"
                          }
                        >
                          {percentage}%
                        </span>

                      </div>


                      {/* FINE */}

                      <div
                        className={
                          low
                            ? "admin-attendance-fine"
                            : "admin-attendance-fine safe"
                        }
                      >

                        {low ? (
                          <>
                            <AlertTriangle
                              size={14}
                            />
                            {t.fine} ₹{fine}
                          </>
                        ) : (
                          <>
                            <CheckCircle2
                              size={14}
                            />
                            {t.fine} ₹0
                          </>
                        )}

                      </div>


                      {/* ACTIONS */}

                      <div className="attendance-admin-actions">

                        <button
                          className="attendance-action-btn absent"
                          onClick={() =>
                            recordAttendance(
                              subject.id,
                              false
                            )
                          }
                        >

                          <Minus size={15} />
                            {t.absent}
                          </button>


                        <button
                          className="attendance-action-btn present"
                          onClick={() =>
                            recordAttendance(
                              subject.id,
                              true
                            )
                          }
                        >

                          <Plus size={15} />
                            {t.present}
                          </button>

                      </div>

                    </div>

                  );
                }
              )}

            </div>


            {/* =================================================
                SAVE
            ================================================= */}

            <div className="attendance-save-area">

              <button
                className="primary-btn"
                onClick={handleSave}
              >

                <Save size={17} />
                            {t.saveAttendance}
                          </button>

              {lastSaved && (

                <span className="attendance-saved-message">

                  <CheckCircle2 size={14} />
                            {t.attendanceSaved}
                          </span>

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}