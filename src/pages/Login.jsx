import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, ShieldCheck, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const loginId =
      role === "student"
        ? registrationNumber.trim()
        : facultyId.trim();

    if (!loginId || !password) {
      setError("Please enter your ID and password.");
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        role === "student"
          ? `${API_URL}/auth/student/login`
          : `${API_URL}/auth/admin/login`;

      const body =
        role === "student"
          ? {
              registrationNumber: loginId,
              password,
            }
          : {
              facultyId: loginId,
              password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid login credentials."
        );
      }

      localStorage.setItem("campx_token", data.token);

      localStorage.setItem(
        "campx_user",
        JSON.stringify(data.user)
      );

      if (role === "student") {
        navigate("/student");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Unable to connect to CampX server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert(
      "Please contact the CampX administration to reset your password."
    );
  };

  return (
    <div className="login-page">

      {/* ==================================================
          LEFT BRANDING PANEL
      ================================================== */}

      <section className="login-left">

        <div className="login-brand">

          <div className="login-brand-icon">
            <ShieldCheck size={29} />
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
            <span>simplified.</span>
          </h2>

          <p className="login-main-description">
            Manage complaints, attendance, hostel, mess,
            documents, gate passes and more — all from one
            intelligent platform.
          </p>

          <div className="login-stats">

            <div className="login-stat">
              <strong>360°</strong>
              <span>Campus Management</span>
            </div>

            <div className="login-stat">
              <strong>AI</strong>
              <span>Smart Assistance</span>
            </div>

            <div className="login-stat">
              <strong>24/7</strong>
              <span>Campus Access</span>
            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          RIGHT LOGIN PANEL
      ================================================== */}

      <section className="login-right">

        <div className="login-card">

          {/* LOGO — mobile only */}
          <div className="login-mobile-brand">

            <div className="login-logo-icon">
              <ShieldCheck size={28} />
            </div>

            <div>
              <h1>CampX</h1>
              <p>One Campus. One Platform.</p>
            </div>

          </div>


          {/* HEADING */}

          <div className="login-heading">

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to CampX
            </p>

          </div>


          {/* ROLE SELECTOR */}

          <div className="role-selector">

            <button
              type="button"
              className={
                role === "student"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setRole("student");
                setError("");
                setPassword("");
              }}
            >
              <User size={18} />
              <span>Student</span>
            </button>

            <button
              type="button"
              className={
                role === "admin"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setRole("admin");
                setError("");
                setPassword("");
              }}
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </button>

          </div>


          {/* LOGIN FORM */}

          <form onSubmit={handleLogin}>

            {/* STUDENT */}

            {role === "student" && (
              <div className="login-field">

                <label htmlFor="registrationNumber">
                  Registration Number
                </label>

                <div className="login-input-wrapper">

                  <User size={19} />

                  <input
                    id="registrationNumber"
                    type="text"
                    value={registrationNumber}
                    onChange={(e) =>
                      setRegistrationNumber(
                        e.target.value
                      )
                    }
                    placeholder="Enter registration number"
                    autoComplete="username"
                  />

                </div>

              </div>
            )}


            {/* ADMIN */}

            {role === "admin" && (
              <div className="login-field">

                <label htmlFor="facultyId">
                  Faculty ID
                </label>

                <div className="login-input-wrapper">

                  <User size={19} />

                  <input
                    id="facultyId"
                    type="text"
                    value={facultyId}
                    onChange={(e) =>
                      setFacultyId(
                        e.target.value
                      )
                    }
                    placeholder="Enter faculty ID"
                    autoComplete="username"
                  />

                </div>

              </div>
            )}


            {/* PASSWORD */}

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-input-wrapper">

                <Lock size={19} />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

              </div>

            </div>


            {/* FORGOT PASSWORD */}

            <div className="login-options">

              <button
                type="button"
                onClick={handleForgotPassword}
                className="forgot-password"
              >
                Forgot password?
              </button>

            </div>


            {/* ERROR */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            {/* SIGN IN */}

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
                  <ArrowRight size={19} />
                </>
              )}
            </button>

          </form>


          {/* SECURITY MESSAGE */}

          <div className="login-demo-note">

            <strong>
              CampX Secure Login
            </strong>

            <span>
              Your credentials are verified securely
              through the CampX backend.
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}