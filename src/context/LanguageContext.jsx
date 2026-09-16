import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    dashboard: "Dashboard",
    overview: "Overview",
    students: "Students",
    addStudents: "Add Students",
    addAdmin: "Add Admin",
    admins: "Admins",
    complaints: "Complaints",
    requests: "Requests",
    applications: "Applications",
    attendance: "Attendance",
    academicControl: "Academic Control",
    notifications: "Notifications",
    gatePass: "Gate Pass",
    hostel: "Hostel",
    canteen: "Canteen",
    library: "Library",
    transport: "Transport",
    placement: "Placement",
    accounts: "Accounts",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    search: "Search CampX...",
    aiAssistant: "AI Assistant",
    timetable: "Timetable",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    odia: "Odia",
    superAdminPortal: "Super Admin Portal",
    adminPortal: "Admin Portal",
    studentPortal: "Student Portal",
  },

  hi: {
    dashboard: "डैशबोर्ड",
    overview: "अवलोकन",
    students: "छात्र",
    addStudents: "छात्र जोड़ें",
    addAdmin: "एडमिन जोड़ें",
    admins: "एडमिन",
    complaints: "शिकायतें",
    requests: "अनुरोध",
    applications: "आवेदन",
    attendance: "उपस्थिति",
    academicControl: "शैक्षणिक नियंत्रण",
    notifications: "सूचनाएँ",
    gatePass: "गेट पास",
    hostel: "छात्रावास",
    canteen: "कैंटीन",
    library: "पुस्तकालय",
    transport: "परिवहन",
    placement: "प्लेसमेंट",
    accounts: "लेखा",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    search: "CampX खोजें...",
    aiAssistant: "AI सहायक",
    timetable: "समय सारणी",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    odia: "ओड़िया",
    superAdminPortal: "सुपर एडमिन पोर्टल",
    adminPortal: "एडमिन पोर्टल",
    studentPortal: "छात्र पोर्टल",
  },

  or: {
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    overview: "ସମୀକ୍ଷା",
    students: "ଛାତ୍ରଛାତ୍ରୀ",
    addStudents: "ଛାତ୍ରଛାତ୍ରୀ ଯୋଡନ୍ତୁ",
    addAdmin: "ଆଡମିନ୍ ଯୋଡନ୍ତୁ",
    admins: "ଆଡମିନ୍",
    complaints: "ଅଭିଯୋଗ",
    requests: "ଅନୁରୋଧ",
    applications: "ଆବେଦନ",
    attendance: "ଉପସ୍ଥାନ",
    academicControl: "ଶିକ୍ଷାଗତ ନିୟନ୍ତ୍ରଣ",
    notifications: "ବିଜ୍ଞପ୍ତି",
    gatePass: "ଗେଟ୍ ପାସ୍",
    hostel: "ଛାତ୍ରାବାସ",
    canteen: "କ୍ୟାଣ୍ଟିନ୍",
    library: "ପାଠାଗାର",
    transport: "ପରିବହନ",
    placement: "ପ୍ଲେସମେଣ୍ଟ",
    accounts: "ଆକାଉଣ୍ଟସ୍",
    profile: "ପ୍ରୋଫାଇଲ୍",
    settings: "ସେଟିଂସ୍",
    logout: "ଲଗ୍ ଆଉଟ୍",
    search: "CampX ଖୋଜନ୍ତୁ...",
    aiAssistant: "AI ସହାୟକ",
    timetable: "ସମୟ ସାରଣୀ",
    language: "ଭାଷା",
    english: "ଇଂରାଜୀ",
    hindi: "ହିନ୍ଦୀ",
    odia: "ଓଡ଼ିଆ",
    superAdminPortal: "ସୁପର ଆଡମିନ୍ ପୋର୍ଟାଲ୍",
    adminPortal: "ଆଡମିନ୍ ପୋର୍ଟାଲ୍",
    studentPortal: "ଛାତ୍ର ପୋର୍ଟାଲ୍",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("campx_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("campx_language", language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}

export default LanguageContext;