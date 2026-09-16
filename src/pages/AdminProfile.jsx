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

export default function AdminProfile() {

  const navigate = useNavigate();

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
              ? "Super Admin Profile"
              : "Admin Profile"
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
                    ? "Super Administrator"
                    : "Administrator"}

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
                      "—"}
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
                    {user?.email || "—"}
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
                    {user?.department || "—"}
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
                    {user?.designation || "—"}
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
                      ? "SUPER ADMIN"
                      : "ADMIN"}
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
                        ? "Administration"
                        : "Not Assigned")}
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