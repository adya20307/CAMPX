import { useEffect, useState } from "react";

import {
  ArrowLeft,
  RefreshCw,
  Users,
  UserCheck,
  Mail,
  Building2,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";


// =====================================================
// API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL || "/api";


// =====================================================
// ADMIN LIST PAGE
// =====================================================


const ADMIN_FACULTY_TRANSLATIONS = {
  en: {
    admins: "Admins",
    search: "Search CampX...",
    backDashboard: "Back to Dashboard",
    management: "Admin Management",
    managementDesc: "View and manage registered CAMPX administrators.",
    refreshing: "Refreshing...",
    refresh: "Refresh",
    totalAdmins: "Total Admins",
    activeAdmins: "Active Admins",
    departments: "Departments",
    registeredAdmins: "Registered Admins",
    administrator: "administrator",
    administrators: "administrators",
    addAdmin: "+ Add Admin",
    loadingAdmins: "Loading Admins...",
    noAdmins: "No Admins Found",
    noAccounts: "No Admin accounts have been registered yet.",
    addFirst: "Add First Admin",
    facultyId: "Faculty ID",
    administratorColumn: "Administrator",
    department: "Department",
    designation: "Designation",
    status: "Status",
    created: "Created",
    action: "Action",
    active: "Active",
    inactive: "Inactive",
    deleteAdmin: "Delete Admin",
    expired: "Your session has expired. Please login again.",
    unableLoad: "Unable to load Admins.",
    unableDelete: "Unable to delete Admin.",
    deletedSuccess: "Admin deleted successfully.",
    ownAccount: "You cannot delete your own Super Admin account.",
    confirmDelete: (name, id) =>
      `Are you sure you want to delete ${name || "this Admin"} (${id})?\n\nThis action cannot be undone.`,
    dash: "—",
    administration: "Administration",
  },
  hi: {
    admins: "एडमिन",
    search: "CAMPX खोजें...",
    backDashboard: "डैशबोर्ड पर वापस जाएं",
    management: "एडमिन प्रबंधन",
    managementDesc: "पंजीकृत CAMPX एडमिनिस्ट्रेटरों को देखें और प्रबंधित करें।",
    refreshing: "रिफ्रेश हो रहा है...",
    refresh: "रिफ्रेश",
    totalAdmins: "कुल एडमिन",
    activeAdmins: "सक्रिय एडमिन",
    departments: "विभाग",
    registeredAdmins: "पंजीकृत एडमिन",
    administrator: "एडमिनिस्ट्रेटर",
    administrators: "एडमिनिस्ट्रेटर",
    addAdmin: "+ एडमिन जोड़ें",
    loadingAdmins: "एडमिन लोड हो रहे हैं...",
    noAdmins: "कोई एडमिन नहीं मिला",
    noAccounts: "अभी तक कोई एडमिन खाता पंजीकृत नहीं हुआ है।",
    addFirst: "पहला एडमिन जोड़ें",
    facultyId: "फैकल्टी ID",
    administratorColumn: "एडमिनिस्ट्रेटर",
    department: "विभाग",
    designation: "पद",
    status: "स्थिति",
    created: "बनाया गया",
    action: "कार्रवाई",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    deleteAdmin: "एडमिन हटाएं",
    expired: "आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।",
    unableLoad: "एडमिन लोड नहीं हो सके।",
    unableDelete: "एडमिन हटाया नहीं जा सका।",
    deletedSuccess: "एडमिन सफलतापूर्वक हटा दिया गया।",
    ownAccount: "आप अपना Super Admin खाता नहीं हटा सकते।",
    confirmDelete: (name, id) =>
      `क्या आप ${name || "इस एडमिन"} (${id}) को हटाना चाहते हैं?\n\nयह कार्रवाई पूर्ववत नहीं की जा सकती।`,
    dash: "—",
    administration: "प्रशासन",
  },
  or: {
    admins: "ଆଡମିନ୍",
    search: "CAMPX ଖୋଜନ୍ତୁ...",
    backDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    management: "ଆଡମିନ୍ ପରିଚାଳନା",
    managementDesc: "ପଞ୍ଜୀକୃତ CAMPX ଆଡମିନିଷ୍ଟ୍ରେଟରମାନଙ୍କୁ ଦେଖନ୍ତୁ ଏବଂ ପରିଚାଳନା କରନ୍ତୁ।",
    refreshing: "ରିଫ୍ରେଶ୍ ହେଉଛି...",
    refresh: "ରିଫ୍ରେଶ୍",
    totalAdmins: "ମୋଟ ଆଡମିନ୍",
    activeAdmins: "ସକ୍ରିୟ ଆଡମିନ୍",
    departments: "ବିଭାଗ",
    registeredAdmins: "ପଞ୍ଜୀକୃତ ଆଡମିନ୍",
    administrator: "ଆଡମିନିଷ୍ଟ୍ରେଟର୍",
    administrators: "ଆଡମିନିଷ୍ଟ୍ରେଟର୍",
    addAdmin: "+ ଆଡମିନ୍ ଯୋଡନ୍ତୁ",
    loadingAdmins: "ଆଡମିନ୍ ଲୋଡ୍ ହେଉଛି...",
    noAdmins: "କୌଣସି ଆଡମିନ୍ ମିଳିଲା ନାହିଁ",
    noAccounts: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଆଡମିନ୍ ଖାତା ପଞ୍ଜୀକୃତ ହୋଇନାହିଁ।",
    addFirst: "ପ୍ରଥମ ଆଡମିନ୍ ଯୋଡନ୍ତୁ",
    facultyId: "ଫ୍ୟାକଲ୍ଟି ID",
    administratorColumn: "ଆଡମିନିଷ୍ଟ୍ରେଟର୍",
    department: "ବିଭାଗ",
    designation: "ପଦବୀ",
    status: "ସ୍ଥିତି",
    created: "ସୃଷ୍ଟି",
    action: "କାର୍ଯ୍ୟ",
    active: "ସକ୍ରିୟ",
    inactive: "ନିଷ୍କ୍ରିୟ",
    deleteAdmin: "ଆଡମିନ୍ ହଟାନ୍ତୁ",
    expired: "ଆପଣଙ୍କ ସେସନ୍ ସମାପ୍ତ ହୋଇଛି। ଦୟାକରି ପୁଣି ଲଗଇନ୍ କରନ୍ତୁ।",
    unableLoad: "ଆଡମିନ୍ ଲୋଡ୍ ହୋଇପାରିଲା ନାହିଁ।",
    unableDelete: "ଆଡମିନ୍ ହଟାଇ ପାରିଲୁ ନାହିଁ।",
    deletedSuccess: "ଆଡମିନ୍ ସଫଳତାର ସହ ହଟାଯାଇଛି।",
    ownAccount: "ଆପଣ ନିଜ Super Admin ଖାତାକୁ ହଟାଇ ପାରିବେ ନାହିଁ।",
    confirmDelete: (name, id) =>
      `ଆପଣ ${name || "ଏହି ଆଡମିନ୍"} (${id})ଙ୍କୁ ହଟାଇବାକୁ ନିଶ୍ଚିତ କି?\n\nଏହି କାର୍ଯ୍ୟକୁ ପୁନଃସ୍ଥାପନ କରିହେବ ନାହିଁ।`,
    dash: "—",
    administration: "ପ୍ରଶାସନ",
  },
};

export default function AdminList() {

  const navigate =
    useNavigate();

  const { language } = useLanguage();
  const t =
    ADMIN_FACULTY_TRANSLATIONS[language] ||
    ADMIN_FACULTY_TRANSLATIONS.en;


  // ===================================================
  // STATE
  // ===================================================

  const [admins, setAdmins] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);


  // ===================================================
  // LOAD ADMINS
  // ===================================================

  const loadAdmins =
    async () => {

      try {

        setError("");

        const token =
          localStorage.getItem(
            "campx_token"
          );


        if (!token) {

          throw new Error(
            t.expired
          );

        }


        const response =
          await fetch(
            `${API_URL}/faculty/admins`,
            {

              method: "GET",

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }
          );


        const data =
          await response.json();


        if (
          !response.ok
        ) {

          throw new Error(
            data.message ||
            t.unableLoad
          );

        }


        setAdmins(
          data.admins || []
        );


      } catch (err) {

        console.error(
          "Load Admins error:",
          err
        );


        setError(
          err.message ||
          t.unableLoad
        );


      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    };


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    loadAdmins();

  }, []);


  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh =
    () => {

      setRefreshing(true);

      loadAdmins();

    };


  // ===================================================
  // DELETE ADMIN
  // ===================================================

  const handleDeleteAdmin =
    async (facultyId, adminName) => {

      const currentUser =
        JSON.parse(
          localStorage.getItem("campx_user") || "{}"
        );

      const currentFacultyId =
        currentUser.facultyId ||
        currentUser.faculty_id;

      if (currentFacultyId === facultyId) {
        alert(t.ownAccount);
        return;
      }

      const confirmed =
        window.confirm(t.confirmDelete(adminName, facultyId));

      if (!confirmed) return;

      try {

        setError("");

        const token =
          localStorage.getItem("campx_token");

        if (!token) {
          throw new Error(
            t.expired
          );
        }

        const response =
          await fetch(
            `${API_URL}/faculty/admin/${encodeURIComponent(facultyId)}`,
            {
              method: "DELETE",
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
            t.unableDelete
          );
        }

        alert(
          data.message ||
          t.deletedSuccess
        );

        loadAdmins();

      } catch (err) {

        console.error(
          "Delete Admin error:",
          err
        );

        setError(
          err.message ||
          t.unableDelete
        );

      }

    };


  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate =
    (dateValue) => {

      if (!dateValue) {

        return "—";

      }


      const date =
        new Date(dateValue);


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return "—";

      }


      return date.toLocaleDateString(
        language === "or" ? "or-IN" : language === "hi" ? "hi-IN" : "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  // ===================================================
  // DEPARTMENT NAME
  // ===================================================

  const getDepartmentName =
    (admin) => {

      return (
        admin.departmentName ||
        admin.department ||
        admin.admin_section ||
        t.administration
      );

    };


  // ===================================================
  // PAGE
  // ===================================================

  return (

    <div className="app-layout">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar admin />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">


        {/* =================================================
            TOPBAR
        ================================================= */}

        <div className="topbar">

          <h1>
            {t.admins}
          </h1>


          <div className="topbar-right">

            <div className="search-box">

              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder={t.search}
              />

            </div>


            <button
              type="button"
              className="topbar-icon-button"
            >
              🔔
            </button>


            <div className="avatar">
              AD
            </div>

          </div>

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="dashboard-content">


          {/* =================================================
              HEADER
          ================================================= */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap: "20px",
              marginBottom:
                "25px",
            }}
          >

            <div>

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    "/admin/dashboard"
                  )
                }
                style={{
                  marginBottom:
                    "18px",
                }}
              >

                <ArrowLeft
                  size={17}
                />

                {t.backDashboard}

              </button>


              <div className="dashboard-header">

                <h1>
                  {t.management}
                </h1>

                <p>
                  {t.managementDesc}
                </p>

              </div>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              className="secondary-btn"
              onClick={
                handleRefresh
              }
              disabled={
                refreshing
              }
            >

              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>


          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "18px",
              marginBottom:
                "24px",
            }}
          >


            {/* TOTAL ADMINS */}

            <div
              className="dashboard-card"
              style={{
                padding: "22px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "15px",
                }}
              >

                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius:
                      "12px",
                    background:
                      "#edf4ff",
                    color:
                      "#2866b3",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >

                  <Users
                    size={23}
                  />

                </div>


                <div>

                  <div
                    style={{
                      color:
                        "#71829a",
                      fontSize:
                        "14px",
                    }}
                  >
                    {t.totalAdmins}
                  </div>

                  <div
                    style={{
                      fontSize:
                        "26px",
                      fontWeight:
                        "700",
                      color:
                        "#102d52",
                    }}
                  >
                    {admins.length}
                  </div>

                </div>

              </div>

            </div>


            {/* ACTIVE ADMINS */}

            <div
              className="dashboard-card"
              style={{
                padding: "22px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "15px",
                }}
              >

                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius:
                      "12px",
                    background:
                      "#eaf8ef",
                    color:
                      "#238b4d",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >

                  <UserCheck
                    size={23}
                  />

                </div>


                <div>

                  <div
                    style={{
                      color:
                        "#71829a",
                      fontSize:
                        "14px",
                    }}
                  >
                    {t.activeAdmins}
                  </div>

                  <div
                    style={{
                      fontSize:
                        "26px",
                      fontWeight:
                        "700",
                      color:
                        "#102d52",
                    }}
                  >

                    {
                      admins.filter(
                        (admin) =>
                          admin.is_active !==
                            false &&
                          admin.is_active !==
                            0
                      ).length
                    }

                  </div>

                </div>

              </div>

            </div>


            {/* DEPARTMENTS */}

            <div
              className="dashboard-card"
              style={{
                padding: "22px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "15px",
                }}
              >

                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius:
                      "12px",
                    background:
                      "#fff4e8",
                    color:
                      "#c56b12",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >

                  <Building2
                    size={23}
                  />

                </div>


                <div>

                  <div
                    style={{
                      color:
                        "#71829a",
                      fontSize:
                        "14px",
                    }}
                  >
                    {t.departments}
                  </div>

                  <div
                    style={{
                      fontSize:
                        "26px",
                      fontWeight:
                        "700",
                      color:
                        "#102d52",
                    }}
                  >

                    {
                      new Set(
                        admins.map(
                          (admin) =>
                            getDepartmentName(
                              admin
                            )
                        )
                      ).size
                    }

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

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


          {/* =================================================
              ADMIN TABLE
          ================================================= */}

          <div
            className="dashboard-card"
            style={{
              overflow:
                "hidden",
            }}
          >


            {/* TABLE HEADER */}

            <div
              style={{
                padding:
                  "24px 26px",
                borderBottom:
                  "1px solid #e5eaf1",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "13px",
                }}
              >

                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius:
                      "10px",
                    background:
                      "#edf4ff",
                    color:
                      "#2866b3",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >

                  <ShieldCheck
                    size={21}
                  />

                </div>


                <div>

                  <h2
                    style={{
                      margin: 0,
                      color:
                        "#102d52",
                    }}
                  >
                    {t.registeredAdmins}
                  </h2>

                  <p
                    style={{
                      margin:
                        "4px 0 0",
                      color:
                        "#71829a",
                    }}
                  >
                    {admins.length}{" "}
                    {admins.length === 1
                      ? t.administrator
                      : t.administrators}
                  </p>

                </div>

              </div>


              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  navigate(
                    "/admin/faculty/add"
                  )
                }
              >

                {t.addAdmin}

              </button>

            </div>


            {/* LOADING */}

            {loading && (

              <div
                style={{
                  padding:
                    "70px 20px",
                  textAlign:
                    "center",
                  color:
                    "#71829a",
                }}
              >

                {t.loadingAdmins}

              </div>

            )}


            {/* EMPTY */}

            {!loading &&
              !error &&
              admins.length ===
                0 && (

                <div
                  style={{
                    padding:
                      "70px 20px",
                    textAlign:
                      "center",
                  }}
                >

                  <Users
                    size={52}
                    style={{
                      color:
                        "#9aabc0",
                      marginBottom:
                        "15px",
                    }}
                  />

                  <h3
                    style={{
                      color:
                        "#102d52",
                      margin:
                        "0 0 8px",
                    }}
                  >
                    {t.noAdmins}
                  </h3>

                  <p
                    style={{
                      color:
                        "#71829a",
                      marginBottom:
                        "20px",
                    }}
                  >
                    {t.noAccounts}
                  </p>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() =>
                      navigate(
                        "/admin/faculty/add"
                      )
                    }
                  >
                    <UserCheck
                      size={17}
                    />

                    {t.addFirst}
                  </button>

                </div>

              )}


            {/* TABLE */}

            {!loading &&
              admins.length >
                0 && (

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
                      minWidth:
                        "900px",
                    }}
                  >

                    <thead>

                      <tr
                        style={{
                          background:
                            "#f7f9fc",
                          borderBottom:
                            "1px solid #e5eaf1",
                        }}
                      >

                        <th
                          style={{
                            padding:
                              "15px 20px",
                            textAlign:
                              "left",
                            color:
                              "#71829a",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          {t.facultyId}
                        </th>


                        <th
                          style={{
                            padding:
                              "15px 20px",
                            textAlign:
                              "left",
                            color:
                              "#71829a",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          {t.administratorColumn}
                        </th>


                        <th
                          style={{
                            padding:
                              "15px 20px",
                            textAlign:
                              "left",
                            color:
                              "#71829a",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          {t.department}
                        </th>


                        <th
                          style={{
                            padding:
                              "15px 20px",
                            textAlign:
                              "left",
                            color:
                              "#71829a",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          {t.designation}
                        </th>


                        <th
                          style={{
                            padding:
                              "15px 20px",
                            textAlign:
                              "left",
                            color:
                              "#71829a",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          {t.status}
                        </th>


                        <th
                          style={{
                            padding:
                              "15px 20px",
                            textAlign:
                              "left",
                            color:
                              "#71829a",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          {t.created}
                        </th>

                        <th
                          style={{
                            padding:
                              "15px 20px",
                            textAlign:
                              "center",
                            color:
                              "#71829a",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          {t.action}
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {admins.map(
                        (admin) => {

                          const active =
                            admin.is_active !==
                              false &&
                            admin.is_active !==
                              0;


                          return (

                            <tr
                              key={
                                admin.faculty_id
                              }
                              style={{
                                borderBottom:
                                  "1px solid #edf0f5",
                              }}
                            >


                              {/* FACULTY ID */}

                              <td
                                style={{
                                  padding:
                                    "18px 20px",
                                  fontWeight:
                                    "600",
                                  color:
                                    "#2866b3",
                                }}
                              >

                                {admin.faculty_id}

                              </td>


                              {/* ADMIN */}

                              <td
                                style={{
                                  padding:
                                    "18px 20px",
                                }}
                              >

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    gap:
                                      "12px",
                                  }}
                                >

                                  <div
                                    style={{
                                      width:
                                        "40px",
                                      height:
                                        "40px",
                                      borderRadius:
                                        "50%",
                                      background:
                                        "#edf4ff",
                                      color:
                                        "#2866b3",
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      justifyContent:
                                        "center",
                                      fontWeight:
                                        "700",
                                    }}
                                  >

                                    {(
                                      admin.name ||
                                      "A"
                                    )
                                      .trim()
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}

                                  </div>


                                  <div>

                                    <div
                                      style={{
                                        fontWeight:
                                          "600",
                                        color:
                                          "#102d52",
                                      }}
                                    >
                                      {
                                        admin.name
                                      }
                                    </div>


                                    <div
                                      style={{
                                        display:
                                          "flex",
                                        alignItems:
                                          "center",
                                        gap:
                                          "5px",
                                        marginTop:
                                          "4px",
                                        color:
                                          "#71829a",
                                        fontSize:
                                          "13px",
                                      }}
                                    >

                                      <Mail
                                        size={
                                          13
                                        }
                                      />

                                      {
                                        admin.email
                                      }

                                    </div>

                                  </div>

                                </div>

                              </td>


                              {/* DEPARTMENT */}

                              <td
                                style={{
                                  padding:
                                    "18px 20px",
                                }}
                              >

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    gap:
                                      "8px",
                                    color:
                                      "#304b6c",
                                  }}
                                >

                                  <Building2
                                    size={
                                      16
                                    }
                                  />

                                  {
                                    getDepartmentName(
                                      admin
                                    )
                                  }

                                </div>

                              </td>


                              {/* DESIGNATION */}

                              <td
                                style={{
                                  padding:
                                    "18px 20px",
                                  color:
                                    "#526b88",
                                }}
                              >

                                {
                                  admin.designation ||
                                  t.dash
                                }

                              </td>


                              {/* STATUS */}

                              <td
                                style={{
                                  padding:
                                    "18px 20px",
                                }}
                              >

                                <span
                                  style={{
                                    display:
                                      "inline-flex",
                                    alignItems:
                                      "center",
                                    padding:
                                      "6px 11px",
                                    borderRadius:
                                      "20px",
                                    background:
                                      active
                                        ? "#eaf8ef"
                                        : "#fff0f0",
                                    color:
                                      active
                                        ? "#238b4d"
                                        : "#d13b3b",
                                    fontSize:
                                      "12px",
                                    fontWeight:
                                      "600",
                                  }}
                                >

                                  {active
                                    ? "Active"
                                    : "Inactive"}

                                </span>

                              </td>


                              {/* CREATED */}

                              <td
                                style={{
                                  padding:
                                    "18px 20px",
                                  color:
                                    "#71829a",
                                  fontSize:
                                    "14px",
                                }}
                              >

                                {formatDate(
                                  admin.created_at
                                )}

                              </td>

                              {/* ACTION */}

                              <td
                                style={{
                                  padding:
                                    "18px 20px",
                                  textAlign:
                                    "center",
                                }}
                              >

                                <button
                                  type="button"
                                  title={t.deleteAdmin}
                                  onClick={() =>
                                    handleDeleteAdmin(
                                      admin.faculty_id,
                                      admin.name
                                    )
                                  }
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    border: "1px solid #f1caca",
                                    borderRadius: "9px",
                                    background: "#fff5f5",
                                    color: "#d13b3b",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Trash2 size={17} />
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

    </div>

  );

}