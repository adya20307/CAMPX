import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";


const STUDENT_TRANSLATIONS = {
  en: {
    students: "Students",
    management: "Student Management",
    managementDesc: "View and manage registered CAMPX students.",
    refresh: "Refresh",
    addStudent: "Add Student",
    searchPlaceholder: "Search by name, registration number, branch...",
    registeredStudents: "Registered Students",
    student: "student",
    studentsPlural: "students",
    loading: "Loading students...",
    noStudentsFound: "No students found",
    tryDifferent: "Try a different search.",
    noRegistered: "No students have been registered yet.",
    addFirst: "Add First Student",
    studentColumn: "Student",
    registrationNo: "Registration No.",
    branch: "Branch",
    batch: "Batch",
    semester: "Semester",
    hostel: "Hostel",
    action: "Action",
    hosteller: "Hosteller",
    nonHosteller: "Non-Hosteller",
    deleteStudent: "Delete Student",
    delete: "Delete",
    administrator: "Administrator",
    expired: "Your session has expired. Please login again.",
    loadFailed: "Failed to load students",
    unableLoad: "Unable to load students",
    deleteFailed: "Failed to delete student.",
    unableDelete: "Unable to delete student.",
    confirmDelete: (name, id) =>
      `Are you sure you want to delete ${name} (${id})?\n\nThis action cannot be undone.`,
    studentFallback: "this student",
    dash: "—",
    errorTitle: "Error",
  },
  hi: {
    students: "छात्र",
    management: "छात्र प्रबंधन",
    managementDesc: "पंजीकृत CAMPX छात्रों को देखें और प्रबंधित करें।",
    refresh: "रिफ्रेश",
    addStudent: "छात्र जोड़ें",
    searchPlaceholder: "नाम, रजिस्ट्रेशन नंबर, शाखा से खोजें...",
    registeredStudents: "पंजीकृत छात्र",
    student: "छात्र",
    studentsPlural: "छात्र",
    loading: "छात्र लोड हो रहे हैं...",
    noStudentsFound: "कोई छात्र नहीं मिला",
    tryDifferent: "कोई अलग खोज आज़माएं।",
    noRegistered: "अभी तक कोई छात्र पंजीकृत नहीं हुआ है।",
    addFirst: "पहला छात्र जोड़ें",
    studentColumn: "छात्र",
    registrationNo: "रजिस्ट्रेशन नंबर",
    branch: "शाखा",
    batch: "बैच",
    semester: "सेमेस्टर",
    hostel: "हॉस्टल",
    action: "कार्रवाई",
    hosteller: "हॉस्टल छात्र",
    nonHosteller: "गैर-हॉस्टल छात्र",
    deleteStudent: "छात्र हटाएं",
    delete: "हटाएं",
    administrator: "एडमिनिस्ट्रेटर",
    expired: "आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।",
    loadFailed: "छात्र लोड करने में विफल",
    unableLoad: "छात्र लोड नहीं हो सके",
    deleteFailed: "छात्र हटाने में विफल।",
    unableDelete: "छात्र हटाया नहीं जा सका।",
    confirmDelete: (name, id) =>
      `क्या आप ${name} (${id}) को हटाना चाहते हैं?\n\nयह कार्रवाई पूर्ववत नहीं की जा सकती।`,
    studentFallback: "इस छात्र",
    dash: "—",
    errorTitle: "त्रुटि",
  },
  or: {
    students: "ଛାତ୍ରଛାତ୍ରୀ",
    management: "ଛାତ୍ର ପରିଚାଳନା",
    managementDesc: "ପଞ୍ଜୀକୃତ CAMPX ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ଦେଖନ୍ତୁ ଏବଂ ପରିଚାଳନା କରନ୍ତୁ।",
    refresh: "ରିଫ୍ରେଶ୍",
    addStudent: "ଛାତ୍ର ଯୋଡନ୍ତୁ",
    searchPlaceholder: "ନାମ, ପଞ୍ଜୀକରଣ ନମ୍ବର, ଶାଖା ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
    registeredStudents: "ପଞ୍ଜୀକୃତ ଛାତ୍ରଛାତ୍ରୀ",
    student: "ଛାତ୍ର",
    studentsPlural: "ଛାତ୍ରଛାତ୍ରୀ",
    loading: "ଛାତ୍ରଛାତ୍ରୀ ଲୋଡ୍ ହେଉଛନ୍ତି...",
    noStudentsFound: "କୌଣସି ଛାତ୍ର ମିଳିଲା ନାହିଁ",
    tryDifferent: "ଅନ୍ୟ ଏକ ସନ୍ଧାନ ଚେଷ୍ଟା କରନ୍ତୁ।",
    noRegistered: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଛାତ୍ର ପଞ୍ଜୀକୃତ ହୋଇନାହାନ୍ତି।",
    addFirst: "ପ୍ରଥମ ଛାତ୍ର ଯୋଡନ୍ତୁ",
    studentColumn: "ଛାତ୍ର",
    registrationNo: "ପଞ୍ଜୀକରଣ ନମ୍ବର",
    branch: "ଶାଖା",
    batch: "ବ୍ୟାଚ୍",
    semester: "ସେମିଷ୍ଟର",
    hostel: "ହଷ୍ଟେଲ୍",
    action: "କାର୍ଯ୍ୟ",
    hosteller: "ହଷ୍ଟେଲ୍ ଛାତ୍ର",
    nonHosteller: "ନନ୍-ହଷ୍ଟେଲ୍ ଛାତ୍ର",
    deleteStudent: "ଛାତ୍ରଙ୍କୁ ହଟାନ୍ତୁ",
    delete: "ହଟାନ୍ତୁ",
    administrator: "ଆଡମିନିଷ୍ଟ୍ରେଟର୍",
    expired: "ଆପଣଙ୍କ ସେସନ୍ ସମାପ୍ତ ହୋଇଛି। ଦୟାକରି ପୁଣି ଲଗଇନ୍ କରନ୍ତୁ।",
    loadFailed: "ଛାତ୍ରଛାତ୍ରୀ ଲୋଡ୍ କରିବା ବିଫଳ ହେଲା",
    unableLoad: "ଛାତ୍ରଛାତ୍ରୀ ଲୋଡ୍ ହୋଇପାରିଲେ ନାହିଁ",
    deleteFailed: "ଛାତ୍ରଙ୍କୁ ହଟାଇବା ବିଫଳ ହେଲା।",
    unableDelete: "ଛାତ୍ରଙ୍କୁ ହଟାଇ ପାରିଲୁ ନାହିଁ।",
    confirmDelete: (name, id) =>
      `ଆପଣ ${name} (${id})ଙ୍କୁ ହଟାଇବାକୁ ନିଶ୍ଚିତ କି?\n\nଏହି କାର୍ଯ୍ୟକୁ ପୁନଃସ୍ଥାପନ କରିହେବ ନାହିଁ।`,
    studentFallback: "ଏହି ଛାତ୍ର",
    dash: "—",
    errorTitle: "ତ୍ରୁଟି",
  },
};

export default function AdminStudents() {

  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = STUDENT_TRANSLATIONS[language] || STUDENT_TRANSLATIONS.en;

  // ==========================================
  // STATE
  // ==========================================

  const [students, setStudents] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  const loadStudents = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "campx_token"
        );

      const response =
        await fetch(
          `${API_URL}/students`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          t.loadFailed
        );

      }

      setStudents(
        Array.isArray(data.students)
          ? data.students
          : Array.isArray(data.data)
          ? data.data
          : []
      );

    } catch (err) {

      console.error(
        "Load students error:",
        err
      );

      setError(
        err.message ||
        t.unableLoad
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadStudents();

  }, [language]);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents =
    students.filter((student) => {

      const text = `
        ${student.name || ""}
        ${student.student_id || ""}
        ${student.studentId || ""}
        ${student.email || ""}
        ${student.branch || ""}
        ${student.batch_year || ""}
        ${student.batchYear || ""}
      `.toLowerCase();

      return text.includes(
        search.toLowerCase()
      );

    });


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const handleDeleteStudent = async (student) => {
    const studentId = student.student_id || student.studentId;
    const studentName = student.name || t.studentFallback;

    const confirmed = window.confirm(
      t.confirmDelete(studentName, studentId)
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = localStorage.getItem("campx_token");

      if (!token) {
        throw new Error(
          t.expired
        );
      }

      const response = await fetch(
        `${API_URL}/students/${encodeURIComponent(studentId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t.deleteFailed
        );
      }

      setStudents((previous) =>
        previous.filter(
          (item) =>
            (item.student_id || item.studentId) !== studentId
        )
      );
    } catch (error) {
      console.error("Delete student error:", error);
      setError(
        error.message || t.unableDelete
      );
    }
  };


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="app-layout">

      {/* ======================================
          SIDEBAR
      ======================================= */}

      <Sidebar admin />


      {/* ======================================
          MAIN
      ======================================= */}

      <main className="main-content">

        <Topbar
          title={t.students}
        />


        <div className="dashboard-content">

          {/* ==================================
              HEADER
          ================================== */}

          <div
            className="dashboard-header"
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "20px",
              marginBottom: "25px",
            }}
          >

            <div>

              <h1>
                {t.management}
              </h1>

              <p>
                {t.managementDesc}
              </p>

            </div>


            {/* ==================================
                ACTIONS
            ================================== */}

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >

              <button
                className="secondary-btn"
                onClick={loadStudents}
              >

                <RefreshCw
                  size={17}
                />

                {t.refresh}

              </button>


              <button
                className="primary-btn"
                onClick={() =>
                  navigate(
                    "/admin/students/add"
                  )
                }
              >

                <UserPlus
                  size={17}
                />

                {t.addStudent}

              </button>

            </div>

          </div>


          {/* ==================================
              SEARCH
          ================================== */}

          <div
            className="dashboard-card"
            style={{
              padding: "18px",
              marginBottom: "20px",
            }}
          >

            <div
              style={{
                position: "relative",
                maxWidth: "500px",
              }}
            >

              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color: "#64748b",
                }}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={t.searchPlaceholder}
                style={{
                  width: "100%",
                  padding:
                    "12px 15px 12px 42px",
                  border:
                    "1px solid #dbe3ef",
                  borderRadius: "8px",
                  outline: "none",
                  boxSizing:
                    "border-box",
                }}
              />

            </div>

          </div>


          {/* ==================================
              ERROR
          ================================== */}

          {error && (

            <div
              style={{
                background: "#fff1f2",
                border:
                  "1px solid #fecdd3",
                color: "#be123c",
                padding: "14px 18px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >

              {error}

            </div>

          )}


          {/* ==================================
              STUDENT TABLE
          ================================== */}

          <div
            className="dashboard-card"
            style={{
              padding: 0,
              overflow: "hidden",
            }}
          >

            <div
              style={{
                padding: "22px",
                borderBottom:
                  "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >

              <Users size={22} />

              <div>

                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  {t.registeredStudents}
                </h2>

                <p
                  style={{
                    margin:
                      "4px 0 0",
                    color: "#64748b",
                  }}
                >
                  {filteredStudents.length}{" "}
                  {filteredStudents.length === 1
                    ? t.student
                    : t.studentsPlural}
                </p>

              </div>

            </div>


            {loading ? (

              <div
                style={{
                  padding: "50px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                {t.loading}
              </div>

            ) : filteredStudents.length === 0 ? (

              <div
                style={{
                  padding: "60px",
                  textAlign: "center",
                }}
              >

                <Users
                  size={45}
                  style={{
                    color: "#94a3b8",
                    marginBottom:
                      "12px",
                  }}
                />

                <h3>
                  {t.noStudentsFound}
                </h3>

                <p
                  style={{
                    color: "#64748b",
                  }}
                >
                  {search
                    ? t.tryDifferent
                    : t.noRegistered}
                </p>

                {!search && (

                  <button
                    className="primary-btn"
                    onClick={() =>
                      navigate(
                        "/admin/students/add"
                      )
                    }
                  >
                    <UserPlus
                      size={17}
                    />

                    {t.addFirst}
                  </button>

                )}

              </div>

            ) : (

              <div
                style={{
                  overflowX: "auto",
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                  }}
                >

                  <thead>

                    <tr
                      style={{
                        background:
                          "#f8fafc",
                      }}
                    >

                      <th
                        style={thStyle}
                      >
                        {t.studentColumn}
                      </th>

                      <th
                        style={thStyle}
                      >
                        {t.registrationNo}
                      </th>

                      <th
                        style={thStyle}
                      >
                        {t.branch}
                      </th>

                      <th
                        style={thStyle}
                      >
                        {t.batch}
                      </th>

                      <th
                        style={thStyle}
                      >
                        {t.semester}
                      </th>

                      <th
                        style={thStyle}
                      >
                        {t.hostel}
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign: "center",
                        }}
                      >
                        {t.action}
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredStudents.map(
                      (student) => (

                        <tr
                          key={
                            student.id ||
                            student.student_id
                          }
                        >

                          <td
                            style={tdStyle}
                          >

                            <strong>
                              {
                                student.name ||
                                t.dash
                              }
                            </strong>

                            <div
                              style={{
                                fontSize:
                                  "13px",
                                color:
                                  "#64748b",
                                marginTop:
                                  "3px",
                              }}
                            >
                              {
                                student.email ||
                                t.dash
                              }
                            </div>

                          </td>


                          <td
                            style={tdStyle}
                          >
                            {
                              student.student_id ||
                              student.studentId ||
                              t.dash
                            }
                          </td>


                          <td
                            style={tdStyle}
                          >
                            {
                              student.branch ||
                              t.dash
                            }
                          </td>


                          <td
                            style={tdStyle}
                          >
                            {
                              student.batch_year ||
                              student.batchYear ||
                              t.dash
                            }
                          </td>


                          <td
                            style={tdStyle}
                          >
                            {
                              student.semester ||
                              t.dash
                            }
                          </td>


                          <td
                            style={tdStyle}
                          >

                            {(
                              student.hostel_status ||
                              student.hostelStatus
                            ) ===
                            "HOSTELLER" ? (
                              <span
                                style={{
                                  padding:
                                    "5px 10px",
                                  borderRadius:
                                    "20px",
                                  background:
                                    "#dcfce7",
                                  color:
                                    "#166534",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    "600",
                                }}
                              >
                                {t.hosteller}
                              </span>
                            ) : (
                              <span
                                style={{
                                  padding:
                                    "5px 10px",
                                  borderRadius:
                                    "20px",
                                  background:
                                    "#f1f5f9",
                                  color:
                                    "#475569",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    "600",
                                }}
                              >
                                {t.nonHosteller}
                              </span>
                            )}

                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              textAlign: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteStudent(student)
                              }
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "7px",
                                padding: "8px 12px",
                                border: "1px solid #fecaca",
                                borderRadius: "8px",
                                background: "#fff5f5",
                                color: "#dc2626",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                              title={t.deleteStudent}
                            >
                              <Trash2 size={16} />
                              {t.delete}
                            </button>
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}


// ==========================================
// TABLE STYLES
// ==========================================

const thStyle = {
  textAlign: "left",
  padding: "15px 18px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  borderBottom:
    "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "16px 18px",
  borderBottom:
    "1px solid #eef2f7",
  color: "#334155",
  fontSize: "14px",
};