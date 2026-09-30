import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Clock,
  Coffee,
  Sun,
  Cookie,
  Moon,
  ArrowLeft,
  RefreshCw,
  Star,
  MessageSquare,
  Send,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

export default function Canteen() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FEEDBACK STATES
  // ============================================

  const [feedbackRating, setFeedbackRating] =
    useState(0);

  const [feedbackMeal, setFeedbackMeal] =
    useState("BREAKFAST");

  const [feedbackComment, setFeedbackComment] =
    useState("");

  const [feedbackSubmitted, setFeedbackSubmitted] =
    useState(false);

  const [feedbackError, setFeedbackError] =
    useState("");

  const storedUser =
    localStorage.getItem("campx_user");

  let user = {};

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : {};
  } catch (err) {
    console.error(
      "Invalid CAMPX user data:",
      err
    );
  }

  // ============================================
  // TRANSLATIONS
  // ============================================

  const translations = {
    en: {
      canteenAccess: "Canteen Access",
      hostelOnly:
        "Canteen services are available only for hostel students.",
      backDashboard: "Back to Dashboard",

      todaysMenu: "Today's Menu",
      campusCanteen: "Campus Canteen",
      student: "Student",
      hosteller: "Hosteller",

      menuUpdated:
        "Menu is updated by the administration.",
      refreshMenu: "Refresh menu",

      canteenTimings: "Canteen Timings",
      breakfast: "Breakfast",
      lunch: "Lunch",
      eveningSnacks: "Evening Snacks",
      dinner: "Dinner",

      retry: "Retry",
      loadingMenu:
        "Loading today's menu...",
      noMenu:
        "No menu available for this meal.",

      canteenInformation:
        "Canteen Information",
      informationText:
        "Today's menu is managed by the administration. Menu items may change depending on availability.",

      unableToLoad:
        "Unable to load today's menu. Please try again.",

      // Feedback
      feedbackTitle:
        "Canteen Feedback",
      feedbackSubtitle:
        "Share your experience with today's canteen food.",
      yourRating:
        "Your Rating",
      selectRating:
        "Please select a rating",
      meal:
        "Meal",
      selectMeal:
        "Select Meal",
      feedbackComment:
        "Your Feedback",
      feedbackPlaceholder:
        "Tell us about the food, taste, quality, quantity or service...",
      submitFeedback:
        "Submit Feedback",
      feedbackSubmitted:
        "Thank you! Your feedback has been submitted.",
      feedbackRequired:
        "Please give a rating and select a meal.",
      feedbackAlready:
        "You have already submitted feedback for this meal today.",
      fiveStar:
        "Excellent",
      fourStar:
        "Very Good",
      threeStar:
        "Good",
      twoStar:
        "Needs Improvement",
      oneStar:
        "Poor",
    },

    hi: {
      canteenAccess:
        "कैंटीन सुविधा",
      hostelOnly:
        "कैंटीन की सुविधा केवल हॉस्टल छात्रों के लिए उपलब्ध है।",
      backDashboard:
        "डैशबोर्ड पर वापस जाएं",

      todaysMenu:
        "आज का मेनू",
      campusCanteen:
        "कैंपस कैंटीन",
      student:
        "छात्र",
      hosteller:
        "हॉस्टल छात्र",

      menuUpdated:
        "मेनू प्रशासन द्वारा अपडेट किया जाता है।",
      refreshMenu:
        "मेनू रीफ्रेश करें",

      canteenTimings:
        "कैंटीन का समय",
      breakfast:
        "नाश्ता",
      lunch:
        "दोपहर का भोजन",
      eveningSnacks:
        "शाम का नाश्ता",
      dinner:
        "रात का खाना",

      retry:
        "पुनः प्रयास करें",
      loadingMenu:
        "आज का मेनू लोड हो रहा है...",
      noMenu:
        "इस भोजन के लिए कोई मेनू उपलब्ध नहीं है।",

      canteenInformation:
        "कैंटीन जानकारी",
      informationText:
        "आज का मेनू प्रशासन द्वारा प्रबंधित किया जाता है। उपलब्धता के अनुसार मेनू आइटम बदल सकते हैं।",

      unableToLoad:
        "आज का मेनू लोड नहीं हो सका। कृपया पुनः प्रयास करें।",

      // Feedback
      feedbackTitle:
        "कैंटीन प्रतिक्रिया",
      feedbackSubtitle:
        "आज के कैंटीन भोजन के बारे में अपना अनुभव साझा करें।",
      yourRating:
        "आपकी रेटिंग",
      selectRating:
        "कृपया रेटिंग चुनें",
      meal:
        "भोजन",
      selectMeal:
        "भोजन चुनें",
      feedbackComment:
        "आपकी प्रतिक्रिया",
      feedbackPlaceholder:
        "भोजन, स्वाद, गुणवत्ता, मात्रा या सेवा के बारे में बताएं...",
      submitFeedback:
        "प्रतिक्रिया जमा करें",
      feedbackSubmitted:
        "धन्यवाद! आपकी प्रतिक्रिया जमा हो गई है।",
      feedbackRequired:
        "कृपया रेटिंग दें और भोजन चुनें।",
      feedbackAlready:
        "आपने आज इस भोजन के लिए पहले ही प्रतिक्रिया दी है।",
      fiveStar:
        "बहुत अच्छा",
      fourStar:
        "अच्छा",
      threeStar:
        "संतोषजनक",
      twoStar:
        "सुधार की आवश्यकता",
      oneStar:
        "खराब",
    },

    or: {
      canteenAccess:
        "କ୍ୟାଣ୍ଟିନ୍ ସୁବିଧା",
      hostelOnly:
        "କ୍ୟାଣ୍ଟିନ୍ ସୁବିଧା କେବଳ ହଷ୍ଟେଲ୍ ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ଉପଲବ୍ଧ।",
      backDashboard:
        "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",

      todaysMenu:
        "ଆଜିର ମେନୁ",
      campusCanteen:
        "କ୍ୟାମ୍ପସ୍ କ୍ୟାଣ୍ଟିନ୍",
      student:
        "ଛାତ୍ର",
      hosteller:
        "ହଷ୍ଟେଲ୍ ଛାତ୍ର",

      menuUpdated:
        "ମେନୁ ପ୍ରଶାସନ ଦ୍ୱାରା ଅପଡେଟ୍ କରାଯାଏ।",
      refreshMenu:
        "ମେନୁ ରିଫ୍ରେଶ୍ କରନ୍ତୁ",

      canteenTimings:
        "କ୍ୟାଣ୍ଟିନ୍ ସମୟ",
      breakfast:
        "ଜଳଖିଆ",
      lunch:
        "ମଧ୍ୟାହ୍ନ ଭୋଜନ",
      eveningSnacks:
        "ସନ୍ଧ୍ୟା ଜଳଖିଆ",
      dinner:
        "ରାତ୍ରି ଭୋଜନ",

      retry:
        "ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ",
      loadingMenu:
        "ଆଜିର ମେନୁ ଲୋଡ୍ ହେଉଛି...",
      noMenu:
        "ଏହି ଭୋଜନ ପାଇଁ କୌଣସି ମେନୁ ଉପଲବ୍ଧ ନାହିଁ।",

      canteenInformation:
        "କ୍ୟାଣ୍ଟିନ୍ ସୂଚନା",
      informationText:
        "ଆଜିର ମେନୁ ପ୍ରଶାସନ ଦ୍ୱାରା ପରିଚାଳିତ ହୁଏ। ଉପଲବ୍ଧତା ଅନୁଯାୟୀ ମେନୁ ଆଇଟମ୍ ବଦଳିପାରେ।",

      unableToLoad:
        "ଆଜିର ମେନୁ ଲୋଡ୍ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ।",

      // Feedback
      feedbackTitle:
        "କ୍ୟାଣ୍ଟିନ୍ ପ୍ରତିକ୍ରିୟା",
      feedbackSubtitle:
        "ଆଜିର କ୍ୟାଣ୍ଟିନ୍ ଖାଦ୍ୟ ବିଷୟରେ ଆପଣଙ୍କ ଅନୁଭୂତି ଜଣାନ୍ତୁ।",
      yourRating:
        "ଆପଣଙ୍କ ରେଟିଂ",
      selectRating:
        "ଦୟାକରି ରେଟିଂ ଚୟନ କରନ୍ତୁ",
      meal:
        "ଭୋଜନ",
      selectMeal:
        "ଭୋଜନ ଚୟନ କରନ୍ତୁ",
      feedbackComment:
        "ଆପଣଙ୍କ ପ୍ରତିକ୍ରିୟା",
      feedbackPlaceholder:
        "ଖାଦ୍ୟ, ସ୍ୱାଦ, ଗୁଣବତ୍ତା, ପରିମାଣ କିମ୍ବା ସେବା ବିଷୟରେ ଲେଖନ୍ତୁ...",
      submitFeedback:
        "ପ୍ରତିକ୍ରିୟା ଦାଖଲ କରନ୍ତୁ",
      feedbackSubmitted:
        "ଧନ୍ୟବାଦ! ଆପଣଙ୍କ ପ୍ରତିକ୍ରିୟା ଦାଖଲ ହୋଇଛି।",
      feedbackRequired:
        "ଦୟାକରି ରେଟିଂ ଦିଅନ୍ତୁ ଏବଂ ଭୋଜନ ଚୟନ କରନ୍ତୁ।",
      feedbackAlready:
        "ଆପଣ ଆଜି ଏହି ଭୋଜନ ପାଇଁ ପୂର୍ବରୁ ପ୍ରତିକ୍ରିୟା ଦେଇଛନ୍ତି।",
      fiveStar:
        "ଅତ୍ୟନ୍ତ ଭଲ",
      fourStar:
        "ବହୁତ ଭଲ",
      threeStar:
        "ଭଲ",
      twoStar:
        "ଉନ୍ନତି ଆବଶ୍ୟକ",
      oneStar:
        "ଖରାପ",
    },
  };

  const t =
    translations[language] ||
    translations.en;

  // ============================================
  // HOSTELLER CHECK
  // ============================================

  const isHosteller =
    user?.hostelStatus === "HOSTELLER" ||
    user?.hostel_status === "HOSTELLER";

  // ============================================
  // CANTEEN TIMINGS
  // ============================================

  const canteenTimings = [
    {
      key: "breakfast",
      title: t.breakfast,
      time: "7:30 AM - 9:00 AM",
      icon: Coffee,
    },
    {
      key: "lunch",
      title: t.lunch,
      time: "12:30 PM - 2:30 PM",
      icon: Sun,
    },
    {
      key: "eveningSnacks",
      title: t.eveningSnacks,
      time: "4:30 PM - 6:00 PM",
      icon: Cookie,
    },
    {
      key: "dinner",
      title: t.dinner,
      time: "7:30 PM - 9:30 PM",
      icon: Moon,
    },
  ];

  // ============================================
  // MEAL ICONS
  // ============================================

  const mealIcons = {
    BREAKFAST: Coffee,
    LUNCH: Sun,
    SNACKS: Cookie,
    DINNER: Moon,
  };

  // ============================================
  // MEAL TITLES
  // ============================================

  const mealTitles = {
    BREAKFAST: t.breakfast,
    LUNCH: t.lunch,
    SNACKS: t.eveningSnacks,
    DINNER: t.dinner,
  };

  // ============================================
  // MEAL TIMINGS
  // ============================================

  const mealTimes = {
    BREAKFAST: "7:30 AM - 9:00 AM",
    LUNCH: "12:30 PM - 2:30 PM",
    SNACKS: "4:30 PM - 6:00 PM",
    DINNER: "7:30 PM - 9:30 PM",
  };

  // ============================================
  // FETCH TODAY'S MENU
  // ============================================

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "/api";

      const response = await fetch(
        `${API_URL}/canteen/today`
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load today's menu"
        );
      }

      setMenu(data.menu || []);
    } catch (err) {
      console.error(
        "Canteen menu error:",
        err
      );

      setError(
        t.unableToLoad
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOAD MENU
  // ============================================

  useEffect(() => {
    if (isHosteller) {
      fetchMenu();
    } else {
      setLoading(false);
    }
  }, [isHosteller]);

  // ============================================
  // UPDATE ERROR MESSAGE
  // ============================================

  useEffect(() => {
    if (error) {
      setError(t.unableToLoad);
    }
  }, [language]);

  // ============================================
  // GROUP MENU
  // ============================================

  const groupedMenu = {
    BREAKFAST: [],
    LUNCH: [],
    SNACKS: [],
    DINNER: [],
  };

  menu.forEach((item) => {
    if (
      groupedMenu[item.meal_type]
    ) {
      groupedMenu[
        item.meal_type
      ].push(item);
    }
  });

  // ============================================
  // SUBMIT FEEDBACK
  // ============================================

  const submitFeedback = () => {
    setFeedbackError("");
    setFeedbackSubmitted(false);

    if (
      feedbackRating === 0 ||
      !feedbackMeal
    ) {
      setFeedbackError(
        t.feedbackRequired
      );
      return;
    }

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const existingFeedback =
      JSON.parse(
        localStorage.getItem(
          "campx_canteen_feedback"
        ) || "[]"
      );

    const studentId =
      user?.registrationNumber ||
      user?.registration_no ||
      user?.regdNo ||
      user?.reg_no ||
      user?.studentId ||
      "student";

    const alreadySubmitted =
      existingFeedback.some(
        (item) =>
          item.registrationNo ===
            studentId &&
          item.meal ===
            feedbackMeal &&
          item.date === today
      );

    if (alreadySubmitted) {
      setFeedbackError(
        t.feedbackAlready
      );
      return;
    }

    const newFeedback = {
      id: Date.now(),
      studentName:
        user?.name ||
        user?.studentName ||
        t.student,
      registrationNo:
        studentId,
      meal: feedbackMeal,
      rating: feedbackRating,
      comment:
        feedbackComment.trim(),
      date: today,
      createdAt:
        new Date().toISOString(),
    };

    const updatedFeedback = [
      ...existingFeedback,
      newFeedback,
    ];

    localStorage.setItem(
      "campx_canteen_feedback",
      JSON.stringify(
        updatedFeedback
      )
    );

    setFeedbackRating(0);
    setFeedbackComment("");
    setFeedbackSubmitted(true);
  };

  // ============================================
  // RATING TEXT
  // ============================================

  const getRatingText = () => {
    if (feedbackRating === 5)
      return t.fiveStar;

    if (feedbackRating === 4)
      return t.fourStar;

    if (feedbackRating === 3)
      return t.threeStar;

    if (feedbackRating === 2)
      return t.twoStar;

    if (feedbackRating === 1)
      return t.oneStar;

    return "";
  };

  // ============================================
  // NON-HOSTELLER
  // ============================================

  if (!isHosteller) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Topbar />

          <div className="canteen-access-denied">

            <div className="access-denied-icon">
              🏠
            </div>

            <h2>
              {t.canteenAccess}
            </h2>

            <p>
              {t.hostelOnly}
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/student")
              }
            >
              <ArrowLeft size={18} />

              {t.backDashboard}
            </button>

          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // MAIN PAGE
  // ============================================

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Topbar />

        <div className="canteen-page">

          {/* ====================================
              HEADER
          ==================================== */}

          <div className="canteen-header">

            <div className="canteen-title-row">

              <div className="canteen-icon">
                <Utensils size={26} />
              </div>

              <div>

                <h1>
                  {t.todaysMenu}
                </h1>

                <p>
                  {t.campusCanteen}
                </p>

              </div>

            </div>

            <div className="canteen-student-info">

              <span>
                {t.student}
              </span>

              <strong>
                {user?.name ||
                  t.student}
              </strong>

              <small>
                {user?.hostel ||
                  t.hosteller}
              </small>

            </div>

          </div>

          {/* ====================================
              TODAY BANNER
          ==================================== */}

          <div className="today-menu-banner">

            <div className="today-menu-icon">
              <Utensils size={20} />
            </div>

            <div>

              <strong>
                {t.todaysMenu}
              </strong>

              <p>
                {t.menuUpdated}
              </p>

            </div>

            <button
              type="button"
              className="canteen-refresh-btn"
              onClick={fetchMenu}
              title={t.refreshMenu}
              aria-label={
                t.refreshMenu
              }
            >
              <RefreshCw size={17} />
            </button>

          </div>

          {/* ====================================
              CANTEEN TIMINGS
          ==================================== */}

          <div className="canteen-timing-card">

            <div className="timing-icon">
              <Clock size={22} />
            </div>

            <div className="timing-content">

              <h2>
                {t.canteenTimings}
              </h2>

              <div className="timing-list">

                {canteenTimings.map(
                  (timing) => {

                    const Icon =
                      timing.icon;

                    return (
                      <div
                        key={
                          timing.key
                        }
                      >

                        <span className="timing-meal">

                          <Icon size={14} />

                          {timing.title}

                        </span>

                        <strong>
                          {timing.time}
                        </strong>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </div>

          {/* ====================================
              ERROR
          ==================================== */}

          {error && (
            <div className="canteen-error">

              <span>
                {error}
              </span>

              <button
                onClick={fetchMenu}
              >
                {t.retry}
              </button>

            </div>
          )}

          {/* ====================================
              LOADING
          ==================================== */}

          {loading ? (

            <div className="canteen-loading">

              <RefreshCw
                size={24}
                className="canteen-loading-icon"
              />

              <p>
                {t.loadingMenu}
              </p>

            </div>

          ) : (

            <div className="canteen-menu-grid">

              {Object.entries(
                groupedMenu
              ).map(
                ([mealType, items]) => {

                  const Icon =
                    mealIcons[
                      mealType
                    ];

                  return (
                    <div
                      className="canteen-meal-card"
                      key={
                        mealType
                      }
                    >

                      <div className="meal-card-header">

                        <div className="meal-icon">

                          {Icon && (
                            <Icon size={22} />
                          )}

                        </div>

                        <div>

                          <h2>
                            {
                              mealTitles[
                                mealType
                              ]
                            }
                          </h2>

                          <div className="meal-time">

                            <Clock size={13} />

                            <span>
                              {
                                mealTimes[
                                  mealType
                                ]
                              }
                            </span>

                          </div>

                        </div>

                      </div>

                      {items.length >
                      0 ? (

                        <div className="food-list">

                          {items.map(
                            (item) => (

                              <div
                                className="food-item"
                                key={
                                  item.id
                                }
                              >

                                <span className="food-dot">
                                  •
                                </span>

                                <span>
                                  {
                                    item.item_name
                                  }
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      ) : (

                        <div className="no-menu-item">

                          <span>
                            {t.noMenu}
                          </span>

                        </div>

                      )}

                    </div>
                  );
                }
              )}

            </div>
          )}

          {/* ====================================
              INFORMATION
          ==================================== */}

          <div className="canteen-note">

            <div className="canteen-note-icon">
              ℹ️
            </div>

            <div>

              <strong>
                {t.canteenInformation}
              </strong>

              <p>
                {t.informationText}
              </p>

            </div>

          </div>

          {/* ====================================
              STUDENT FEEDBACK
          ==================================== */}

          <section className="canteen-feedback-section">

            <div className="canteen-feedback-header">

              <div className="canteen-feedback-heading">

                <div className="canteen-feedback-icon">
                  <MessageSquare
                    size={22}
                  />
                </div>

                <div>

                  <h2>
                    {t.feedbackTitle}
                  </h2>

                  <p>
                    {t.feedbackSubtitle}
                  </p>

                </div>

              </div>

            </div>

            {/* SUCCESS MESSAGE */}

            {feedbackSubmitted && (
              <div className="feedback-success-message">

                <span>
                  ✓
                </span>

                <p>
                  {t.feedbackSubmitted}
                </p>

              </div>
            )}

            {/* ERROR MESSAGE */}

            {feedbackError && (
              <div className="feedback-error-message">

                <span>
                  ⚠
                </span>

                <p>
                  {feedbackError}
                </p>

              </div>
            )}

            <div className="canteen-feedback-form">

              {/* RATING */}

              <div className="feedback-form-group">

                <label>
                  {t.yourRating}
                </label>

                <div className="feedback-rating-container">

                  <div className="feedback-stars">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <button
                          type="button"
                          key={star}
                          className={
                            star <=
                            feedbackRating
                              ? "feedback-star active"
                              : "feedback-star"
                          }
                          onClick={() => {
                            setFeedbackRating(
                              star
                            );
                            setFeedbackError(
                              ""
                            );
                          }}
                          aria-label={`${star} star`}
                        >

                          <Star
                            size={30}
                            fill={
                              star <=
                              feedbackRating
                                ? "currentColor"
                                : "none"
                            }
                          />

                        </button>

                      )
                    )}

                  </div>

                  {feedbackRating >
                    0 && (
                    <span className="rating-text">
                      {getRatingText()}
                    </span>
                  )}

                </div>

              </div>

              {/* MEAL */}

              <div className="feedback-form-group">

                <label>
                  {t.meal}
                </label>

                <select
                  className="feedback-select"
                  value={
                    feedbackMeal
                  }
                  onChange={(e) => {
                    setFeedbackMeal(
                      e.target.value
                    );
                    setFeedbackError(
                      ""
                    );
                    setFeedbackSubmitted(
                      false
                    );
                  }}
                >

                  <option value="BREAKFAST">
                    {t.breakfast}
                  </option>

                  <option value="LUNCH">
                    {t.lunch}
                  </option>

                  <option value="SNACKS">
                    {t.eveningSnacks}
                  </option>

                  <option value="DINNER">
                    {t.dinner}
                  </option>

                </select>

              </div>

              {/* COMMENT */}

              <div className="feedback-form-group">

                <label>
                  {t.feedbackComment}
                </label>

                <textarea
                  className="feedback-textarea"
                  value={
                    feedbackComment
                  }
                  onChange={(e) => {
                    setFeedbackComment(
                      e.target.value
                    );
                    setFeedbackError(
                      ""
                    );
                    setFeedbackSubmitted(
                      false
                    );
                  }}
                  placeholder={
                    t.feedbackPlaceholder
                  }
                  rows={5}
                  maxLength={500}
                />

                <small className="feedback-character-count">
                  {
                    feedbackComment.length
                  }{" "}
                  / 500
                </small>

              </div>

              {/* SUBMIT */}

              <div className="feedback-submit-row">

                <button
                  type="button"
                  className="feedback-submit-button"
                  onClick={
                    submitFeedback
                  }
                >

                  <Send size={17} />

                  {t.submitFeedback}

                </button>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}