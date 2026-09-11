import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Users,
  User,
  BookOpen,
  Home,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  FileText,
  FileCheck,
  ClipboardList,
  DoorOpen,
  Bell,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { getNotifications } from "../notificationStorage";

const STUDENTS_KEY = "campx_students";
const ATTENDANCE_KEY = "campx_attendance";

const COMPLAINTS_KEY = "campxComplaints";
const REQUESTS_KEY = "campxRequests";
const APPLICATIONS_KEY = "campx_applications";
const GATEPASS_KEY = "campx_gate_passes";

const CURRENT_STUDENT_ID = "CX2026001";
const API_URL = import.meta.env.VITE_API_URL || "/api";


// =========================================================
// DEFAULT STUDENTS
// =========================================================

const DEFAULT_STUDENTS = [
  {
    id: "CX2026001",
    name: "Adya Dash",
    email: "adya@campx.edu",
    phone: "",
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
    email: "rahul@campx.edu",
    phone: "",
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
    email: "priya@campx.edu",
    phone: "",
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
    email: "ankit@campx.edu",
    phone: "",
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
    email: "sneha@campx.edu",
    phone: "",
    branch: "EEE",
    semester: "4th",
    section: "A",
    hostel: "Hostel B",
    room: "B-214",
    status: "Active",
  },
];


// =========================================================
// DEFAULT SUBJECTS
// =========================================================

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
];


// =========================================================
// ATTENDANCE HELPERS
// =========================================================

function calculatePercentage(present, total) {
  if (!total) return 0;

  return Math.round(
    (Number(present) / Number(total)) * 100
  );
}


function calculateFine(percentage) {
  if (percentage >= 75) return 0;

  return (75 - percentage) * 50;
}


// =========================================================
// STORAGE HELPERS
// =========================================================

function getArrayFromStorage(key) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}


// =========================================================
// STUDENTS
// =========================================================

function getStudents() {
  try {
    const saved =
      localStorage.getItem(STUDENTS_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    localStorage.setItem(
      STUDENTS_KEY,
      JSON.stringify(DEFAULT_STUDENTS)
    );

    return DEFAULT_STUDENTS;
  } catch {
    return DEFAULT_STUDENTS;
  }
}

async function getStudentsFromApi() {
  const response = await fetch(`${API_URL}/students`);

  if (!response.ok) {
    throw new Error("Unable to load students from the backend");
  }

  const data = await response.json();

  if (!Array.isArray(data.students)) {
    throw new Error("Invalid student response");
  }

  localStorage.setItem(
    STUDENTS_KEY,
    JSON.stringify(data.students)
  );

  return data.students;
}


// =========================================================
// ATTENDANCE
// =========================================================

function getAttendance() {
  try {
    const saved =
      localStorage.getItem(ATTENDANCE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {

        // New format
        if (
          parsed.length > 0 &&
          parsed[0].studentId
        ) {
          return parsed;
        }

        // Migrate old format
        if (parsed.length > 0) {
          const migrated = [
            {
              studentId: CURRENT_STUDENT_ID,
              subjects: parsed,
            },
          ];

          localStorage.setItem(
            ATTENDANCE_KEY,
            JSON.stringify(migrated)
          );

          return migrated;
        }
      }
    }
  } catch (error) {
    console.error(
      "Attendance migration error:",
      error
    );
  }

  return [];
}


// =========================================================
// MAIN COMPONENT
// =========================================================

export default function AdminStudents() {

  const [students, setStudents] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [complaints, setComplaints] =
    useState([]);

  const [requests, setRequests] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [gatePasses, setGatePasses] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [branchFilter, setBranchFilter] =
    useState("All");

  const [semesterFilter, setSemesterFilter] =
    useState("All");

  const [selectedStudent, setSelectedStudent] =
    useState(null);


  // =======================================================
  // LOAD ALL DATA
  // =======================================================

  const loadData = async () => {

    let studentData;

    try {
      studentData = await getStudentsFromApi();
    } catch (error) {
      console.error("Student API error:", error);
      studentData = getStudents();
    }

    setStudents(studentData);


    let attendanceData =
      getAttendance();


    // Create attendance for students
    // who don't have a record yet.

    let changed = false;

    studentData.forEach((student) => {

      const exists =
        attendanceData.some(
          (item) =>
            item.studentId === student.id
        );


      if (!exists) {

        attendanceData.push({
          studentId: student.id,

          subjects:
            student.id === CURRENT_STUDENT_ID
              ? DEFAULT_SUBJECTS
              : DEFAULT_SUBJECTS.map(
                  (subject) => ({
                    ...subject,

                    present:
                      Math.max(
                        0,
                        subject.present -
                          Math.floor(
                            Math.random() * 8
                          )
                      ),
                  })
                ),
        });

        changed = true;
      }
    });


    if (changed) {

      localStorage.setItem(
        ATTENDANCE_KEY,
        JSON.stringify(
          attendanceData
        )
      );
    }


    setAttendance(
      attendanceData
    );


    // Other CampX data

    setComplaints(
      getArrayFromStorage(
        COMPLAINTS_KEY
      )
    );

    setRequests(
      getArrayFromStorage(
        REQUESTS_KEY
      )
    );

    setApplications(
      getArrayFromStorage(
        APPLICATIONS_KEY
      )
    );

    setGatePasses(
      getArrayFromStorage(
        GATEPASS_KEY
      )
    );

    setNotifications(
      getNotifications()
    );
  };


  // =======================================================
  // INITIAL LOAD + LIVE UPDATES
  // =======================================================

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

    window.addEventListener(
      "campx-notification",
      handleUpdate
    );

    window.addEventListener(
      "campx-complaint-updated",
      handleUpdate
    );

    window.addEventListener(
      "campx-request-updated",
      handleUpdate
    );

    window.addEventListener(
      "campx-gatepass-updated",
      handleUpdate
    );


    const interval =
      setInterval(
        loadData,
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

      window.removeEventListener(
        "campx-complaint-updated",
        handleUpdate
      );

      window.removeEventListener(
        "campx-request-updated",
        handleUpdate
      );

      window.removeEventListener(
        "campx-gatepass-updated",
        handleUpdate
      );

      clearInterval(interval);
    };

  }, []);


  // =======================================================
  // FILTER STUDENTS
  // =======================================================

  const filteredStudents =
    useMemo(() => {

      return students.filter(
        (student) => {

          const searchValue =
            search.toLowerCase();


          const matchesSearch =
            student.name
              .toLowerCase()
              .includes(searchValue) ||
            student.id
              .toLowerCase()
              .includes(searchValue);


          const matchesBranch =
            branchFilter === "All" ||
            student.branch ===
              branchFilter;


          const matchesSemester =
            semesterFilter === "All" ||
            student.semester ===
              semesterFilter;


          return (
            matchesSearch &&
            matchesBranch &&
            matchesSemester
          );
        }
      );

    }, [
      students,
      search,
      branchFilter,
      semesterFilter,
    ]);


  // =======================================================
  // GET ATTENDANCE
  // =======================================================

  const getStudentAttendance = (
    studentId
  ) => {

    const record =
      attendance.find(
        (item) =>
          item.studentId ===
          studentId
      );

    return (
      record?.subjects ||
      []
    );
  };


  // =======================================================
  // STUDENT STATS
  // =======================================================

  const getStudentStats = (
    studentId
  ) => {

    const subjects =
      getStudentAttendance(
        studentId
      );


    const present =
      subjects.reduce(
        (sum, item) =>
          sum +
          Number(
            item.present || 0
          ),
        0
      );


    const total =
      subjects.reduce(
        (sum, item) =>
          sum +
          Number(
            item.total || 0
          ),
        0
      );


    const overall =
      calculatePercentage(
        present,
        total
      );


    const fine =
      subjects.reduce(
        (sum, item) =>
          sum +
          calculateFine(
            calculatePercentage(
              item.present,
              item.total
            )
          ),
        0
      );


    return {
      overall,
      fine,
      subjects,
    };
  };


  // =======================================================
  // 360° PROFILE DATA
  // =======================================================

  const getStudentActivity = (
    studentId
  ) => {

    const studentComplaints =
      complaints.filter(
        (item) =>
          item.studentId ===
          studentId
      );


    const studentRequests =
      requests.filter(
        (item) =>
          item.studentId ===
          studentId
      );


    const studentApplications =
      applications.filter(
        (item) =>
          item.studentId ===
          studentId
      );


    const studentGatePasses =
      gatePasses.filter(
        (item) =>
          item.studentId ===
          studentId
      );


    const studentNotifications =
      notifications.filter(
        (item) =>
          item.studentId ===
          studentId
      );


    return {
      complaints:
        studentComplaints,

      requests:
        studentRequests,

      applications:
        studentApplications,

      gatePasses:
        studentGatePasses,

      notifications:
        studentNotifications,
    };
  };


  // =======================================================
  // CLOSE PROFILE
  // =======================================================

  const closeProfile = () => {
    setSelectedStudent(null);
  };


  // =======================================================
  // STATUS CLASS
  // =======================================================

  const getStatusClass = (
    status
  ) => {

    if (
      status === "Approved" ||
      status === "Resolved" ||
      status === "Completed"
    ) {
      return "status-success";
    }

    if (
      status === "Rejected"
    ) {
      return "status-danger";
    }

    if (
      status === "In Progress"
    ) {
      return "status-progress";
    }

    return "status-pending";
  };


  return (

    <div className="app-layout">

      {/* ADMIN SIDEBAR */}
      <Sidebar />


      <main className="main-content">

        <Topbar title="Students" />


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
                Student Management
              </h1>

              <p>
                Manage student profiles,
                academic information and
                complete campus activity.
              </p>

            </div>


            <div className="students-header-icon">
              <Users size={28} />
            </div>

          </section>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="student-management-stats">

            <div className="student-management-stat">

              <div className="management-stat-icon blue">
                <Users size={20} />
              </div>

              <div>

                <span>
                  Total Students
                </span>

                <strong>
                  {students.length}
                </strong>

              </div>

            </div>


            <div className="student-management-stat">

              <div className="management-stat-icon green">
                <CheckCircle2 size={20} />
              </div>

              <div>

                <span>
                  Active
                </span>

                <strong>
                  {
                    students.filter(
                      (s) =>
                        s.status ===
                        "Active"
                    ).length
                  }
                </strong>

              </div>

            </div>


            <div className="student-management-stat">

              <div className="management-stat-icon orange">
                <AlertTriangle size={20} />
              </div>

              <div>

                <span>
                  Attendance Warning
                </span>

                <strong>
                  {
                    students.filter(
                      (student) =>
                        getStudentStats(
                          student.id
                        ).overall < 75
                    ).length
                  }
                </strong>

              </div>

            </div>

          </section>


          {/* =================================================
              STUDENT LIST
          ================================================= */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <h3>
                  All Students
                </h3>

                <p>
                  Search and open a complete
                  360° student profile.
                </p>

              </div>

              <Users size={20} />

            </div>


            {/* SEARCH */}

            <div className="student-filter-bar">

              <div className="student-search">

                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search by name or student ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>


              <select
                value={branchFilter}
                onChange={(e) =>
                  setBranchFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Branches
                </option>

                <option value="CSE">
                  CSE
                </option>

                <option value="ECE">
                  ECE
                </option>

                <option value="EEE">
                  EEE
                </option>

              </select>


              <select
                value={semesterFilter}
                onChange={(e) =>
                  setSemesterFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Semesters
                </option>

                <option value="4th">
                  4th
                </option>

                <option value="6th">
                  6th
                </option>

              </select>

            </div>


            {/* STUDENTS */}

            <div className="student-management-list">

              {filteredStudents.map(
                (student) => {

                  const stats =
                    getStudentStats(
                      student.id
                    );

                  const warning =
                    stats.overall < 75;


                  return (

                    <button
                      key={student.id}
                      className="student-management-row"
                      onClick={() =>
                        setSelectedStudent(
                          student
                        )
                      }
                    >

                      <div className="student-management-avatar">

                        {student.name
                          .split(" ")
                          .map(
                            (word) =>
                              word[0]
                          )
                          .join("")
                          .slice(0, 2)}

                      </div>


                      <div className="student-management-info">

                        <strong>
                          {student.name}
                        </strong>

                        <span>
                          {student.id}
                        </span>

                      </div>


                      <div className="student-management-academic">

                        <strong>
                          {student.branch}
                        </strong>

                        <span>
                          {student.semester} Semester
                        </span>

                      </div>


                      <div className="student-management-hostel">

                        <Home size={14} />

                        <span>
                          {student.hostel}
                          {" • "}
                          {student.room}
                        </span>

                      </div>


                      <div
                        className={
                          warning
                            ? "student-attendance-warning"
                            : "student-attendance-safe"
                        }
                      >

                        {warning ? (
                          <AlertTriangle size={13} />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}

                        {stats.overall}%

                      </div>


                      <ChevronRight
                        size={18}
                        className="student-row-arrow"
                      />

                    </button>

                  );

                }
              )}

            </div>


            {filteredStudents.length === 0 && (

              <div className="student-management-empty">

                <Users size={35} />

                <strong>
                  No students found
                </strong>

                <p>
                  Try changing your search
                  or filters.
                </p>

              </div>

            )}

          </section>

        </div>

      </main>


      {/* =====================================================
          360° STUDENT PROFILE
      ===================================================== */}

      {selectedStudent && (

        <div
          className="student-profile-overlay"
          onClick={closeProfile}
        >

          <div
            className="student-profile-modal student-profile-360"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {(() => {

              const stats =
                getStudentStats(
                  selectedStudent.id
                );

              const activity =
                getStudentActivity(
                  selectedStudent.id
                );


              const resolvedComplaints =
                activity.complaints.filter(
                  (item) =>
                    item.status ===
                    "Resolved"
                ).length;


              const pendingRequests =
                activity.requests.filter(
                  (item) =>
                    item.status !==
                    "Resolved"
                ).length;


              const approvedApplications =
                activity.applications.filter(
                  (item) =>
                    item.status ===
                    "Approved"
                ).length;


              const approvedGatePasses =
                activity.gatePasses.filter(
                  (item) =>
                    item.status ===
                    "Approved"
                ).length;


              return (
                <>
                  {/* ========================================
                      PROFILE HEADER
                  ========================================= */}

                  <div className="student-profile-modal-header">

                    <div className="profile-header-student">

                      <div className="profile-large-avatar">

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

                        <p className="eyebrow">
                          360° STUDENT PROFILE
                        </p>

                        <h2>
                          {selectedStudent.name}
                        </h2>

                        <span>
                          {selectedStudent.id}
                        </span>

                      </div>

                    </div>


                    <button
                      className="modal-close-btn"
                      onClick={closeProfile}
                    >
                      <X size={19} />
                    </button>

                  </div>


                  {/* ========================================
                      BASIC INFORMATION
                  ========================================= */}

                  <div className="student-profile-details">

                    <div className="profile-detail-card">

                      <User size={17} />

                      <div>

                        <span>
                          Branch
                        </span>

                        <strong>
                          {selectedStudent.branch}
                        </strong>

                      </div>

                    </div>


                    <div className="profile-detail-card">

                      <BookOpen size={17} />

                      <div>

                        <span>
                          Semester
                        </span>

                        <strong>
                          {selectedStudent.semester}
                        </strong>

                      </div>

                    </div>


                    <div className="profile-detail-card">

                      <Home size={17} />

                      <div>

                        <span>
                          Hostel
                        </span>

                        <strong>
                          {selectedStudent.hostel}
                        </strong>

                      </div>

                    </div>


                    <div className="profile-detail-card">

                      <Home size={17} />

                      <div>

                        <span>
                          Room
                        </span>

                        <strong>
                          {selectedStudent.room}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* ========================================
                      360° OVERVIEW CARDS
                  ========================================= */}

                  <div className="student-360-section">

                    <div className="profile-section-title">

                      <div>

                        <h3>
                          Campus Activity
                        </h3>

                        <p>
                          Complete CampX activity
                          for this student.
                        </p>

                      </div>

                    </div>


                    <div className="student-360-grid">

                      {/* ATTENDANCE */}

                      <div className="student-360-card">

                        <div className="student-360-card-icon blue">
                          <BookOpen size={17} />
                        </div>

                        <span>
                          Attendance
                        </span>

                        <strong>
                          {stats.overall}%
                        </strong>

                        <small>
                          Fine ₹{stats.fine}
                        </small>

                      </div>


                      {/* COMPLAINTS */}

                      <div className="student-360-card">

                        <div className="student-360-card-icon orange">
                          <AlertTriangle size={17} />
                        </div>

                        <span>
                          Complaints
                        </span>

                        <strong>
                          {activity.complaints.length}
                        </strong>

                        <small>
                          {resolvedComplaints} resolved
                        </small>

                      </div>


                      {/* REQUESTS */}

                      <div className="student-360-card">

                        <div className="student-360-card-icon purple">
                          <FileText size={17} />
                        </div>

                        <span>
                          Requests
                        </span>

                        <strong>
                          {activity.requests.length}
                        </strong>

                        <small>
                          {pendingRequests} pending
                        </small>

                      </div>


                      {/* APPLICATIONS */}

                      <div className="student-360-card">

                        <div className="student-360-card-icon green">
                          <FileCheck size={17} />
                        </div>

                        <span>
                          Applications
                        </span>

                        <strong>
                          {activity.applications.length}
                        </strong>

                        <small>
                          {approvedApplications} approved
                        </small>

                      </div>


                      {/* GATE PASSES */}

                      <div className="student-360-card">

                        <div className="student-360-card-icon blue">
                          <DoorOpen size={17} />
                        </div>

                        <span>
                          Gate Passes
                        </span>

                        <strong>
                          {activity.gatePasses.length}
                        </strong>

                        <small>
                          {approvedGatePasses} approved
                        </small>

                      </div>

                    </div>

                  </div>


                  {/* ========================================
                      ATTENDANCE
                  ========================================= */}

                  <div className="student-profile-attendance">

                    <div className="profile-section-title">

                      <div>

                        <h3>
                          Attendance
                        </h3>

                        <p>
                          Subject-wise attendance
                          and current fine.
                        </p>

                      </div>

                      <BookOpen size={19} />

                    </div>


                    <div className="profile-attendance-summary">

                      <div>

                        <span>
                          Overall
                        </span>

                        <strong
                          className={
                            stats.overall < 75
                              ? "percentage-danger"
                              : "percentage-safe"
                          }
                        >
                          {stats.overall}%
                        </strong>

                      </div>


                      <div>

                        <span>
                          Current Fine
                        </span>

                        <strong>
                          ₹{stats.fine}
                        </strong>

                      </div>

                    </div>


                    <div className="profile-subject-list">

                      {stats.subjects.map(
                        (subject) => {

                          const value =
                            calculatePercentage(
                              subject.present,
                              subject.total
                            );

                          const fine =
                            calculateFine(
                              value
                            );


                          return (

                            <div
                              className="profile-subject-row"
                              key={subject.id}
                            >

                              <div>

                                <strong>
                                  {subject.code}
                                </strong>

                                <span>
                                  {subject.subject}
                                </span>

                              </div>


                              <div>

                                <strong
                                  className={
                                    value < 75
                                      ? "percentage-danger"
                                      : "percentage-safe"
                                  }
                                >
                                  {value}%
                                </strong>

                                <span>
                                  Fine ₹{fine}
                                </span>

                              </div>

                            </div>

                          );

                        }
                      )}

                    </div>

                  </div>


                  {/* ========================================
                      COMPLAINTS
                  ========================================= */}

                  <div className="student-360-list-section">

                    <div className="profile-section-title">

                      <div>

                        <h3>
                          Complaints
                        </h3>

                        <p>
                          Student complaint history.
                        </p>

                      </div>

                      <ClipboardList size={19} />

                    </div>


                    {activity.complaints.length === 0 ? (

                      <div className="profile-empty-small">
                        No complaints submitted.
                      </div>

                    ) : (

                      <div className="profile-activity-list">

                        {activity.complaints
                          .slice(0, 5)
                          .map((item) => (

                            <div
                              className="profile-activity-row"
                              key={item.id}
                            >

                              <div>

                                <strong>
                                  {item.issue ||
                                    item.title ||
                                    "Complaint"}
                                </strong>

                                <span>
                                  {item.id}
                                </span>

                              </div>

                              <span
                                className={`profile-status ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {item.status ||
                                  "Submitted"}
                              </span>

                            </div>

                          ))}

                      </div>

                    )}

                  </div>


                  {/* ========================================
                      REQUESTS
                  ========================================= */}

                  <div className="student-360-list-section">

                    <div className="profile-section-title">

                      <div>

                        <h3>
                          Requests
                        </h3>

                        <p>
                          Student service requests.
                        </p>

                      </div>

                      <FileText size={19} />

                    </div>


                    {activity.requests.length === 0 ? (

                      <div className="profile-empty-small">
                        No requests submitted.
                      </div>

                    ) : (

                      <div className="profile-activity-list">

                        {activity.requests
                          .slice(0, 5)
                          .map((item) => (

                            <div
                              className="profile-activity-row"
                              key={item.id}
                            >

                              <div>

                                <strong>
                                  {item.type ||
                                    item.title ||
                                    "Student Request"}
                                </strong>

                                <span>
                                  {item.id}
                                </span>

                              </div>

                              <span
                                className={`profile-status ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {item.status ||
                                  "Submitted"}
                              </span>

                            </div>

                          ))}

                      </div>

                    )}

                  </div>


                  {/* ========================================
                      APPLICATIONS
                  ========================================= */}

                  <div className="student-360-list-section">

                    <div className="profile-section-title">

                      <div>

                        <h3>
                          Applications
                        </h3>

                        <p>
                          Applications and approval
                          history.
                        </p>

                      </div>

                      <FileCheck size={19} />

                    </div>


                    {activity.applications.length === 0 ? (

                      <div className="profile-empty-small">
                        No applications submitted.
                      </div>

                    ) : (

                      <div className="profile-activity-list">

                        {activity.applications
                          .slice(0, 5)
                          .map((item) => (

                            <div
                              className="profile-activity-row"
                              key={item.id}
                            >

                              <div>

                                <strong>
                                  {item.type ||
                                    item.subject ||
                                    "Application"}
                                </strong>

                                <span>
                                  {item.id}
                                </span>

                              </div>

                              <span
                                className={`profile-status ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {item.status ||
                                  "Submitted"}
                              </span>

                            </div>

                          ))}

                      </div>

                    )}

                  </div>


                  {/* ========================================
                      GATE PASSES
                  ========================================= */}

                  <div className="student-360-list-section">

                    <div className="profile-section-title">

                      <div>

                        <h3>
                          Gate Passes
                        </h3>

                        <p>
                          Gate-pass request history.
                        </p>

                      </div>

                      <DoorOpen size={19} />

                    </div>


                    {activity.gatePasses.length === 0 ? (

                      <div className="profile-empty-small">
                        No gate passes submitted.
                      </div>

                    ) : (

                      <div className="profile-activity-list">

                        {activity.gatePasses
                          .slice(0, 5)
                          .map((item) => (

                            <div
                              className="profile-activity-row"
                              key={item.id}
                            >

                              <div>

                                <strong>
                                  {item.destination ||
                                    "Gate Pass"}
                                </strong>

                                <span>
                                  {item.exitDate ||
                                    item.id}
                                </span>

                              </div>

                              <span
                                className={`profile-status ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {item.status ||
                                  "Pending"}
                              </span>

                            </div>

                          ))}

                      </div>

                    )}

                  </div>


                  {/* ========================================
                      NOTIFICATIONS
                  ========================================= */}

                  <div className="student-360-list-section">

                    <div className="profile-section-title">

                      <div>

                        <h3>
                          Recent Notifications
                        </h3>

                        <p>
                          Important updates sent
                          to this student.
                        </p>

                      </div>

                      <Bell size={19} />

                    </div>


                    {activity.notifications.length === 0 ? (

                      <div className="profile-empty-small">
                        No student notifications.
                      </div>

                    ) : (

                      <div className="profile-activity-list">

                        {activity.notifications
                          .slice(0, 5)
                          .map((item) => (

                            <div
                              className="profile-activity-row"
                              key={item.id}
                            >

                              <div>

                                <strong>
                                  {item.title ||
                                    "Notification"}
                                </strong>

                                <span>
                                  {item.message ||
                                    "Campus update"}
                                </span>

                              </div>

                              <span
                                className={`profile-status ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {item.status ||
                                  "Info"}
                              </span>

                            </div>

                          ))}

                      </div>

                    )}

                  </div>


                  {/* ========================================
                      FOOTER
                  ========================================= */}

                  <div className="student-profile-footer">

                    <button
                      className="secondary-btn"
                      onClick={closeProfile}
                    >
                      Close
                    </button>

                  </div>

                </>
              );

            })()}

          </div>

        </div>

      )}

    </div>
  );
}