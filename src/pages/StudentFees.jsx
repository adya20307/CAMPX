import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  GraduationCap,
  IndianRupee,
  Receipt,
  RefreshCw,
  WalletCards,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

function formatAmount(value) {
  const amount = Number(value || 0);

  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  const normalized = String(
    status || ""
  )
    .trim()
    .toUpperCase();

  if (normalized === "PAID") {
    return "paid";
  }

  if (
    normalized === "PARTIAL" ||
    normalized === "OVERDUE"
  ) {
    return "warning";
  }

  return "pending";
}

function getStatusIcon(status) {
  const normalized = String(
    status || ""
  )
    .trim()
    .toUpperCase();

  if (normalized === "PAID") {
    return <CheckCircle2 size={15} />;
  }

  if (
    normalized === "PARTIAL" ||
    normalized === "OVERDUE"
  ) {
    return <AlertCircle size={15} />;
  }

  return <Clock3 size={15} />;
}

export default function StudentFees() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [data, setData] = useState({
    student: null,
    totals: {
      total: 0,
      scholarship: 0,
      discount: 0,
      paid: 0,
      due: 0,
    },
    studentFees: [],
    payments: [],
    scholarships: [],
    receipts: [],
  });

  const loadFees = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        localStorage.getItem(
          "campx_token"
        );

      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      const response = await fetch(
        `${API_URL}/accounts/student/my-fees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load your fee information."
        );
      }

      setData({
        student:
          result.student || null,
        totals:
          result.totals || {
            total: 0,
            scholarship: 0,
            discount: 0,
            paid: 0,
            due: 0,
          },
        studentFees:
          Array.isArray(
            result.studentFees
          )
            ? result.studentFees
            : [],
        payments:
          Array.isArray(
            result.payments
          )
            ? result.payments
            : [],
        scholarships:
          Array.isArray(
            result.scholarships
          )
            ? result.scholarships
            : [],
        receipts:
          Array.isArray(
            result.receipts
          )
            ? result.receipts
            : [],
      });
    } catch (err) {
      console.error(
        "Student fees error:",
        err
      );

      setError(
        err.message ||
          "Unable to load your fee information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const latestFee = useMemo(
    () =>
      data.studentFees.length > 0
        ? data.studentFees[0]
        : null,
    [data.studentFees]
  );

  const overallStatus =
    latestFee?.status ||
    (data.totals.due <= 0
      ? "PAID"
      : data.totals.paid > 0
      ? "PARTIAL"
      : "PENDING");

  const downloadReceipt = async (
    receipt
  ) => {
    if (!receipt?.receipt_file) {
      alert(
        "This receipt does not have a downloadable file yet."
      );
      return;
    }

    const token =
      localStorage.getItem(
        "campx_token"
      );

    if (!token) {
      navigate("/login", {
        replace: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/accounts/student/receipt/${receipt.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let result = {};

        try {
          result =
            await response.json();
        } catch {
          result = {};
        }

        throw new Error(
          result.message ||
            "Unable to download receipt."
        );
      }

      const blob =
        await response.blob();

      const blobUrl =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = blobUrl;
      link.download =
        receipt.receipt_number
          ? `${receipt.receipt_number}.pdf`
          : "fee-receipt.pdf";

      document.body.appendChild(
        link
      );

      link.click();
      link.remove();

      window.URL.revokeObjectURL(
        blobUrl
      );
    } catch (err) {
      console.error(
        "Receipt download error:",
        err
      );

      alert(
        err.message ||
          "Unable to download receipt."
      );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Topbar title="My Fees" />

        <div className="content">
          <section className="welcome-section">
            <div>
              <p className="eyebrow">
                CAMPX STUDENT PORTAL
              </p>

              <h1>
                My Fees
              </h1>

              <p>
                View your fee details,
                payments, scholarships and
                receipts.
              </p>
            </div>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                loadFees(true)
              }
              disabled={refreshing}
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "campx-spin"
                    : ""
                }
              />
              Refresh
            </button>
          </section>

          {data.student && (
            <section
              className="student-profile-card"
              style={{
                marginBottom: "24px",
              }}
            >
              <div className="student-avatar">
                {String(
                  data.student.name ||
                    "Student"
                )
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(
                    (part) =>
                      part[0]
                  )
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="student-profile-info">
                <h3>
                  {data.student.name}
                </h3>

                <p>
                  {data.student.student_id ||
                    "—"}{" "}
                  •{" "}
                  {data.student.branch ||
                    "—"}{" "}
                  •{" "}
                  {data.student.semester ||
                    "—"}
                </p>
              </div>

              <div className="student-profile-status">
                <span className="profile-status-dot" />
                Student Account
              </div>
            </section>
          )}

          {error && (
            <div
              className="panel"
              style={{
                marginBottom: "24px",
                border:
                  "1px solid #fecaca",
                background:
                  "#fff7f7",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "10px",
                  color: "#b91c1c",
                  fontWeight: 600,
                }}
              >
                <AlertCircle
                  size={20}
                />
                {error}
              </div>
            </div>
          )}

          {loading ? (
            <section className="panel">
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                Loading your fee
                information...
              </div>
            </section>
          ) : (
            <>
              <section
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <FeeSummaryCard
                  icon={
                    <IndianRupee
                      size={20}
                    />
                  }
                  title="Total Fees"
                  value={`₹${formatAmount(
                    data.totals.total
                  )}`}
                  subtitle="Total assigned fees"
                />

                <FeeSummaryCard
                  icon={
                    <CheckCircle2
                      size={20}
                    />
                  }
                  title="Paid Amount"
                  value={`₹${formatAmount(
                    data.totals.paid
                  )}`}
                  subtitle="Amount paid"
                />

                <FeeSummaryCard
                  icon={
                    <WalletCards
                      size={20}
                    />
                  }
                  title="Due Amount"
                  value={`₹${formatAmount(
                    data.totals.due
                  )}`}
                  subtitle="Amount remaining"
                />

                <FeeSummaryCard
                  icon={
                    <GraduationCap
                      size={20}
                    />
                  }
                  title="Scholarship"
                  value={`₹${formatAmount(
                    data.totals.scholarship
                  )}`}
                  subtitle="Scholarship amount"
                />

                <FeeSummaryCard
                  icon={
                    <CreditCard
                      size={20}
                    />
                  }
                  title="Discount"
                  value={`₹${formatAmount(
                    data.totals.discount
                  )}`}
                  subtitle="Fee discount"
                />

                <FeeSummaryCard
                  icon={
                    getStatusIcon(
                      overallStatus
                    )
                  }
                  title="Fee Status"
                  value={
                    <span
                      className={`fee-status ${getStatusClass(
                        overallStatus
                      )}`}
                    >
                      {overallStatus ||
                        "PENDING"}
                    </span>
                  }
                  subtitle="Current fee status"
                />
              </section>

              <section className="panel">
                <div
                  className="panel-header"
                  style={{
                    marginBottom:
                      "18px",
                  }}
                >
                  <div>
                    <h2>
                      Fee Details
                    </h2>
                    <p>
                      Fee records assigned
                      by the Accounts
                      department
                    </p>
                  </div>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() =>
                      navigate(
                        "/student"
                      )
                    }
                  >
                    <ArrowLeft
                      size={16}
                    />
                    Back
                  </button>
                </div>

                {data.studentFees
                  .length === 0 ? (
                  <EmptyState
                    icon={
                      <CreditCard
                        size={28}
                      />
                    }
                    title="No fee record yet"
                    message="The Accounts department has not assigned a fee record to your account yet."
                  />
                ) : (
                  <div
                    style={{
                      overflowX:
                        "auto",
                    }}
                  >
                    <table className="campx-table">
                      <thead>
                        <tr>
                          <th>
                            Academic Year
                          </th>
                          <th>
                            Semester
                          </th>
                          <th>
                            Total
                          </th>
                          <th>
                            Scholarship
                          </th>
                          <th>
                            Discount
                          </th>
                          <th>
                            Paid
                          </th>
                          <th>
                            Due
                          </th>
                          <th>
                            Due Date
                          </th>
                          <th>
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.studentFees.map(
                          (item) => (
                            <tr
                              key={
                                item.id
                              }
                            >
                              <td>
                                {item.academic_year ||
                                  "—"}
                              </td>

                              <td>
                                {item.semester ||
                                  "—"}
                              </td>

                              <td>
                                ₹
                                {formatAmount(
                                  item.total_amount
                                )}
                              </td>

                              <td>
                                ₹
                                {formatAmount(
                                  item.scholarship_amount
                                )}
                              </td>

                              <td>
                                ₹
                                {formatAmount(
                                  item.discount_amount
                                )}
                              </td>

                              <td>
                                ₹
                                {formatAmount(
                                  item.paid_amount
                                )}
                              </td>

                              <td>
                                ₹
                                {formatAmount(
                                  item.due_amount
                                )}
                              </td>

                              <td>
                                {formatDate(
                                  item.due_date
                                )}
                              </td>

                              <td>
                                <span
                                  className={`fee-status ${getStatusClass(
                                    item.status
                                  )}`}
                                >
                                  {getStatusIcon(
                                    item.status
                                  )}
                                  {item.status ||
                                    "PENDING"}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section
                className="panel"
                style={{
                  marginTop: "24px",
                }}
              >
                <div className="panel-header">
                  <div>
                    <h2>
                      Payment History
                    </h2>
                    <p>
                      Payments recorded by
                      the Accounts
                      department
                    </p>
                  </div>
                </div>

                {data.payments.length ===
                0 ? (
                  <EmptyState
                    icon={
                      <WalletCards
                        size={28}
                      />
                    }
                    title="No payment history"
                    message="No payment has been recorded for your account yet."
                  />
                ) : (
                  <div
                    style={{
                      overflowX:
                        "auto",
                    }}
                  >
                    <table className="campx-table">
                      <thead>
                        <tr>
                          <th>
                            Date
                          </th>
                          <th>
                            Amount
                          </th>
                          <th>
                            Method
                          </th>
                          <th>
                            Transaction ID
                          </th>
                          <th>
                            Academic Year
                          </th>
                          <th>
                            Remarks
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.payments.map(
                          (payment) => (
                            <tr
                              key={
                                payment.id
                              }
                            >
                              <td>
                                {formatDate(
                                  payment.payment_date
                                )}
                              </td>

                              <td>
                                ₹
                                {formatAmount(
                                  payment.amount
                                )}
                              </td>

                              <td>
                                {payment.payment_method ||
                                  "—"}
                              </td>

                              <td>
                                {payment.transaction_id ||
                                  "—"}
                              </td>

                              <td>
                                {payment.academic_year ||
                                  "—"}
                              </td>

                              <td>
                                {payment.remarks ||
                                  "—"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "24px",
                  marginTop: "24px",
                }}
              >
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>
                        Scholarships
                      </h2>
                      <p>
                        Scholarship records
                        linked to your
                        account
                      </p>
                    </div>
                  </div>

                  {data.scholarships
                    .length === 0 ? (
                    <EmptyState
                      icon={
                        <GraduationCap
                          size={28}
                        />
                      }
                      title="No scholarships"
                      message="No scholarship record has been added yet."
                    />
                  ) : (
                    <div
                      style={{
                        display:
                          "grid",
                        gap: "12px",
                      }}
                    >
                      {data.scholarships.map(
                        (item) => (
                          <div
                            key={
                              item.id
                            }
                            style={{
                              padding:
                                "15px",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius:
                                "12px",
                              background:
                                "#f8fafc",
                            }}
                          >
                            <strong>
                              {
                                item.scholarship_name
                              }
                            </strong>

                            <p
                              style={{
                                margin:
                                  "6px 0",
                                color:
                                  "#64748b",
                              }}
                            >
                              {
                                item.scholarship_type
                              }{" "}
                              • ₹
                              {formatAmount(
                                item.amount
                              )}
                            </p>

                            <span
                              className={`fee-status ${getStatusClass(
                                item.status
                              )}`}
                            >
                              {item.status ||
                                "PENDING"}
                            </span>

                            {item.description && (
                              <p
                                style={{
                                  margin:
                                    "8px 0 0",
                                  color:
                                    "#475569",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {
                                  item.description
                                }
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>
                        Fee Receipts
                      </h2>
                      <p>
                        Receipts generated
                        for your payments
                      </p>
                    </div>
                  </div>

                  {data.receipts.length ===
                  0 ? (
                    <EmptyState
                      icon={
                        <Receipt
                          size={28}
                        />
                      }
                      title="No receipts"
                      message="No fee receipt has been generated yet."
                    />
                  ) : (
                    <div
                      style={{
                        display:
                          "grid",
                        gap: "12px",
                      }}
                    >
                      {data.receipts.map(
                        (receipt) => (
                          <div
                            key={
                              receipt.id
                            }
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "space-between",
                              gap: "12px",
                              padding:
                                "15px",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius:
                                "12px",
                            }}
                          >
                            <div>
                              <strong>
                                {
                                  receipt.receipt_number
                                }
                              </strong>

                              <p
                                style={{
                                  margin:
                                    "5px 0 0",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                ₹
                                {formatAmount(
                                  receipt.amount
                                )}{" "}
                                •{" "}
                                {formatDate(
                                  receipt.payment_date
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              className="secondary-btn"
                              onClick={() =>
                                downloadReceipt(
                                  receipt
                                )
                              }
                            >
                              <Download
                                size={15}
                              />
                              Download
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </section>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function FeeSummaryCard({
  icon,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="panel">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#eef2ff",
            color: "#4f46e5",
          }}
        >
          {icon}
        </div>

        <span
          style={{
            color: "#64748b",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "5px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
}) {
  return (
    <div
      style={{
        padding: "35px 20px",
        textAlign: "center",
        color: "#64748b",
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          margin: "0 auto 12px",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eef2ff",
          color: "#4f46e5",
        }}
      >
        {icon}
      </div>

      <strong
        style={{
          display: "block",
          color: "#334155",
          marginBottom: "6px",
        }}
      >
        {title}
      </strong>

      <span>{message}</span>
    </div>
  );
}
