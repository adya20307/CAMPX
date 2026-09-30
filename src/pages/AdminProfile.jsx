import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";


const PROFILE_TRANSLATIONS = {
  en: {
    superAdminProfile: "Super Admin Profile",
    adminProfile: t.adminProfile,
    myProfile: "My Profile",
    description: "View your CAMPX administrator account information.",
    backDashboard: "Back to Dashboard",
    superAdministrator: "Super Administrator",
    administrator: "Administrator",
    facultyId: "Faculty ID",
    email: "Email",
    department: "Department",
    designation: "Designation",
    accountRole: "Account Role",
    adminSection: "Admin Section",
    departmentFallback: "Administration",
    superAdmin: "SUPER ADMIN",
    admin: "ADMIN",
    notAssigned: "Not Assigned",
    noData: "—",
  },

  hi: {
    superAdminProfile: "सुपर एडमिन प्रोफ़ाइल",
    adminProfile: "एडमिन प्रोफ़ाइल",
    myProfile: "मेरी प्रोफ़ाइल",
    description: "अपने CAMPX एडमिनिस्ट्रेटर अकाउंट की जानकारी देखें।",
    backDashboard: "डैशबोर्ड पर वापस जाएं",
    superAdministrator: "सुपर एडमिनिस्ट्रेटर",
    administrator: "एडमिनिस्ट्रेटर",
    facultyId: "फैकल्टी आईडी",
    email: "ईमेल",
    department: "विभाग",
    designation: "पद",
    accountRole: "अकाउंट भूमिका",
    adminSection: "एडमिन सेक्शन",
    departmentFallback: "प्रशासन",
    superAdmin: "सुपर एडमिन",
    admin: "एडमिन",
    notAssigned: "निर्धारित नहीं",
    noData: "—",
  },

  or: {
    superAdminProfile: "ସୁପର ଆଡମିନ୍ ପ୍ରୋଫାଇଲ୍",
    adminProfile: "ଆଡମିନ୍ ପ୍ରୋଫାଇଲ୍",
    myProfile: "ମୋ ପ୍ରୋଫାଇଲ୍",
    description: "ଆପଣଙ୍କ CAMPX ଆଡମିନିଷ୍ଟ୍ରେଟର୍ ଆକାଉଣ୍ଟ ସୂଚନା ଦେଖନ୍ତୁ।",
    backDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    superAdministrator: "ସୁପର ଆଡମିନିଷ୍ଟ୍ରେଟର୍",
    administrator: "ଆଡମିନିଷ୍ଟ୍ରେଟର୍",
    facultyId: "ଫ୍ୟାକଲ୍ଟି ଆଇଡି",
    email: "ଇମେଲ୍",
    department: "ବିଭାଗ",
    designation: "ପଦବୀ",
    accountRole: "ଆକାଉଣ୍ଟ ଭୂମିକା",
    adminSection: "ଆଡମିନ୍ ବିଭାଗ",
    departmentFallback: "ପ୍ରଶାସନ",
    superAdmin: "ସୁପର ଆଡମିନ୍",
    admin: "ଆଡମିନ୍",
    notAssigned: "ନିର୍ଦ୍ଧାରିତ ନୁହେଁ",
    noData: "—",
  },
};

export default function AdminProfile() {

  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = PROFILE_TRANSLATIONS[language] || PROFILE_TRANSLATIONS.en;

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const storedUser =
    localStorage.getItem("campx_user");

  let user = {};

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : {};
  } catch (error) {
    console.error(
      "Invalid CAMPX user data:",
      error
    );
  }

  // ==========================================
  // ROLE
  // ==========================================

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  // ==========================================
  // PROFILE PAGE
  // ==========================================

  return (
    <div className="app-layout">

      {/* ======================================
          SIDEBAR
      ======================================= */}

      <Sidebar admin />


      {/* ======================================
          MAIN CONTENT
      ======================================= */}

      <main className="main-content">

        <Topbar
          title={
            isSuperAdmin
              ? t.superAdminProfile
              : t.adminProfile
          }
        />


        <div className="dashboard-content">

          {/* ==================================
              HEADER
          ================================== */}

          <div
            className="dashboard-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >

            <div>

              <h1>
                My Profile
              </h1>

              <p>
                View your CAMPX administrator
                account information.
              </p>

            </div>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate("/admin/dashboard")
              }
            >

              <ArrowLeft size={17} />

              Back to Dashboard

            </button>

          </div>


          {/* ==================================
              PROFILE CARD
          ================================== */}

          <div
            className="dashboard-card"
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "30px",
            }}
          >

            {/* =================================
                PROFILE HEADER
            ================================= */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                paddingBottom: "25px",
                borderBottom:
                  "1px solid #e5e7eb",
                marginBottom: "30px",
              }}
            >

              {/* AVATAR */}

              <div
                style={{
                  width: "75px",
                  height: "75px",
                  borderRadius: "50%",
                  background: "#173f7a",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >

                {(user?.name || "A")
                  .charAt(0)
                  .toUpperCase()}

              </div>


              {/* NAME */}

              <div>

                <h2
                  style={{
                    margin: "0 0 6px 0",
                  }}
                >

                  {user?.name ||
                    "Administrator"}

                </h2>


                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                  }}
                >

                  {isSuperAdmin
                    ? t.superAdministrator
                    : t.administrator}

                </p>

              </div>

            </div>


            {/* =================================
                INFORMATION GRID
            ================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "22px",
              }}
            >

              {/* FACULTY ID */}

              <div>

                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Faculty ID
                </label>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >

                  <User size={18} />

                  <span>
                    {user?.facultyId ||
                      user?.faculty_id ||
                      t.noData}
                  </span>

                </div>

              </div>


              {/* EMAIL */}

              <div>

                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Email
                </label>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >

                  <Mail size={18} />

                  <span>
                    {user?.email || t.noData}
                  </span>

                </div>

              </div>


              {/* DEPARTMENT */}

              <div>

                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Department
                </label>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >

                  <Building2 size={18} />

                  <span>
                    {user?.department || t.noData}
                  </span>

                </div>

              </div>


              {/* DESIGNATION */}

              <div>

                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Designation
                </label>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >

                  <User size={18} />

                  <span>
                    {user?.designation || t.noData}
                  </span>

                </div>

              </div>


              {/* ROLE */}

              <div>

                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Account Role
                </label>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >

                  <ShieldCheck size={18} />

                  <span>
                    {isSuperAdmin
                      ? t.superAdmin
                      : t.admin}
                  </span>

                </div>

              </div>


              {/* ADMIN SECTION */}

              <div>

                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Admin Section
                </label>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >

                  <Building2 size={18} />

                  <span>
                    {user?.adminSection ||
                      user?.admin_section ||
                      (isSuperAdmin
                        ? t.departmentFallback
                        : t.notAssigned)}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}