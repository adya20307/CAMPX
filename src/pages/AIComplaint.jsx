import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { addNotification } from "../notificationStorage";
import { useLanguage } from "../context/LanguageContext";

const COMPLAINTS_KEY = "campxComplaints";
const REQUESTS_KEY = "campxRequests";

const getCurrentStudent = () => {
  try {
    const user = JSON.parse(localStorage.getItem("campx_user") || "null");

    return {
      name: user?.name || user?.studentName || "Student",
      id:
        user?.studentId ||
        user?.student_id ||
        user?.registrationNumber ||
        user?.registration_number ||
        "",
      department: user?.department || user?.branch || "CSE",
      semester: user?.semester || "",
    };
  } catch {
    return {
      name: "Student",
      id: "",
      department: "CSE",
      semester: "",
    };
  }
};

/* =========================================================
   CAMPY AI ANALYSIS
========================================================= */

function analyzeComplaint(text) {
  const value = text.toLowerCase();

  /* ---------- ACADEMIC / TIMETABLE REQUEST ---------- */

  const academicKeywords = [
    "timetable",
    "time table",
    "time-table",
    "class schedule",
    "class timetable",
    "my classes",
    "next class",
    "classes tomorrow",
    "class tomorrow",
    "today's class",
    "tomorrow's class",
    "tomorrow class",
    "schedule tomorrow",
    "academic schedule",
  ];

  if (academicKeywords.some((word) => value.includes(word))) {
    return {
      type: "request",
      category: "Academic Services",
      issue: "Timetable Request",
      location: "Academic Block",
      room: "Not detected",
      priority: "Low",
      duration: "Not specified",
      department: "Academic Office",
      action:
        "Check the student's timetable and provide the class schedule.",
    };
  }

  /* ---------- DOCUMENT REQUEST ---------- */

  const documentKeywords = [
    "bonafide",
    "certificate",
    "document",
    "documents",
    "fee receipt",
    "character certificate",
    "academic document",
    "transcript",
  ];

  if (documentKeywords.some((word) => value.includes(word))) {
    return {
      type: "request",
      category: "Student Services",
      issue: "Document / Certificate Request",
      location: "Administration Office",
      room: "Not detected",
      priority: "Low",
      duration: "Not specified",
      department: "Student Administration",
      action:
        "Verify the student's request and process the required document.",
    };
  }

  /* ---------- COMPLAINT CATEGORY ---------- */

  let category = "General Campus";
  let issue = "General Complaint";
  let department = "Campus Administration";

  if (
    value.includes("tap") ||
    value.includes("leak") ||
    value.includes("water") ||
    value.includes("plumb")
  ) {
    category = "Hostel Maintenance";
    issue = "Water / Plumbing Issue";
    department = "Maintenance";
  } else if (
    value.includes("wifi") ||
    value.includes("internet") ||
    value.includes("network")
  ) {
    category = "IT Support";
    issue = "Internet / Wi-Fi Issue";
    department = "IT Support";
  } else if (
    value.includes("food") ||
    value.includes("mess") ||
    value.includes("meal")
  ) {
    category = "Mess & Food";
    issue = "Mess / Food Issue";
    department = "Mess Management";
  } else if (
    value.includes("light") ||
    value.includes("fan") ||
    value.includes("electric")
  ) {
    category = "Electrical Maintenance";
    issue = "Electrical Issue";
    department = "Electrical Maintenance";
  } else if (
    value.includes("clean") ||
    value.includes("garbage") ||
    value.includes("dirty")
  ) {
    category = "Cleanliness";
    issue = "Cleanliness Issue";
    department = "Housekeeping";
  }

  /* ---------- LOCATION ---------- */

  let location = "Not detected";

  if (value.includes("hostel a")) {
    location = "Hostel A";
  } else if (value.includes("hostel b")) {
    location = "Hostel B";
  } else if (value.includes("hostel")) {
    location = "Hostel";
  } else if (value.includes("academic block")) {
    location = "Academic Block";
  } else if (value.includes("library")) {
    location = "Library";
  } else if (value.includes("mess")) {
    location = "Main Mess";
  }

  /* ---------- ROOM ---------- */

  const roomMatch = value.match(
    /(?:room|rm)\s*([a-z]?\s*-?\s*\d{1,4})/i
  );

  const room = roomMatch
    ? roomMatch[1].replace(/\s+/g, "")
    : "Not detected";

  /* ---------- DURATION ---------- */

  const durationMatch = value.match(
    /(\d+)\s*(hour|hours|day|days|week|weeks)/
  );

  const duration = durationMatch
    ? `${durationMatch[1]} ${durationMatch[2]}`
    : "Not specified";

  /* ---------- PRIORITY ---------- */

  let priority = "Medium";

  if (
    value.includes("urgent") ||
    value.includes("emergency") ||
    value.includes("danger") ||
    value.includes("flood") ||
    value.includes("fire")
  ) {
    priority = "Critical";
  } else if (
    value.includes("4 days") ||
    value.includes("5 days") ||
    value.includes("week") ||
    value.includes("weeks") ||
    value.includes("cannot") ||
    value.includes("not working")
  ) {
    priority = "High";
  }

  return {
    type: "complaint",
    category,
    issue,
    location,
    room,
    priority,
    duration,
    department,
    action: `Route the complaint to ${department} for resolution.`,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AIComplaint() {
  const { language } = useLanguage();

  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [submittedType, setSubmittedType] = useState("");

  /* =======================================================
     TRANSLATIONS
  ======================================================= */

  const translations = {
    en: {
      aiAssistant: "CAMPY AI Assistant",
      campxAI: "CAMPX AI",
      meet: "Meet",
      yourCampusAssistant: "Your Campus AI Assistant",

      welcomeTitle: "Hi! I'm CAMPY 👋",
      welcomeText:
        "Tell me what you need in your own words. I can understand complaints and requests and route them to the right campus department.",

      tellCampy: "Tell CAMPY what you need",
      noComplicatedForms:
        "No complicated forms. Just describe your problem.",

      placeholder:
        "Example: The Wi-Fi has not been working in Hostel A Room 204 since morning...",

      try: "Try:",
      wifiProblem: "Wi-Fi problem",
      bonafideCertificate: "Bonafide certificate",
      timetable: "Timetable",

      askCampy: "Ask CAMPY",

      campyAnalysis: "CAMPY Analysis",
      detectedInformation: "AI-detected information",

      waitingMessage: "Waiting for your message",
      waitingDescription:
        "CAMPY will identify the type, category, priority and responsible department.",

      studentRequest: "Student Request",
      campusComplaint: "Campus Complaint",

      category: "Category",
      issue: "Issue",
      location: "Location",
      room: "Room",
      department: "Department",
      priority: "Priority",
      duration: "Duration",

      campyAction: "CAMPY Action",

      submitRequest: "Submit Request",
      submitComplaint: "Submit Complaint",

      requestSubmitted:
        "Request submitted successfully",
      complaintSubmitted:
        "Complaint submitted successfully",

      routedMessage:
        "CAMPY has analyzed your submission and routed it to the appropriate campus department.",

      requestId: "Request ID",
      complaintId: "Complaint ID",

      viewRequests: "View Requests",
      viewComplaints: "View Complaints",
      submitAnother: "Submit Another",

      notDetected: "Not detected",
      notSpecified: "Not specified",

      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    },

    hi: {
      aiAssistant: "CAMPY AI सहायक",
      campxAI: "CAMPX AI",
      meet: "मिलिए",
      yourCampusAssistant: "आपका कैंपस AI सहायक",

      welcomeTitle: "नमस्ते! मैं CAMPY हूँ 👋",
      welcomeText:
        "अपने शब्दों में बताएं कि आपको क्या चाहिए। मैं शिकायतों और अनुरोधों को समझकर उन्हें सही कैंपस विभाग तक भेज सकता हूँ।",

      tellCampy: "CAMPY को बताएं कि आपको क्या चाहिए",
      noComplicatedForms:
        "कोई जटिल फॉर्म नहीं। बस अपनी समस्या बताएं।",

      placeholder:
        "उदाहरण: सुबह से हॉस्टल A के कमरा 204 में Wi-Fi काम नहीं कर रहा है...",

      try: "कोशिश करें:",
      wifiProblem: "Wi-Fi समस्या",
      bonafideCertificate: "बोनाफाइड प्रमाणपत्र",
      timetable: "समय सारणी",

      askCampy: "CAMPY से पूछें",

      campyAnalysis: "CAMPY विश्लेषण",
      detectedInformation: "AI द्वारा पहचानी गई जानकारी",

      waitingMessage: "आपके संदेश की प्रतीक्षा है",
      waitingDescription:
        "CAMPY प्रकार, श्रेणी, प्राथमिकता और जिम्मेदार विभाग की पहचान करेगा।",

      studentRequest: "छात्र अनुरोध",
      campusComplaint: "कैंपस शिकायत",

      category: "श्रेणी",
      issue: "समस्या",
      location: "स्थान",
      room: "कमरा",
      department: "विभाग",
      priority: "प्राथमिकता",
      duration: "अवधि",

      campyAction: "CAMPY कार्रवाई",

      submitRequest: "अनुरोध भेजें",
      submitComplaint: "शिकायत भेजें",

      requestSubmitted:
        "अनुरोध सफलतापूर्वक भेज दिया गया",
      complaintSubmitted:
        "शिकायत सफलतापूर्वक भेज दी गई",

      routedMessage:
        "CAMPY ने आपके अनुरोध का विश्लेषण करके इसे संबंधित कैंपस विभाग को भेज दिया है।",

      requestId: "अनुरोध ID",
      complaintId: "शिकायत ID",

      viewRequests: "अनुरोध देखें",
      viewComplaints: "शिकायतें देखें",
      submitAnother: "एक और भेजें",

      notDetected: "पता नहीं चला",
      notSpecified: "निर्दिष्ट नहीं",

      low: "कम",
      medium: "मध्यम",
      high: "उच्च",
      critical: "अत्यावश्यक",
    },

    or: {
      aiAssistant: "CAMPY AI ସହାୟକ",
      campxAI: "CAMPX AI",
      meet: "ପରିଚିତ ହୁଅନ୍ତୁ",
      yourCampusAssistant: "ଆପଣଙ୍କ କ୍ୟାମ୍ପସ AI ସହାୟକ",

      welcomeTitle: "ନମସ୍କାର! ମୁଁ CAMPY 👋",
      welcomeText:
        "ଆପଣଙ୍କୁ କଣ ଦରକାର ନିଜ ଶବ୍ଦରେ କୁହନ୍ତୁ। ମୁଁ ଅଭିଯୋଗ ଏବଂ ଅନୁରୋଧ ବୁଝି ସଠିକ୍ କ୍ୟାମ୍ପସ ବିଭାଗକୁ ପଠାଇପାରିବି।",

      tellCampy: "CAMPYକୁ ଆପଣଙ୍କ ଆବଶ୍ୟକତା କୁହନ୍ତୁ",
      noComplicatedForms:
        "କୌଣସି ଜଟିଳ ଫର୍ମ ନାହିଁ। କେବଳ ଆପଣଙ୍କ ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ।",

      placeholder:
        "ଉଦାହରଣ: ସକାଳଠାରୁ ହଷ୍ଟେଲ A ରୁମ୍ 204 ରେ Wi-Fi କାମ କରୁନାହିଁ...",

      try: "ଚେଷ୍ଟା କରନ୍ତୁ:",
      wifiProblem: "Wi-Fi ସମସ୍ୟା",
      bonafideCertificate: "ବୋନାଫାଇଡ୍ ପ୍ରମାଣପତ୍ର",
      timetable: "ସମୟ ସାରଣୀ",

      askCampy: "CAMPYକୁ ପଚାରନ୍ତୁ",

      campyAnalysis: "CAMPY ବିଶ୍ଳେଷଣ",
      detectedInformation: "AI ଦ୍ୱାରା ଚିହ୍ନଟ ହୋଇଥିବା ସୂଚନା",

      waitingMessage: "ଆପଣଙ୍କ ବାର୍ତ୍ତା ପାଇଁ ଅପେକ୍ଷା କରାଯାଉଛି",
      waitingDescription:
        "CAMPY ପ୍ରକାର, ଶ୍ରେଣୀ, ପ୍ରାଥମିକତା ଏବଂ ଦାୟୀ ବିଭାଗ ଚିହ୍ନଟ କରିବ।",

      studentRequest: "ଛାତ୍ର ଅନୁରୋଧ",
      campusComplaint: "କ୍ୟାମ୍ପସ ଅଭିଯୋଗ",

      category: "ଶ୍ରେଣୀ",
      issue: "ସମସ୍ୟା",
      location: "ସ୍ଥାନ",
      room: "ରୁମ୍",
      department: "ବିଭାଗ",
      priority: "ପ୍ରାଥମିକତା",
      duration: "ଅବଧି",

      campyAction: "CAMPY କାର୍ଯ୍ୟ",

      submitRequest: "ଅନୁରୋଧ ପଠାନ୍ତୁ",
      submitComplaint: "ଅଭିଯୋଗ ପଠାନ୍ତୁ",

      requestSubmitted:
        "ଅନୁରୋଧ ସଫଳତାର ସହ ପଠାଯାଇଛି",
      complaintSubmitted:
        "ଅଭିଯୋଗ ସଫଳତାର ସହ ପଠାଯାଇଛି",

      routedMessage:
        "CAMPY ଆପଣଙ୍କ ଦାଖଲକୁ ବିଶ୍ଳେଷଣ କରି ଉପଯୁକ୍ତ କ୍ୟାମ୍ପସ ବିଭାଗକୁ ପଠାଇଛି।",

      requestId: "ଅନୁରୋଧ ID",
      complaintId: "ଅଭିଯୋଗ ID",

      viewRequests: "ଅନୁରୋଧ ଦେଖନ୍ତୁ",
      viewComplaints: "ଅଭିଯୋଗ ଦେଖନ୍ତୁ",
      submitAnother: "ଆଉ ଏକ ପଠାନ୍ତୁ",

      notDetected: "ଚିହ୍ନଟ ହୋଇନାହିଁ",
      notSpecified: "ନିର୍ଦ୍ଦିଷ୍ଟ ନୁହେଁ",

      low: "କମ୍",
      medium: "ମଧ୍ୟମ",
      high: "ଉଚ୍ଚ",
      critical: "ଗୁରୁତର",
    },
  };

  const t = translations[language] || translations.en;

  /* =======================================================
     TRANSLATE ANALYSIS VALUES FOR DISPLAY
  ======================================================= */

  const translateValue = (value) => {
    if (!value) return "";

    const map = {
      "Not detected": t.notDetected,
      "Not specified": t.notSpecified,

      Low: t.low,
      Medium: t.medium,
      High: t.high,
      Critical: t.critical,

      "Academic Services":
        language === "hi"
          ? "शैक्षणिक सेवाएं"
          : language === "or"
          ? "ଶିକ୍ଷା ସେବା"
          : "Academic Services",

      "Timetable Request":
        language === "hi"
          ? "समय सारणी अनुरोध"
          : language === "or"
          ? "ସମୟ ସାରଣୀ ଅନୁରୋଧ"
          : "Timetable Request",

      "Academic Block":
        language === "hi"
          ? "शैक्षणिक ब्लॉक"
          : language === "or"
          ? "ଶିକ୍ଷା ବ୍ଲକ୍"
          : "Academic Block",

      "Student Services":
        language === "hi"
          ? "छात्र सेवाएं"
          : language === "or"
          ? "ଛାତ୍ର ସେବା"
          : "Student Services",

      "Document / Certificate Request":
        language === "hi"
          ? "दस्तावेज़ / प्रमाणपत्र अनुरोध"
          : language === "or"
          ? "ଦସ୍ତାବିଜ / ପ୍ରମାଣପତ୍ର ଅନୁରୋଧ"
          : "Document / Certificate Request",

      "Administration Office":
        language === "hi"
          ? "प्रशासन कार्यालय"
          : language === "or"
          ? "ପ୍ରଶାସନ କାର୍ଯ୍ୟାଳୟ"
          : "Administration Office",

      "Student Administration":
        language === "hi"
          ? "छात्र प्रशासन"
          : language === "or"
          ? "ଛାତ୍ର ପ୍ରଶାସନ"
          : "Student Administration",

      "General Campus":
        language === "hi"
          ? "सामान्य कैंपस"
          : language === "or"
          ? "ସାଧାରଣ କ୍ୟାମ୍ପସ"
          : "General Campus",

      "General Complaint":
        language === "hi"
          ? "सामान्य शिकायत"
          : language === "or"
          ? "ସାଧାରଣ ଅଭିଯୋଗ"
          : "General Complaint",

      "Hostel Maintenance":
        language === "hi"
          ? "हॉस्टल रखरखाव"
          : language === "or"
          ? "ହଷ୍ଟେଲ ରକ୍ଷଣାବେକ୍ଷଣ"
          : "Hostel Maintenance",

      "Water / Plumbing Issue":
        language === "hi"
          ? "पानी / प्लंबिंग समस्या"
          : language === "or"
          ? "ପାଣି / ପ୍ଲମ୍ବିଂ ସମସ୍ୟା"
          : "Water / Plumbing Issue",

      Maintenance:
        language === "hi"
          ? "रखरखाव"
          : language === "or"
          ? "ରକ୍ଷଣାବେକ୍ଷଣ"
          : "Maintenance",

      "IT Support":
        language === "hi"
          ? "IT सहायता"
          : language === "or"
          ? "IT ସହାୟତା"
          : "IT Support",

      "Internet / Wi-Fi Issue":
        language === "hi"
          ? "इंटरनेट / Wi-Fi समस्या"
          : language === "or"
          ? "ଇଣ୍ଟରନେଟ୍ / Wi-Fi ସମସ୍ୟା"
          : "Internet / Wi-Fi Issue",

      "Mess & Food":
        language === "hi"
          ? "मेस और भोजन"
          : language === "or"
          ? "ମେସ୍ ଏବଂ ଖାଦ୍ୟ"
          : "Mess & Food",

      "Mess / Food Issue":
        language === "hi"
          ? "मेस / भोजन समस्या"
          : language === "or"
          ? "ମେସ୍ / ଖାଦ୍ୟ ସମସ୍ୟା"
          : "Mess / Food Issue",

      "Mess Management":
        language === "hi"
          ? "मेस प्रबंधन"
          : language === "or"
          ? "ମେସ୍ ପରିଚାଳନା"
          : "Mess Management",

      "Electrical Maintenance":
        language === "hi"
          ? "विद्युत रखरखाव"
          : language === "or"
          ? "ବିଦ୍ୟୁତ ରକ୍ଷଣାବେକ୍ଷଣ"
          : "Electrical Maintenance",

      "Electrical Issue":
        language === "hi"
          ? "विद्युत समस्या"
          : language === "or"
          ? "ବିଦ୍ୟୁତ ସମସ୍ୟା"
          : "Electrical Issue",

      "Cleanliness":
        language === "hi"
          ? "स्वच्छता"
          : language === "or"
          ? "ପରିଷ୍କାର ପରିଚ୍ଛନ୍ନତା"
          : "Cleanliness",

      "Cleanliness Issue":
        language === "hi"
          ? "स्वच्छता समस्या"
          : language === "or"
          ? "ପରିଷ୍କାର ସମସ୍ୟା"
          : "Cleanliness Issue",

      Housekeeping:
        language === "hi"
          ? "हाउसकीपिंग"
          : language === "or"
          ? "ହାଉସକିପିଂ"
          : "Housekeeping",

      "Campus Administration":
        language === "hi"
          ? "कैंपस प्रशासन"
          : language === "or"
          ? "କ୍ୟାମ୍ପସ ପ୍ରଶାସନ"
          : "Campus Administration",

      "Hostel A":
        language === "hi"
          ? "हॉस्टल A"
          : language === "or"
          ? "ହଷ୍ଟେଲ A"
          : "Hostel A",

      "Hostel B":
        language === "hi"
          ? "हॉस्टल B"
          : language === "or"
          ? "ହଷ୍ଟେଲ B"
          : "Hostel B",

      Hostel:
        language === "hi"
          ? "हॉस्टल"
          : language === "or"
          ? "ହଷ୍ଟେଲ"
          : "Hostel",

      Library:
        language === "hi"
          ? "पुस्तकालय"
          : language === "or"
          ? "ଲାଇବ୍ରେରୀ"
          : "Library",

      "Main Mess":
        language === "hi"
          ? "मुख्य मेस"
          : language === "or"
          ? "ମୁଖ୍ୟ ମେସ୍"
          : "Main Mess",
    };

    return map[value] || value;
  };

  /* =======================================================
     HANDLE ANALYZE
  ======================================================= */

  const handleAnalyze = () => {
    if (!text.trim()) return;

    const result = analyzeComplaint(text.trim());

    setAnalysis(result);
  };

  /* =======================================================
     HANDLE SUBMIT
  ======================================================= */

  const handleSubmit = () => {
    if (!analysis || !text.trim()) return;

    const now = new Date().toISOString();

    /* =====================================================
       REQUEST
    ===================================================== */

    if (analysis.type === "request") {
      const newRequest = {
        id: `REQ-${Date.now()}`,
        studentName: getCurrentStudent().name,
        studentId: getCurrentStudent().id,
        type: analysis.issue,
        purpose: text.trim(),
        category: analysis.category,
        department: analysis.department,
        status: "Submitted",
        createdAt: now,
      };

      const existing = JSON.parse(
        localStorage.getItem(REQUESTS_KEY) || "[]"
      );

      localStorage.setItem(
        REQUESTS_KEY,
        JSON.stringify([newRequest, ...existing])
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

      window.dispatchEvent(
        new Event("campx-request-updated")
      );

      setSubmittedId(newRequest.id);
      setSubmittedType("request");
      setSubmitted(true);

      return;
    }

    /* =====================================================
       COMPLAINT
    ===================================================== */

    const newComplaint = {
      id: `CMP-${Date.now()}`,
      studentName: getCurrentStudent().name,
      studentId: getCurrentStudent().id,

      complaint: text.trim(),
      description: text.trim(),

      category: analysis.category,
      issue: analysis.issue,
      location: analysis.location,
      room: analysis.room,

      priority: analysis.priority,
      duration: analysis.duration,
      department: analysis.department,

      status: "Submitted",

      createdAt: now,
      updatedAt: now,
    };

    const existing = JSON.parse(
      localStorage.getItem(COMPLAINTS_KEY) || "[]"
    );

    localStorage.setItem(
      COMPLAINTS_KEY,
      JSON.stringify([newComplaint, ...existing])
    );

    addNotification({
      audience: "admin",
      type: "complaint",
      title: "New AI Complaint",
      message: `${newComplaint.studentName} submitted a ${newComplaint.issue} complaint.`,
      studentId: newComplaint.studentId,
      relatedId: newComplaint.id,
      status: "Submitted",
    });

    window.dispatchEvent(
      new Event("campx-complaint-updated")
    );

    setSubmittedId(newComplaint.id);
    setSubmittedType("complaint");
    setSubmitted(true);
  };

  /* =====================================================
     SUCCESS SCREEN
  ===================================================== */

  if (submitted) {
    const isRequest = submittedType === "request";

    return (
      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <Topbar title={t.aiAssistant} />

          <div className="content">

            <div className="ai-success-card">

              <div className="success-icon">
                <CheckCircle2 size={42} />
              </div>

              <p className="eyebrow">
                {t.campxAI}
              </p>

              <h1>
                {isRequest
                  ? t.requestSubmitted
                  : t.complaintSubmitted}
              </h1>

              <p>
                {t.routedMessage}
              </p>

              <div className="success-id">

                <span>
                  {isRequest
                    ? t.requestId
                    : t.complaintId}
                </span>

                <strong>
                  {submittedId}
                </strong>

              </div>

              <div className="success-actions">

                <Link
                  to={
                    isRequest
                      ? "/requests"
                      : "/complaints"
                  }
                  className="primary-btn"
                >
                  {isRequest
                    ? t.viewRequests
                    : t.viewComplaints}

                  <ArrowRight size={17} />
                </Link>

                <button
                  className="secondary-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setText("");
                    setAnalysis(null);
                    setSubmittedId("");
                    setSubmittedType("");
                  }}
                >
                  {t.submitAnother}
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>
    );
  }

  /* =====================================================
     MAIN SCREEN
  ===================================================== */

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Topbar title={t.aiAssistant} />

        <div className="content">

          {/* ==========================================
              CAMPY HEADER
          ========================================== */}

          <section className="ai-assistant-header">

            <div className="ai-avatar">
              <Bot size={32} />
            </div>

            <div>

              <p className="eyebrow">
                {t.campxAI}
              </p>

              <h1>
                {t.meet} <span>CAMPY</span>
              </h1>

              <p>
                {t.yourCampusAssistant}
              </p>

            </div>

          </section>


          {/* ==========================================
              WELCOME CARD
          ========================================== */}

          <section className="campy-welcome-card">

            <div className="campy-welcome-icon">
              <Sparkles size={23} />
            </div>

            <div>

              <h3>
                {t.welcomeTitle}
              </h3>

              <p>
                {t.welcomeText}
              </p>

            </div>

          </section>


          {/* ==========================================
              MAIN AI LAYOUT
          ========================================== */}

          <section className="ai-complaint-layout">

            {/* ========================================
                LEFT PANEL
            ======================================== */}

            <div className="panel">

              <div className="panel-header">

                <div>

                  <h3>
                    {t.tellCampy}
                  </h3>

                  <p>
                    {t.noComplicatedForms}
                  </p>

                </div>

                <Bot size={21} />

              </div>


              {/* TEXTAREA */}

              <textarea
                className="ai-textarea"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setAnalysis(null);
                }}
                placeholder={t.placeholder}
              />


              {/* EXAMPLES */}

              <div className="ai-examples">

                <span>
                  {t.try}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setText(
                      "The Wi-Fi has not been working in Hostel A Room 204 since morning."
                    )
                  }
                >
                  {t.wifiProblem}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setText(
                      "I need a bonafide certificate for my internship."
                    )
                  }
                >
                  {t.bonafideCertificate}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setText(
                      "Show me my class timetable for tomorrow."
                    )
                  }
                >
                  {t.timetable}
                </button>

              </div>


              {/* ASK CAMPY */}

              <button
                type="button"
                className="primary-btn ai-analyze-btn"
                onClick={handleAnalyze}
                disabled={!text.trim()}
              >

                <Send size={17} />

                {t.askCampy}

              </button>

            </div>


            {/* ========================================
                RIGHT PANEL
            ======================================== */}

            <div className="panel">

              <div className="panel-header">

                <div>

                  <h3>
                    {t.campyAnalysis}
                  </h3>

                  <p>
                    {t.detectedInformation}
                  </p>

                </div>

                <Sparkles size={20} />

              </div>


              {!analysis ? (

                /* ====================================
                   EMPTY STATE
                ==================================== */

                <div className="ai-empty">

                  <Bot size={42} />

                  <h3>
                    {t.waitingMessage}
                  </h3>

                  <p>
                    {t.waitingDescription}
                  </p>

                </div>

              ) : (

                /* ====================================
                   ANALYSIS
                ==================================== */

                <div className="ai-analysis">

                  {/* TYPE */}

                  <div className="analysis-type">

                    {analysis.type === "request" ? (
                      <FileText size={19} />
                    ) : (
                      <Wrench size={19} />
                    )}

                    <strong>
                      {analysis.type === "request"
                        ? t.studentRequest
                        : t.campusComplaint}
                    </strong>

                  </div>


                  {/* CATEGORY */}

                  <AnalysisRow
                    label={t.category}
                    value={translateValue(
                      analysis.category
                    )}
                  />


                  {/* ISSUE */}

                  <AnalysisRow
                    label={t.issue}
                    value={translateValue(
                      analysis.issue
                    )}
                  />


                  {/* LOCATION */}

                  <AnalysisRow
                    label={t.location}
                    value={translateValue(
                      analysis.location
                    )}
                  />


                  {/* ROOM */}

                  <AnalysisRow
                    label={t.room}
                    value={translateValue(
                      analysis.room
                    )}
                  />


                  {/* DEPARTMENT */}

                  <AnalysisRow
                    label={t.department}
                    value={translateValue(
                      analysis.department
                    )}
                  />


                  {/* PRIORITY + DURATION */}

                  {analysis.type === "complaint" && (
                    <>
                      <AnalysisRow
                        label={t.priority}
                        value={translateValue(
                          analysis.priority
                        )}
                        priority
                        priorityValue={
                          analysis.priority
                        }
                      />

                      <AnalysisRow
                        label={t.duration}
                        value={
                          translateValue(
                            analysis.duration
                          )
                        }
                      />
                    </>
                  )}


                  {/* CAMPY ACTION */}

                  <div className="ai-action-box">

                    <AlertTriangle size={17} />

                    <div>

                      <strong>
                        {t.campyAction}
                      </strong>

                      <p>
                        {language === "hi"
                          ? `समस्या को ${translateValue(
                              analysis.department
                            )} विभाग को समाधान के लिए भेजें।`
                          : language === "or"
                          ? `${translateValue(
                              analysis.department
                            )} ବିଭାଗକୁ ସମାଧାନ ପାଇଁ ଅଭିଯୋଗ ପଠାନ୍ତୁ।`
                          : analysis.action}
                      </p>

                    </div>

                  </div>


                  {/* SUBMIT */}

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={handleSubmit}
                  >

                    <CheckCircle2 size={17} />

                    {analysis.type === "request"
                      ? t.submitRequest
                      : t.submitComplaint}

                  </button>

                </div>

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   ANALYSIS ROW
========================================================= */

function AnalysisRow({
  label,
  value,
  priority = false,
  priorityValue = "",
}) {
  return (
    <div className="analysis-row">

      <span>
        {label}
      </span>

      <strong
        className={
          priority
            ? `analysis-priority ${String(
                priorityValue || value
              ).toLowerCase()}`
            : ""
        }
      >
        {value}
      </strong>

    </div>
  );
}