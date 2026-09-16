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

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

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

          <Topbar title="Profile" />

          <div className="content">

            <div className="profile-empty">

              <div className="profile-empty-icon">
                <User size={28} />
              </div>

              <h2>
                Profile not available
              </h2>

              <p>
                Please login again to view
                your profile information.
              </p>

              <button
                className="profile-primary-btn"
                onClick={() =>
                  navigate("/login")
                }
              >
                Go to Login
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

  // =====================================================
  // USER INITIALS
  // =====================================================

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .toUpperCase() || "U";

  // =====================================================
  // USER VALUES
  // =====================================================

  const studentId =
    user.studentId ||
    user.student_id ||
    "—";

  const batchYear =
    user.batchYear ||
    user.batch_year ||
    "—";

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

        <Topbar title="Profile" />

        <div className="content">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="profile-header">

            <div>

              <div className="profile-eyebrow">
                CAMPX ACCOUNT
              </div>

              <h1>
                My Profile
              </h1>

              <p>
                View your CampX account
                information.
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
              Back
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
                    ? user.role ===
                      "SUPER_ADMIN"
                      ? "Super Administrator"
                      : "Administrator"
                    : "Student"}
                </p>

                <div className="profile-status">

                  <span className="status-dot"></span>

                  Active Account

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
                    Account Information
                  </h3>

                  <p>
                    Your CampX account details
                  </p>

                </div>

              </div>


              <div className="profile-grid">

                {/* FULL NAME */}

                <ProfileItem
                  icon={<User size={18} />}
                  label="Full Name"
                  value={user.name}
                />


                {/* EMAIL */}

                <ProfileItem
                  icon={<Mail size={18} />}
                  label="Email Address"
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
                      label="Faculty ID"
                      value={
                        user.facultyId ||
                        user.faculty_id ||
                        "—"
                      }
                    />

                    <ProfileItem
                      icon={
                        <Shield size={18} />
                      }
                      label="Role"
                      value={
                        user.role ===
                        "SUPER_ADMIN"
                          ? "Super Admin"
                          : "Admin"
                      }
                    />

                    <ProfileItem
                      icon={
                        <Building2
                          size={18}
                        />
                      }
                      label="Department"
                      value={
                        user.department ||
                        "—"
                      }
                    />

                    <ProfileItem
                      icon={
                        <BookOpen
                          size={18}
                        />
                      }
                      label="Admin Section"
                      value={
                        adminSection
                      }
                    />

                    <ProfileItem
                      icon={
                        <GraduationCap
                          size={18}
                        />
                      }
                      label="Designation"
                      value={
                        user.designation ||
                        "Administrator"
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
                      label="Registration Number"
                      value={studentId}
                    />

                    <ProfileItem
                      icon={
                        <GraduationCap
                          size={18}
                        />
                      }
                      label="Branch"
                      value={
                        user.branch ||
                        "—"
                      }
                    />

                    <ProfileItem
                      icon={
                        <BookOpen
                          size={18}
                        />
                      }
                      label="Semester"
                      value={
                        user.semester ||
                        "—"
                      }
                    />

                    <ProfileItem
                      icon={
                        <User size={18} />
                      }
                      label="Section"
                      value={
                        user.section ||
                        "—"
                      }
                    />

                    <ProfileItem
                      icon={
                        <CalendarDays
                          size={18}
                        />
                      }
                      label="Batch Year"
                      value={batchYear}
                    />

                    <ProfileItem
                      icon={
                        <Phone size={18} />
                      }
                      label="Phone Number"
                      value={
                        user.phone ||
                        "—"
                      }
                    />

                    <ProfileItem
                      icon={
                        <Home size={18} />
                      }
                      label="Hostel Status"
                      value={
                        hostelStatus ===
                        "HOSTELLER"
                          ? "Hosteller"
                          : "Non-Hosteller"
                      }
                    />

                    {/* HOSTEL DETAILS */}

                    {hostelStatus ===
                      "HOSTELLER" && (
                      <>

                        <ProfileItem
                          icon={
                            <Home size={18} />
                          }
                          label="Hostel"
                          value={
                            user.hostel ||
                            "—"
                          }
                        />

                        <ProfileItem
                          icon={
                            <DoorOpen
                              size={18}
                            />
                          }
                          label="Room Number"
                          value={
                            user.room ||
                            "—"
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
                    ? user.role ===
                      "SUPER_ADMIN"
                      ? "Super Admin Access"
                      : "Admin Access"
                    : "Student Access"}

                </h4>

                <p>

                  {isAdmin
                    ? user.role ===
                      "SUPER_ADMIN"
                      ? "You have full administrative access to the CampX system."
                      : `You have administrative access for the ${adminSection} section.`
                    : "You have access to your CampX student portal and student services."}

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