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

export default function AdminAttendance() {
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
        title: "Attendance Alert",
        message:
          `Your ${currentSubject.code} attendance has fallen to ${newPercentage}%. Your current fine is ₹${newFine}. Please improve your attendance.`,
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
          `Your ${currentSubject.code} attendance is now ${newPercentage}%. Your fine has increased to ₹${newFine}.`,
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
          `Your ${currentSubject.code} attendance is now ${newPercentage}%. Your fine has decreased to ₹${newFine}.`,
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
        title: "Attendance Restored",
        message:
          `Your ${currentSubject.code} attendance is now ${newPercentage}%. Your attendance fine is now ₹0.`,
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

        <Topbar title="Attendance Control" />

        <div className="content">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="welcome-section">

            <div>

              <p className="eyebrow">
                ADMINISTRATION
              </p>

              <h1>
                Attendance Control
              </h1>

              <p>
                Manage attendance for
                individual students.
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
                  Select Student
                </strong>

                <span>
                  Choose the student whose
                  attendance you want to manage.
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
                      placeholder="Search student..."
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
                Subjects
              </small>

            </div>


            <div className="attendance-overview-card">

              <div className="attendance-card-icon red">
                <IndianRupee size={21} />
              </div>

              <span>
                Total Fine
              </span>

              <strong>
                ₹{totalFine}
              </strong>

              <small>
                Dynamic fine
              </small>

            </div>


            <div className="attendance-overview-card">

              <div className="attendance-card-icon green">
                <CheckCircle2 size={21} />
              </div>

              <span>
                Required
              </span>

              <strong>
                75%
              </strong>

              <small>
                Minimum attendance
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
                Smart Attendance Fine
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
                  Subject Attendance
                </h3>

                <p>
                  Record attendance for{" "}
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
                            Fine ₹{fine}
                          </>
                        ) : (
                          <>
                            <CheckCircle2
                              size={14}
                            />
                            Fine ₹0
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

                          Absent

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

                          Present

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

                Save Attendance

              </button>

              {lastSaved && (

                <span className="attendance-saved-message">

                  <CheckCircle2 size={14} />

                  Attendance saved

                </span>

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}