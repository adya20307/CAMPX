import { useEffect, useState } from "react";
import {
  FileText,
  Send,
  CheckCircle2,
  Printer,
  Eye,
  Clock3,
  XCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";
import { useLanguage } from "../context/LanguageContext";

const APPLICATIONS_KEY = "campx_applications";

function getCurrentStudent() {
  try {
    const savedUser = localStorage.getItem("campx_user");
    const user = savedUser ? JSON.parse(savedUser) : {};

    return {
      name: user?.name || user?.studentName || "Student",
      id:
        user?.studentId ||
        user?.student_id ||
        user?.registrationNumber ||
        user?.registration_number ||
        "",
      department:
        user?.department ||
        user?.branch ||
        "Computer Science & Engineering",
      semester: user?.semester || "Semester",
    };
  } catch (error) {
    console.error("Error reading logged-in student:", error);

    return {
      name: "Student",
      id: "",
      department: "Computer Science & Engineering",
      semester: "Semester",
    };
  }
}

const applicationTypes = [
  "Leave Application",
  "Hostel Application",
  "Fee Related Application",
  "Academic Application",
  "Bonafide / Certificate Application",
  "Permission Application",
  "Internship / Training Application",
  "Event / Activity Permission",
  "Other",
];

function loadApplications() {
  try {
    const saved = localStorage.getItem(APPLICATIONS_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading applications:", error);
    return [];
  }
}

function saveApplications(applications) {
  localStorage.setItem(
    APPLICATIONS_KEY,
    JSON.stringify(applications)
  );

  window.dispatchEvent(
    new Event("campx-application-updated")
  );
}

export default function Applications() {
  const { language } = useLanguage();
  const CURRENT_STUDENT = getCurrentStudent();

  const [applications, setApplications] = useState([]);

  const [applicationType, setApplicationType] =
    useState("Leave Application");

  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  const [applicationDate, setApplicationDate] =
    useState("");
  const [additionalDetails, setAdditionalDetails] =
    useState("");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const translations = {
    en: {
      studentServices: "STUDENT SERVICES",
      digitalApplications: "Digital Applications",
      submitTrack:
        "Submit applications and track their approval status.",

      createApplication: "Create Application",
      fillDetails: "Fill in the details below.",

      applicationType: "Application Type",
      applicationDate: "Application Date",
      subject: "Subject",
      reasonContent: "Reason / Application Content",
      additionalDetails: "Additional Details",

      subjectPlaceholder: "e.g. Request for leave",
      reasonPlaceholder:
        "Write your application reason...",
      additionalPlaceholder:
        "Any additional information...",

      applicantInformation: "Applicant Information",
      name: "Name",
      studentId: "Student ID",
      department: "Department",
      semester: "Semester",

      standardFormat: "Standard Application Format",
      to: "To,",
      concernedAuthority: "The Concerned Authority",
      applicationSubject: "Application Subject",
      respected: "Respected Sir/Madam,",
      requestConsider:
        "request you to kindly consider my application.",

      submitApplication: "Submit Application",

      myApplications: "My Applications",
      trackApplications:
        "Track your submitted applications and print approved applications.",

      noApplications: "No applications yet",
      submittedAppear:
        "Your submitted applications will appear here.",

      view: "View",
      print: "Print",

      approvedApplication: "APPROVED APPLICATION",
      applicationDetails: "APPLICATION DETAILS",

      digitalStudentApplication:
        "Digital Student Application",

      date: "Date:",
      applicationId: "Application ID:",
      reason: "Reason:",
      additional: "Additional Details:",

      applicant: "Applicant",
      approvedBy: "Approved By",

      pendingVerification:
        "This application is still awaiting administrative verification.",

      close: "Close",
      printApproved: "Print Approved Application",

      alertSubjectReason:
        "Please enter the subject and reason.",
      alertSuccess:
        "Application submitted successfully.",
      alertApplicationId: "Application ID:",

      newApplicationNotification:
        "New Application Submitted",
      submittedNotification:
        "submitted a",
      applicationWord: "application.",

      leave: "Leave Application",
      hostel: "Hostel Application",
      fee: "Fee Related Application",
      academic: "Academic Application",
      bonafide: "Bonafide / Certificate Application",
      permission: "Permission Application",
      internship: "Internship / Training Application",
      event: "Event / Activity Permission",
      other: "Other",

      submitted: "Submitted",
      approved: "Approved",
      rejected: "Rejected",
      pending: "Pending",

      requestConsiderFull:
        "I, {name} ({id}), request you to kindly consider my application.",
    },

    hi: {
      studentServices: "छात्र सेवाएँ",
      digitalApplications: "डिजिटल आवेदन",
      submitTrack:
        "आवेदन जमा करें और उनकी स्वीकृति स्थिति देखें।",

      createApplication: "आवेदन बनाएँ",
      fillDetails: "नीचे दिए गए विवरण भरें।",

      applicationType: "आवेदन का प्रकार",
      applicationDate: "आवेदन की तारीख",
      subject: "विषय",
      reasonContent: "कारण / आवेदन की सामग्री",
      additionalDetails: "अतिरिक्त विवरण",

      subjectPlaceholder:
        "जैसे: छुट्टी के लिए अनुरोध",
      reasonPlaceholder:
        "अपने आवेदन का कारण लिखें...",
      additionalPlaceholder:
        "कोई अतिरिक्त जानकारी...",

      applicantInformation: "आवेदक की जानकारी",
      name: "नाम",
      studentId: "छात्र आईडी",
      department: "विभाग",
      semester: "सेमेस्टर",

      standardFormat: "मानक आवेदन प्रारूप",
      to: "सेवा में,",
      concernedAuthority: "संबंधित प्राधिकारी",
      applicationSubject: "आवेदन का विषय",
      respected: "आदरणीय सर/मैडम,",
      requestConsider:
        "कृपया मेरे आवेदन पर विचार करने का अनुरोध है।",

      submitApplication: "आवेदन जमा करें",

      myApplications: "मेरे आवेदन",
      trackApplications:
        "अपने जमा किए गए आवेदनों को देखें और स्वीकृत आवेदन प्रिंट करें।",

      noApplications: "अभी कोई आवेदन नहीं है",
      submittedAppear:
        "आपके जमा किए गए आवेदन यहाँ दिखाई देंगे।",

      view: "देखें",
      print: "प्रिंट",

      approvedApplication: "स्वीकृत आवेदन",
      applicationDetails: "आवेदन का विवरण",

      digitalStudentApplication:
        "डिजिटल छात्र आवेदन",

      date: "तारीख:",
      applicationId: "आवेदन आईडी:",
      reason: "कारण:",
      additional: "अतिरिक्त विवरण:",

      applicant: "आवेदक",
      approvedBy: "द्वारा स्वीकृत",

      pendingVerification:
        "यह आवेदन अभी प्रशासनिक सत्यापन की प्रतीक्षा कर रहा है।",

      close: "बंद करें",
      printApproved: "स्वीकृत आवेदन प्रिंट करें",

      alertSubjectReason:
        "कृपया विषय और कारण दर्ज करें।",
      alertSuccess:
        "आवेदन सफलतापूर्वक जमा किया गया।",
      alertApplicationId: "आवेदन आईडी:",

      newApplicationNotification:
        "नया आवेदन जमा हुआ",
      submittedNotification:
        "ने एक",
      applicationWord: "आवेदन जमा किया है।",

      leave: "छुट्टी का आवेदन",
      hostel: "हॉस्टल आवेदन",
      fee: "शुल्क संबंधी आवेदन",
      academic: "शैक्षणिक आवेदन",
      bonafide: "बोनाफाइड / प्रमाणपत्र आवेदन",
      permission: "अनुमति आवेदन",
      internship: "इंटर्नशिप / प्रशिक्षण आवेदन",
      event: "कार्यक्रम / गतिविधि अनुमति",
      other: "अन्य",

      submitted: "जमा किया गया",
      approved: "स्वीकृत",
      rejected: "अस्वीकृत",
      pending: "लंबित",

      requestConsiderFull:
        "मैं, {name} ({id}), आपसे मेरे आवेदन पर विचार करने का अनुरोध करता/करती हूँ।",
    },

    or: {
      studentServices: "ଛାତ୍ର ସେବା",
      digitalApplications: "ଡିଜିଟାଲ ଆବେଦନ",
      submitTrack:
        "ଆବେଦନ ଦାଖଲ କରନ୍ତୁ ଏବଂ ଏହାର ଅନୁମୋଦନ ସ୍ଥିତି ଦେଖନ୍ତୁ।",

      createApplication: "ଆବେଦନ ସୃଷ୍ଟି କରନ୍ତୁ",
      fillDetails: "ନିମ୍ନରେ ଦିଆଯାଇଥିବା ବିବରଣୀ ପୂରଣ କରନ୍ତୁ।",

      applicationType: "ଆବେଦନ ପ୍ରକାର",
      applicationDate: "ଆବେଦନ ତାରିଖ",
      subject: "ବିଷୟ",
      reasonContent: "କାରଣ / ଆବେଦନ ବିଷୟବସ୍ତୁ",
      additionalDetails: "ଅତିରିକ୍ତ ବିବରଣୀ",

      subjectPlaceholder:
        "ଯଥା: ଛୁଟି ପାଇଁ ଅନୁରୋଧ",
      reasonPlaceholder:
        "ଆପଣଙ୍କ ଆବେଦନର କାରଣ ଲେଖନ୍ତୁ...",
      additionalPlaceholder:
        "ଅନ୍ୟାନ୍ୟ ଅତିରିକ୍ତ ସୂଚନା...",

      applicantInformation: "ଆବେଦକଙ୍କ ସୂଚନା",
      name: "ନାମ",
      studentId: "ଛାତ୍ର ID",
      department: "ବିଭାଗ",
      semester: "ସେମିଷ୍ଟର",

      standardFormat: "ମାନକ ଆବେଦନ ଫର୍ମାଟ",
      to: "ପ୍ରତି,",
      concernedAuthority: "ସମ୍ପୃକ୍ତ କର୍ତ୍ତୃପକ୍ଷ",
      applicationSubject: "ଆବେଦନର ବିଷୟ",
      respected: "ମାନ୍ୟବର ସାର୍ / ମ୍ୟାଡାମ୍,",
      requestConsider:
        "ଦୟାକରି ମୋର ଆବେଦନକୁ ବିଚାର କରିବାକୁ ଅନୁରୋଧ କରୁଛି।",

      submitApplication: "ଆବେଦନ ଦାଖଲ କରନ୍ତୁ",

      myApplications: "ମୋର ଆବେଦନଗୁଡ଼ିକ",
      trackApplications:
        "ଆପଣଙ୍କ ଦାଖଲ କରାଯାଇଥିବା ଆବେଦନଗୁଡ଼ିକୁ ଟ୍ରାକ୍ କରନ୍ତୁ ଏବଂ ଅନୁମୋଦିତ ଆବେଦନ ପ୍ରିଣ୍ଟ କରନ୍ତୁ।",

      noApplications: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଆବେଦନ ନାହିଁ",
      submittedAppear:
        "ଆପଣଙ୍କ ଦାଖଲ କରାଯାଇଥିବା ଆବେଦନ ଏଠାରେ ଦେଖାଯିବ।",

      view: "ଦେଖନ୍ତୁ",
      print: "ପ୍ରିଣ୍ଟ",

      approvedApplication: "ଅନୁମୋଦିତ ଆବେଦନ",
      applicationDetails: "ଆବେଦନ ବିବରଣୀ",

      digitalStudentApplication:
        "ଡିଜିଟାଲ ଛାତ୍ର ଆବେଦନ",

      date: "ତାରିଖ:",
      applicationId: "ଆବେଦନ ID:",
      reason: "କାରଣ:",
      additional: "ଅତିରିକ୍ତ ବିବରଣୀ:",

      applicant: "ଆବେଦକ",
      approvedBy: "ଅନୁମୋଦନକାରୀ",

      pendingVerification:
        "ଏହି ଆବେଦନ ବର୍ତ୍ତମାନ ପ୍ରଶାସନିକ ଯାଞ୍ଚ ପାଇଁ ଅପେକ୍ଷାରତ ଅଛି।",

      close: "ବନ୍ଦ କରନ୍ତୁ",
      printApproved: "ଅନୁମୋଦିତ ଆବେଦନ ପ୍ରିଣ୍ଟ କରନ୍ତୁ",

      alertSubjectReason:
        "ଦୟାକରି ବିଷୟ ଏବଂ କାରଣ ଲେଖନ୍ତୁ।",
      alertSuccess:
        "ଆବେଦନ ସଫଳତାର ସହିତ ଦାଖଲ ହୋଇଛି।",
      alertApplicationId: "ଆବେଦନ ID:",

      newApplicationNotification:
        "ନୂତନ ଆବେଦନ ଦାଖଲ ହୋଇଛି",
      submittedNotification:
        "ଏକ",
      applicationWord: "ଆବେଦନ ଦାଖଲ କରିଛନ୍ତି।",

      leave: "ଛୁଟି ଆବେଦନ",
      hostel: "ହଷ୍ଟେଲ ଆବେଦନ",
      fee: "ଫି ସମ୍ବନ୍ଧୀୟ ଆବେଦନ",
      academic: "ଶିକ୍ଷାଗତ ଆବେଦନ",
      bonafide: "ବୋନାଫାଇଡ୍ / ପ୍ରମାଣପତ୍ର ଆବେଦନ",
      permission: "ଅନୁମତି ଆବେଦନ",
      internship: "ଇଣ୍ଟର୍ନସିପ୍ / ପ୍ରଶିକ୍ଷଣ ଆବେଦନ",
      event: "କାର୍ଯ୍ୟକ୍ରମ / କାର୍ଯ୍ୟକଳାପ ଅନୁମତି",
      other: "ଅନ୍ୟାନ୍ୟ",

      submitted: "ଦାଖଲ",
      approved: "ଅନୁମୋଦିତ",
      rejected: "ପ୍ରତ୍ୟାଖ୍ୟାନ",
      pending: "ବିଚାରାଧୀନ",

      requestConsiderFull:
        "ମୁଁ, {name} ({id}), ମୋର ଆବେଦନକୁ ବିଚାର କରିବା ପାଇଁ ଆପଣଙ୍କୁ ଅନୁରୋଧ କରୁଛି।",
    },
  };

  const t = (key) => {
    return (
      translations[language]?.[key] ||
      translations.en[key] ||
      key
    );
  };

  const getApplicationTypeLabel = (type) => {
    const labels = {
      "Leave Application": t("leave"),
      "Hostel Application": t("hostel"),
      "Fee Related Application": t("fee"),
      "Academic Application": t("academic"),
      "Bonafide / Certificate Application": t("bonafide"),
      "Permission Application": t("permission"),
      "Internship / Training Application": t("internship"),
      "Event / Activity Permission": t("event"),
      Other: t("other"),
    };

    return labels[type] || type;
  };

  const getStatusLabel = (status) => {
    const labels = {
      Submitted: t("submitted"),
      Approved: t("approved"),
      Rejected: t("rejected"),
      Pending: t("pending"),
    };

    return labels[status] || status;
  };

  useEffect(() => {
    const loadStudentApplications = () => {
      const allApplications = loadApplications();

      const studentApplications = allApplications.filter(
        (application) =>
          application.studentId === CURRENT_STUDENT.id
      );

      setApplications(studentApplications);
    };

    loadStudentApplications();

    window.addEventListener(
      "storage",
      loadStudentApplications
    );

    window.addEventListener(
      "campx-application-updated",
      loadStudentApplications
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadStudentApplications
      );

      window.removeEventListener(
        "campx-application-updated",
        loadStudentApplications
      );
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!subject.trim() || !reason.trim()) {
      alert(t("alertSubjectReason"));
      return;
    }

    const newApplication = {
      id: `APP-${Date.now()}`,

      studentName: CURRENT_STUDENT.name,

      studentId: CURRENT_STUDENT.id,

      department: CURRENT_STUDENT.department,

      semester: CURRENT_STUDENT.semester,

      type: applicationType,

      subject: subject.trim(),

      reason: reason.trim(),

      applicationDate,

      additionalDetails:
        additionalDetails.trim(),

      status: "Submitted",

      verificationStatus: "Pending",

      approvalAuthority: "",

      authorityName: "",

      authorityDesignation: "",

      approvalImage: "",

      verificationNote: "",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    const allApplications = loadApplications();

    allApplications.unshift(newApplication);

    saveApplications(allApplications);

    addNotification({
      audience: "admin",

      type: "application",

      title: t("newApplicationNotification"),

      message: `${newApplication.studentName} ${t(
        "submittedNotification"
      )} ${getApplicationTypeLabel(
        newApplication.type
      )} ${t("applicationWord")}`,

      studentId: newApplication.studentId,

      relatedId: newApplication.id,

      status: "Submitted",
    });

    setSubject("");
    setReason("");
    setApplicationDate("");
    setAdditionalDetails("");

    alert(
      `${t("alertSuccess")}\n\n${t(
        "alertApplicationId"
      )} ${newApplication.id}`
    );
  };

  const printApplication = () => {
    window.print();
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    try {
      const locale =
        language === "hi"
          ? "hi-IN"
          : language === "or"
          ? "or-IN"
          : "en-IN";

      return new Date(dateValue).toLocaleDateString(
        locale
      );
    } catch {
      return new Date(dateValue).toLocaleDateString();
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <div className="page-content">

          {/* HEADER */}

          <div className="page-header">
            <div>
              <div className="page-eyebrow">
                {t("studentServices")}
              </div>

              <h1>
                {t("digitalApplications")}
              </h1>

              <p>
                {t("submitTrack")}
              </p>
            </div>
          </div>

          {/* NEW APPLICATION */}

          <div className="application-layout">

            <div className="application-form-card">

              <div className="application-card-heading">

                <div className="application-heading-icon">
                  <FileText size={22} />
                </div>

                <div>
                  <h2>
                    {t("createApplication")}
                  </h2>

                  <p>
                    {t("fillDetails")}
                  </p>
                </div>

              </div>

              <form onSubmit={handleSubmit}>

                <div className="application-form-grid">

                  <div className="form-field">

                    <label>
                      {t("applicationType")}
                    </label>

                    <select
                      value={applicationType}
                      onChange={(event) =>
                        setApplicationType(
                          event.target.value
                        )
                      }
                    >
                      {applicationTypes.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {getApplicationTypeLabel(
                              type
                            )}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                  <div className="form-field">

                    <label>
                      {t("applicationDate")}
                    </label>

                    <input
                      type="date"
                      value={applicationDate}
                      onChange={(event) =>
                        setApplicationDate(
                          event.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-field">

                  <label>
                    {t("subject")} <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder={t(
                      "subjectPlaceholder"
                    )}
                    value={subject}
                    onChange={(event) =>
                      setSubject(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="form-field">

                  <label>
                    {t("reasonContent")}{" "}
                    <span>*</span>
                  </label>

                  <textarea
                    rows="7"
                    placeholder={t(
                      "reasonPlaceholder"
                    )}
                    value={reason}
                    onChange={(event) =>
                      setReason(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="form-field">

                  <label>
                    {t("additionalDetails")}
                  </label>

                  <textarea
                    rows="4"
                    placeholder={t(
                      "additionalPlaceholder"
                    )}
                    value={additionalDetails}
                    onChange={(event) =>
                      setAdditionalDetails(
                        event.target.value
                      )
                    }
                  />

                </div>

                {/* STUDENT INFORMATION */}

                <div className="application-student-info">

                  <h3>
                    {t("applicantInformation")}
                  </h3>

                  <div className="student-info-grid">

                    <div>
                      <span>
                        {t("name")}
                      </span>

                      <strong>
                        {CURRENT_STUDENT.name}
                      </strong>
                    </div>

                    <div>
                      <span>
                        {t("studentId")}
                      </span>

                      <strong>
                        {CURRENT_STUDENT.id}
                      </strong>
                    </div>

                    <div>
                      <span>
                        {t("department")}
                      </span>

                      <strong>
                        {CURRENT_STUDENT.department}
                      </strong>
                    </div>

                    <div>
                      <span>
                        {t("semester")}
                      </span>

                      <strong>
                        {CURRENT_STUDENT.semester}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* STANDARD APPLICATION FORMAT */}

                <div className="application-format-note">

                  <strong>
                    {t("standardFormat")}
                  </strong>

                  <p>
                    {t("to")}
                    <br />

                    {t("concernedAuthority")}
                    <br />

                    {CURRENT_STUDENT.department}
                    <br />
                    <br />

                    <strong>
                      {t("subject")}:{" "}
                      {subject ||
                        t("applicationSubject")}
                    </strong>

                    <br />
                    <br />

                    {t("respected")}
                    <br />
                    <br />

                    {CURRENT_STUDENT.name}{" "}
                    ({CURRENT_STUDENT.id}),{" "}
                    {t("requestConsider")}
                  </p>

                </div>

                <button
                  type="submit"
                  className="primary-btn application-submit-btn"
                >
                  <Send size={17} />

                  {t("submitApplication")}
                </button>

              </form>

            </div>

            {/* MY APPLICATIONS */}

            <div className="application-side-card">

              <div className="application-side-icon">
                <FileText size={22} />
              </div>

              <h2>
                {t("myApplications")}
              </h2>

              <p className="my-applications-subtitle">
                {t("trackApplications")}
              </p>

              {applications.length === 0 ? (

                <div className="my-applications-empty">

                  <FileText size={30} />

                  <strong>
                    {t("noApplications")}
                  </strong>

                  <span>
                    {t("submittedAppear")}
                  </span>

                </div>

              ) : (

                <div className="my-applications-list">

                  {applications.map(
                    (application) => (

                      <div
                        className="my-application-card"
                        key={application.id}
                      >

                        <div className="my-application-top">

                          <div>

                            <span>
                              {getApplicationTypeLabel(
                                application.type
                              )}
                            </span>

                            <h3>
                              {application.subject}
                            </h3>

                          </div>

                          <span
                            className={
                              `my-application-status ` +
                              String(
                                application.status || ""
                              ).toLowerCase()
                            }
                          >

                            {application.status ===
                              "Approved" && (
                              <CheckCircle2
                                size={13}
                              />
                            )}

                            {application.status ===
                              "Submitted" && (
                              <Clock3
                                size={13}
                              />
                            )}

                            {application.status ===
                              "Rejected" && (
                              <XCircle
                                size={13}
                              />
                            )}

                            {getStatusLabel(
                              application.status
                            )}

                          </span>

                        </div>

                        <div className="my-application-id">
                          {application.id}
                        </div>

                        <div className="my-application-actions">

                          <button
                            type="button"
                            className="application-view-btn"
                            onClick={() =>
                              setSelectedApplication(
                                application
                              )
                            }
                          >
                            <Eye size={15} />

                            {t("view")}
                          </button>

                          {application.status ===
                            "Approved" && (

                            <button
                              type="button"
                              className="application-print-btn"
                              onClick={() =>
                                setSelectedApplication(
                                  application
                                )
                              }
                            >
                              <Printer size={15} />

                              {t("print")}
                            </button>

                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </main>

      {/* APPLICATION VIEW / PRINT MODAL */}

      {selectedApplication && (

        <div className="application-modal-overlay">

          <div className="student-application-modal">

            <div className="student-application-modal-header">

              <div>

                <span>
                  {selectedApplication.status ===
                  "Approved"
                    ? t("approvedApplication")
                    : t("applicationDetails")}
                </span>

                <h2>
                  {selectedApplication.subject}
                </h2>

                <p>
                  {selectedApplication.id}
                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setSelectedApplication(null)
                }
              >
                ×
              </button>

            </div>

            {/* DOCUMENT */}

            <div
              className="student-print-document"
              id="print-application"
            >

              <div className="student-document-header">

                <h1>
                  CAMPX
                </h1>

                <p>
                  {t(
                    "digitalStudentApplication"
                  )}
                </p>

              </div>

              <div className="document-to">

                {t("to")}
                <br />

                {t("concernedAuthority")}
                <br />

                {selectedApplication.department}

              </div>

              <div className="student-document-meta">

                <span>
                  {t("date")}{" "}
                  {selectedApplication.applicationDate
                    ? formatDate(
                        selectedApplication.applicationDate
                      )
                    : formatDate(
                        selectedApplication.createdAt
                      )}
                </span>

                <span>
                  {t("applicationId")}{" "}
                  {selectedApplication.id}
                </span>

              </div>

              <h3>
                {t("subject")}:{" "}
                {selectedApplication.subject}
              </h3>

              <p>
                {t("respected")}
              </p>

              <p>
                {language === "hi" ? (
                  <>
                    मैं,{" "}
                    <strong>
                      {selectedApplication.studentName}
                    </strong>{" "}
                    (
                    {selectedApplication.studentId}
                    ),{" "}
                    {selectedApplication.department},{" "}
                    {selectedApplication.semester} का/की
                    छात्र/छात्रा हूँ। ऊपर दिए गए विषय के
                    संबंध में मेरे आवेदन पर विचार करने
                    का अनुरोध है।
                  </>
                ) : language === "or" ? (
                  <>
                    ମୁଁ,{" "}
                    <strong>
                      {selectedApplication.studentName}
                    </strong>{" "}
                    (
                    {selectedApplication.studentId}
                    ),{" "}
                    {selectedApplication.department},{" "}
                    {selectedApplication.semester} ର
                    ଛାତ୍ର/ଛାତ୍ରୀ। ଉପରୋକ୍ତ ବିଷୟ
                    ସମ୍ବନ୍ଧରେ ମୋର ଆବେଦନକୁ ବିଚାର
                    କରିବାକୁ ଅନୁରୋଧ କରୁଛି।
                  </>
                ) : (
                  <>
                    I,{" "}
                    <strong>
                      {selectedApplication.studentName}
                    </strong>{" "}
                    (
                    {selectedApplication.studentId}
                    ), student of{" "}
                    {selectedApplication.department},{" "}
                    {selectedApplication.semester},
                    request you to kindly consider
                    my application regarding the
                    above-mentioned subject.
                  </>
                )}
              </p>

              <p>
                <strong>
                  {t("reason")}
                </strong>
              </p>

              <p>
                {selectedApplication.reason}
              </p>

              {selectedApplication.additionalDetails && (

                <p>

                  <strong>
                    {t("additional")}
                  </strong>

                  <br />

                  {
                    selectedApplication.additionalDetails
                  }

                </p>

              )}

              <div className="student-document-signature">

                <strong>
                  {t("applicant")}
                </strong>

                <span>
                  {selectedApplication.studentName}
                </span>

                <span>
                  {selectedApplication.studentId}
                </span>

              </div>

              {/* APPROVAL */}

              {selectedApplication.status ===
                "Approved" && (

                <div className="student-approved-section">

                  <div className="student-approved-details">

                    <strong>
                      {t("approvedBy")}
                    </strong>

                    <span>
                      {
                        selectedApplication.authorityName
                      }
                    </span>

                    <small>
                      {
                        selectedApplication.authorityDesignation
                      }
                    </small>

                  </div>

                  {selectedApplication.approvalImage && (

                    <img
                      src={
                        selectedApplication.approvalImage
                      }
                      alt="Official approval stamp and signature"
                      className="student-approved-image"
                    />

                  )}

                </div>

              )}

              {selectedApplication.status !==
                "Approved" && (

                <div className="student-pending-notice">

                  <Clock3 size={17} />

                  <span>
                    {t("pendingVerification")}
                  </span>

                </div>

              )}

            </div>

            {/* ACTIONS */}

            <div className="student-application-modal-actions">

              <button
                className="secondary-btn"
                onClick={() =>
                  setSelectedApplication(null)
                }
              >
                {t("close")}
              </button>

              {selectedApplication.status ===
                "Approved" && (

                <button
                  className="primary-btn"
                  onClick={printApplication}
                >
                  <Printer size={17} />

                  {t("printApproved")}
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}