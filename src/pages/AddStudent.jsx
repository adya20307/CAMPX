import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const initialForm = {
  registrationNumber: "",
  name: "",
  email: "",
  branch: "",
  semester: "",
  section: "",
  batchYear: "2026",
  hostelStatus: "NON_HOSTELLER",
  hostel: "NA",
  room: "NA",
  phone: "",
  password: "",
  confirmPassword: "",
};


const ADD_STUDENT_TRANSLATIONS = {
  en: {
    addStudent: "Add Student",
    back: "Back",
    registerStudent: "Register Student",
    registerDescription: "Register a new student in CAMPX.",
    studentInformation: "Student Information",
    enterDetails: "Enter the student's academic and personal details.",
    registrationNumber: "Registration Number",
    registrationPlaceholder: "e.g. 2401289031",
    fullName: "Full Name",
    namePlaceholder: "Enter student's full name",
    collegeEmail: "College Email",
    emailPlaceholder: "student@campx.edu",
    phoneNumber: "Phone Number",
    phonePlaceholder: "Enter phone number",
    academicInformation: "Academic Information",
    branch: "Branch",
    selectBranch: "Select Branch",
    cse: "Computer Science Engineering",
    ece: "Electronics & Communication",
    eee: "Electrical & Electronics",
    me: "Mechanical Engineering",
    ce: "Civil Engineering",
    it: "Information Technology",
    ai: "Artificial Intelligence",
    aiml: "AI & Machine Learning",
    semester: "Semester",
    selectSemester: "Select Semester",
    section: "Section",
    selectSection: "Select Section",
    batchYear: "Batch Year",
    hostelInformation: "Hostel Information",
    hostelStatus: "Hostel Status",
    nonHosteller: "Non-Hosteller",
    hosteller: "Hosteller",
    hostel: "Hostel",
    hostelPlaceholder: "e.g. Hostel A",
    roomNumber: "Room Number",
    roomPlaceholder: "e.g. A-204",
    studentLogin: "Student Login",
    loginDescription: "Create the password the student will use to log in to CAMPX.",
    password: "Password",
    minimumPassword: "Minimum 6 characters",
    confirmPassword: "Confirm Password",
    reenterPassword: "Re-enter password",
    cancel: "Cancel",
    registering: "Registering...",
    register: "Register Student",
    sessionExpired: "Your session has expired. Please login again.",
    registrationNumberRequired: "Registration number is required.",
    studentNameRequired: "Student name is required.",
    emailRequired: "Email address is required.",
    branchRequired: "Branch is required.",
    semesterRequired: "Semester is required.",
    sectionRequired: "Section is required.",
    batchRequired: "Batch year is required.",
    passwordRequired: "Password is required.",
    passwordLength: "Password must contain at least 6 characters.",
    passwordsMismatch: "Passwords do not match.",
    hostelRoomRequired: "Hostel and room number are required for hostellers.",
    failedRegister: "Failed to register student.",
    registeredSuccess: "Student registered successfully!",
    unableRegister: "Unable to register student.",
  },
  hi: {
    addStudent: "छात्र जोड़ें",
    back: "वापस",
    registerStudent: "छात्र पंजीकृत करें",
    registerDescription: "CAMPX में एक नए छात्र को पंजीकृत करें।",
    studentInformation: "छात्र जानकारी",
    enterDetails: "छात्र की शैक्षणिक और व्यक्तिगत जानकारी दर्ज करें।",
    registrationNumber: "रजिस्ट्रेशन नंबर",
    registrationPlaceholder: "जैसे 2401289031",
    fullName: "पूरा नाम",
    namePlaceholder: "छात्र का पूरा नाम दर्ज करें",
    collegeEmail: "कॉलेज ईमेल",
    emailPlaceholder: "student@campx.edu",
    phoneNumber: "फोन नंबर",
    phonePlaceholder: "फोन नंबर दर्ज करें",
    academicInformation: "शैक्षणिक जानकारी",
    branch: "शाखा",
    selectBranch: "शाखा चुनें",
    cse: "कंप्यूटर साइंस इंजीनियरिंग",
    ece: "इलेक्ट्रॉनिक्स एवं कम्युनिकेशन",
    eee: "इलेक्ट्रिकल एवं इलेक्ट्रॉनिक्स",
    me: "मैकेनिकल इंजीनियरिंग",
    ce: "सिविल इंजीनियरिंग",
    it: "इन्फॉर्मेशन टेक्नोलॉजी",
    ai: "आर्टिफिशियल इंटेलिजेंस",
    aiml: "AI एवं मशीन लर्निंग",
    semester: "सेमेस्टर",
    selectSemester: "सेमेस्टर चुनें",
    section: "सेक्शन",
    selectSection: "सेक्शन चुनें",
    batchYear: "बैच वर्ष",
    hostelInformation: "हॉस्टल जानकारी",
    hostelStatus: "हॉस्टल स्थिति",
    nonHosteller: "गैर-हॉस्टल छात्र",
    hosteller: "हॉस्टल छात्र",
    hostel: "हॉस्टल",
    hostelPlaceholder: "जैसे हॉस्टल A",
    roomNumber: "कमरा नंबर",
    roomPlaceholder: "जैसे A-204",
    studentLogin: "छात्र लॉगिन",
    loginDescription: "वह पासवर्ड बनाएं जिसका उपयोग छात्र CAMPX में लॉगिन करने के लिए करेगा।",
    password: "पासवर्ड",
    minimumPassword: "कम से कम 6 अक्षर",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    reenterPassword: "पासवर्ड फिर से दर्ज करें",
    cancel: "रद्द करें",
    registering: "पंजीकरण हो रहा है...",
    register: "छात्र पंजीकृत करें",
    sessionExpired: "आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।",
    registrationNumberRequired: "रजिस्ट्रेशन नंबर आवश्यक है।",
    studentNameRequired: "छात्र का नाम आवश्यक है।",
    emailRequired: "ईमेल पता आवश्यक है।",
    branchRequired: "शाखा आवश्यक है।",
    semesterRequired: "सेमेस्टर आवश्यक है।",
    sectionRequired: "सेक्शन आवश्यक है।",
    batchRequired: "बैच वर्ष आवश्यक है।",
    passwordRequired: "पासवर्ड आवश्यक है।",
    passwordLength: "पासवर्ड में कम से कम 6 अक्षर होने चाहिए।",
    passwordsMismatch: "पासवर्ड मेल नहीं खाते।",
    hostelRoomRequired: "हॉस्टल छात्रों के लिए हॉस्टल और कमरा नंबर आवश्यक है।",
    failedRegister: "छात्र पंजीकरण विफल रहा।",
    registeredSuccess: "छात्र सफलतापूर्वक पंजीकृत हो गया!",
    unableRegister: "छात्र को पंजीकृत नहीं किया जा सका।",
  },
  or: {
    addStudent: "ଛାତ୍ର ଯୋଡନ୍ତୁ",
    back: "ପଛକୁ",
    registerStudent: "ଛାତ୍ର ପଞ୍ଜୀକରଣ କରନ୍ତୁ",
    registerDescription: "CAMPX ରେ ଜଣେ ନୂତନ ଛାତ୍ରଙ୍କୁ ପଞ୍ଜୀକରଣ କରନ୍ତୁ।",
    studentInformation: "ଛାତ୍ର ସୂଚନା",
    enterDetails: "ଛାତ୍ରଙ୍କ ଶିକ୍ଷାଗତ ଏବଂ ବ୍ୟକ୍ତିଗତ ବିବରଣୀ ଦିଅନ୍ତୁ।",
    registrationNumber: "ପଞ୍ଜୀକରଣ ନମ୍ବର",
    registrationPlaceholder: "ଯଥା 2401289031",
    fullName: "ପୂର୍ଣ୍ଣ ନାମ",
    namePlaceholder: "ଛାତ୍ରଙ୍କ ପୂର୍ଣ୍ଣ ନାମ ଦିଅନ୍ତୁ",
    collegeEmail: "କଲେଜ୍ ଇମେଲ୍",
    emailPlaceholder: "student@campx.edu",
    phoneNumber: "ଫୋନ୍ ନମ୍ବର",
    phonePlaceholder: "ଫୋନ୍ ନମ୍ବର ଦିଅନ୍ତୁ",
    academicInformation: "ଶିକ୍ଷାଗତ ସୂଚନା",
    branch: "ଶାଖା",
    selectBranch: "ଶାଖା ଚୟନ କରନ୍ତୁ",
    cse: "କମ୍ପ୍ୟୁଟର ସାଇନ୍ସ ଇଞ୍ଜିନିୟରିଂ",
    ece: "ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ଏବଂ କମ୍ୟୁନିକେସନ୍",
    eee: "ଇଲେକ୍ଟ୍ରିକାଲ୍ ଏବଂ ଇଲେକ୍ଟ୍ରୋନିକ୍ସ",
    me: "ମେକାନିକାଲ୍ ଇଞ୍ଜିନିୟରିଂ",
    ce: "ସିଭିଲ୍ ଇଞ୍ଜିନିୟରିଂ",
    it: "ଇନଫର୍ମେସନ୍ ଟେକ୍ନୋଲୋଜି",
    ai: "ଆର୍ଟିଫିସିଆଲ୍ ଇଣ୍ଟେଲିଜେନ୍ସ",
    aiml: "AI ଏବଂ ମେସିନ୍ ଲର୍ଣ୍ଣିଂ",
    semester: "ସେମିଷ୍ଟର",
    selectSemester: "ସେମିଷ୍ଟର ଚୟନ କରନ୍ତୁ",
    section: "ସେକ୍ସନ୍",
    selectSection: "ସେକ୍ସନ୍ ଚୟନ କରନ୍ତୁ",
    batchYear: "ବ୍ୟାଚ୍ ବର୍ଷ",
    hostelInformation: "ହଷ୍ଟେଲ୍ ସୂଚନା",
    hostelStatus: "ହଷ୍ଟେଲ୍ ସ୍ଥିତି",
    nonHosteller: "ନନ୍-ହଷ୍ଟେଲ୍ ଛାତ୍ର",
    hosteller: "ହଷ୍ଟେଲ୍ ଛାତ୍ର",
    hostel: "ହଷ୍ଟେଲ୍",
    hostelPlaceholder: "ଯଥା ହଷ୍ଟେଲ୍ A",
    roomNumber: "ରୁମ୍ ନମ୍ବର",
    roomPlaceholder: "ଯଥା A-204",
    studentLogin: "ଛାତ୍ର ଲଗଇନ୍",
    loginDescription: "ଛାତ୍ର CAMPX ରେ ଲଗଇନ୍ କରିବା ପାଇଁ ବ୍ୟବହାର କରିବା ପାସୱାର୍ଡ ସୃଷ୍ଟି କରନ୍ତୁ।",
    password: "ପାସୱାର୍ଡ",
    minimumPassword: "ଅତି କମରେ 6ଟି ଅକ୍ଷର",
    confirmPassword: "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
    reenterPassword: "ପାସୱାର୍ଡ ପୁଣି ଦିଅନ୍ତୁ",
    cancel: "ବାତିଲ୍",
    registering: "ପଞ୍ଜୀକରଣ ହେଉଛି...",
    register: "ଛାତ୍ର ପଞ୍ଜୀକରଣ କରନ୍ତୁ",
    sessionExpired: "ଆପଣଙ୍କ ସେସନ୍ ସମାପ୍ତ ହୋଇଛି। ଦୟାକରି ପୁଣି ଲଗଇନ୍ କରନ୍ତୁ।",
    registrationNumberRequired: "ପଞ୍ଜୀକରଣ ନମ୍ବର ଆବଶ୍ୟକ।",
    studentNameRequired: "ଛାତ୍ରଙ୍କ ନାମ ଆବଶ୍ୟକ।",
    emailRequired: "ଇମେଲ୍ ଠିକଣା ଆବଶ୍ୟକ।",
    branchRequired: "ଶାଖା ଆବଶ୍ୟକ।",
    semesterRequired: "ସେମିଷ୍ଟର ଆବଶ୍ୟକ।",
    sectionRequired: "ସେକ୍ସନ୍ ଆବଶ୍ୟକ।",
    batchRequired: "ବ୍ୟାଚ୍ ବର୍ଷ ଆବଶ୍ୟକ।",
    passwordRequired: "ପାସୱାର୍ଡ ଆବଶ୍ୟକ।",
    passwordLength: "ପାସୱାର୍ଡରେ ଅତି କମରେ 6ଟି ଅକ୍ଷର ଥିବା ଆବଶ୍ୟକ।",
    passwordsMismatch: "ପାସୱାର୍ଡ ମେଳ ଖାଉନାହିଁ।",
    hostelRoomRequired: "ହଷ୍ଟେଲ୍ ଛାତ୍ରଙ୍କ ପାଇଁ ହଷ୍ଟେଲ୍ ଏବଂ ରୁମ୍ ନମ୍ବର ଆବଶ୍ୟକ।",
    failedRegister: "ଛାତ୍ର ପଞ୍ଜୀକରଣ ବିଫଳ ହେଲା।",
    registeredSuccess: "ଛାତ୍ର ସଫଳତାର ସହ ପଞ୍ଜୀକୃତ ହୋଇଛନ୍ତି!",
    unableRegister: "ଛାତ୍ରଙ୍କୁ ପଞ୍ଜୀକରଣ କରିହେଲା ନାହିଁ।",
  },
};

export default function AddStudent() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t =
    ADD_STUDENT_TRANSLATIONS[language] ||
    ADD_STUDENT_TRANSLATIONS.en;

  const [form, setForm] = useState(initialForm);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");

    // If student is non-hosteller, automatically clear
    // hostel and room information.
    if (name === "hostelStatus" && value === "NON_HOSTELLER") {
      setForm((previous) => ({
        ...previous,
        hostelStatus: value,
        hostel: "NA",
        room: "NA",
      }));
    }
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!form.registrationNumber.trim()) {
      return t.registrationNumberRequired;
    }

    if (!form.name.trim()) {
      return t.studentNameRequired;
    }

    if (!form.email.trim()) {
      return t.emailRequired;
    }

    if (!form.branch.trim()) {
      return t.branchRequired;
    }

    if (!form.semester.trim()) {
      return t.semesterRequired;
    }

    if (!form.section.trim()) {
      return t.sectionRequired;
    }

    if (!form.batchYear) {
      return t.batchRequired;
    }

    if (!form.password) {
      return t.passwordRequired;
    }

    if (form.password.length < 6) {
      return t.passwordLength;
    }

    if (form.password !== form.confirmPassword) {
      return t.passwordsMismatch;
    }

    if (
      form.hostelStatus === "HOSTELLER" &&
      (!form.hostel.trim() || !form.room.trim())
    ) {
      return t.hostelRoomRequired;
    }

    return "";
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    // ========================================
    // GET LOGIN TOKEN
    // ========================================

    const token = localStorage.getItem("campx_token");

    if (!token) {
      setError(
        t.sessionExpired
      );

      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1500);

      return;
    }

    try {
      setLoading(true);

      // ======================================
      // DATA SENT TO BACKEND
      // ======================================

      const studentData = {
        registrationNumber:
          form.registrationNumber.trim(),

        name: form.name.trim(),

        email: form.email.trim(),

        branch: form.branch.trim(),

        semester: form.semester.trim(),

        section: form.section.trim(),

        batchYear: Number(form.batchYear),

        hostelStatus: form.hostelStatus,

        hostel:
          form.hostelStatus === "HOSTELLER"
            ? form.hostel.trim()
            : "NA",

        room:
          form.hostelStatus === "HOSTELLER"
            ? form.room.trim()
            : "NA",

        phone: form.phone.trim(),

        password: form.password,
      };

      console.log(
        "Registering student:",
        studentData
      );

      // ======================================
      // API REQUEST
      // ======================================

      const response = await fetch(
        `${API_URL}/students`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            // IMPORTANT:
            // Backend requires this JWT.
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(studentData),
        }
      );

      // ======================================
      // READ RESPONSE
      // ======================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        "Add student response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            t.failedRegister
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      setMessage(
        data.message ||
          t.registeredSuccess
      );

      // Clear form
      setForm(initialForm);

      // Go back to student list after success
      setTimeout(() => {
        navigate("/admin/students");
      }, 1200);
    } catch (err) {
      console.error(
        "Add student error:",
        err
      );

      setError(
        err.message ||
          t.unableRegister
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    navigate("/admin/students");
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
          MAIN CONTENT
      ======================================= */}

      <main className="main-content">

        <Topbar title={t.addStudent} />

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
              gap: "20px",
              marginBottom: "25px",
            }}
          >

            <div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >

                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "8px",
                    border:
                      "1px solid #dbe3ef",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title={t.back}
                >
                  <ArrowLeft size={19} />
                </button>

                <h1
                  style={{
                    margin: 0,
                  }}
                >
                  Add Student
                </h1>

              </div>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                }}
              >
                {t.registerDescription}
              </p>

            </div>

          </div>

          {/* ==================================
              SUCCESS MESSAGE
          ================================== */}

          {message && (
            <div
              style={{
                background: "#f0fdf4",
                border:
                  "1px solid #bbf7d0",
                color: "#166534",
                padding: "14px 18px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              {message}
            </div>
          )}

          {/* ==================================
              ERROR MESSAGE
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
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          {/* ==================================
              FORM
          ================================== */}

          <form onSubmit={handleSubmit}>

            {/* ==================================
                BASIC INFORMATION
            ================================== */}

            <div
              className="dashboard-card"
              style={{
                marginBottom: "20px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "25px",
                }}
              >

                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserPlus size={21} />
                </div>

                <div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                    }}
                  >
                    {t.studentInformation}
                  </h2>

                  <p
                    style={{
                      margin:
                        "4px 0 0",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    {t.enterDetails}
                  </p>

                </div>

              </div>

              <div className="form-grid">

                {/* Registration Number */}

                <div className="form-group">

                  <label>
                    {t.registrationNumber}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="registrationNumber"
                    value={
                      form.registrationNumber
                    }
                    onChange={handleChange}
                    placeholder={t.registrationPlaceholder}
                    required
                  />

                </div>

                {/* Name */}

                <div className="form-group">

                  <label>
                    {t.fullName}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t.namePlaceholder}
                    required
                  />

                </div>

                {/* Email */}

                <div className="form-group">

                  <label>
                    {t.collegeEmail}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder}
                    required
                  />

                </div>

                {/* Phone */}

                <div className="form-group">

                  <label>
                    {t.phoneNumber}
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder}
                  />

                </div>

              </div>

            </div>

            {/* ==================================
                ACADEMIC INFORMATION
            ================================== */}

            <div
              className="dashboard-card"
              style={{
                marginBottom: "20px",
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "25px",
                  fontSize: "20px",
                }}
              >
                {t.academicInformation}
              </h2>

              <div className="form-grid">

                {/* Branch */}

                <div className="form-group">

                  <label>
                    {t.branch}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <select
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {t.selectBranch}
                    </option>

                    <option value="CSE">
                      {t.cse}
                    </option>

                    <option value="ECE">
                      {t.ece}
                    </option>

                    <option value="EEE">
                      {t.eee}
                    </option>

                    <option value="ME">
                      {t.me}
                    </option>

                    <option value="CE">
                      {t.ce}
                    </option>

                    <option value="IT">
                      {t.it}
                    </option>

                    <option value="AI">
                      {t.ai}
                    </option>

                    <option value="AIML">
                      {t.aiml}
                    </option>

                  </select>

                </div>

                {/* Semester */}

                <div className="form-group">

                  <label>
                    {t.semester}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {t.selectSemester}
                    </option>

                    <option value="1st Semester">
                      1st Semester
                    </option>

                    <option value="2nd Semester">
                      2nd Semester
                    </option>

                    <option value="3rd Semester">
                      3rd Semester
                    </option>

                    <option value="4th Semester">
                      4th Semester
                    </option>

                    <option value="5th Semester">
                      5th Semester
                    </option>

                    <option value="6th Semester">
                      6th Semester
                    </option>

                    <option value="7th Semester">
                      7th Semester
                    </option>

                    <option value="8th Semester">
                      8th Semester
                    </option>

                  </select>

                </div>

                {/* Section */}

                <div className="form-group">

                  <label>
                    {t.section}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <select
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {t.selectSection}
                    </option>

                    <option value="A">
                      A
                    </option>

                    <option value="B">
                      B
                    </option>

                    <option value="C">
                      C
                    </option>

                    <option value="D">
                      D
                    </option>

                  </select>

                </div>

                {/* Batch */}

                <div className="form-group">

                  <label>
                    {t.batchYear}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <select
                    name="batchYear"
                    value={form.batchYear}
                    onChange={handleChange}
                    required
                  >

                    <option value="2022">
                      2022
                    </option>

                    <option value="2024">
                      2024
                    </option>

                    <option value="2025">
                      2025
                    </option>

                    <option value="2026">
                      2026
                    </option>

                  </select>

                </div>

              </div>

            </div>

            {/* ==================================
                HOSTEL INFORMATION
            ================================== */}

            <div
              className="dashboard-card"
              style={{
                marginBottom: "20px",
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "25px",
                  fontSize: "20px",
                }}
              >
                {t.hostelInformation}
              </h2>

              <div className="form-grid">

                {/* Hostel Status */}

                <div className="form-group">

                  <label>
                    {t.hostelStatus}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <select
                    name="hostelStatus"
                    value={form.hostelStatus}
                    onChange={handleChange}
                    required
                  >

                    <option value="NON_HOSTELLER">
                      {t.nonHosteller}
                    </option>

                    <option value="HOSTELLER">
                      {t.hosteller}
                    </option>

                  </select>

                </div>

                {/* Hostel */}

                {form.hostelStatus ===
                  "HOSTELLER" && (
                  <div className="form-group">

                    <label>
                      {t.hostel}
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="hostel"
                      value={form.hostel}
                      onChange={handleChange}
                      placeholder={t.hostelPlaceholder}
                      required
                    />

                  </div>
                )}

                {/* Room */}

                {form.hostelStatus ===
                  "HOSTELLER" && (
                  <div className="form-group">

                    <label>
                      {t.roomNumber}
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="room"
                      value={form.room}
                      onChange={handleChange}
                      placeholder={t.roomPlaceholder}
                      required
                    />

                  </div>
                )}

              </div>

            </div>

            {/* ==================================
                LOGIN INFORMATION
            ================================== */}

            <div
              className="dashboard-card"
              style={{
                marginBottom: "25px",
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "8px",
                  fontSize: "20px",
                }}
              >
                {t.studentLogin}
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "25px",
                }}
              >
                {t.loginDescription}
              </p>

              <div className="form-grid">

                {/* Password */}

                <div className="form-group">

                  <label>
                    {t.password}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={t.minimumPassword}
                      required
                      style={{
                        paddingRight:
                          "45px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      style={{
                        position:
                          "absolute",
                        right: "10px",
                        top: "50%",
                        transform:
                          "translateY(-50%)",
                        border: "none",
                        background:
                          "transparent",
                        cursor: "pointer",
                        color: "#64748b",
                      }}
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Confirm Password */}

                <div className="form-group">

                  <label>
                    {t.confirmPassword}
                    <span className="required">
                      *
                    </span>
                  </label>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        form.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder={t.reenterPassword}
                      required
                      style={{
                        paddingRight:
                          "45px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      style={{
                        position:
                          "absolute",
                        right: "10px",
                        top: "50%",
                        transform:
                          "translateY(-50%)",
                        border: "none",
                        background:
                          "transparent",
                        cursor: "pointer",
                        color: "#64748b",
                      }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================
                ACTION BUTTONS
            ================================== */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginBottom: "30px",
              }}
            >

              <button
                type="button"
                className="secondary-btn"
                onClick={handleCancel}
                disabled={loading}
                style={{
                  padding:
                    "11px 22px",
                }}
              >
                {t.cancel}
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minWidth: "160px",
                  padding:
                    "11px 22px",
                  opacity: loading
                    ? 0.7
                    : 1,
                }}
              >

                <Save size={17} />

                {loading
                  ? "Registering..."
                  : "Register Student"}

              </button>

            </div>

          </form>

        </div>

      </main>

      {/* ======================================
          FORM STYLES
      ======================================= */}

      <style>
        {`
          .form-grid {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group label {
            font-size: 14px;
            font-weight: 600;
            color: #334155;
          }

          .required {
            color: #dc2626;
            margin-left: 4px;
          }

          .form-group input,
          .form-group select {
            width: 100%;
            min-height: 44px;
            padding: 10px 13px;
            border:
              1px solid #dbe3ef;
            border-radius: 8px;
            background: #ffffff;
            color: #1e293b;
            font-size: 14px;
            outline: none;
            box-sizing: border-box;
            transition:
              border-color 0.2s,
              box-shadow 0.2s;
          }

          .form-group input:focus,
          .form-group select:focus {
            border-color: #2563eb;
            box-shadow:
              0 0 0 3px
              rgba(37, 99, 235, 0.1);
          }

          .form-group input::placeholder {
            color: #94a3b8;
          }

          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

    </div>
  );
}