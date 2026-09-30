import { useState } from "react";
import { FileText, Send, CheckCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";
import { useLanguage } from "../context/LanguageContext";

const REQUESTS_KEY = "campxRequests";

export default function Requests() {
  const { language } = useLanguage();

  const [requestType, setRequestType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");

  const translations = {
    en: {
      studentRequests: "Student Requests",
      submitCertificates:
        "Submit certificates, documents and other campus service requests.",
      submitRequest: "Submit a Request",
      selectService:
        "Select the service you need and provide a short description.",
      requestType: "Request Type",
      selectRequestType: "Select request type",
      bonafide: "Bonafide Certificate",
      character: "Character Certificate",
      feeReceipt: "Fee Receipt",
      academic: "Academic Document",
      hostel: "Hostel Request",
      other: "Other",
      purpose: "Purpose / Description",
      explain: "Explain what you need...",
      submit: "Submit Request",
      requestSubmitted: "Request Submitted",
      success:
        "Your request has been successfully submitted to the administration.",
      requestId: "Request ID:",
      another: "Submit Another Request",
      notificationTitle: "New Student Request",
      notificationMessage: "submitted a request.",
    },

    hi: {
      studentRequests: "छात्र अनुरोध",
      submitCertificates:
        "प्रमाण पत्र, दस्तावेज़ और अन्य कैंपस सेवा अनुरोध जमा करें।",
      submitRequest: "अनुरोध जमा करें",
      selectService:
        "आपको जिस सेवा की आवश्यकता है उसे चुनें और संक्षिप्त विवरण दें।",
      requestType: "अनुरोध का प्रकार",
      selectRequestType: "अनुरोध का प्रकार चुनें",
      bonafide: "बोनाफाइड प्रमाण पत्र",
      character: "चरित्र प्रमाण पत्र",
      feeReceipt: "शुल्क रसीद",
      academic: "शैक्षणिक दस्तावेज़",
      hostel: "हॉस्टल अनुरोध",
      other: "अन्य",
      purpose: "उद्देश्य / विवरण",
      explain: "बताएं कि आपको क्या चाहिए...",
      submit: "अनुरोध जमा करें",
      requestSubmitted: "अनुरोध जमा हो गया",
      success:
        "आपका अनुरोध प्रशासन को सफलतापूर्वक भेज दिया गया है।",
      requestId: "अनुरोध आईडी:",
      another: "एक और अनुरोध जमा करें",
      notificationTitle: "नया छात्र अनुरोध",
      notificationMessage: "ने एक अनुरोध जमा किया है।",
    },

    or: {
      studentRequests: "ଛାତ୍ର ଅନୁରୋଧ",
      submitCertificates:
        "ପ୍ରମାଣପତ୍ର, ଦଲିଲ ଏବଂ ଅନ୍ୟାନ୍ୟ କ୍ୟାମ୍ପସ ସେବା ଅନୁରୋଧ ଦାଖଲ କରନ୍ତୁ।",
      submitRequest: "ଅନୁରୋଧ ଦାଖଲ କରନ୍ତୁ",
      selectService:
        "ଆପଣ ଆବଶ୍ୟକ କରୁଥିବା ସେବା ବାଛନ୍ତୁ ଏବଂ ସଂକ୍ଷିପ୍ତ ବିବରଣୀ ଦିଅନ୍ତୁ।",
      requestType: "ଅନୁରୋଧ ପ୍ରକାର",
      selectRequestType: "ଅନୁରୋଧ ପ୍ରକାର ବାଛନ୍ତୁ",
      bonafide: "ବୋନାଫାଇଡ୍ ପ୍ରମାଣପତ୍ର",
      character: "ଚରିତ୍ର ପ୍ରମାଣପତ୍ର",
      feeReceipt: "ଫି ରସିଦ",
      academic: "ଶିକ୍ଷାଗତ ଦଲିଲ",
      hostel: "ହଷ୍ଟେଲ ଅନୁରୋଧ",
      other: "ଅନ୍ୟାନ୍ୟ",
      purpose: "ଉଦ୍ଦେଶ୍ୟ / ବିବରଣୀ",
      explain: "ଆପଣଙ୍କୁ କଣ ଆବଶ୍ୟକ ତାହା ଲେଖନ୍ତୁ...",
      submit: "ଅନୁରୋଧ ଦାଖଲ କରନ୍ତୁ",
      requestSubmitted: "ଅନୁରୋଧ ଦାଖଲ ହୋଇଛି",
      success:
        "ଆପଣଙ୍କ ଅନୁରୋଧ ସଫଳତାର ସହିତ ପ୍ରଶାସନ ନିକଟକୁ ପଠାଯାଇଛି।",
      requestId: "ଅନୁରୋଧ ଆଇଡି:",
      another: "ଅନ୍ୟ ଏକ ଅନୁରୋଧ ଦାଖଲ କରନ୍ତୁ",
      notificationTitle: "ନୂତନ ଛାତ୍ର ଅନୁରୋଧ",
      notificationMessage: "ଏକ ଅନୁରୋଧ ଦାଖଲ କରିଛନ୍ତି।",
    },
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const getRequestTypeLabel = (type) => {
    const labels = {
      "Bonafide Certificate": t("bonafide"),
      "Character Certificate": t("character"),
      "Fee Receipt": t("feeReceipt"),
      "Academic Document": t("academic"),
      "Hostel Request": t("hostel"),
      Other: t("other"),
    };

    return labels[type] || type;
  };

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
      JSON.stringify([newRequest, ...existingRequests])
    );

    addNotification({
      audience: "admin",
      type: "request",
      title: t("notificationTitle"),
      message:
        language === "hi"
          ? `Adya Dash ${t("notificationMessage")}`
          : language === "or"
          ? `Adya Dash ${t("notificationMessage")}`
          : `Adya Dash ${t("notificationMessage")} (${requestType}).`,
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

              <h1>{t("requestSubmitted")}</h1>

              <p>{t("success")}</p>

              <div className="request-id">
                {t("requestId")} <strong>{requestId}</strong>
              </div>

              <button
                className="primary-btn"
                onClick={() => setSubmitted(false)}
              >
                {t("another")}
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
              <h1>{t("studentRequests")}</h1>

              <p>{t("submitCertificates")}</p>
            </div>
          </div>

          <div className="request-form-card">
            <div className="request-form-icon">
              <FileText size={24} />
            </div>

            <h2>{t("submitRequest")}</h2>

            <p>{t("selectService")}</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t("requestType")}</label>

                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  required
                >
                  <option value="">{t("selectRequestType")}</option>

                  <option value="Bonafide Certificate">
                    {getRequestTypeLabel("Bonafide Certificate")}
                  </option>

                  <option value="Character Certificate">
                    {getRequestTypeLabel("Character Certificate")}
                  </option>

                  <option value="Fee Receipt">
                    {getRequestTypeLabel("Fee Receipt")}
                  </option>

                  <option value="Academic Document">
                    {getRequestTypeLabel("Academic Document")}
                  </option>

                  <option value="Hostel Request">
                    {getRequestTypeLabel("Hostel Request")}
                  </option>

                  <option value="Other">
                    {getRequestTypeLabel("Other")}
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>{t("purpose")}</label>

                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={t("explain")}
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="primary-btn">
                <Send size={17} />
                {t("submit")}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}