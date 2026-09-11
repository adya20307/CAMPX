import { useState } from "react";
import { FileText, Send, CheckCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";

const REQUESTS_KEY = "campxRequests";

export default function Requests() {
  const [requestType, setRequestType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!requestType || !purpose.trim()) {
      return;
    }

    const newRequest = {
      id: `REQ-${Date.now()}`,
      studentName: "Adya Dash",
      studentId: "CX2026001",
      type: requestType,
      purpose: purpose.trim(),
      status: "Submitted",
      createdAt: new Date().toISOString(),
    };

    const existingRequests = JSON.parse(
      localStorage.getItem(REQUESTS_KEY) || "[]"
    );

    localStorage.setItem(
      REQUESTS_KEY,
      JSON.stringify([
        newRequest,
        ...existingRequests,
      ])
    );

    addNotification({
      audience: "admin",
      type: "request",
      title: "New Student Request",
      message: `${newRequest.studentName} submitted a ${newRequest.type} request.`,
      studentId: newRequest.studentId,
      relatedId: newRequest.id,
      status: "Submitted",
    });

    setRequestId(newRequest.id);
    setSubmitted(true);
    setPurpose("");
    setRequestType("");
  };

  if (submitted) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Topbar />

          <div className="page-content">
            <div className="success-card">
              <CheckCircle size={52} />

              <h1>Request Submitted</h1>

              <p>
                Your request has been successfully
                submitted to the administration.
              </p>

              <div className="request-id">
                Request ID: <strong>{requestId}</strong>
              </div>

              <button
                className="primary-btn"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <div className="page-content">

          <div className="page-header">
            <div>
              <h1>Student Requests</h1>

              <p>
                Submit certificates, documents and
                other campus service requests.
              </p>
            </div>
          </div>

          <div className="request-form-card">

            <div className="request-form-icon">
              <FileText size={24} />
            </div>

            <h2>Submit a Request</h2>

            <p>
              Select the service you need and provide
              a short description.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Request Type
                </label>

                <select
                  value={requestType}
                  onChange={(e) =>
                    setRequestType(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select request type
                  </option>

                  <option value="Bonafide Certificate">
                    Bonafide Certificate
                  </option>

                  <option value="Character Certificate">
                    Character Certificate
                  </option>

                  <option value="Fee Receipt">
                    Fee Receipt
                  </option>

                  <option value="Academic Document">
                    Academic Document
                  </option>

                  <option value="Hostel Request">
                    Hostel Request
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>


              <div className="form-group">

                <label>
                  Purpose / Description
                </label>

                <textarea
                  value={purpose}
                  onChange={(e) =>
                    setPurpose(e.target.value)
                  }
                  placeholder="Explain what you need..."
                  rows="5"
                  required
                />

              </div>


              <button
                type="submit"
                className="primary-btn"
              >
                <Send size={17} />
                Submit Request
              </button>

            </form>

          </div>

        </div>
      </main>
    </div>
  );
}