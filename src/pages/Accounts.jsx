import React, { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  IndianRupee,
  CalendarDays,
  GraduationCap,
  FileText,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Accounts() {
  const [activeSection, setActiveSection] = useState("fee-structures");

  const [feeStructures, setFeeStructures] = useState([]);

  // Student-wise fee records
  const [studentFees, setStudentFees] = useState([]);

  // Real students loaded from MySQL
  const [students, setStudents] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [apiError, setApiError] = useState("");

  const [studentFeeSearch, setStudentFeeSearch] = useState("");
  const [showStudentFeeForm, setShowStudentFeeForm] = useState(false);
  const [editingStudentFeeId, setEditingStudentFeeId] = useState(null);

  const [studentFeeForm, setStudentFeeForm] = useState({
    student_id: "",
    fee_structure_id: "",
    academic_year: "",
    semester: "",
    total_amount: "",
    scholarship_amount: "0",
    discount_amount: "0",
    paid_amount: "0",
    due_date: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    batch_year: "",
    branch: "",
    semester: "",
    tuition_fee: "",
    exam_fee: "",
    hostel_fee: "",
    library_fee: "",
    development_fee: "",
    other_fee: "",
    due_date: "",
  });

  // =====================================================
  // LOAD ACCOUNTS DATA FROM MYSQL
  // =====================================================

  const loadAccountsData = async () => {
    try {
      setLoadingData(true);
      setApiError("");

      const token = localStorage.getItem("campx_token");

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [structuresResponse, studentsResponse, feesResponse] =
        await Promise.all([
          fetch(`${API_URL}/accounts/fee-structures`, { headers }),
          fetch(`${API_URL}/accounts/students`, { headers }),
          fetch(`${API_URL}/accounts/student-fees`, { headers }),
        ]);

      const structuresData = await structuresResponse.json();
      const studentsData = await studentsResponse.json();
      const feesData = await feesResponse.json();

      if (!structuresResponse.ok) {
        throw new Error(
          structuresData.message ||
            "Unable to load fee structures."
        );
      }

      if (!studentsResponse.ok) {
        throw new Error(
          studentsData.message ||
            "Unable to load students."
        );
      }

      if (!feesResponse.ok) {
        throw new Error(
          feesData.message ||
            "Unable to load student fees."
        );
      }

      setFeeStructures(
        Array.isArray(structuresData.feeStructures)
          ? structuresData.feeStructures
          : []
      );

      setStudents(
        Array.isArray(studentsData.students)
          ? studentsData.students
          : []
      );

      setStudentFees(
        Array.isArray(feesData.studentFees)
          ? feesData.studentFees
          : []
      );
    } catch (error) {
      console.error("Accounts data loading error:", error);
      setApiError(
        error.message ||
          "Unable to load Accounts data."
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAccountsData();
  }, []);

  const calculateTotal = (data = formData) => {
    const values = [
      data.tuition_fee,
      data.exam_fee,
      data.hostel_fee,
      data.library_fee,
      data.development_fee,
      data.other_fee,
    ];

    return values.reduce((total, value) => {
      const amount = Number(value);

      if (!Number.isFinite(amount)) {
        return total;
      }

      return total + amount;
    }, 0);
  };

  const filteredStructures = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return feeStructures;
    }

    return feeStructures.filter((item) => {
      return (
        String(item.batch_year)
          .toLowerCase()
          .includes(search) ||
        String(item.branch)
          .toLowerCase()
          .includes(search) ||
        String(item.semester)
          .toLowerCase()
          .includes(search)
      );
    });
  }, [feeStructures, searchTerm]);

  const selectedFeeStructure = useMemo(() => {
    return feeStructures.find(
      (item) => String(item.id) === String(studentFeeForm.fee_structure_id)
    );
  }, [feeStructures, studentFeeForm.fee_structure_id]);

  const studentFeeTotal = Math.max(
    0,
    Number(
      studentFeeForm.total_amount ||
        selectedFeeStructure?.total_fee ||
        0
    )
  );

  const studentFeeScholarship = Math.max(
    0,
    Number(studentFeeForm.scholarship_amount || 0)
  );

  const studentFeeDiscount = Math.max(
    0,
    Number(studentFeeForm.discount_amount || 0)
  );

  const studentFeePaid = Math.max(
    0,
    Number(studentFeeForm.paid_amount || 0)
  );

  const studentFeeDue = Math.max(
    0,
    studentFeeTotal -
      studentFeeScholarship -
      studentFeeDiscount -
      studentFeePaid
  );

  const getStudentFeeStatus = (
    total,
    scholarship,
    discount,
    paid
  ) => {
    const due = Math.max(
      0,
      Number(total || 0) -
        Number(scholarship || 0) -
        Number(discount || 0) -
        Number(paid || 0)
    );

    if (due <= 0) {
      return "PAID";
    }

    if (Number(paid || 0) > 0) {
      return "PARTIAL";
    }

    return "PENDING";
  };

  const filteredStudentFees = useMemo(() => {
    const search = studentFeeSearch.trim().toLowerCase();

    if (!search) {
      return studentFees;
    }

    return studentFees.filter((item) => {
      return (
        String(item.student_id).toLowerCase().includes(search) ||
        String(item.student_name).toLowerCase().includes(search) ||
        String(item.branch).toLowerCase().includes(search) ||
        String(item.semester).toLowerCase().includes(search) ||
        String(item.status).toLowerCase().includes(search)
      );
    });
  }, [studentFees, studentFeeSearch]);

  const resetStudentFeeForm = () => {
    setStudentFeeForm({
      student_id: "",
      fee_structure_id: "",
      academic_year: "",
      semester: "",
      total_amount: "",
      scholarship_amount: "0",
      discount_amount: "0",
      paid_amount: "0",
      due_date: "",
    });

    setEditingStudentFeeId(null);
    setShowStudentFeeForm(false);
  };

  const handleStudentFeeInputChange = (event) => {
    const { name, value } = event.target;

    setStudentFeeForm((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (name === "fee_structure_id") {
        const structure = feeStructures.find(
          (item) => String(item.id) === String(value)
        );

        if (structure) {
          updated.total_amount = String(
            structure.total_fee || 0
          );
          updated.semester = structure.semester || "";
          updated.due_date = structure.due_date || "";
        }
      }

      if (name === "student_id") {
        const student = students.find(
          (item) => String(item.student_id) === String(value)
        );

        if (student) {
          updated.semester = student.semester || updated.semester;
        }
      }

      return updated;
    });
  };

  const handleStudentFeeSubmit = async (event) => {
    event.preventDefault();

    if (!studentFeeForm.student_id) {
      alert("Please select a student.");
      return;
    }

    if (!studentFeeForm.fee_structure_id) {
      alert("Please select a fee structure.");
      return;
    }

    const total = Math.max(
      0,
      Number(studentFeeForm.total_amount || selectedFeeStructure?.total_fee || 0)
    );
    const scholarship = Math.max(0, Number(studentFeeForm.scholarship_amount || 0));
    const discount = Math.max(0, Number(studentFeeForm.discount_amount || 0));
    const paid = Math.max(0, Number(studentFeeForm.paid_amount || 0));

    if (total <= 0) {
      alert("Fee amount must be greater than zero.");
      return;
    }

    if (scholarship + discount > total) {
      alert("Scholarship and discount cannot be greater than the total fee.");
      return;
    }

    if (paid > total - scholarship - discount) {
      alert("Paid amount cannot be greater than the remaining fee.");
      return;
    }

    if (!studentFeeForm.academic_year.trim()) {
      alert("Please enter the academic year.");
      return;
    }

    if (!studentFeeForm.semester.trim()) {
      alert("Please enter the semester.");
      return;
    }

    if (!studentFeeForm.due_date) {
      alert("Please select the due date.");
      return;
    }

    try {
      const token = localStorage.getItem("campx_token");

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const endpoint = editingStudentFeeId
        ? `${API_URL}/accounts/student-fees/${editingStudentFeeId}`
        : `${API_URL}/accounts/student-fees`;

      const response = await fetch(endpoint, {
        method: editingStudentFeeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: studentFeeForm.student_id,
          fee_structure_id: studentFeeForm.fee_structure_id,
          academic_year: studentFeeForm.academic_year.trim(),
          semester: studentFeeForm.semester.trim(),
          scholarship_amount: scholarship,
          discount_amount: discount,
          paid_amount: paid,
          due_date: studentFeeForm.due_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save student fee record."
        );
      }

      alert(data.message || "Student fee saved successfully.");
      resetStudentFeeForm();
      await loadAccountsData();
    } catch (error) {
      console.error("Save student fee error:", error);
      alert(error.message || "Unable to save student fee record.");
    }
  };

  const handleEditStudentFee = (item) => {
    setEditingStudentFeeId(item.id);

    setStudentFeeForm({
      student_id: item.student_id || "",
      fee_structure_id: item.fee_structure_id || "",
      academic_year: item.academic_year || "",
      semester: item.semester || "",
      total_amount: item.total_amount || "",
      scholarship_amount: item.scholarship_amount || "0",
      discount_amount: item.discount_amount || "0",
      paid_amount: item.paid_amount || "0",
      due_date: item.due_date
        ? String(item.due_date).slice(0, 10)
        : "",
    });

    setShowStudentFeeForm(true);
  };

  const handleDeleteStudentFee = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student fee record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("campx_token");

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/accounts/student-fees/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete student fee record."
        );
      }

      alert(data.message || "Student fee deleted successfully.");
      await loadAccountsData();
    } catch (error) {
      console.error("Delete student fee error:", error);
      alert(error.message || "Unable to delete student fee record.");
    }
  };

  const handleOpenStudentFeeForm = () => {
    setEditingStudentFeeId(null);
    setStudentFeeForm({
      student_id: "",
      fee_structure_id: "",
      academic_year: "",
      semester: "",
      total_amount: "",
      scholarship_amount: "0",
      discount_amount: "0",
      paid_amount: "0",
      due_date: "",
    });
    setShowStudentFeeForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      batch_year: "",
      branch: "",
      semester: "",
      tuition_fee: "",
      exam_fee: "",
      hostel_fee: "",
      library_fee: "",
      development_fee: "",
      other_fee: "",
      due_date: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.batch_year) {
      alert("Please select a batch year.");
      return;
    }

    if (!formData.branch.trim()) {
      alert("Please enter the branch.");
      return;
    }

    if (!formData.semester) {
      alert("Please select the semester.");
      return;
    }

    if (!formData.due_date) {
      alert("Please select the due date.");
      return;
    }

    const totalFee = calculateTotal(formData);

    if (totalFee <= 0) {
      alert("Please enter at least one fee amount.");
      return;
    }

    try {
      const token = localStorage.getItem("campx_token");

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const endpoint = editingId
        ? `${API_URL}/accounts/fee-structures/${editingId}`
        : `${API_URL}/accounts/fee-structures`;

      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          batch_year: Number(formData.batch_year),
          branch: formData.branch.trim().toUpperCase(),
          semester: formData.semester,
          tuition_fee: Number(formData.tuition_fee) || 0,
          exam_fee: Number(formData.exam_fee) || 0,
          hostel_fee: Number(formData.hostel_fee) || 0,
          library_fee: Number(formData.library_fee) || 0,
          development_fee: Number(formData.development_fee) || 0,
          other_fee: Number(formData.other_fee) || 0,
          due_date: formData.due_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save fee structure."
        );
      }

      alert(data.message || "Fee structure saved successfully.");
      resetForm();
      await loadAccountsData();
    } catch (error) {
      console.error("Save fee structure error:", error);
      alert(error.message || "Unable to save fee structure.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      batch_year: item.batch_year || "",
      branch: item.branch || "",
      semester: item.semester || "",
      tuition_fee: item.tuition_fee || "",
      exam_fee: item.exam_fee || "",
      hostel_fee: item.hostel_fee || "",
      library_fee: item.library_fee || "",
      development_fee: item.development_fee || "",
      other_fee: item.other_fee || "",
      due_date: item.due_date
        ? String(item.due_date).slice(0, 10)
        : "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fee structure?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("campx_token");

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/accounts/fee-structures/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete fee structure."
        );
      }

      alert(data.message || "Fee structure deleted successfully.");
      await loadAccountsData();
    } catch (error) {
      console.error("Delete fee structure error:", error);
      alert(error.message || "Unable to delete fee structure.");
    }
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const totalFeeStructures = feeStructures.length;

  const totalConfiguredAmount = feeStructures.reduce(
    (total, item) => total + Number(item.total_fee || 0),
    0
  );

  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">
        <Topbar />

        <div
          style={{
            padding: "24px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                Accounts Management
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#6b7280",
                }}
              >
                Manage student fees, payments, receipts and financial records.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (activeSection === "student-fees") {
                  handleOpenStudentFeeForm();
                  return;
                }

                setEditingId(null);
                setFormData({
                  batch_year: "",
                  branch: "",
                  semester: "",
                  tuition_fee: "",
                  exam_fee: "",
                  hostel_fee: "",
                  library_fee: "",
                  development_fee: "",
                  other_fee: "",
                  due_date: "",
                });
                setShowForm(true);
              }}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "11px 18px",
                background: "#2563eb",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 600,
              }}
            >
              <Plus size={18} />
              {activeSection === "student-fees"
                ? "Assign Student Fee"
                : "Add Fee Structure"}
            </button>
          </div>

          {apiError && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "9px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
              }}
            >
              {apiError}
            </div>
          )}

          {loadingData && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "9px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#1d4ed8",
              }}
            >
              Loading Accounts data...
            </div>
          )}

          {/* SUMMARY CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={summaryCardStyle}>
              <div style={summaryIconStyle}>
                <FileText size={21} />
              </div>

              <div>
                <div style={summaryTitleStyle}>
                  Fee Structures
                </div>

                <div style={summaryValueStyle}>
                  {totalFeeStructures}
                </div>

                <div style={summarySubStyle}>
                  Configured structures
                </div>
              </div>
            </div>

            <div style={summaryCardStyle}>
              <div
                style={{
                  ...summaryIconStyle,
                  background: "#ecfdf5",
                  color: "#059669",
                }}
              >
                <IndianRupee size={21} />
              </div>

              <div>
                <div style={summaryTitleStyle}>
                  Configured Amount
                </div>

                <div style={summaryValueStyle}>
                  {formatCurrency(totalConfiguredAmount)}
                </div>

                <div style={summarySubStyle}>
                  Total across structures
                </div>
              </div>
            </div>

            <div style={summaryCardStyle}>
              <div
                style={{
                  ...summaryIconStyle,
                  background: "#fff7ed",
                  color: "#ea580c",
                }}
              >
                <GraduationCap size={21} />
              </div>

              <div>
                <div style={summaryTitleStyle}>
                  Academic Batches
                </div>

                <div style={summaryValueStyle}>
                  {new Set(
                    feeStructures.map((item) => item.batch_year)
                  ).size}
                </div>

                <div style={summarySubStyle}>
                  Batches configured
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT MODULES */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {[
              ["fee-structures", "Fee Structures"],
              ["student-fees", "Student Fees"],
              ["payments", "Payments"],
              ["receipts", "Receipts"],
              ["scholarships", "Scholarships"],
              ["reports", "Reports"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveSection(value)}
                style={{
                  border:
                    activeSection === value
                      ? "1px solid #2563eb"
                      : "1px solid #e5e7eb",
                  background:
                    activeSection === value
                      ? "#eff6ff"
                      : "#ffffff",
                  color:
                    activeSection === value
                      ? "#2563eb"
                      : "#374151",
                  borderRadius: "8px",
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontWeight:
                    activeSection === value ? 600 : 500,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* FEE STRUCTURES */}
          {activeSection === "fee-structures" && (
            <section style={panelStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "15px",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                    }}
                  >
                    Fee Structures
                  </h2>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Configure semester-wise fees for each batch and branch.
                  </p>
                </div>

                <div
                  style={{
                    position: "relative",
                    width: "280px",
                    maxWidth: "100%",
                  }}
                >
                  <Search
                    size={17}
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "11px",
                      color: "#9ca3af",
                    }}
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search batch, branch..."
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px 12px 10px 36px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* FORM */}
              {showForm && (
                <div
                  style={{
                    border: "1px solid #dbeafe",
                    background: "#f8fbff",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "18px",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>
                      {editingId
                        ? "Edit Fee Structure"
                        : "Add Fee Structure"}
                    </h3>

                    <button
                      type="button"
                      onClick={resetForm}
                      style={closeButtonStyle}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div style={formGridStyle}>
                      <div>
                        <label style={labelStyle}>
                          Batch Year *
                        </label>

                        <select
                          name="batch_year"
                          value={formData.batch_year}
                          onChange={handleInputChange}
                          style={inputStyle}
                        >
                          <option value="">
                            Select Batch
                          </option>

                          {[
                            2020,
                            2021,
                            2022,
                            2023,
                            2024,
                            2025,
                            2026,
                            2027,
                            2028,
                          ].map((year) => (
                            <option
                              key={year}
                              value={year}
                            >
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Branch *
                        </label>

                        <input
                          type="text"
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          placeholder="Example: CSE"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Semester *
                        </label>

                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleInputChange}
                          style={inputStyle}
                        >
                          <option value="">
                            Select Semester
                          </option>

                          {[
                            "1st Semester",
                            "2nd Semester",
                            "3rd Semester",
                            "4th Semester",
                            "5th Semester",
                            "6th Semester",
                            "7th Semester",
                            "8th Semester",
                          ].map((semester) => (
                            <option
                              key={semester}
                              value={semester}
                            >
                              {semester}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Due Date
                        </label>

                        <input
                          type="date"
                          name="due_date"
                          value={formData.due_date}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <h4
                      style={{
                        margin: "24px 0 14px",
                      }}
                    >
                      Fee Components
                    </h4>

                    <div style={formGridStyle}>
                      <FeeInput
                        label="Tuition Fee"
                        name="tuition_fee"
                        value={formData.tuition_fee}
                        onChange={handleInputChange}
                      />

                      <FeeInput
                        label="Exam Fee"
                        name="exam_fee"
                        value={formData.exam_fee}
                        onChange={handleInputChange}
                      />

                      <FeeInput
                        label="Hostel Fee"
                        name="hostel_fee"
                        value={formData.hostel_fee}
                        onChange={handleInputChange}
                      />

                      <FeeInput
                        label="Library Fee"
                        name="library_fee"
                        value={formData.library_fee}
                        onChange={handleInputChange}
                      />

                      <FeeInput
                        label="Development Fee"
                        name="development_fee"
                        value={formData.development_fee}
                        onChange={handleInputChange}
                      />

                      <FeeInput
                        label="Other Fee"
                        name="other_fee"
                        value={formData.other_fee}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: "20px",
                        padding: "15px",
                        borderRadius: "10px",
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong>Total Fee</strong>

                      <strong
                        style={{
                          fontSize: "22px",
                          color: "#2563eb",
                        }}
                      >
                        {formatCurrency(
                          calculateTotal(formData)
                        )}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "18px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={resetForm}
                        style={secondaryButtonStyle}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        style={primaryButtonStyle}
                      >
                        <Save size={17} />
                        {editingId
                          ? "Update Structure"
                          : "Save Structure"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TABLE */}
              {filteredStructures.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "50px 20px",
                    color: "#6b7280",
                    border: "1px dashed #d1d5db",
                    borderRadius: "10px",
                  }}
                >
                  <CreditCard
                    size={42}
                    style={{
                      marginBottom: "10px",
                      opacity: 0.5,
                    }}
                  />

                  <h3
                    style={{
                      margin: "0 0 6px",
                      color: "#374151",
                    }}
                  >
                    No Fee Structures
                  </h3>

                  <p style={{ margin: 0 }}>
                    Add your first fee structure to get started.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    overflowX: "auto",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: "1000px",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        <TableHeader>Batch</TableHeader>
                        <TableHeader>Branch</TableHeader>
                        <TableHeader>Semester</TableHeader>
                        <TableHeader>Tuition</TableHeader>
                        <TableHeader>Exam</TableHeader>
                        <TableHeader>Hostel</TableHeader>
                        <TableHeader>Library</TableHeader>
                        <TableHeader>Development</TableHeader>
                        <TableHeader>Other</TableHeader>
                        <TableHeader>Total</TableHeader>
                        <TableHeader>Due Date</TableHeader>
                        <TableHeader>Actions</TableHeader>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStructures.map((item) => (
                        <tr key={item.id}>
                          <TableCell>
                            {item.batch_year}
                          </TableCell>

                          <TableCell>
                            {item.branch}
                          </TableCell>

                          <TableCell>
                            {item.semester}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.tuition_fee
                            )}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.exam_fee
                            )}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.hostel_fee
                            )}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.library_fee
                            )}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.development_fee
                            )}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.other_fee
                            )}
                          </TableCell>

                          <TableCell>
                            <strong>
                              {formatCurrency(
                                item.total_fee
                              )}
                            </strong>
                          </TableCell>

                          <TableCell>
                            {item.due_date || "—"}
                          </TableCell>

                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(item)
                                }
                                style={iconButtonStyle}
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(item.id)
                                }
                                style={{
                                  ...iconButtonStyle,
                                  color: "#dc2626",
                                }}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* STUDENT-WISE FEES */}
          {activeSection === "student-fees" && (
            <section style={panelStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "15px",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "20px" }}>
                    Student-wise Fees
                  </h2>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Assign a fee structure to an individual student and track paid and due amounts.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "260px",
                      maxWidth: "100%",
                    }}
                  >
                    <Search
                      size={17}
                      style={{
                        position: "absolute",
                        left: "11px",
                        top: "11px",
                        color: "#9ca3af",
                      }}
                    />

                    <input
                      type="text"
                      value={studentFeeSearch}
                      onChange={(event) =>
                        setStudentFeeSearch(event.target.value)
                      }
                      placeholder="Search student..."
                      style={{
                        ...inputStyle,
                        paddingLeft: "36px",
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenStudentFeeForm}
                    style={primaryButtonStyle}
                  >
                    <Plus size={17} />
                    Assign Student Fee
                  </button>
                </div>
              </div>

              {showStudentFeeForm && (
                <div
                  style={{
                    border: "1px solid #dbeafe",
                    background: "#f8fbff",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "18px",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0 }}>
                        {editingStudentFeeId
                          ? "Edit Student Fee"
                          : "Assign Fee to Student"}
                      </h3>

                      <p
                        style={{
                          margin: "5px 0 0",
                          color: "#6b7280",
                          fontSize: "13px",
                        }}
                      >
                        Select the student and applicable fee structure.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetStudentFeeForm}
                      style={closeButtonStyle}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleStudentFeeSubmit}>
                    <div style={formGridStyle}>
                      <div>
                        <label style={labelStyle}>
                          Student *
                        </label>

                        <select
                          name="student_id"
                          value={studentFeeForm.student_id}
                          onChange={handleStudentFeeInputChange}
                          style={inputStyle}
                        >
                          <option value="">
                            Select Student
                          </option>

                          {students.map((student) => (
                            <option
                              key={student.student_id}
                              value={student.student_id}
                            >
                              {student.student_id} - {student.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Fee Structure *
                        </label>

                        <select
                          name="fee_structure_id"
                          value={studentFeeForm.fee_structure_id}
                          onChange={handleStudentFeeInputChange}
                          style={inputStyle}
                        >
                          <option value="">
                            Select Fee Structure
                          </option>

                          {feeStructures.map((structure) => (
                            <option
                              key={structure.id}
                              value={structure.id}
                            >
                              {structure.batch_year} -{" "}
                              {structure.branch} -{" "}
                              {structure.semester} -{" "}
                              {formatCurrency(structure.total_fee)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Academic Year
                        </label>

                        <input
                          type="text"
                          name="academic_year"
                          value={studentFeeForm.academic_year}
                          onChange={handleStudentFeeInputChange}
                          placeholder="Example: 2026-27"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Semester
                        </label>

                        <input
                          type="text"
                          name="semester"
                          value={studentFeeForm.semester}
                          onChange={handleStudentFeeInputChange}
                          placeholder="Example: 5th Semester"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Total Fee
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          name="total_amount"
                          value={studentFeeForm.total_amount}
                          onChange={handleStudentFeeInputChange}
                          placeholder="0"
                          readOnly
                          style={{
                            ...inputStyle,
                            background: "#f3f4f6",
                          }}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Scholarship
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          name="scholarship_amount"
                          value={studentFeeForm.scholarship_amount}
                          onChange={handleStudentFeeInputChange}
                          placeholder="0"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Discount
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          name="discount_amount"
                          value={studentFeeForm.discount_amount}
                          onChange={handleStudentFeeInputChange}
                          placeholder="0"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Paid Amount
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          name="paid_amount"
                          value={studentFeeForm.paid_amount}
                          onChange={handleStudentFeeInputChange}
                          placeholder="0"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          Due Date
                        </label>

                        <input
                          type="date"
                          name="due_date"
                          value={studentFeeForm.due_date}
                          onChange={handleStudentFeeInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px",
                        marginTop: "20px",
                      }}
                    >
                      <div
                        style={{
                          padding: "14px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={summarySubStyle}>
                          Net Fee
                        </div>

                        <strong style={{ fontSize: "20px" }}>
                          {formatCurrency(
                            Math.max(
                              0,
                              studentFeeTotal -
                                studentFeeScholarship -
                                studentFeeDiscount
                            )
                          )}
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: "14px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={summarySubStyle}>
                          Paid
                        </div>

                        <strong
                          style={{
                            fontSize: "20px",
                            color: "#059669",
                          }}
                        >
                          {formatCurrency(studentFeePaid)}
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: "14px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={summarySubStyle}>
                          Due
                        </div>

                        <strong
                          style={{
                            fontSize: "20px",
                            color:
                              studentFeeDue > 0
                                ? "#dc2626"
                                : "#059669",
                          }}
                        >
                          {formatCurrency(studentFeeDue)}
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: "14px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={summarySubStyle}>
                          Status
                        </div>

                        <strong
                          style={{
                            fontSize: "18px",
                            color:
                              getStudentFeeStatus(
                                studentFeeTotal,
                                studentFeeScholarship,
                                studentFeeDiscount,
                                studentFeePaid
                              ) === "PAID"
                                ? "#059669"
                                : "#d97706",
                          }}
                        >
                          {getStudentFeeStatus(
                            studentFeeTotal,
                            studentFeeScholarship,
                            studentFeeDiscount,
                            studentFeePaid
                          )}
                        </strong>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "18px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={resetStudentFeeForm}
                        style={secondaryButtonStyle}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        style={primaryButtonStyle}
                      >
                        <Save size={17} />
                        {editingStudentFeeId
                          ? "Update Student Fee"
                          : "Save Student Fee"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {feeStructures.length === 0 && (
                <div
                  style={{
                    padding: "14px",
                    marginBottom: "18px",
                    borderRadius: "9px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    color: "#9a3412",
                    fontSize: "14px",
                  }}
                >
                  Add at least one Fee Structure before assigning a student-wise fee.
                </div>
              )}

              {filteredStudentFees.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "50px 20px",
                    color: "#6b7280",
                    border: "1px dashed #d1d5db",
                    borderRadius: "10px",
                  }}
                >
                  <GraduationCap
                    size={42}
                    style={{
                      marginBottom: "10px",
                      opacity: 0.5,
                    }}
                  />

                  <h3
                    style={{
                      margin: "0 0 6px",
                      color: "#374151",
                    }}
                  >
                    No Student Fee Records
                  </h3>

                  <p style={{ margin: 0 }}>
                    Assign a fee structure to a student to create the first record.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    overflowX: "auto",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: "1200px",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        <TableHeader>Student ID</TableHeader>
                        <TableHeader>Student</TableHeader>
                        <TableHeader>Branch</TableHeader>
                        <TableHeader>Semester</TableHeader>
                        <TableHeader>Total</TableHeader>
                        <TableHeader>Scholarship</TableHeader>
                        <TableHeader>Discount</TableHeader>
                        <TableHeader>Paid</TableHeader>
                        <TableHeader>Due</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Due Date</TableHeader>
                        <TableHeader>Actions</TableHeader>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudentFees.map((item) => (
                        <tr key={item.id}>
                          <TableCell>
                            {item.student_id}
                          </TableCell>

                          <TableCell>
                            <strong>
                              {item.student_name}
                            </strong>
                          </TableCell>

                          <TableCell>
                            {item.branch}
                          </TableCell>

                          <TableCell>
                            {item.semester}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.total_amount
                            )}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.scholarship_amount
                            )}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.discount_amount
                            )}
                          </TableCell>

                          <TableCell>
                            {formatCurrency(
                              item.paid_amount
                            )}
                          </TableCell>

                          <TableCell>
                            <strong
                              style={{
                                color:
                                  Number(item.due_amount) > 0
                                    ? "#dc2626"
                                    : "#059669",
                              }}
                            >
                              {formatCurrency(
                                item.due_amount
                              )}
                            </strong>
                          </TableCell>

                          <TableCell>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: 600,
                                background:
                                  item.status === "PAID"
                                    ? "#ecfdf5"
                                    : item.status === "PARTIAL"
                                    ? "#fff7ed"
                                    : "#fef2f2",
                                color:
                                  item.status === "PAID"
                                    ? "#047857"
                                    : item.status === "PARTIAL"
                                    ? "#c2410c"
                                    : "#b91c1c",
                              }}
                            >
                              {item.status}
                            </span>
                          </TableCell>

                          <TableCell>
                            {item.due_date || "—"}
                          </TableCell>

                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditStudentFee(item)
                                }
                                style={iconButtonStyle}
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteStudentFee(item.id)
                                }
                                style={{
                                  ...iconButtonStyle,
                                  color: "#dc2626",
                                }}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* OTHER SECTIONS */}
          {activeSection !== "fee-structures" &&
            activeSection !== "student-fees" && (
            <section style={panelStyle}>
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                }}
              >
                <CreditCard
                  size={48}
                  style={{
                    color: "#2563eb",
                    marginBottom: "12px",
                  }}
                />

                <h2
                  style={{
                    margin: "0 0 8px",
                  }}
                >
                  {getSectionTitle(activeSection)}
                </h2>

                <p
                  style={{
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  This Accounts module will be connected next.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

/* =====================================================
   FEE INPUT
===================================================== */

function FeeInput({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <div
        style={{
          position: "relative",
        }}
      >
        <IndianRupee
          size={16}
          style={{
            position: "absolute",
            left: "11px",
            top: "12px",
            color: "#9ca3af",
          }}
        />

        <input
          type="number"
          min="0"
          step="0.01"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="0"
          style={{
            ...inputStyle,
            paddingLeft: "32px",
          }}
        />
      </div>
    </div>
  );
}

/* =====================================================
   TABLE COMPONENTS
===================================================== */

function TableHeader({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "13px 12px",
        fontSize: "13px",
        fontWeight: 600,
        color: "#374151",
        borderBottom: "1px solid #e5e7eb",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return (
    <td
      style={{
        padding: "13px 12px",
        fontSize: "13px",
        color: "#4b5563",
        borderBottom: "1px solid #f0f0f0",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </td>
  );
}

/* =====================================================
   SECTION TITLE
===================================================== */

function getSectionTitle(section) {
  const titles = {
    "student-fees": "Student Fees",
    payments: "Fee Payments",
    receipts: "Fee Receipts",
    scholarships: "Scholarships",
    reports: "Financial Reports",
  };

  return titles[section] || "Accounts";
}

/* =====================================================
   STYLES
===================================================== */

const summaryCardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "18px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const summaryIconStyle = {
  width: "44px",
  height: "44px",
  borderRadius: "10px",
  background: "#eff6ff",
  color: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const summaryTitleStyle = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "4px",
};

const summaryValueStyle = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#111827",
};

const summarySubStyle = {
  fontSize: "12px",
  color: "#9ca3af",
  marginTop: "3px",
};

const panelStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "22px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "16px",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#111827",
  fontSize: "14px",
  outline: "none",
};

const primaryButtonStyle = {
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  background: "#2563eb",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const secondaryButtonStyle = {
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "10px 16px",
  background: "#ffffff",
  color: "#374151",
  cursor: "pointer",
  fontWeight: 500,
};

const closeButtonStyle = {
  width: "34px",
  height: "34px",
  border: "1px solid #e5e7eb",
  borderRadius: "7px",
  background: "#ffffff",
  color: "#6b7280",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const iconButtonStyle = {
  width: "32px",
  height: "32px",
  border: "1px solid #e5e7eb",
  borderRadius: "7px",
  background: "#ffffff",
  color: "#2563eb",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};