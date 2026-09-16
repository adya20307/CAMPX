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

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

export default function AdminStudents() {

  const navigate = useNavigate();

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
          "Failed to load students"
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
        "Unable to load students"
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

  }, []);


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
    const studentName = student.name || "this student";

    const confirmed = window.confirm(
      `Are you sure you want to delete ${studentName} (${studentId})?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = localStorage.getItem("campx_token");

      if (!token) {
        throw new Error(
          "Your session has expired. Please login again."
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
          data.message || "Failed to delete student."
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
        error.message || "Unable to delete student."
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
          title="Students"
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
                Student Management
              </h1>

              <p>
                View and manage registered
                CAMPX students.
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

                Refresh

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

                Add Student

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
                placeholder="Search by name, registration number, branch..."
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
                  Registered Students
                </h2>

                <p
                  style={{
                    margin:
                      "4px 0 0",
                    color: "#64748b",
                  }}
                >
                  {filteredStudents.length}
                  {" "}student
                  {filteredStudents.length !== 1
                    ? "s"
                    : ""}
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
                Loading students...
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
                  No students found
                </h3>

                <p
                  style={{
                    color: "#64748b",
                  }}
                >
                  {search
                    ? "Try a different search."
                    : "No students have been registered yet."}
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

                    Add First Student
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
                        Student
                      </th>

                      <th
                        style={thStyle}
                      >
                        Registration No.
                      </th>

                      <th
                        style={thStyle}
                      >
                        Branch
                      </th>

                      <th
                        style={thStyle}
                      >
                        Batch
                      </th>

                      <th
                        style={thStyle}
                      >
                        Semester
                      </th>

                      <th
                        style={thStyle}
                      >
                        Hostel
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign: "center",
                        }}
                      >
                        Action
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
                                "—"
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
                                "—"
                              }
                            </div>

                          </td>


                          <td
                            style={tdStyle}
                          >
                            {
                              student.student_id ||
                              student.studentId ||
                              "—"
                            }
                          </td>


                          <td
                            style={tdStyle}
                          >
                            {
                              student.branch ||
                              "—"
                            }
                          </td>


                          <td
                            style={tdStyle}
                          >
                            {
                              student.batch_year ||
                              student.batchYear ||
                              "—"
                            }
                          </td>


                          <td
                            style={tdStyle}
                          >
                            {
                              student.semester ||
                              "—"
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
                                Hosteller
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
                                Non-Hosteller
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
                              title="Delete Student"
                            >
                              <Trash2 size={16} />
                              Delete
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