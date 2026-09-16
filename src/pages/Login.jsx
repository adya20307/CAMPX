import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

// =====================================================
// API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

// =====================================================
// LOGIN COMPONENT
//
// /login  -> Student Login
// /admin  -> Admin / Super Admin Login
//
// =====================================================

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // ===================================================
  // DETERMINE LOGIN TYPE FROM URL
  // ===================================================

  const mode =
    location.pathname === "/admin"
      ? "admin"
      : "student";

  const isStudent = mode === "student";
  const isAdmin = mode === "admin";

  // ===================================================
  // STATES
  // ===================================================

  const [registrationNumber, setRegistrationNumber] =
    useState("");

  const [facultyId, setFacultyId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ===================================================
  // LOGIN
  // ===================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // -------------------------------------------------
    // Get login ID
    // -------------------------------------------------

    const loginId = isStudent
      ? registrationNumber.trim()
      : facultyId.trim();

    // -------------------------------------------------
    // Validate
    // -------------------------------------------------

    if (!loginId || !password) {
      setError(
        isStudent
          ? "Please enter your registration number and password."
          : "Please enter your Faculty ID and password."
      );

      return;
    }

    try {
      setLoading(true);

      // ------------------------------------------------
      // API endpoint
      // ------------------------------------------------

      const endpoint = isStudent
        ? `${API_URL}/auth/student/login`
        : `${API_URL}/auth/admin/login`;

      // ------------------------------------------------
      // Request body
      // ------------------------------------------------

      const body = isStudent
        ? {
            registrationNumber: loginId,
            password: password,
          }
        : {
            facultyId: loginId,
            password: password,
          };

      console.log("Login request:", {
        endpoint,
        loginType: isStudent ? "STUDENT" : "ADMIN",
      });

      // ------------------------------------------------
      // Send request
      // ------------------------------------------------

      const response = await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(body),
        }
      );

      // ------------------------------------------------
      // Get response
      // ------------------------------------------------

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(
          "Unable to parse server response:",
          jsonError
        );

        throw new Error(
          "Invalid response received from CampX server."
        );
      }

      // ------------------------------------------------
      // Error response
      // ------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid login credentials."
        );
      }

      // ------------------------------------------------
      // Make sure token exists
      // ------------------------------------------------

      if (!data.token) {
        throw new Error(
          "Login successful but authentication token was not received."
        );
      }

      // ------------------------------------------------
      // Make sure user exists
      // ------------------------------------------------

      if (!data.user) {
        throw new Error(
          "Login successful but user information was not received."
        );
      }

      // =================================================
      // CLEAR OLD LOGIN DATA
      // =================================================

      localStorage.removeItem(
        "campx_token"
      );

      localStorage.removeItem(
        "campx_user"
      );

      // =================================================
      // SAVE NEW LOGIN
      // =================================================

      localStorage.setItem(
        "campx_token",
        data.token
      );

      localStorage.setItem(
        "campx_user",
        JSON.stringify(data.user)
      );

      // =================================================
      // STUDENT LOGIN
      // =================================================

      if (isStudent) {
        console.log(
          "Logged in as STUDENT"
        );

        navigate(
          "/student",
          {
            replace: true,
          }
        );

        return;
      }

      // =================================================
      // ADMIN / SUPER ADMIN LOGIN
      // =================================================

      if (isAdmin) {
        // ----------------------------------------------
        // Check role returned by backend
        // ----------------------------------------------

        if (
          data.user.role ===
          "SUPER_ADMIN"
        ) {
          console.log(
            "Logged in as SUPER_ADMIN"
          );
        } else if (
          data.user.role ===
          "ADMIN"
        ) {
          console.log(
            "Logged in as ADMIN"
          );
        } else {
          console.warn(
            "Unknown admin role:",
            data.user.role
          );
        }

        // ----------------------------------------------
        // Both ADMIN and SUPER_ADMIN
        // use the same dashboard
        // ----------------------------------------------

        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to CampX server."
      );

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FORGOT PASSWORD
  // ===================================================

  const handleForgotPassword = () => {
    if (isStudent) {
      alert(
        "Please contact the CampX administration to reset your student password."
      );
    } else {
      alert(
        "Please contact the CampX Super Admin to reset your admin password."
      );
    }
  };

  // ===================================================
  // CLEAR SESSION
  // ===================================================

  const handleClearSession = () => {
    localStorage.removeItem(
      "campx_token"
    );

    localStorage.removeItem(
      "campx_user"
    );

    setRegistrationNumber("");
    setFacultyId("");
    setPassword("");
    setError("");
  };

  // ===================================================
  // RETURN UI
  // ===================================================

  return (
    <div className="login-page">

      {/* =================================================
          LEFT BRANDING PANEL
      ================================================= */}

      <section className="login-left">

        <div className="login-brand">

          <div className="login-brand-icon">

            <ShieldCheck
              size={29}
            />

          </div>

          <div>

            <div className="login-brand-name">
              CampX
            </div>

            <div className="login-brand-tagline">
              One Campus. One Platform.
            </div>

          </div>

        </div>


        <div className="login-left-content">

          <div className="login-badge">
            AI-POWERED CAMPUS OPERATIONS
          </div>


          <h2 className="login-main-title">

            Your campus life,

            <span>
              simplified.
            </span>

          </h2>


          <p className="login-main-description">

            Manage complaints, attendance,
            hostel, mess, documents,
            gate passes and more —
            all from one intelligent platform.

          </p>


          <div className="login-stats">


            <div className="login-stat">

              <strong>
                360°
              </strong>

              <span>
                Campus Management
              </span>

            </div>


            <div className="login-stat">

              <strong>
                AI
              </strong>

              <span>
                Smart Assistance
              </span>

            </div>


            <div className="login-stat">

              <strong>
                24/7
              </strong>

              <span>
                Campus Access
              </span>

            </div>


          </div>

        </div>

      </section>


      {/* =================================================
          RIGHT LOGIN PANEL
      ================================================= */}

      <section className="login-right">

        <div className="login-card">


          {/* =================================================
              MOBILE BRAND
          ================================================= */}

          <div className="login-mobile-brand">

            <div className="login-logo-icon">

              <ShieldCheck
                size={28}
              />

            </div>


            <div>

              <h1>
                CampX
              </h1>

              <p>
                One Campus. One Platform.
              </p>

            </div>

          </div>


          {/* =================================================
              HEADING
          ================================================= */}

          <div className="login-heading">

            <h2>

              {isStudent
                ? "Student Login"
                : "Admin Portal Login"}

            </h2>


            <p>

              {isStudent
                ? "Sign in to continue to your CampX student portal"
                : "Sign in using your Faculty ID"}

            </p>

          </div>


          {/* =================================================
              LOGIN TYPE INDICATOR
          ================================================= */}

          <div
            style={{
              marginBottom: "20px",
              padding: "12px 14px",
              borderRadius: "10px",
              background:
                "rgba(37, 99, 235, 0.08)",
              border:
                "1px solid rgba(37, 99, 235, 0.15)",
              color: "#1d4ed8",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >

            {isStudent
              ? "🎓 Student Portal"
              : "🛡️ Admin & Super Admin Portal"}

          </div>


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleLogin}
          >


            {/* =================================================
                STUDENT REGISTRATION NUMBER
            ================================================= */}

            {isStudent && (

              <div className="login-field">

                <label
                  htmlFor="registrationNumber"
                >
                  Registration Number
                </label>


                <div className="login-input-wrapper">

                  <User
                    size={19}
                  />


                  <input
                    id="registrationNumber"

                    type="text"

                    value={
                      registrationNumber
                    }

                    onChange={(e) =>
                      setRegistrationNumber(
                        e.target.value
                      )
                    }

                    placeholder="Enter registration number"

                    autoComplete="username"

                    autoFocus
                  />

                </div>

              </div>

            )}


            {/* =================================================
                FACULTY ID
            ================================================= */}

            {isAdmin && (

              <div className="login-field">

                <label
                  htmlFor="facultyId"
                >
                  Faculty ID
                </label>


                <div className="login-input-wrapper">

                  <User
                    size={19}
                  />


                  <input
                    id="facultyId"

                    type="text"

                    value={
                      facultyId
                    }

                    onChange={(e) =>
                      setFacultyId(
                        e.target.value
                      )
                    }

                    placeholder="Enter Faculty ID"

                    autoComplete="username"

                    autoFocus
                  />

                </div>

              </div>

            )}


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="login-field">

              <label
                htmlFor="password"
              >
                Password
              </label>


              <div className="login-input-wrapper">

                <Lock
                  size={19}
                />


                <input
                  id="password"

                  type="password"

                  value={
                    password
                  }

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  placeholder="Enter your password"

                  autoComplete="current-password"
                />

              </div>

            </div>


            {/* =================================================
                FORGOT PASSWORD
            ================================================= */}

            <div className="login-options">

              <button
                type="button"

                onClick={
                  handleForgotPassword
                }

                className="forgot-password"
              >
                Forgot password?
              </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="login-error">

                {error}

              </div>

            )}


            {/* =================================================
                SIGN IN
            ================================================= */}

            <button
              type="submit"

              className="login-button"

              disabled={loading}
            >

              {loading ? (

                "Signing in..."

              ) : (

                <>

                  Sign In

                  <ArrowRight
                    size={19}
                  />

                </>

              )}

            </button>


          </form>


          {/* =================================================
              SECURITY MESSAGE
          ================================================= */}

          <div className="login-demo-note">

            <strong>
              CampX Secure Login
            </strong>

            <span>

              {isStudent
                ? "Student credentials are securely verified through the CampX backend."
                : "Admin credentials are securely verified through the CampX backend. Your role determines your access level."}

            </span>

          </div>


        </div>

      </section>

    </div>
  );
}