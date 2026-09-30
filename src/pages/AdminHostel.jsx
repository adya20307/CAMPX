import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Search,
  Users,
  DoorOpen,
  CheckCircle2,
  AlertCircle,
  BedDouble,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

// =====================================================
// TRANSLATIONS
// =====================================================

const ADMIN_HOSTEL_TRANSLATIONS = {
  en: {
    title: "Hostel Management",
    subtitle:
      "Manage hostel students, rooms, occupancy and hostel status.",
    totalStudents: "Total Hostellers",
    occupiedRooms: "Occupied Rooms",
    availableBeds: "Available Beds",
    complaints: "Hostel Complaints",
    search: "Search students...",
    allHostels: "All Hostels",
    allStatus: "All Status",
    occupied: "Occupied",
    available: "Available",
    student: "Student",
    registrationNo: "Registration No.",
    hostel: "Hostel",
    room: "Room",
    status: "Status",
    actions: "Actions",
    noStudents: "No hostel students found.",
    hostelA: "Hostel A",
    hostelB: "Hostel B",
    hostelC: "Hostel C",
    hosteller: "Hosteller",
    roomAssigned: "Room Assigned",
    noRoom: "No Room",
    view: "View",
    close: "Close",
    studentDetails: "Student Details",
    name: "Name",
    email: "Email",
    branch: "Branch",
    semester: "Semester",
    section: "Section",
    batchYear: "Batch Year",
    hostelStatus: "Hostel Status",
    roomNo: "Room No.",
    refresh: "Refresh",
    loading: "Loading...",
    loadFailed: "Unable to load hostel students.",
  },

  hi: {
    title: "छात्रावास प्रबंधन",
    subtitle:
      "छात्रावास के छात्रों, कमरों, अधिभोग और छात्रावास स्थिति का प्रबंधन करें।",
    totalStudents: "कुल छात्रावासी",
    occupiedRooms: "भरे हुए कमरे",
    availableBeds: "उपलब्ध बेड",
    complaints: "छात्रावास शिकायतें",
    search: "छात्र खोजें...",
    allHostels: "सभी छात्रावास",
    allStatus: "सभी स्थिति",
    occupied: "भरा हुआ",
    available: "उपलब्ध",
    student: "छात्र",
    registrationNo: "पंजीकरण संख्या",
    hostel: "छात्रावास",
    room: "कमरा",
    status: "स्थिति",
    actions: "कार्रवाई",
    noStudents: "कोई छात्रावास छात्र नहीं मिला।",
    hostelA: "छात्रावास A",
    hostelB: "छात्रावास B",
    hostelC: "छात्रावास C",
    hosteller: "छात्रावासी",
    roomAssigned: "कमरा आवंटित",
    noRoom: "कोई कमरा नहीं",
    view: "देखें",
    close: "बंद करें",
    studentDetails: "छात्र विवरण",
    name: "नाम",
    email: "ईमेल",
    branch: "शाखा",
    semester: "सेमेस्टर",
    section: "सेक्शन",
    batchYear: "बैच वर्ष",
    hostelStatus: "छात्रावास स्थिति",
    roomNo: "कमरा संख्या",
    refresh: "रिफ्रेश",
    loading: "लोड हो रहा है...",
    loadFailed: "छात्रावास छात्रों को लोड नहीं किया जा सका।",
  },

  or: {
    title: "ହଷ୍ଟେଲ୍ ପରିଚାଳନା",
    subtitle:
      "ହଷ୍ଟେଲ୍ ଛାତ୍ର, କୋଠରୀ, ଅଧିକୃତ ସ୍ଥିତି ଏବଂ ହଷ୍ଟେଲ୍ ସ୍ଥିତି ପରିଚାଳନା କରନ୍ତୁ।",
    totalStudents: "ମୋଟ ହଷ୍ଟେଲ୍ ଛାତ୍ର",
    occupiedRooms: "ବ୍ୟବହୃତ କୋଠରୀ",
    availableBeds: "ଉପଲବ୍ଧ ବେଡ୍",
    complaints: "ହଷ୍ଟେଲ୍ ଅଭିଯୋଗ",
    search: "ଛାତ୍ର ଖୋଜନ୍ତୁ...",
    allHostels: "ସମସ୍ତ ହଷ୍ଟେଲ୍",
    allStatus: "ସମସ୍ତ ସ୍ଥିତି",
    occupied: "ବ୍ୟବହୃତ",
    available: "ଉପଲବ୍ଧ",
    student: "ଛାତ୍ର",
    registrationNo: "ପଞ୍ଜୀକରଣ ନମ୍ବର",
    hostel: "ହଷ୍ଟେଲ୍",
    room: "କୋଠରୀ",
    status: "ସ୍ଥିତି",
    actions: "କାର୍ଯ୍ୟ",
    noStudents: "କୌଣସି ହଷ୍ଟେଲ୍ ଛାତ୍ର ମିଳିଲେ ନାହିଁ।",
    hostelA: "ହଷ୍ଟେଲ୍ A",
    hostelB: "ହଷ୍ଟେଲ୍ B",
    hostelC: "ହଷ୍ଟେଲ୍ C",
    hosteller: "ହଷ୍ଟେଲ୍ ଛାତ୍ର",
    roomAssigned: "କୋଠରୀ ଆବଣ୍ଟିତ",
    noRoom: "କୋଠରୀ ନାହିଁ",
    view: "ଦେଖନ୍ତୁ",
    close: "ବନ୍ଦ କରନ୍ତୁ",
    studentDetails: "ଛାତ୍ର ବିବରଣୀ",
    name: "ନାମ",
    email: "ଇମେଲ୍",
    branch: "ଶାଖା",
    semester: "ସେମେଷ୍ଟର",
    section: "ସେକ୍ସନ୍",
    batchYear: "ବ୍ୟାଚ୍ ବର୍ଷ",
    hostelStatus: "ହଷ୍ଟେଲ୍ ସ୍ଥିତି",
    roomNo: "କୋଠରୀ ନମ୍ବର",
    refresh: "ରିଫ୍ରେଶ୍",
    loading: "ଲୋଡ୍ ହେଉଛି...",
    loadFailed: "ହଷ୍ଟେଲ୍ ଛାତ୍ରମାନଙ୍କୁ ଲୋଡ୍ କରିହେଲା ନାହିଁ।",
  },
};

// =====================================================
// COMPONENT
// =====================================================

export default function AdminHostel() {
  const { language } = useLanguage();

  const t =
    ADMIN_HOSTEL_TRANSLATIONS[language] ||
    ADMIN_HOSTEL_TRANSLATIONS.en;

  // ===================================================
  // STATE
  // ===================================================

  const [students, setStudents] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [hostelFilter, setHostelFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  // ===================================================
  // API URL
  // ===================================================

  const API_URL =
    import.meta.env.VITE_API_URL || "/api";

  // ===================================================
  // LOAD STUDENTS
  // ===================================================

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

      const studentData =
        Array.isArray(data.students)
          ? data.students
          : Array.isArray(data.data)
          ? data.data
          : [];

      // Only HOSTELLER students
      const hostelStudents =
        studentData.filter(
          (student) =>
            String(
              student.hostel_status ||
              student.hostelStatus ||
              ""
            ).toUpperCase() ===
            "HOSTELLER"
        );

      setStudents(hostelStudents);
    } catch (err) {
      console.error(
        "Hostel students load error:",
        err
      );

      setError(
        err.message ||
        t.loadFailed
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadStudents();
  }, [language]);

  // ===================================================
  // FILTERED STUDENTS
  // ===================================================

  const filteredStudents =
    useMemo(() => {
      return students.filter(
        (student) => {
          const name =
            student.name || "";

          const registration =
            student.student_id ||
            student.studentId ||
            student.registration_number ||
            student.registrationNumber ||
            "";

          const email =
            student.email || "";

          const hostel =
            student.hostel ||
            student.hostel_name ||
            student.hostelName ||
            "";

          const room =
            student.room ||
            student.room_no ||
            student.roomNo ||
            "";

          const status =
            student.hostel_status ||
            student.hostelStatus ||
            "";

          const searchableText =
            `
              ${name}
              ${registration}
              ${email}
              ${hostel}
              ${room}
            `
              .toLowerCase()
              .trim();

          const matchesSearch =
            searchableText.includes(
              search
                .toLowerCase()
                .trim()
            );

          const matchesHostel =
            hostelFilter === "ALL" ||
            hostel === hostelFilter;

          const hasRoom =
            room &&
            room !== "NA" &&
            room !== "-";

          const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter ===
              "OCCUPIED" &&
              hasRoom) ||
            (statusFilter ===
              "AVAILABLE" &&
              !hasRoom);

          return (
            matchesSearch &&
            matchesHostel &&
            matchesStatus
          );
        }
      );
    }, [
      students,
      search,
      hostelFilter,
      statusFilter,
    ]);

  // ===================================================
  // STATISTICS
  // ===================================================

  const totalStudents =
    students.length;

  const occupiedRooms =
    new Set(
      students
        .map(
          (student) =>
            student.room ||
            student.room_no ||
            student.roomNo
        )
        .filter(
          (room) =>
            room &&
            room !== "NA" &&
            room !== "-"
        )
    ).size;

  const availableBeds =
    Math.max(
      0,
      totalStudents -
        occupiedRooms
    );

  // ===================================================
  // FORMAT HOSTEL
  // ===================================================

  const formatHostel = (
    hostel
  ) => {
    if (!hostel) {
      return "—";
    }

    const value =
      String(hostel)
        .toUpperCase();

    if (value === "HOSTEL A") {
      return t.hostelA;
    }

    if (value === "HOSTEL B") {
      return t.hostelB;
    }

    if (value === "HOSTEL C") {
      return t.hostelC;
    }

    return hostel;
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="app-layout">

      <Sidebar admin />

      <main className="main-content">

        <Topbar />

        <div className="page-container">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="admin-page-header">

            <div>

              <div className="eyebrow">
                CAMPX
              </div>

              <h1>
                <Building2
                  size={30}
                  style={{
                    verticalAlign:
                      "middle",
                    marginRight:
                      "10px",
                  }}
                />

                {t.title}
              </h1>

              <p>
                {t.subtitle}
              </p>

            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadStudents}
            >
              {t.refresh}
            </button>

          </div>

          {/* =========================================
              STAT CARDS
          ========================================= */}

          <div
            className="dashboard-grid"
            style={{
              marginBottom:
                "24px",
            }}
          >

            <div className="dashboard-card">

              <div className="card-icon">
                <Users size={22} />
              </div>

              <div>
                <span>
                  {t.totalStudents}
                </span>

                <strong>
                  {totalStudents}
                </strong>
              </div>

            </div>

            <div className="dashboard-card">

              <div className="card-icon">
                <DoorOpen size={22} />
              </div>

              <div>
                <span>
                  {t.occupiedRooms}
                </span>

                <strong>
                  {occupiedRooms}
                </strong>
              </div>

            </div>

            <div className="dashboard-card">

              <div className="card-icon">
                <BedDouble size={22} />
              </div>

              <div>
                <span>
                  {t.availableBeds}
                </span>

                <strong>
                  {availableBeds}
                </strong>
              </div>

            </div>

            <div className="dashboard-card">

              <div className="card-icon">
                <AlertCircle
                  size={22}
                />
              </div>

              <div>
                <span>
                  {t.complaints}
                </span>

                <strong>
                  0
                </strong>
              </div>

            </div>

          </div>

          {/* =========================================
              FILTERS
          ========================================= */}

          <div
            className="card"
            style={{
              marginBottom:
                "20px",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                gap: "12px",
                flexWrap:
                  "wrap",
              }}
            >

              <div
                style={{
                  flex: "1 1 280px",
                  position:
                    "relative",
                }}
              >

                <Search
                  size={18}
                  style={{
                    position:
                      "absolute",
                    left: "12px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                  }}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder={
                    t.search
                  }
                  style={{
                    width: "100%",
                    padding:
                      "11px 12px 11px 40px",
                  }}
                />

              </div>

              <select
                value={hostelFilter}
                onChange={(e) =>
                  setHostelFilter(
                    e.target.value
                  )
                }
                style={{
                  minWidth:
                    "170px",
                }}
              >
                <option value="ALL">
                  {t.allHostels}
                </option>

                <option value="Hostel A">
                  {t.hostelA}
                </option>

                <option value="Hostel B">
                  {t.hostelB}
                </option>

                <option value="Hostel C">
                  {t.hostelC}
                </option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                style={{
                  minWidth:
                    "170px",
                }}
              >
                <option value="ALL">
                  {t.allStatus}
                </option>

                <option value="OCCUPIED">
                  {t.occupied}
                </option>

                <option value="AVAILABLE">
                  {t.available}
                </option>
              </select>

            </div>

          </div>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div
              className="error-message"
              style={{
                marginBottom:
                  "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* =========================================
              TABLE
          ========================================= */}

          <div className="card">

            {loading ? (
              <div
                style={{
                  padding:
                    "40px",
                  textAlign:
                    "center",
                }}
              >
                {t.loading}
              </div>
            ) : filteredStudents.length ===
              0 ? (
              <div
                style={{
                  padding:
                    "40px",
                  textAlign:
                    "center",
                }}
              >
                {t.noStudents}
              </div>
            ) : (
              <div
                style={{
                  overflowX:
                    "auto",
                }}
              >

                <table
                  style={{
                    width:
                      "100%",
                    borderCollapse:
                      "collapse",
                  }}
                >

                  <thead>

                    <tr>

                      <th>
                        {t.student}
                      </th>

                      <th>
                        {t.registrationNo}
                      </th>

                      <th>
                        {t.hostel}
                      </th>

                      <th>
                        {t.room}
                      </th>

                      <th>
                        {t.status}
                      </th>

                      <th>
                        {t.actions}
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredStudents.map(
                      (student) => {

                        const registration =
                          student.student_id ||
                          student.studentId ||
                          student.registration_number ||
                          student.registrationNumber ||
                          "—";

                        const hostel =
                          student.hostel ||
                          student.hostel_name ||
                          student.hostelName ||
                          "";

                        const room =
                          student.room ||
                          student.room_no ||
                          student.roomNo ||
                          "NA";

                        const hasRoom =
                          room &&
                          room !==
                            "NA" &&
                          room !== "-";

                        return (
                          <tr
                            key={
                              registration
                            }
                          >

                            <td>
                              <strong>
                                {
                                  student.name ||
                                  "—"
                                }
                              </strong>

                              <div
                                style={{
                                  fontSize:
                                    "12px",
                                  opacity:
                                    0.7,
                                }}
                              >
                                {
                                  student.email ||
                                  "—"
                                }
                              </div>
                            </td>

                            <td>
                              {
                                registration
                              }
                            </td>

                            <td>
                              {formatHostel(
                                hostel
                              )}
                            </td>

                            <td>
                              {hasRoom
                                ? room
                                : "—"}
                            </td>

                            <td>

                              <span
                                style={{
                                  display:
                                    "inline-flex",
                                  alignItems:
                                    "center",
                                  gap:
                                    "5px",
                                  padding:
                                    "5px 9px",
                                  borderRadius:
                                    "999px",
                                }}
                              >

                                {hasRoom ? (
                                  <>
                                    <CheckCircle2
                                      size={
                                        15
                                      }
                                    />

                                    {
                                      t.roomAssigned
                                    }
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle
                                      size={
                                        15
                                      }
                                    />

                                    {
                                      t.noRoom
                                    }
                                  </>
                                )}

                              </span>

                            </td>

                            <td>

                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                  setSelectedStudent(
                                    student
                                  )
                                }
                              >
                                {t.view}
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* ===========================================
          STUDENT DETAILS MODAL
      =========================================== */}

      {selectedStudent && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 1000,
            padding:
              "20px",
          }}
          onClick={() =>
            setSelectedStudent(
              null
            )
          }
        >

          <div
            className="card"
            style={{
              width:
                "min(600px, 100%)",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "20px",
              }}
            >

              <h2>
                {t.studentDetails}
              </h2>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setSelectedStudent(
                    null
                  )
                }
              >
                {t.close}
              </button>

            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap:
                  "16px",
              }}
            >

              <div>
                <strong>
                  {t.name}
                </strong>

                <p>
                  {
                    selectedStudent.name ||
                    "—"
                  }
                </p>
              </div>

              <div>
                <strong>
                  {t.registrationNo}
                </strong>

                <p>
                  {
                    selectedStudent.student_id ||
                    selectedStudent.studentId ||
                    selectedStudent.registration_number ||
                    selectedStudent.registrationNumber ||
                    "—"
                  }
                </p>
              </div>

              <div>
                <strong>
                  {t.email}
                </strong>

                <p>
                  {
                    selectedStudent.email ||
                    "—"
                  }
                </p>
              </div>

              <div>
                <strong>
                  {t.branch}
                </strong>

                <p>
                  {
                    selectedStudent.branch ||
                    "—"
                  }
                </p>
              </div>

              <div>
                <strong>
                  {t.semester}
                </strong>

                <p>
                  {
                    selectedStudent.semester ||
                    "—"
                  }
                </p>
              </div>

              <div>
                <strong>
                  {t.section}
                </strong>

                <p>
                  {
                    selectedStudent.section ||
                    "—"
                  }
                </p>
              </div>

              <div>
                <strong>
                  {t.batchYear}
                </strong>

                <p>
                  {
                    selectedStudent.batch_year ||
                    selectedStudent.batchYear ||
                    "—"
                  }
                </p>
              </div>

              <div>
                <strong>
                  {t.hostelStatus}
                </strong>

                <p>
                  {t.hosteller}
                </p>
              </div>

              <div>
                <strong>
                  {t.hostel}
                </strong>

                <p>
                  {formatHostel(
                    selectedStudent.hostel ||
                      selectedStudent.hostel_name ||
                      selectedStudent.hostelName
                  )}
                </p>
              </div>

              <div>
                <strong>
                  {t.roomNo}
                </strong>

                <p>
                  {
                    selectedStudent.room ||
                    selectedStudent.room_no ||
                    selectedStudent.roomNo ||
                    "NA"
                  }
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}