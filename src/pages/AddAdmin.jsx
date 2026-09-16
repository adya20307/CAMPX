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

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

function AddAdmin() {
  const navigate = useNavigate();

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  const storedUser =
    localStorage.getItem("campx_user");

  let currentUser = {};

  try {
    currentUser = storedUser
      ? JSON.parse(storedUser)
      : {};
  } catch (error) {
    console.error(
      "Invalid CAMPX user data:",
      error
    );
  }

  const isSuperAdmin =
    currentUser?.role === "SUPER_ADMIN";


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
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

  const [departments, setDepartments] =
    useState([]);

  const [departmentsLoading, setDepartmentsLoading] =
    useState(true);


  // =====================================================
  // UI STATES
  // =====================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  useEffect(() => {

    const loadDepartments = async () => {

      try {

        setDepartmentsLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "campx_token"
          );

        if (!token) {
          throw new Error(
            "Authentication token not found."
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
              "Unable to load departments."
          );

        }

        setDepartments(
          data.departments || []
        );

      } catch (err) {

        console.error(
          "Load Departments Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load departments."
        );

      } finally {

        setDepartmentsLoading(false);

      }

    };


    if (isSuperAdmin) {
      loadDepartments();
    } else {
      setDepartmentsLoading(false);
    }

  }, [isSuperAdmin]);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    setError("");
    setMessage("");

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");


    // ===================================================
    // SUPER ADMIN CHECK
    // ===================================================

    if (!isSuperAdmin) {

      setError(
        "Only the Super Admin can create a new Admin."
      );

      return;

    }


    // ===================================================
    // REQUIRED FIELD VALIDATION
    // ===================================================

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
        "Please fill in all required fields."
      );

      return;

    }


    // ===================================================
    // EMAIL VALIDATION
    // ===================================================

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        formData.email.trim()
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return;

    }


    // ===================================================
    // PASSWORD MATCH
    // ===================================================

    if (
      formData.password !==
      formData.confirm_password
    ) {

      setError(
        "Password and Confirm Password do not match."
      );

      return;

    }


    // ===================================================
    // PASSWORD LENGTH
    // ===================================================

    if (
      formData.password.length < 6
    ) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;

    }


    // ===================================================
    // DEPARTMENT VALIDATION
    // ===================================================

    const selectedDepartment =
      departments.find(
        (department) =>
          department.id ===
          formData.department
      );


    if (!selectedDepartment) {

      setError(
        "Please select a valid department."
      );

      return;

    }


    try {

      setLoading(true);


      // =================================================
      // GET TOKEN
      // =================================================

      const token =
        localStorage.getItem(
          "campx_token"
        );


      if (!token) {

        throw new Error(
          "Authentication token not found. Please login again."
        );

      }


      // =================================================
      // CREATE ADMIN
      // =================================================

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

            body: JSON.stringify({

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


      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {

        throw new Error(
          data.message ||
            "Failed to create Admin."
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        `Admin created successfully for ${selectedDepartment.name}.`
      );


      // =================================================
      // RESET FORM
      // =================================================

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
      setShowConfirmPassword(false);


    } catch (err) {

      console.error(
        "Add Admin Error:",
        err
      );

      setError(
        err.message ||
          "Unable to create Admin."
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
            title="Access Denied"
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
                  Access Denied
                </h2>

                <p>
                  Only the Super Admin can
                  register new Admins.
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

                  Back to Dashboard

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
          title="Add Admin"
        />

        <div className="dashboard-content">


          {/* =================================================
              HEADER
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
                Register New Admin
              </h1>

              <p>
                Create a departmental Admin account.
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

              Back

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
                  Admin Account
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0",
                  }}
                >
                  Enter the new administrator's details.
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
                Basic Information
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
                    Full Name *
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
                    placeholder="Enter full name"
                    required
                  />

                </div>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <div>

                  <label>
                    Email *
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
                    placeholder="admin@campx.edu"
                    required
                  />

                </div>


                {/* =================================================
                    DEPARTMENT
                ================================================= */}

                <div>

                  <label>
                    Department *
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
                          ? "Loading departments..."
                          : "Select Department"}
                      </option>

                      {departments.map(
                        (department) => (

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
                    The Admin will only have access to this department.
                  </small>

                </div>


                {/* =================================================
                    DESIGNATION
                ================================================= */}

                <div>

                  <label>
                    Designation *
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
                    placeholder="Faculty / HOD"
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
                    Department Access
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

                    This Admin will be assigned to{" "}

                    <strong>
                      {
                        departments.find(
                          (d) =>
                            d.id ===
                            formData.department
                        )?.name
                      }
                    </strong>

                    {" "}and will receive
                    department-specific notifications
                    and sidebar options.

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
                Login Credentials
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
                    Faculty ID *
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
                    placeholder="FAC002"
                    required
                  />

                  <small>
                    This will be the Admin login ID.
                  </small>

                </div>


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div>

                  <label>
                    Password *
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

                      placeholder="Enter password"

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
                          !showPassword
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
                    Confirm Password *
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

                      placeholder="Confirm password"

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
                          !showConfirmPassword
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
                  Cancel
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

                    "Creating..."

                  ) : (

                    <>
                      <Save
                        size={17}
                      />

                      Create Admin
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


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default AddAdmin;