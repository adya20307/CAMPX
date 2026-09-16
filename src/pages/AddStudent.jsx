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

export default function AddStudent() {
  const navigate = useNavigate();

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
      return "Registration number is required.";
    }

    if (!form.name.trim()) {
      return "Student name is required.";
    }

    if (!form.email.trim()) {
      return "Email address is required.";
    }

    if (!form.branch.trim()) {
      return "Branch is required.";
    }

    if (!form.semester.trim()) {
      return "Semester is required.";
    }

    if (!form.section.trim()) {
      return "Section is required.";
    }

    if (!form.batchYear) {
      return "Batch year is required.";
    }

    if (!form.password) {
      return "Password is required.";
    }

    if (form.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    if (
      form.hostelStatus === "HOSTELLER" &&
      (!form.hostel.trim() || !form.room.trim())
    ) {
      return "Hostel and room number are required for hostellers.";
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
        "Your session has expired. Please login again."
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
            "Failed to register student."
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      setMessage(
        data.message ||
          "Student registered successfully!"
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
          "Unable to register student."
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

        <Topbar title="Add Student" />

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
                  title="Back"
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
                Register a new student in CAMPX.
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
                    Student Information
                  </h2>

                  <p
                    style={{
                      margin:
                        "4px 0 0",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    Enter the student's academic
                    and personal details.
                  </p>

                </div>

              </div>

              <div className="form-grid">

                {/* Registration Number */}

                <div className="form-group">

                  <label>
                    Registration Number
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
                    placeholder="e.g. 2401289031"
                    required
                  />

                </div>

                {/* Name */}

                <div className="form-group">

                  <label>
                    Full Name
                    <span className="required">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter student's full name"
                    required
                  />

                </div>

                {/* Email */}

                <div className="form-group">

                  <label>
                    College Email
                    <span className="required">
                      *
                    </span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@campx.edu"
                    required
                  />

                </div>

                {/* Phone */}

                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
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
                Academic Information
              </h2>

              <div className="form-grid">

                {/* Branch */}

                <div className="form-group">

                  <label>
                    Branch
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
                      Select Branch
                    </option>

                    <option value="CSE">
                      Computer Science Engineering
                    </option>

                    <option value="ECE">
                      Electronics & Communication
                    </option>

                    <option value="EEE">
                      Electrical & Electronics
                    </option>

                    <option value="ME">
                      Mechanical Engineering
                    </option>

                    <option value="CE">
                      Civil Engineering
                    </option>

                    <option value="IT">
                      Information Technology
                    </option>

                    <option value="AI">
                      Artificial Intelligence
                    </option>

                    <option value="AIML">
                      AI & Machine Learning
                    </option>

                  </select>

                </div>

                {/* Semester */}

                <div className="form-group">

                  <label>
                    Semester
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
                      Select Semester
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
                    Section
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
                      Select Section
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
                    Batch Year
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
                Hostel Information
              </h2>

              <div className="form-grid">

                {/* Hostel Status */}

                <div className="form-group">

                  <label>
                    Hostel Status
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
                      Non-Hosteller
                    </option>

                    <option value="HOSTELLER">
                      Hosteller
                    </option>

                  </select>

                </div>

                {/* Hostel */}

                {form.hostelStatus ===
                  "HOSTELLER" && (
                  <div className="form-group">

                    <label>
                      Hostel
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="hostel"
                      value={form.hostel}
                      onChange={handleChange}
                      placeholder="e.g. Hostel A"
                      required
                    />

                  </div>
                )}

                {/* Room */}

                {form.hostelStatus ===
                  "HOSTELLER" && (
                  <div className="form-group">

                    <label>
                      Room Number
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="room"
                      value={form.room}
                      onChange={handleChange}
                      placeholder="e.g. A-204"
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
                Student Login
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "25px",
                }}
              >
                Create the password the student
                will use to log in to CAMPX.
              </p>

              <div className="form-grid">

                {/* Password */}

                <div className="form-group">

                  <label>
                    Password
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
                      placeholder="Minimum 6 characters"
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
                    Confirm Password
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
                      placeholder="Re-enter password"
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
                Cancel
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