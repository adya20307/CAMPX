import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserPlus,
  ArrowLeft,
  Save,
  ShieldCheck,
  Eye,
  EyeOff,
  Building2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";


const ADD_ADMIN_TRANSLATIONS = {
  en: {
    accessDenied: "Access Denied",
    onlySuperAdmin:
      "Only the Super Admin can register new Admins.",
    backDashboard:
      "Back to Dashboard",
    addAdmin:
      "Add Admin",
    registerNew:
      "Register New Admin",
    createDescription:
      "Create an admin account with department-specific access.",
    back:
      "Back",
    adminAccount:
      "Admin Account",
    enterDetails:
      "Enter the details of the new administrator.",
    basicInformation:
      "Basic Information",
    fullName:
      "Full Name",
    email:
      "Email",
    department:
      "Department / Category",
    designation:
      "Designation",
    selectDepartment:
      "Select Department / Category",
    loadingDepartments:
      "Loading departments...",
    departmentAccessNote:
      "This admin will only have access to the selected category.",
    departmentAccess:
      "Department Access",
    assignedTo:
      "This admin will be assigned to",
    notificationsAndSidebar:
      "and will receive category-specific notifications and sidebar options.",
    loginCredentials:
      "Login Credentials",
    facultyId:
      "Faculty ID",
    facultyIdHelp:
      "This will be the admin's login ID.",
    password:
      "Password",
    confirmPassword:
      "Confirm Password",
    enterPassword:
      "Enter password",
    confirmPasswordPlaceholder:
      "Confirm password",
    facultyHod:
      "Faculty / HOD",
    cancel:
      "Cancel",
    creating:
      "Creating...",
    createAdmin:
      "Create Admin",
    required:
      "Please fill all required fields.",
    invalidEmail:
      "Please enter a valid email address.",
    passwordMismatch:
      "Password and confirm password do not match.",
    passwordLength:
      "Password must contain at least 6 characters.",
    invalidDepartment:
      "Please select a valid department.",
    authToken:
      "Authentication token not found.",
    authLogin:
      "Authentication token not found. Please login again.",
    unableDepartments:
      "Unable to load departments.",
    failedCreate:
      "Failed to create admin.",
    unableCreate:
      "Unable to create admin.",
    created:
      (department) =>
        `Admin created successfully for ${department}.`,
    fullNamePlaceholder:
      "Enter full name",
    emailPlaceholder:
      "admin@campx.edu",
    facultyIdPlaceholder:
      "FAC002",
    accessInfo:
      "The selected category controls the admin's available features.",
  },

  hi: {
    accessDenied:
      "पहुंच अस्वीकृत",
    onlySuperAdmin:
      "केवल Super Admin नए एडमिन पंजीकृत कर सकता है।",
    backDashboard:
      "डैशबोर्ड पर वापस जाएं",
    addAdmin:
      "एडमिन जोड़ें",
    registerNew:
      "नया एडमिन पंजीकृत करें",
    createDescription:
      "विभाग-विशिष्ट पहुंच वाला एडमिन खाता बनाएं।",
    back:
      "वापस",
    adminAccount:
      "एडमिन खाता",
    enterDetails:
      "नए एडमिनिस्ट्रेटर का विवरण दर्ज करें।",
    basicInformation:
      "मूल जानकारी",
    fullName:
      "पूरा नाम",
    email:
      "ईमेल",
    department:
      "विभाग / श्रेणी",
    designation:
      "पद",
    selectDepartment:
      "विभाग / श्रेणी चुनें",
    loadingDepartments:
      "विभाग लोड हो रहे हैं...",
    departmentAccessNote:
      "इस एडमिन को केवल चयनित श्रेणी की पहुंच मिलेगी।",
    departmentAccess:
      "विभागीय पहुंच",
    assignedTo:
      "यह एडमिन नियुक्त किया जाएगा",
    notificationsAndSidebar:
      "और इसे श्रेणी-विशिष्ट सूचनाएं और साइडबार विकल्प मिलेंगे।",
    loginCredentials:
      "लॉगिन विवरण",
    facultyId:
      "फैकल्टी ID",
    facultyIdHelp:
      "यह एडमिन का लॉगिन ID होगा।",
    password:
      "पासवर्ड",
    confirmPassword:
      "पासवर्ड की पुष्टि करें",
    enterPassword:
      "पासवर्ड दर्ज करें",
    confirmPasswordPlaceholder:
      "पासवर्ड की पुष्टि करें",
    facultyHod:
      "फैकल्टी / HOD",
    cancel:
      "रद्द करें",
    creating:
      "बनाया जा रहा है...",
    createAdmin:
      "एडमिन बनाएं",
    required:
      "कृपया सभी आवश्यक फ़ील्ड भरें।",
    invalidEmail:
      "कृपया एक मान्य ईमेल पता दर्ज करें।",
    passwordMismatch:
      "पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।",
    passwordLength:
      "पासवर्ड में कम से कम 6 अक्षर होने चाहिए।",
    invalidDepartment:
      "कृपया एक मान्य विभाग चुनें।",
    authToken:
      "ऑथेंटिकेशन टोकन नहीं मिला।",
    authLogin:
      "ऑथेंटिकेशन टोकन नहीं मिला। कृपया फिर से लॉगिन करें।",
    unableDepartments:
      "विभाग लोड नहीं हो सके।",
    failedCreate:
      "एडमिन बनाने में विफल।",
    unableCreate:
      "एडमिन बनाया नहीं जा सका।",
    created:
      (department) =>
        `${department} के लिए एडमिन सफलतापूर्वक बनाया गया।`,
    fullNamePlaceholder:
      "पूरा नाम दर्ज करें",
    emailPlaceholder:
      "admin@campx.edu",
    facultyIdPlaceholder:
      "FAC002",
    accessInfo:
      "चयनित श्रेणी एडमिन की उपलब्ध सुविधाओं को नियंत्रित करती है।",
  },

  or: {
    accessDenied:
      "ପ୍ରବେଶ ଅନୁମତି ନାହିଁ",
    onlySuperAdmin:
      "କେବଳ Super Admin ନୂତନ ଆଡମିନ୍ ପଞ୍ଜୀକରଣ କରିପାରିବେ।",
    backDashboard:
      "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    addAdmin:
      "ଆଡମିନ୍ ଯୋଡନ୍ତୁ",
    registerNew:
      "ନୂତନ ଆଡମିନ୍ ପଞ୍ଜୀକରଣ କରନ୍ତୁ",
    createDescription:
      "ବିଭାଗ-ନିର୍ଦ୍ଦିଷ୍ଟ ପ୍ରବେଶ ସହିତ ଏକ ଆଡମିନ୍ ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ।",
    back:
      "ପଛକୁ",
    adminAccount:
      "ଆଡମିନ୍ ଖାତା",
    enterDetails:
      "ନୂତନ ଆଡମିନିଷ୍ଟ୍ରେଟରଙ୍କ ବିବରଣୀ ଦିଅନ୍ତୁ।",
    basicInformation:
      "ମୌଳିକ ସୂଚନା",
    fullName:
      "ପୂର୍ଣ୍ଣ ନାମ",
    email:
      "ଇମେଲ୍",
    department:
      "ବିଭାଗ / ଶ୍ରେଣୀ",
    designation:
      "ପଦବୀ",
    selectDepartment:
      "ବିଭାଗ / ଶ୍ରେଣୀ ଚୟନ କରନ୍ତୁ",
    loadingDepartments:
      "ବିଭାଗଗୁଡ଼ିକ ଲୋଡ୍ ହେଉଛି...",
    departmentAccessNote:
      "ଏହି ଆଡମିନଙ୍କୁ କେବଳ ଚୟନ କରାଯାଇଥିବା ଶ୍ରେଣୀରେ ପ୍ରବେଶ ମିଳିବ।",
    departmentAccess:
      "ବିଭାଗୀୟ ପ୍ରବେଶ",
    assignedTo:
      "ଏହି ଆଡମିନଙ୍କୁ ନିଯୁକ୍ତ କରାଯିବ",
    notificationsAndSidebar:
      "ଏବଂ ବିଭାଗ-ନିର୍ଦ୍ଦିଷ୍ଟ ସୂଚନା ଓ ସାଇଡବାର୍ ବିକଳ୍ପ ମିଳିବ।",
    loginCredentials:
      "ଲଗଇନ୍ ବିବରଣୀ",
    facultyId:
      "ଫ୍ୟାକଲ୍ଟି ID",
    facultyIdHelp:
      "ଏହା ଆଡମିନଙ୍କ ଲଗଇନ୍ ID ହେବ।",
    password:
      "ପାସୱାର୍ଡ",
    confirmPassword:
      "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
    enterPassword:
      "ପାସୱାର୍ଡ ଦିଅନ୍ତୁ",
    confirmPasswordPlaceholder:
      "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
    facultyHod:
      "ଫ୍ୟାକଲ୍ଟି / HOD",
    cancel:
      "ବାତିଲ୍",
    creating:
      "ସୃଷ୍ଟି ହେଉଛି...",
    createAdmin:
      "ଆଡମିନ୍ ସୃଷ୍ଟି କରନ୍ତୁ",
    required:
      "ଦୟାକରି ସମସ୍ତ ଆବଶ୍ୟକ ଫିଲ୍ଡ ପୂରଣ କରନ୍ତୁ।",
    invalidEmail:
      "ଦୟାକରି ଏକ ବୈଧ ଇମେଲ୍ ଠିକଣା ଦିଅନ୍ତୁ।",
    passwordMismatch:
      "ପାସୱାର୍ଡ ଏବଂ ନିଶ୍ଚିତ ପାସୱାର୍ଡ ମେଳ ଖାଉନାହିଁ।",
    passwordLength:
      "ପାସୱାର୍ଡରେ ଅତି କମରେ 6ଟି ଅକ୍ଷର ଥିବା ଆବଶ୍ୟକ।",
    invalidDepartment:
      "ଦୟାକରି ଏକ ବୈଧ ବିଭାଗ ଚୟନ କରନ୍ତୁ।",
    authToken:
      "ଅଥେଣ୍ଟିକେସନ୍ ଟୋକେନ୍ ମିଳିଲା ନାହିଁ।",
    authLogin:
      "ଅଥେଣ୍ଟିକେସନ୍ ଟୋକେନ୍ ମିଳିଲା ନାହିଁ। ଦୟାକରି ପୁଣି ଲଗଇନ୍ କରନ୍ତୁ।",
    unableDepartments:
      "ବିଭାଗଗୁଡ଼ିକ ଲୋଡ୍ ହୋଇପାରିଲା ନାହିଁ।",
    failedCreate:
      "ଆଡମିନ୍ ସୃଷ୍ଟି ବିଫଳ ହେଲା।",
    unableCreate:
      "ଆଡମିନ୍ ସୃଷ୍ଟି ହୋଇପାରିଲା ନାହିଁ।",
    created:
      (department) =>
        `${department} ପାଇଁ ଆଡମିନ୍ ସଫଳତାର ସହ ସୃଷ୍ଟି ହୋଇଛି।`,
    fullNamePlaceholder:
      "ପୂର୍ଣ୍ଣ ନାମ ଦିଅନ୍ତୁ",
    emailPlaceholder:
      "admin@campx.edu",
    facultyIdPlaceholder:
      "FAC002",
    accessInfo:
      "ଚୟନ କରାଯାଇଥିବା ଶ୍ରେଣୀ ଆଡମିନଙ୍କ ଉପଲବ୍ଧ ସୁବିଧାଗୁଡ଼ିକୁ ନିୟନ୍ତ୍ରଣ କରେ।",
  },
};


function AddAdmin() {

  const navigate = useNavigate();

  const { language } =
    useLanguage();

  const t =
    ADD_ADMIN_TRANSLATIONS[
      language
    ] ||
    ADD_ADMIN_TRANSLATIONS.en;


  // =====================================================
  // CURRENT USER
  // =====================================================

  const storedUser =
    localStorage.getItem(
      "campx_user"
    );

  let currentUser = {};

  try {

    currentUser =
      storedUser
        ? JSON.parse(storedUser)
        : {};

  } catch (error) {

    console.error(
      "Invalid CAMPX user data:",
      error
    );

  }


  const isSuperAdmin =
    currentUser?.role ===
    "SUPER_ADMIN";


  // =====================================================
  // FORM DATA
  // =====================================================

  const [
    formData,
    setFormData,
  ] = useState({

    name: "",
    email: "",
    department: "",
    designation: "",
    faculty_id: "",
    password: "",
    confirm_password: "",

  });


  // =====================================================
  // DEPARTMENTS
  // =====================================================

  const [
    departments,
    setDepartments,
  ] = useState([]);

  const [
    departmentsLoading,
    setDepartmentsLoading,
  ] = useState(true);


  // =====================================================
  // UI STATES
  // =====================================================

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");


  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  useEffect(() => {

    const loadDepartments =
      async () => {

        if (!isSuperAdmin) {

          setDepartmentsLoading(
            false
          );

          return;

        }


        try {

          setDepartmentsLoading(
            true
          );

          setError("");


          const token =
            localStorage.getItem(
              "campx_token"
            );


          if (!token) {

            throw new Error(
              t.authToken
            );

          }


          const response =
            await fetch(
              `${API_URL}/faculty/departments`,
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


          if (!response.ok) {

            throw new Error(
              data.message ||
                t.unableDepartments
            );

          }


          setDepartments(
            Array.isArray(
              data.departments
            )
              ? data.departments
              : []
          );

        } catch (err) {

          console.error(
            "Load Departments Error:",
            err
          );

          setError(
            err.message ||
              t.unableDepartments
          );

        } finally {

          setDepartmentsLoading(
            false
          );

        }

      };


    loadDepartments();

  }, [isSuperAdmin, language]);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;


      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );


      setError("");
      setMessage("");

    };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");
      setMessage("");


      // ================================================
      // SUPER ADMIN CHECK
      // ================================================

      if (!isSuperAdmin) {

        setError(
          t.onlySuperAdmin
        );

        return;

      }


      // ================================================
      // REQUIRED FIELDS
      // ================================================

      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.department ||
        !formData.designation.trim() ||
        !formData.faculty_id.trim() ||
        !formData.password ||
        !formData.confirm_password
      ) {

        setError(
          t.required
        );

        return;

      }


      // ================================================
      // EMAIL VALIDATION
      // ================================================

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(
          formData.email.trim()
        )
      ) {

        setError(
          t.invalidEmail
        );

        return;

      }


      // ================================================
      // PASSWORD MATCH
      // ================================================

      if (
        formData.password !==
        formData.confirm_password
      ) {

        setError(
          t.passwordMismatch
        );

        return;

      }


      // ================================================
      // PASSWORD LENGTH
      // ================================================

      if (
        formData.password.length <
        6
      ) {

        setError(
          t.passwordLength
        );

        return;

      }


      // ================================================
      // SELECTED DEPARTMENT
      // ================================================

      const selectedDepartment =
        departments.find(
          (department) =>
            department.id ===
            formData.department
        );


      if (!selectedDepartment) {

        setError(
          t.invalidDepartment
        );

        return;

      }


      // ================================================
      // CREATE ADMIN
      // ================================================

      try {

        setLoading(true);


        const token =
          localStorage.getItem(
            "campx_token"
          );


        if (!token) {

          throw new Error(
            t.authLogin
          );

        }


        const response =
          await fetch(
            `${API_URL}/faculty/admin`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({

                  name:
                    formData.name.trim(),

                  email:
                    formData.email
                      .trim()
                      .toLowerCase(),

                  department:
                    formData.department,

                  designation:
                    formData.designation.trim(),

                  faculty_id:
                    formData.faculty_id.trim(),

                  password:
                    formData.password,

                }),

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
              t.failedCreate
          );

        }


        // ============================================
        // SUCCESS
        // ============================================

        setMessage(
          t.created(
            selectedDepartment.name
          )
        );


        // ============================================
        // RESET FORM
        // ============================================

        setFormData({

          name: "",
          email: "",
          department: "",
          designation: "",
          faculty_id: "",
          password: "",
          confirm_password: "",

        });


        setShowPassword(false);

        setShowConfirmPassword(
          false
        );

      } catch (err) {

        console.error(
          "Add Admin Error:",
          err
        );

        setError(
          err.message ||
            t.unableCreate
        );

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // ACCESS DENIED
  // =====================================================

  if (!isSuperAdmin) {

    return (

      <div className="app-layout">

        <Sidebar admin />

        <main className="main-content">

          <Topbar
            title={
              t.accessDenied
            }
          />

          <div className="dashboard-content">

            <div className="dashboard-card">

              <div
                style={{
                  textAlign:
                    "center",
                  padding:
                    "40px",
                }}
              >

                <ShieldCheck
                  size={55}
                />

                <h2>
                  {t.accessDenied}
                </h2>

                <p>
                  {t.onlySuperAdmin}
                </p>

                <button
                  className="primary-btn"
                  onClick={() =>
                    navigate(
                      "/admin/dashboard"
                    )
                  }
                >

                  <ArrowLeft
                    size={17}
                  />

                  {t.backDashboard}

                </button>

              </div>

            </div>

          </div>

        </main>

      </div>

    );

  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div className="app-layout">

      <Sidebar admin />

      <main className="main-content">

        <Topbar
          title={t.addAdmin}
        />


        <div className="dashboard-content">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div
            className="dashboard-header"
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              marginBottom:
                "25px",

            }}
          >

            <div>

              <h1>
                {t.registerNew}
              </h1>

              <p>
                {t.createDescription}
              </p>

            </div>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  "/admin/dashboard"
                )
              }
            >

              <ArrowLeft
                size={17}
              />

              {t.back}

            </button>

          </div>


          {/* =================================================
              FORM CARD
          ================================================= */}

          <div
            className="dashboard-card"
            style={{
              maxWidth:
                "900px",

              margin:
                "0 auto",
            }}
          >


            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "12px",

                marginBottom:
                  "25px",
              }}
            >

              <UserPlus
                size={28}
              />

              <div>

                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  {t.adminAccount}
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0",
                  }}
                >
                  {t.enterDetails}
                </p>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div
                style={{
                  padding:
                    "12px",

                  marginBottom:
                    "20px",

                  borderRadius:
                    "8px",

                  background:
                    "#fee2e2",

                  color:
                    "#b91c1c",
                }}
              >

                {error}

              </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {message && (

              <div
                style={{
                  padding:
                    "12px",

                  marginBottom:
                    "20px",

                  borderRadius:
                    "8px",

                  background:
                    "#dcfce7",

                  color:
                    "#166534",
                }}
              >

                {message}

              </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
            >


              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <h3>
                {t.basicInformation}
              </h3>


              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",

                  gap:
                    "20px",

                  marginTop:
                    "20px",
                }}
              >


                {/* =================================================
                    FULL NAME
                ================================================= */}

                <div>

                  <label>
                    {t.fullName} *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.fullNamePlaceholder
                    }
                    required
                  />

                </div>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <div>

                  <label>
                    {t.email} *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.emailPlaceholder
                    }
                    required
                  />

                </div>


                {/* =================================================
                    DEPARTMENT / CATEGORY
                ================================================= */}

                <div>

                  <label>
                    {t.department} *
                  </label>


                  <div
                    style={{
                      position:
                        "relative",
                    }}
                  >

                    <Building2
                      size={18}
                      style={{
                        position:
                          "absolute",

                        left:
                          "12px",

                        top:
                          "50%",

                        transform:
                          "translateY(-50%)",

                        pointerEvents:
                          "none",

                        opacity:
                          0.65,
                      }}
                    />


                    <select
                      name="department"
                      value={
                        formData.department
                      }
                      onChange={
                        handleChange
                      }
                      required
                      disabled={
                        departmentsLoading
                      }
                      style={{
                        width:
                          "100%",

                        paddingLeft:
                          "40px",
                      }}
                    >

                      <option value="">

                        {departmentsLoading
                          ? t.loadingDepartments
                          : t.selectDepartment}

                      </option>


                      {departments.map(
                        (
                          department
                        ) => (

                          <option
                            key={
                              department.id
                            }
                            value={
                              department.id
                            }
                          >
                            {
                              department.name
                            }
                          </option>

                        )
                      )}

                    </select>

                  </div>


                  <small
                    style={{
                      display:
                        "block",

                      marginTop:
                        "6px",

                      color:
                        "#64748b",
                    }}
                  >

                    {
                      t.departmentAccessNote
                    }

                  </small>

                </div>


                {/* =================================================
                    DESIGNATION
                ================================================= */}

                <div>

                  <label>
                    {t.designation} *
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={
                      formData.designation
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.facultyHod
                    }
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  DEPARTMENT INFORMATION
              ================================================= */}

              {formData.department && (

                <div
                  style={{
                    marginTop:
                      "20px",

                    padding:
                      "14px 16px",

                    borderRadius:
                      "10px",

                    background:
                      "rgba(37, 99, 235, 0.07)",

                    border:
                      "1px solid rgba(37, 99, 235, 0.15)",
                  }}
                >

                  <strong>
                    {
                      t.departmentAccess
                    }
                  </strong>

                  <p
                    style={{
                      margin:
                        "5px 0 0",

                      color:
                        "#475569",

                      fontSize:
                        "14px",
                    }}
                  >

                    {t.assignedTo}{" "}

                    <strong>

                      {
                        departments.find(
                          (department) =>
                            department.id ===
                            formData.department
                        )?.name
                      }

                    </strong>

                    {" "}

                    {
                      t.notificationsAndSidebar
                    }

                  </p>


                  <p
                    style={{
                      margin:
                        "8px 0 0",

                      color:
                        "#64748b",

                      fontSize:
                        "13px",
                    }}
                  >

                    {t.accessInfo}

                  </p>

                </div>

              )}


              {/* =================================================
                  LOGIN CREDENTIALS
              ================================================= */}

              <h3
                style={{
                  marginTop:
                    "35px",
                }}
              >
                {t.loginCredentials}
              </h3>


              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",

                  gap:
                    "20px",

                  marginTop:
                    "20px",
                }}
              >


                {/* =================================================
                    FACULTY ID
                ================================================= */}

                <div>

                  <label>
                    {t.facultyId} *
                  </label>

                  <input
                    type="text"
                    name="faculty_id"
                    value={
                      formData.faculty_id
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.facultyIdPlaceholder
                    }
                    required
                  />

                  <small>
                    {t.facultyIdHelp}
                  </small>

                </div>


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div>

                  <label>
                    {t.password} *
                  </label>


                  <div
                    style={{
                      position:
                        "relative",
                    }}
                  >

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      name="password"

                      value={
                        formData.password
                      }

                      onChange={
                        handleChange
                      }

                      placeholder={
                        t.enterPassword
                      }

                      required

                      style={{
                        width:
                          "100%",

                        paddingRight:
                          "45px",
                      }}
                    />


                    <button
                      type="button"

                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }

                      style={{
                        position:
                          "absolute",

                        right:
                          "10px",

                        top:
                          "50%",

                        transform:
                          "translateY(-50%)",

                        border:
                          "none",

                        background:
                          "transparent",

                        cursor:
                          "pointer",
                      }}
                    >

                      {showPassword ? (

                        <EyeOff
                          size={18}
                        />

                      ) : (

                        <Eye
                          size={18}
                        />

                      )}

                    </button>

                  </div>

                </div>


                {/* =================================================
                    CONFIRM PASSWORD
                ================================================= */}

                <div>

                  <label>
                    {
                      t.confirmPassword
                    } *
                  </label>


                  <div
                    style={{
                      position:
                        "relative",
                    }}
                  >

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }

                      name="confirm_password"

                      value={
                        formData.confirm_password
                      }

                      onChange={
                        handleChange
                      }

                      placeholder={
                        t.confirmPasswordPlaceholder
                      }

                      required

                      style={{
                        width:
                          "100%",

                        paddingRight:
                          "45px",
                      }}
                    />


                    <button
                      type="button"

                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) =>
                            !previous
                        )
                      }

                      style={{
                        position:
                          "absolute",

                        right:
                          "10px",

                        top:
                          "50%",

                        transform:
                          "translateY(-50%)",

                        border:
                          "none",

                        background:
                          "transparent",

                        cursor:
                          "pointer",
                      }}
                    >

                      {showConfirmPassword ? (

                        <EyeOff
                          size={18}
                        />

                      ) : (

                        <Eye
                          size={18}
                        />

                      )}

                    </button>

                  </div>

                </div>

              </div>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "flex-end",

                  gap:
                    "12px",

                  marginTop:
                    "35px",

                  paddingTop:
                    "25px",

                  borderTop:
                    "1px solid #e5e7eb",
                }}
              >

                <button
                  type="button"
                  className="secondary-btn"

                  onClick={() =>
                    navigate(
                      "/admin/dashboard"
                    )
                  }

                  disabled={
                    loading
                  }
                >

                  {t.cancel}

                </button>


                <button
                  type="submit"
                  className="primary-btn"

                  disabled={
                    loading ||
                    departmentsLoading
                  }
                >

                  {loading ? (

                    t.creating

                  ) : (

                    <>
                      <Save
                        size={17}
                      />

                      {t.createAdmin}
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      </main>

    </div>

  );
}


export default AddAdmin;