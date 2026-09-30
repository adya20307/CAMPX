import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  Hash,
  BookOpen,
  Home,
  DoorOpen,
  CalendarDays,
  Phone,
  Building2,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

export default function Profile() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [user, setUser] = useState(null);

  // =====================================================
  // TRANSLATIONS
  // =====================================================

  const translations = {
    en: {
      profile: "Profile",
      account: "CAMPX ACCOUNT",
      myProfile: "My Profile",
      profileDescription:
        "View your CampX account information.",
      back: "Back",

      profileNotAvailable: "Profile not available",
      loginAgain:
        "Please login again to view your profile information.",
      goToLogin: "Go to Login",

      student: "Student",
      administrator: "Administrator",
      superAdministrator: "Super Administrator",
      activeAccount: "Active Account",

      accountInformation: "Account Information",
      accountDetails: "Your CampX account details",

      fullName: "Full Name",
      emailAddress: "Email Address",

      facultyId: "Faculty ID",
      role: "Role",
      department: "Department",
      adminSection: "Admin Section",
      designation: "Designation",

      superAdmin: "Super Admin",
      admin: "Admin",

      registrationNumber: "Registration Number",
      branch: "Branch",
      semester: "Semester",
      section: "Section",
      batchYear: "Batch Year",
      phoneNumber: "Phone Number",
      hostelStatus: "Hostel Status",
      hosteller: "Hosteller",
      nonHosteller: "Non-Hosteller",
      hostel: "Hostel",
      roomNumber: "Room Number",

      accessInformation: "Access Information",
      superAdminAccess: "Super Admin Access",
      adminAccess: "Admin Access",
      studentAccess: "Student Access",

      fullAdministrativeAccess:
        "You have full administrative access to the CampX system.",

      sectionAccess:
        "You have administrative access for the {section} section.",

      studentPortalAccess:
        "You have access to your CampX student portal and student services.",

      notAvailable: "—",
    },

    hi: {
      profile: "प्रोफ़ाइल",
      account: "CAMPX खाता",
      myProfile: "मेरी प्रोफ़ाइल",
      profileDescription:
        "अपने CampX खाते की जानकारी देखें।",
      back: "वापस",

      profileNotAvailable: "प्रोफ़ाइल उपलब्ध नहीं है",
      loginAgain:
        "अपनी प्रोफ़ाइल जानकारी देखने के लिए कृपया फिर से लॉगिन करें।",
      goToLogin: "लॉगिन पर जाएं",

      student: "छात्र",
      administrator: "प्रशासक",
      superAdministrator: "सुपर प्रशासक",
      activeAccount: "सक्रिय खाता",

      accountInformation: "खाता जानकारी",
      accountDetails: "आपके CampX खाते का विवरण",

      fullName: "पूरा नाम",
      emailAddress: "ईमेल पता",

      facultyId: "फैकल्टी ID",
      role: "भूमिका",
      department: "विभाग",
      adminSection: "प्रशासन अनुभाग",
      designation: "पद",

      superAdmin: "सुपर एडमिन",
      admin: "एडमिन",

      registrationNumber: "पंजीकरण संख्या",
      branch: "शाखा",
      semester: "सेमेस्टर",
      section: "सेक्शन",
      batchYear: "बैच वर्ष",
      phoneNumber: "फोन नंबर",
      hostelStatus: "हॉस्टल स्थिति",
      hosteller: "हॉस्टल छात्र",
      nonHosteller: "गैर-हॉस्टल छात्र",
      hostel: "हॉस्टल",
      roomNumber: "कमरा नंबर",

      accessInformation: "एक्सेस जानकारी",
      superAdminAccess: "सुपर एडमिन एक्सेस",
      adminAccess: "एडमिन एक्सेस",
      studentAccess: "छात्र एक्सेस",

      fullAdministrativeAccess:
        "आपके पास CampX सिस्टम का पूर्ण प्रशासनिक एक्सेस है।",

      sectionAccess:
        "आपके पास {section} अनुभाग के लिए प्रशासनिक एक्सेस है।",

      studentPortalAccess:
        "आपके पास अपने CampX छात्र पोर्टल और छात्र सेवाओं का एक्सेस है।",

      notAvailable: "—",
    },

    or: {
      profile: "ପ୍ରୋଫାଇଲ୍",
      account: "CAMPX ଆକାଉଣ୍ଟ",
      myProfile: "ମୋ ପ୍ରୋଫାଇଲ୍",
      profileDescription:
        "ଆପଣଙ୍କ CampX ଆକାଉଣ୍ଟ ସୂଚନା ଦେଖନ୍ତୁ।",
      back: "ପଛକୁ",

      profileNotAvailable: "ପ୍ରୋଫାଇଲ୍ ଉପଲବ୍ଧ ନାହିଁ",
      loginAgain:
        "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ସୂଚନା ଦେଖିବା ପାଇଁ ପୁନର୍ବାର ଲଗଇନ୍ କରନ୍ତୁ।",
      goToLogin: "ଲଗଇନ୍ କୁ ଯାଆନ୍ତୁ",

      student: "ଛାତ୍ର",
      administrator: "ପ୍ରଶାସକ",
      superAdministrator: "ସୁପର ପ୍ରଶାସକ",
      activeAccount: "ସକ୍ରିୟ ଆକାଉଣ୍ଟ",

      accountInformation: "ଆକାଉଣ୍ଟ ସୂଚନା",
      accountDetails: "ଆପଣଙ୍କ CampX ଆକାଉଣ୍ଟ ବିବରଣୀ",

      fullName: "ସମ୍ପୂର୍ଣ୍ଣ ନାମ",
      emailAddress: "ଇମେଲ୍ ଠିକଣା",

      facultyId: "ଫ୍ୟାକଲ୍ଟି ID",
      role: "ଭୂମିକା",
      department: "ବିଭାଗ",
      adminSection: "ପ୍ରଶାସନ ବିଭାଗ",
      designation: "ପଦବୀ",

      superAdmin: "ସୁପର ଆଡମିନ୍",
      admin: "ଆଡମିନ୍",

      registrationNumber: "ପଞ୍ଜୀକରଣ ନମ୍ବର",
      branch: "ଶାଖା",
      semester: "ସେମିଷ୍ଟର",
      section: "ସେକ୍ସନ୍",
      batchYear: "ବ୍ୟାଚ୍ ବର୍ଷ",
      phoneNumber: "ଫୋନ୍ ନମ୍ବର",
      hostelStatus: "ହଷ୍ଟେଲ୍ ସ୍ଥିତି",
      hosteller: "ହଷ୍ଟେଲ୍ ଛାତ୍ର",
      nonHosteller: "ନନ୍-ହଷ୍ଟେଲର୍ ଛାତ୍ର",
      hostel: "ହଷ୍ଟେଲ୍",
      roomNumber: "ରୁମ୍ ନମ୍ବର",

      accessInformation: "ଆକ୍ସେସ୍ ସୂଚନା",
      superAdminAccess: "ସୁପର ଆଡମିନ୍ ଆକ୍ସେସ୍",
      adminAccess: "ଆଡମିନ୍ ଆକ୍ସେସ୍",
      studentAccess: "ଛାତ୍ର ଆକ୍ସେସ୍",

      fullAdministrativeAccess:
        "ଆପଣଙ୍କ ପାଖରେ CampX ସିଷ୍ଟମର ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରଶାସନିକ ଆକ୍ସେସ୍ ଅଛି।",

      sectionAccess:
        "ଆପଣଙ୍କ ପାଖରେ {section} ବିଭାଗ ପାଇଁ ପ୍ରଶାସନିକ ଆକ୍ସେସ୍ ଅଛି।",

      studentPortalAccess:
        "ଆପଣଙ୍କ ପାଖରେ CampX ଛାତ୍ର ପୋର୍ଟାଲ୍ ଏବଂ ଛାତ୍ର ସେବାଗୁଡ଼ିକର ଆକ୍ସେସ୍ ଅଛି।",

      notAvailable: "—",
    },
  };

  const t = translations[language] || translations.en;

  // =====================================================
  // TRANSLATE COMMON VALUES
  // =====================================================

  const translateValue = (value) => {
    if (!value) return t.notAvailable;

    const map = {
      "SUPER_ADMIN": t.superAdmin,
      "ADMIN": t.admin,

      "Super Admin": t.superAdmin,
      "Admin": t.admin,

      "Super Administrator": t.superAdministrator,
      "Administrator": t.administrator,
      Student: t.student,

      HOSTELLER: t.hosteller,
      NON_HOSTELLER: t.nonHosteller,

      Hosteller: t.hosteller,
      "Non-Hosteller": t.nonHosteller,
    };

    return map[value] || value;
  };

  // =====================================================
  // LOAD CURRENT LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("campx_user");

      if (storedUser) {
        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Error loading CAMPX profile:",
        error
      );
    }
  }, []);

  // =====================================================
  // IF USER DATA NOT AVAILABLE
  // =====================================================

  if (!user) {
    return (
      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <Topbar title={t.profile} />

          <div className="content">

            <div className="profile-empty">

              <div className="profile-empty-icon">
                <User size={28} />
              </div>

              <h2>
                {t.profileNotAvailable}
              </h2>

              <p>
                {t.loginAgain}
              </p>

              <button
                className="profile-primary-btn"
                onClick={() =>
                  navigate("/login")
                }
              >
                {t.goToLogin}
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // DETECT ROLE
  // =====================================================

  const isAdmin =
    user.role === "ADMIN" ||
    user.role === "SUPER_ADMIN";

  const isSuperAdmin =
    user.role === "SUPER_ADMIN";

  // =====================================================
  // USER INITIALS
  // =====================================================

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) => part.charAt(0)
      )
      .join("")
      .toUpperCase() || "U";

  // =====================================================
  // USER VALUES
  // =====================================================

  const studentId =
    user.studentId ||
    user.student_id ||
    t.notAvailable;

  const batchYear =
    user.batchYear ||
    user.batch_year ||
    t.notAvailable;

  const hostelStatus =
    user.hostelStatus ||
    user.hostel_status ||
    "NON_HOSTELLER";

  const adminSection =
    user.adminSection ||
    user.admin_section ||
    "Administration";

  // =====================================================
  // PROFILE
  // =====================================================

  return (
    <div className="app-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        <Topbar title={t.profile} />

        <div className="content">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="profile-header">

            <div>

              <div className="profile-eyebrow">
                {t.account}
              </div>

              <h1>
                {t.myProfile}
              </h1>

              <p>
                {t.profileDescription}
              </p>

            </div>

            <button
              className="profile-back-button"
              onClick={() =>
                navigate(
                  isAdmin
                    ? "/admin/dashboard"
                    : "/student"
                )
              }
            >
              <ArrowLeft size={17} />
              {t.back}
            </button>

          </div>


          {/* =================================================
              PROFILE MAIN CARD
          ================================================= */}

          <div className="profile-container">

            {/* =================================================
                PROFILE HERO
            ================================================= */}

            <div className="profile-hero">

              <div className="profile-avatar">
                {initials}
              </div>

              <div className="profile-hero-details">

                <h2>
                  {user.name || "User"}
                </h2>

                <p>
                  {isAdmin
                    ? isSuperAdmin
                      ? t.superAdministrator
                      : t.administrator
                    : t.student}
                </p>

                <div className="profile-status">

                  <span className="status-dot"></span>

                  {t.activeAccount}

                </div>

              </div>

            </div>


            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <div className="profile-section">

              <div className="profile-section-heading">

                <div className="profile-section-icon">
                  <Shield size={20} />
                </div>

                <div>

                  <h3>
                    {t.accountInformation}
                  </h3>

                  <p>
                    {t.accountDetails}
                  </p>

                </div>

              </div>


              <div className="profile-grid">

                {/* FULL NAME */}

                <ProfileItem
                  icon={<User size={18} />}
                  label={t.fullName}
                  value={user.name}
                />


                {/* EMAIL */}

                <ProfileItem
                  icon={<Mail size={18} />}
                  label={t.emailAddress}
                  value={user.email}
                />


                {/* =================================================
                    ADMIN INFORMATION
                ================================================= */}

                {isAdmin ? (
                  <>

                    <ProfileItem
                      icon={
                        <Hash size={18} />
                      }
                      label={t.facultyId}
                      value={
                        user.facultyId ||
                        user.faculty_id ||
                        t.notAvailable
                      }
                    />


                    <ProfileItem
                      icon={
                        <Shield size={18} />
                      }
                      label={t.role}
                      value={translateValue(
                        user.role
                      )}
                    />


                    <ProfileItem
                      icon={
                        <Building2 size={18} />
                      }
                      label={t.department}
                      value={
                        user.department ||
                        t.notAvailable
                      }
                    />


                    <ProfileItem
                      icon={
                        <BookOpen size={18} />
                      }
                      label={t.adminSection}
                      value={adminSection}
                    />


                    <ProfileItem
                      icon={
                        <GraduationCap
                          size={18}
                        />
                      }
                      label={t.designation}
                      value={
                        user.designation ||
                        t.administrator
                      }
                    />

                  </>
                ) : (

                  /* =================================================
                     STUDENT INFORMATION
                  ================================================= */

                  <>

                    <ProfileItem
                      icon={
                        <Hash size={18} />
                      }
                      label={
                        t.registrationNumber
                      }
                      value={studentId}
                    />


                    <ProfileItem
                      icon={
                        <GraduationCap
                          size={18}
                        />
                      }
                      label={t.branch}
                      value={
                        user.branch ||
                        t.notAvailable
                      }
                    />


                    <ProfileItem
                      icon={
                        <BookOpen
                          size={18}
                        />
                      }
                      label={t.semester}
                      value={
                        user.semester ||
                        t.notAvailable
                      }
                    />


                    <ProfileItem
                      icon={
                        <User size={18} />
                      }
                      label={t.section}
                      value={
                        user.section ||
                        t.notAvailable
                      }
                    />


                    <ProfileItem
                      icon={
                        <CalendarDays
                          size={18}
                        />
                      }
                      label={t.batchYear}
                      value={batchYear}
                    />


                    <ProfileItem
                      icon={
                        <Phone size={18} />
                      }
                      label={t.phoneNumber}
                      value={
                        user.phone ||
                        t.notAvailable
                      }
                    />


                    <ProfileItem
                      icon={
                        <Home size={18} />
                      }
                      label={t.hostelStatus}
                      value={translateValue(
                        hostelStatus
                      )}
                    />


                    {/* HOSTEL DETAILS */}

                    {hostelStatus ===
                      "HOSTELLER" && (
                      <>

                        <ProfileItem
                          icon={
                            <Home size={18} />
                          }
                          label={t.hostel}
                          value={
                            user.hostel ||
                            t.notAvailable
                          }
                        />


                        <ProfileItem
                          icon={
                            <DoorOpen
                              size={18}
                            />
                          }
                          label={t.roomNumber}
                          value={
                            user.room ||
                            t.notAvailable
                          }
                        />

                      </>
                    )}

                  </>

                )}

              </div>

            </div>


            {/* =================================================
                ACCESS INFORMATION
            ================================================= */}

            <div className="profile-access-box">

              <div className="profile-access-icon">
                <Shield size={22} />
              </div>

              <div>

                <h4>

                  {isAdmin
                    ? isSuperAdmin
                      ? t.superAdminAccess
                      : t.adminAccess
                    : t.studentAccess}

                </h4>

                <p>

                  {isAdmin
                    ? isSuperAdmin
                      ? t.fullAdministrativeAccess
                      : t.sectionAccess.replace(
                          "{section}",
                          adminSection
                        )
                    : t.studentPortalAccess}

                </p>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   PROFILE ITEM COMPONENT
===================================================== */

function ProfileItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="profile-item">

      <div className="profile-item-icon">
        {icon}
      </div>

      <div className="profile-item-content">

        <span>
          {label}
        </span>

        <strong>
          {value || "—"}
        </strong>

      </div>

    </div>
  );
}