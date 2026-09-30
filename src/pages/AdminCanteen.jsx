import { useEffect, useState } from "react";
import {
  Utensils,
  Clock,
  Coffee,
  Sun,
  Cookie,
  Moon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Star,
  MessageSquare,
  User,
  CalendarDays,
  Trash2,
  Plus,
  Pencil,
  Power,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useLanguage } from "../context/LanguageContext";

// =====================================================
// TRANSLATIONS
// =====================================================

const ADMIN_CANTEEN_TRANSLATIONS = {
  en: {
    title: "Canteen Management",
    subtitle:
      "View and monitor the daily campus canteen menu.",
    todayMenu: "Today's Menu",
    refresh: "Refresh",
    breakfast: "Breakfast",
    lunch: "Lunch",
    snacks: "Evening Snacks",
    dinner: "Dinner",
    breakfastTime: "7:30 AM - 9:00 AM",
    lunchTime: "12:30 PM - 2:30 PM",
    snacksTime: "4:30 PM - 6:00 PM",
    dinnerTime: "7:30 PM - 9:30 PM",
    available: "Available",
    unavailable: "Unavailable",
    noItems: "No menu items added for this meal.",
    loading: "Loading today's menu...",
    loadFailed:
      "Unable to load today's menu. Please try again.",
    totalItems: "Total Menu Items",
    activeMeals: "Active Meals",
    mealSchedule: "Meal Schedule",
    item: "Item",
    status: "Status",
    quantity: "Quantity",
    noQuantity: "Not specified",
    addItem: "Add Menu Item",
    editItem: "Edit Menu Item",
    mealType: "Meal Type",
    itemName: "Item Name",
    description: "Description",
    menuDate: "Menu Date",
    save: "Save",
    update: "Update",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    toggle: "Toggle",
    confirmDeleteMenu: "Are you sure you want to delete this menu item?",
    saveSuccess: "Menu item saved successfully.",
    updateSuccess: "Menu item updated successfully.",
    deleteSuccess: "Menu item deleted successfully.",
    actionFailed: "Action failed. Please try again.",
    requiredFields: "Meal type, item name and menu date are required.",

    feedbackTitle: "Student Canteen Feedback",
    feedbackSubtitle:
      "View feedback and ratings submitted by students.",
    totalFeedback: "Total Feedback",
    averageRating: "Average Rating",
    meal: "Meal",
    rating: "Rating",
    student: "Student",
    registrationNo: "Registration No.",
    comment: "Comment",
    date: "Date",
    allMeals: "All Meals",
    allRatings: "All Ratings",
    noFeedback: "No student feedback available.",
    deleteFeedback: "Delete",
    confirmDelete:
      "Are you sure you want to delete this feedback?",
    noComment: "No comment provided.",
    stars: "stars",
    outOf: "out of",
  },

  hi: {
    title: "कैंटीन प्रबंधन",
    subtitle:
      "दैनिक कैंपस कैंटीन मेनू देखें और उसकी निगरानी करें।",
    todayMenu: "आज का मेनू",
    refresh: "रिफ्रेश",
    breakfast: "नाश्ता",
    lunch: "दोपहर का भोजन",
    snacks: "शाम का नाश्ता",
    dinner: "रात्रि भोजन",
    breakfastTime: "सुबह 7:30 - 9:00",
    lunchTime: "दोपहर 12:30 - 2:30",
    snacksTime: "शाम 4:30 - 6:00",
    dinnerTime: "शाम 7:30 - 9:30",
    available: "उपलब्ध",
    unavailable: "अनुपलब्ध",
    noItems:
      "इस भोजन के लिए कोई मेनू आइटम नहीं जोड़ा गया है।",
    loading: "आज का मेनू लोड हो रहा है...",
    loadFailed:
      "आज का मेनू लोड नहीं हो सका। कृपया पुनः प्रयास करें।",
    totalItems: "कुल मेनू आइटम",
    activeMeals: "सक्रिय भोजन",
    mealSchedule: "भोजन समय-सारणी",
    item: "आइटम",
    status: "स्थिति",
    quantity: "मात्रा",
    noQuantity: "निर्दिष्ट नहीं",
    addItem: "मेनू आइटम जोड़ें",
    editItem: "मेनू आइटम संपादित करें",
    mealType: "भोजन प्रकार",
    itemName: "आइटम का नाम",
    description: "विवरण",
    menuDate: "मेनू तारीख",
    save: "सेव करें",
    update: "अपडेट करें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    toggle: "उपलब्धता बदलें",
    confirmDeleteMenu: "क्या आप इस मेनू आइटम को हटाना चाहते हैं?",
    saveSuccess: "मेनू आइटम सफलतापूर्वक सेव किया गया।",
    updateSuccess: "मेनू आइटम सफलतापूर्वक अपडेट किया गया।",
    deleteSuccess: "मेनू आइटम सफलतापूर्वक हटाया गया।",
    actionFailed: "कार्रवाई विफल हुई। कृपया पुनः प्रयास करें।",
    requiredFields: "भोजन प्रकार, आइटम का नाम और मेनू तारीख आवश्यक हैं।",

    feedbackTitle: "छात्र कैंटीन फीडबैक",
    feedbackSubtitle:
      "छात्रों द्वारा दिए गए फीडबैक और रेटिंग देखें।",
    totalFeedback: "कुल फीडबैक",
    averageRating: "औसत रेटिंग",
    meal: "भोजन",
    rating: "रेटिंग",
    student: "छात्र",
    registrationNo: "रजिस्ट्रेशन नंबर",
    comment: "टिप्पणी",
    date: "तारीख",
    allMeals: "सभी भोजन",
    allRatings: "सभी रेटिंग",
    noFeedback: "कोई छात्र फीडबैक उपलब्ध नहीं है।",
    deleteFeedback: "हटाएं",
    confirmDelete:
      "क्या आप इस फीडबैक को हटाना चाहते हैं?",
    noComment: "कोई टिप्पणी नहीं दी गई।",
    stars: "स्टार",
    outOf: "में से",
  },

  or: {
    title: "କ୍ୟାଣ୍ଟିନ୍ ପରିଚାଳନା",
    subtitle:
      "ଦୈନିକ କ୍ୟାମ୍ପସ୍ କ୍ୟାଣ୍ଟିନ୍ ମେନୁ ଦେଖନ୍ତୁ ଏବଂ ନିରୀକ୍ଷଣ କରନ୍ତୁ।",
    todayMenu: "ଆଜିର ମେନୁ",
    refresh: "ରିଫ୍ରେଶ୍",
    breakfast: "ଜଳଖିଆ",
    lunch: "ମଧ୍ୟାହ୍ନ ଭୋଜନ",
    snacks: "ସନ୍ଧ୍ୟା ଜଳଖିଆ",
    dinner: "ରାତ୍ରି ଭୋଜନ",
    breakfastTime: "ସକାଳ 7:30 - 9:00",
    lunchTime: "ଦିନ 12:30 - 2:30",
    snacksTime: "ସନ୍ଧ୍ୟା 4:30 - 6:00",
    dinnerTime: "ସନ୍ଧ୍ୟା 7:30 - 9:30",
    available: "ଉପଲବ୍ଧ",
    unavailable: "ଅନୁପଲବ୍ଧ",
    noItems:
      "ଏହି ଭୋଜନ ପାଇଁ କୌଣସି ମେନୁ ଆଇଟମ୍ ଯୋଡାଯାଇ ନାହିଁ।",
    loading: "ଆଜିର ମେନୁ ଲୋଡ୍ ହେଉଛି...",
    loadFailed:
      "ଆଜିର ମେନୁ ଲୋଡ୍ ହୋଇପାରିଲା ନାହିଁ। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।",
    totalItems: "ମୋଟ ମେନୁ ଆଇଟମ୍",
    activeMeals: "ସକ୍ରିୟ ଭୋଜନ",
    mealSchedule: "ଭୋଜନ ସମୟସୂଚୀ",
    item: "ଆଇଟମ୍",
    status: "ସ୍ଥିତି",
    quantity: "ପରିମାଣ",
    noQuantity: "ଉଲ୍ଲେଖ ନାହିଁ",
    addItem: "ମେନୁ ଆଇଟମ୍ ଯୋଡନ୍ତୁ",
    editItem: "ମେନୁ ଆଇଟମ୍ ସମ୍ପାଦନ କରନ୍ତୁ",
    mealType: "ଭୋଜନ ପ୍ରକାର",
    itemName: "ଆଇଟମ୍ ନାମ",
    description: "ବିବରଣୀ",
    menuDate: "ମେନୁ ତାରିଖ",
    save: "ସେଭ୍",
    update: "ଅପଡେଟ୍",
    cancel: "ବାତିଲ୍",
    edit: "ସମ୍ପାଦନ",
    delete: "ଡିଲିଟ୍",
    toggle: "ଉପଲବ୍ଧତା ବଦଳାନ୍ତୁ",
    confirmDeleteMenu: "ଆପଣ ଏହି ମେନୁ ଆଇଟମ୍ ଡିଲିଟ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
    saveSuccess: "ମେନୁ ଆଇଟମ୍ ସଫଳତାର ସହ ସେଭ୍ ହୋଇଛି।",
    updateSuccess: "ମେନୁ ଆଇଟମ୍ ସଫଳତାର ସହ ଅପଡେଟ୍ ହୋଇଛି।",
    deleteSuccess: "ମେନୁ ଆଇଟମ୍ ସଫଳତାର ସହ ଡିଲିଟ୍ ହୋଇଛି।",
    actionFailed: "କାର୍ଯ୍ୟ ବିଫଳ ହେଲା। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।",
    requiredFields: "ଭୋଜନ ପ୍ରକାର, ଆଇଟମ୍ ନାମ ଏବଂ ମେନୁ ତାରିଖ ଆବଶ୍ୟକ।",

    feedbackTitle: "ଛାତ୍ର କ୍ୟାଣ୍ଟିନ୍ ଫିଡବ୍ୟାକ୍",
    feedbackSubtitle:
      "ଛାତ୍ରମାନଙ୍କ ଦ୍ୱାରା ଦିଆଯାଇଥିବା ଫିଡବ୍ୟାକ୍ ଏବଂ ରେଟିଂ ଦେଖନ୍ତୁ।",
    totalFeedback: "ମୋଟ ଫିଡବ୍ୟାକ୍",
    averageRating: "ହାରାହାରି ରେଟିଂ",
    meal: "ଭୋଜନ",
    rating: "ରେଟିଂ",
    student: "ଛାତ୍ର",
    registrationNo: "ରେଜିଷ୍ଟ୍ରେସନ୍ ନମ୍ବର",
    comment: "ମତାମତ",
    date: "ତାରିଖ",
    allMeals: "ସମସ୍ତ ଭୋଜନ",
    allRatings: "ସମସ୍ତ ରେଟିଂ",
    noFeedback: "କୌଣସି ଛାତ୍ର ଫିଡବ୍ୟାକ୍ ନାହିଁ।",
    deleteFeedback: "ଡିଲିଟ୍",
    confirmDelete:
      "ଆପଣ ଏହି ଫିଡବ୍ୟାକ୍ ଡିଲିଟ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
    noComment: "କୌଣସି ମତାମତ ଦିଆଯାଇନାହିଁ।",
    stars: "ଷ୍ଟାର୍",
    outOf: "ମଧ୍ୟରୁ",
  },
};

// =====================================================
// MEAL CONFIGURATION
// =====================================================

const MEALS = [
  {
    type: "BREAKFAST",
    titleKey: "breakfast",
    timeKey: "breakfastTime",
    icon: Coffee,
  },
  {
    type: "LUNCH",
    titleKey: "lunch",
    timeKey: "lunchTime",
    icon: Sun,
  },
  {
    type: "SNACKS",
    titleKey: "snacks",
    timeKey: "snacksTime",
    icon: Cookie,
  },
  {
    type: "DINNER",
    titleKey: "dinner",
    timeKey: "dinnerTime",
    icon: Moon,
  },
];

// =====================================================
// COMPONENT
// =====================================================

export default function AdminCanteen() {
  const { language } = useLanguage();

  const t =
    ADMIN_CANTEEN_TRANSLATIONS[language] ||
    ADMIN_CANTEEN_TRANSLATIONS.en;

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // MENU MANAGEMENT STATE
  // ===================================================

  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [savingMenu, setSavingMenu] = useState(false);
  const [menuActionError, setMenuActionError] = useState("");
  const [menuForm, setMenuForm] = useState({
    mealType: "BREAKFAST",
    itemName: "",
    description: "",
    menuDate: new Date().toISOString().split("T")[0],
    isAvailable: true,
  });

  // ===================================================
  // MENU MANAGEMENT ACTIONS
  // ===================================================

  const openAddMenuForm = () => {
    setEditingMenuItem(null);
    setMenuActionError("");
    setMenuForm({
      mealType: "BREAKFAST",
      itemName: "",
      description: "",
      menuDate: new Date().toISOString().split("T")[0],
      isAvailable: true,
    });
    setShowMenuForm(true);
  };

  const openEditMenuForm = (item) => {
    setEditingMenuItem(item);
    setMenuActionError("");
    setMenuForm({
      mealType: item?.meal_type || item?.mealType || "BREAKFAST",
      itemName: item?.item_name || item?.itemName || "",
      description: item?.description || "",
      menuDate: String(item?.menu_date || item?.menuDate || "").slice(0, 10),
      isAvailable: isAvailable(item),
    });
    setShowMenuForm(true);
  };

  const closeMenuForm = () => {
    if (savingMenu) return;
    setShowMenuForm(false);
    setEditingMenuItem(null);
    setMenuActionError("");
  };

  const handleMenuFormChange = (field, value) => {
    setMenuForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveMenuItem = async (event) => {
    event.preventDefault();

    if (
      !menuForm.mealType ||
      !menuForm.itemName.trim() ||
      !menuForm.menuDate
    ) {
      setMenuActionError(t.requiredFields);
      return;
    }

    try {
      setSavingMenu(true);
      setMenuActionError("");

      const endpoint = editingMenuItem
        ? `${API_URL}/canteen/${editingMenuItem.id}`
        : `${API_URL}/canteen`;

      const response = await fetch(endpoint, {
        method: editingMenuItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealType: menuForm.mealType,
          itemName: menuForm.itemName.trim(),
          description: menuForm.description.trim(),
          menuDate: menuForm.menuDate,
          isAvailable: menuForm.isAvailable,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || t.actionFailed);
      }

      setShowMenuForm(false);
      setEditingMenuItem(null);
      await fetchMenu();
      window.alert(
        editingMenuItem ? t.updateSuccess : t.saveSuccess
      );
    } catch (err) {
      console.error("Canteen menu save error:", err);
      setMenuActionError(err.message || t.actionFailed);
    } finally {
      setSavingMenu(false);
    }
  };

  const deleteMenuItem = async (item) => {
    const confirmed = window.confirm(t.confirmDeleteMenu);

    if (!confirmed) return;

    try {
      setMenuActionError("");

      const response = await fetch(
        `${API_URL}/canteen/${item.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || t.actionFailed);
      }

      await fetchMenu();
      window.alert(t.deleteSuccess);
    } catch (err) {
      console.error("Canteen menu delete error:", err);
      setMenuActionError(err.message || t.actionFailed);
    }
  };

  const toggleMenuItem = async (item) => {
    try {
      setMenuActionError("");

      const response = await fetch(
        `${API_URL}/canteen/${item.id}/toggle`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || t.actionFailed);
      }

      await fetchMenu();
    } catch (err) {
      console.error("Canteen menu toggle error:", err);
      setMenuActionError(err.message || t.actionFailed);
    }
  };

  // ===================================================
  // FEEDBACK STATE
  // ===================================================

  const [feedback, setFeedback] = useState([]);
  const [feedbackMealFilter, setFeedbackMealFilter] =
    useState("ALL");
  const [feedbackRatingFilter, setFeedbackRatingFilter] =
    useState("ALL");

  // ===================================================
  // API URL
  // ===================================================

  const API_URL =
    import.meta.env.VITE_API_URL || "/api";

  // ===================================================
  // FETCH MENU
  // ===================================================

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/canteen/today`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || t.loadFailed
        );
      }

      setMenu(
        Array.isArray(data.menu)
          ? data.menu
          : []
      );
    } catch (err) {
      console.error(
        "Admin canteen menu error:",
        err
      );

      setError(
        err.message || t.loadFailed
      );

      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD MENU + FEEDBACK
  // ===================================================

  useEffect(() => {
    fetchMenu();
  }, [language]);

  useEffect(() => {
    loadFeedback();
  }, []);

  // ===================================================
  // LOAD FEEDBACK FROM LOCAL STORAGE
  // ===================================================

  const loadFeedback = () => {
    try {
      const storedFeedback =
        localStorage.getItem(
          "campx_canteen_feedback"
        );

      if (!storedFeedback) {
        setFeedback([]);
        return;
      }

      const parsedFeedback =
        JSON.parse(storedFeedback);

      setFeedback(
        Array.isArray(parsedFeedback)
          ? parsedFeedback
          : []
      );
    } catch (err) {
      console.error(
        "Error loading canteen feedback:",
        err
      );

      setFeedback([]);
    }
  };

  // ===================================================
  // DELETE FEEDBACK
  // ===================================================

  const deleteFeedback = (feedbackId) => {
    const confirmed = window.confirm(
      t.confirmDelete
    );

    if (!confirmed) {
      return;
    }

    const updatedFeedback =
      feedback.filter(
        (item) => item.id !== feedbackId
      );

    setFeedback(updatedFeedback);

    localStorage.setItem(
      "campx_canteen_feedback",
      JSON.stringify(updatedFeedback)
    );
  };

  // ===================================================
  // GROUP MENU
  // ===================================================

  const groupedMenu = {
    BREAKFAST: [],
    LUNCH: [],
    SNACKS: [],
    DINNER: [],
  };

  menu.forEach((item) => {
    const mealType = String(
      item?.meal_type ||
        item?.mealType ||
        ""
    )
      .trim()
      .toUpperCase();

    if (groupedMenu[mealType]) {
      groupedMenu[mealType].push(item);
    }
  });

  // ===================================================
  // STATISTICS
  // ===================================================

  const totalItems = menu.length;

  const activeMeals = MEALS.filter(
    (meal) =>
      groupedMenu[meal.type].length > 0
  ).length;

  // ===================================================
  // FEEDBACK STATISTICS
  // ===================================================

  const totalFeedback = feedback.length;

  const averageRating =
    feedback.length > 0
      ? (
          feedback.reduce(
            (sum, item) =>
              sum +
              Number(item.rating || 0),
            0
          ) / feedback.length
        ).toFixed(1)
      : "0.0";

  // ===================================================
  // FILTER FEEDBACK
  // ===================================================

  const filteredFeedback =
    feedback.filter((item) => {
      const mealMatch =
        feedbackMealFilter === "ALL" ||
        String(item.meal || "")
          .toUpperCase() ===
          feedbackMealFilter;

      const ratingMatch =
        feedbackRatingFilter === "ALL" ||
        Number(item.rating) ===
          Number(feedbackRatingFilter);

      return mealMatch && ratingMatch;
    });

  // ===================================================
  // GET MEAL NAME
  // ===================================================

  const getFeedbackMealName = (meal) => {
    const normalized = String(
      meal || ""
    )
      .trim()
      .toUpperCase();

    if (normalized === "BREAKFAST") {
      return t.breakfast;
    }

    if (normalized === "LUNCH") {
      return t.lunch;
    }

    if (normalized === "SNACKS") {
      return t.snacks;
    }

    if (normalized === "DINNER") {
      return t.dinner;
    }

    return meal || "—";
  };

  // ===================================================
  // ITEM NAME
  // ===================================================

  const getItemName = (item) =>
    item?.item_name ||
    item?.itemName ||
    item?.name ||
    item?.food_name ||
    item?.foodName ||
    "—";

  // ===================================================
  // ITEM STATUS
  // ===================================================

  const isAvailable = (item) => {
    if (
      item?.is_available === undefined &&
      item?.isAvailable === undefined &&
      item?.available === undefined
    ) {
      return true;
    }

    return (
      item?.is_available ??
      item?.isAvailable ??
      item?.available
    );
  };

  // ===================================================
  // QUANTITY
  // ===================================================

  const getQuantity = (item) =>
    item?.quantity ||
    item?.serving_quantity ||
    item?.servingQuantity ||
    "";

  // ===================================================
  // STAR DISPLAY
  // ===================================================

  const renderStars = (rating) => {
    const numericRating = Number(
      rating || 0
    );

    return (
      <div
        style={{
          display: "flex",
          gap: "2px",
        }}
      >
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={16}
              fill={
                star <= numericRating
                  ? "#f59e0b"
                  : "none"
              }
              style={{
                color:
                  star <= numericRating
                    ? "#f59e0b"
                    : "#cbd5e1",
              }}
            />
          )
        )}
      </div>
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="app-layout">
      <Sidebar admin />

      <main className="main-content">
        <Topbar />

        <div className="page-container">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="admin-page-header">
            <div>
              <div className="eyebrow">
                CAMPX
              </div>

              <h1>
                <Utensils
                  size={30}
                  style={{
                    verticalAlign:
                      "middle",
                    marginRight:
                      "10px",
                  }}
                />

                {t.title}
              </h1>

              <p>
                {t.subtitle}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="primary-button"
                onClick={openAddMenuForm}
              >
                <Plus size={17} />
                {t.addItem}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={fetchMenu}
                disabled={loading}
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "campx-spin"
                      : ""
                  }
                />
                {t.refresh}
              </button>
            </div>
          </div>

          {/* =========================================
              STATISTICS
          ========================================= */}

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">
                <Utensils size={21} />
              </div>

              <span>
                {t.totalItems}
              </span>

              <strong>
                {totalItems}
              </strong>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <CheckCircle2
                  size={21}
                />
              </div>

              <span>
                {t.activeMeals}
              </span>

              <strong>
                {activeMeals}/4
              </strong>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <Coffee size={21} />
              </div>

              <span>
                {t.breakfast}
              </span>

              <strong>
                {
                  groupedMenu
                    .BREAKFAST.length
                }
              </strong>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <Moon size={21} />
              </div>

              <span>
                {t.dinner}
              </span>

              <strong>
                {
                  groupedMenu
                    .DINNER.length
                }
              </strong>
            </div>
          </div>

          {/* =========================================
              MEAL SCHEDULE
          ========================================= */}

          <div
            className="card"
            style={{
              marginTop: "22px",
              marginBottom: "22px",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "16px",
              }}
            >
              {t.mealSchedule}
            </h2>

            <div className="dashboard-grid">
              {MEALS.map((meal) => {
                const Icon =
                  meal.icon;

                return (
                  <div
                    key={meal.type}
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "12px",
                      padding: "14px",
                      border:
                        "1px solid #e7ebf1",
                      borderRadius:
                        "10px",
                    }}
                  >
                    <div className="card-icon">
                      <Icon size={20} />
                    </div>

                    <div>
                      <strong
                        style={{
                          display:
                            "block",
                          marginBottom:
                            "4px",
                        }}
                      >
                        {
                          t[
                            meal
                              .titleKey
                          ]
                        }
                      </strong>

                      <span
                        style={{
                          color:
                            "#718096",
                          fontSize:
                            "12px",
                        }}
                      >
                        <Clock
                          size={12}
                          style={{
                            verticalAlign:
                              "middle",
                            marginRight:
                              "4px",
                          }}
                        />

                        {
                          t[
                            meal
                              .timeKey
                          ]
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div
              className="error-message"
              style={{
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {menuActionError && !showMenuForm && (
            <div
              className="error-message"
              style={{
                marginBottom: "20px",
              }}
            >
              {menuActionError}
            </div>
          )}

          {/* =========================================
              TODAY'S MENU
          ========================================= */}

          <div className="card">
            <h2
              style={{
                marginTop: 0,
                marginBottom:
                  "20px",
              }}
            >
              {t.todayMenu}
            </h2>

            {loading ? (
              <div className="loading-state">
                {t.loading}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "18px",
                }}
              >
                {MEALS.map((meal) => {
                  const Icon =
                    meal.icon;

                  const items =
                    groupedMenu[
                      meal.type
                    ];

                  return (
                    <div
                      key={meal.type}
                      style={{
                        border:
                          "1px solid #e7ebf1",
                        borderRadius:
                          "12px",
                        overflow:
                          "hidden",
                        background:
                          "#ffffff",
                      }}
                    >
                      {/* MEAL HEADER */}

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                          padding:
                            "15px",
                          background:
                            "#f7f9fc",
                          borderBottom:
                            "1px solid #e7ebf1",
                        }}
                      >
                        <div className="card-icon">
                          <Icon size={20} />
                        </div>

                        <div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize:
                                "16px",
                            }}
                          >
                            {
                              t[
                                meal
                                  .titleKey
                              ]
                            }
                          </h3>

                          <div
                            style={{
                              color:
                                "#718096",
                              fontSize:
                                "12px",
                              marginTop:
                                "3px",
                            }}
                          >
                            <Clock
                              size={12}
                              style={{
                                verticalAlign:
                                  "middle",
                                marginRight:
                                  "4px",
                              }}
                            />

                            {
                              t[
                                meal
                                  .timeKey
                              ]
                            }
                          </div>
                        </div>
                      </div>

                      {/* MEAL ITEMS */}

                      <div
                        style={{
                          padding:
                            "12px",
                        }}
                      >
                        {items.length ===
                        0 ? (
                          <div
                            style={{
                              padding:
                                "20px 10px",
                              textAlign:
                                "center",
                              color:
                                "#8a96a8",
                              fontSize:
                                "13px",
                            }}
                          >
                            {t.noItems}
                          </div>
                        ) : (
                          <div
                            style={{
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              gap: "8px",
                            }}
                          >
                            {items.map(
                              (
                                item,
                                index
                              ) => {
                                const available =
                                  isAvailable(
                                    item
                                  );

                                const quantity =
                                  getQuantity(
                                    item
                                  );

                                return (
                                  <div
                                    key={
                                      item.id ||
                                      `${meal.type}-${index}`
                                    }
                                    style={{
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      justifyContent:
                                        "space-between",
                                      gap:
                                        "10px",
                                      padding:
                                        "11px",
                                      border:
                                        "1px solid #edf0f4",
                                      borderRadius:
                                        "8px",
                                    }}
                                  >
                                    <div>
                                      <strong
                                        style={{
                                          display:
                                            "block",
                                          color:
                                            "#344054",
                                          fontSize:
                                            "14px",
                                        }}
                                      >
                                        {getItemName(
                                          item
                                        )}
                                      </strong>

                                      <span
                                        style={{
                                          display:
                                            "block",
                                          marginTop:
                                            "3px",
                                          color:
                                            "#8a96a8",
                                          fontSize:
                                            "11px",
                                        }}
                                      >
                                        {
                                          t.quantity
                                        }
                                        :{" "}
                                        {quantity ||
                                          t.noQuantity}
                                      </span>
                                    </div>

                                    <span
                                      className={`badge ${
                                        available
                                          ? "badge-success"
                                          : "badge-danger"
                                      }`}
                                    >
                                      {available ? (
                                        <CheckCircle2
                                          size={
                                            13
                                          }
                                        />
                                      ) : (
                                        <AlertCircle
                                          size={
                                            13
                                          }
                                        />
                                      )}

                                      {available
                                        ? t.available
                                        : t.unavailable}
                                    </span>

                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        marginLeft: "auto",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        title={t.edit}
                                        onClick={() =>
                                          openEditMenuForm(item)
                                        }
                                        style={{
                                          border: "1px solid #e2e8f0",
                                          background: "#ffffff",
                                          borderRadius: "7px",
                                          padding: "6px",
                                          cursor: "pointer",
                                          color: "#475467",
                                          display: "flex",
                                        }}
                                      >
                                        <Pencil size={14} />
                                      </button>

                                      <button
                                        type="button"
                                        title={t.toggle}
                                        onClick={() =>
                                          toggleMenuItem(item)
                                        }
                                        style={{
                                          border: "1px solid #e2e8f0",
                                          background: "#ffffff",
                                          borderRadius: "7px",
                                          padding: "6px",
                                          cursor: "pointer",
                                          color: available
                                            ? "#d97706"
                                            : "#16a34a",
                                          display: "flex",
                                        }}
                                      >
                                        <Power size={14} />
                                      </button>

                                      <button
                                        type="button"
                                        title={t.delete}
                                        onClick={() =>
                                          deleteMenuItem(item)
                                        }
                                        style={{
                                          border: "1px solid #fecaca",
                                          background: "#fff7f7",
                                          borderRadius: "7px",
                                          padding: "6px",
                                          cursor: "pointer",
                                          color: "#dc2626",
                                          display: "flex",
                                        }}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =========================================
              ADD / EDIT MENU MODAL
          ========================================= */}

          {showMenuForm && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                zIndex: 1000,
              }}
            >
              <div
                className="card"
                style={{
                  width: "100%",
                  maxWidth: "560px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <div
                      className="eyebrow"
                      style={{ marginBottom: "5px" }}
                    >
                      CAMPX
                    </div>
                    <h2 style={{ margin: 0 }}>
                      {editingMenuItem
                        ? t.editItem
                        : t.addItem}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeMenuForm}
                    disabled={savingMenu}
                    style={{
                      border: "none",
                      background: "#f1f5f9",
                      borderRadius: "8px",
                      padding: "8px",
                      cursor: "pointer",
                      display: "flex",
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {menuActionError && (
                  <div
                    className="error-message"
                    style={{ marginBottom: "15px" }}
                  >
                    {menuActionError}
                  </div>
                )}

                <form onSubmit={saveMenuItem}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <label style={{ display: "block" }}>
                      <span
                        style={{
                          display: "block",
                          marginBottom: "7px",
                          fontWeight: 600,
                          color: "#344054",
                        }}
                      >
                        {t.mealType}
                      </span>

                      <select
                        value={menuForm.mealType}
                        onChange={(e) =>
                          handleMenuFormChange(
                            "mealType",
                            e.target.value
                          )
                        }
                        className="feedback-select"
                        style={{ width: "100%" }}
                      >
                        <option value="BREAKFAST">
                          {t.breakfast}
                        </option>
                        <option value="LUNCH">
                          {t.lunch}
                        </option>
                        <option value="SNACKS">
                          {t.snacks}
                        </option>
                        <option value="DINNER">
                          {t.dinner}
                        </option>
                      </select>
                    </label>

                    <label style={{ display: "block" }}>
                      <span
                        style={{
                          display: "block",
                          marginBottom: "7px",
                          fontWeight: 600,
                          color: "#344054",
                        }}
                      >
                        {t.menuDate}
                      </span>

                      <input
                        type="date"
                        value={menuForm.menuDate}
                        onChange={(e) =>
                          handleMenuFormChange(
                            "menuDate",
                            e.target.value
                          )
                        }
                        required
                        className="feedback-select"
                        style={{ width: "100%" }}
                      />
                    </label>

                    <label
                      style={{
                        display: "block",
                        gridColumn: "1 / -1",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          marginBottom: "7px",
                          fontWeight: 600,
                          color: "#344054",
                        }}
                      >
                        {t.itemName}
                      </span>

                      <input
                        type="text"
                        value={menuForm.itemName}
                        onChange={(e) =>
                          handleMenuFormChange(
                            "itemName",
                            e.target.value
                          )
                        }
                        placeholder={t.itemName}
                        required
                        className="feedback-select"
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      />
                    </label>

                    <label
                      style={{
                        display: "block",
                        gridColumn: "1 / -1",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          marginBottom: "7px",
                          fontWeight: 600,
                          color: "#344054",
                        }}
                      >
                        {t.description}
                      </span>

                      <textarea
                        value={menuForm.description}
                        onChange={(e) =>
                          handleMenuFormChange(
                            "description",
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder={t.description}
                        className="feedback-select"
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          resize: "vertical",
                        }}
                      />
                    </label>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        gridColumn: "1 / -1",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={menuForm.isAvailable}
                        onChange={(e) =>
                          handleMenuFormChange(
                            "isAvailable",
                            e.target.checked
                          )
                        }
                      />
                      <span style={{ fontWeight: 600 }}>
                        {t.available}
                      </span>
                    </label>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "22px",
                    }}
                  >
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={closeMenuForm}
                      disabled={savingMenu}
                    >
                      {t.cancel}
                    </button>

                    <button
                      type="submit"
                      className="primary-button"
                      disabled={savingMenu}
                    >
                      {savingMenu ? (
                        <RefreshCw
                          size={16}
                          className="campx-spin"
                        />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}

                      {editingMenuItem
                        ? t.update
                        : t.save}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =========================================
              STUDENT FEEDBACK SECTION
          ========================================= */}

          <div
            className="card canteen-feedback-section"
            style={{
              marginTop: "24px",
              marginBottom: "30px",
            }}
          >
            {/* FEEDBACK HEADER */}

            <div
              className="canteen-feedback-header"
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: "20px",
                flexWrap:
                  "wrap",
                marginBottom:
                  "20px",
              }}
            >
              <div>
                <h2
                  className="canteen-feedback-heading"
                  style={{
                    margin: 0,
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "10px",
                  }}
                >
                  <MessageSquare
                    size={24}
                  />

                  {t.feedbackTitle}
                </h2>

                <p
                  style={{
                    marginTop:
                      "6px",
                    marginBottom: 0,
                    color:
                      "#718096",
                  }}
                >
                  {t.feedbackSubtitle}
                </p>
              </div>

              {/* FEEDBACK STATISTICS */}

              <div
                style={{
                  display:
                    "flex",
                  gap: "12px",
                  flexWrap:
                    "wrap",
                }}
              >
                <div
                  className="feedback-stat-card"
                  style={{
                    minWidth:
                      "130px",
                  }}
                >
                  <span>
                    {t.totalFeedback}
                  </span>

                  <strong>
                    {totalFeedback}
                  </strong>
                </div>

                <div
                  className="feedback-stat-card"
                  style={{
                    minWidth:
                      "150px",
                  }}
                >
                  <span>
                    {t.averageRating}
                  </span>

                  <strong
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "5px",
                    }}
                  >
                    {averageRating}

                    <Star
                      size={17}
                      fill="#f59e0b"
                      style={{
                        color:
                          "#f59e0b",
                      }}
                    />
                  </strong>
                </div>
              </div>
            </div>

            {/* =========================================
                FILTERS
            ========================================= */}

            <div
              style={{
                display:
                  "flex",
                gap: "12px",
                flexWrap:
                  "wrap",
                marginBottom:
                  "20px",
                padding:
                  "14px",
                background:
                  "#f8fafc",
                borderRadius:
                  "10px",
              }}
            >
              <select
                className="feedback-select"
                value={
                  feedbackMealFilter
                }
                onChange={(e) =>
                  setFeedbackMealFilter(
                    e.target.value
                  )
                }
                style={{
                  minWidth:
                    "180px",
                }}
              >
                <option value="ALL">
                  {t.allMeals}
                </option>

                <option value="BREAKFAST">
                  {t.breakfast}
                </option>

                <option value="LUNCH">
                  {t.lunch}
                </option>

                <option value="SNACKS">
                  {t.snacks}
                </option>

                <option value="DINNER">
                  {t.dinner}
                </option>
              </select>

              <select
                className="feedback-select"
                value={
                  feedbackRatingFilter
                }
                onChange={(e) =>
                  setFeedbackRatingFilter(
                    e.target.value
                  )
                }
                style={{
                  minWidth:
                    "160px",
                }}
              >
                <option value="ALL">
                  {t.allRatings}
                </option>

                <option value="5">
                  5 ⭐
                </option>

                <option value="4">
                  4 ⭐
                </option>

                <option value="3">
                  3 ⭐
                </option>

                <option value="2">
                  2 ⭐
                </option>

                <option value="1">
                  1 ⭐
                </option>
              </select>
            </div>

            {/* =========================================
                FEEDBACK LIST
            ========================================= */}

            {filteredFeedback.length ===
            0 ? (
              <div
                className="canteen-no-feedback"
                style={{
                  padding:
                    "45px 20px",
                  textAlign:
                    "center",
                  color:
                    "#8a96a8",
                }}
              >
                <MessageSquare
                  size={42}
                  style={{
                    marginBottom:
                      "10px",
                    opacity: 0.5,
                  }}
                />

                <p
                  style={{
                    margin: 0,
                  }}
                >
                  {t.noFeedback}
                </p>
              </div>
            ) : (
              <div
                className="canteen-feedback-list"
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: "14px",
                }}
              >
                {filteredFeedback
                  .slice()
                  .reverse()
                  .map(
                    (item) => (
                      <div
                        className="canteen-feedback-card"
                        key={
                          item.id
                        }
                        style={{
                          border:
                            "1px solid #e7ebf1",
                          borderRadius:
                            "12px",
                          padding:
                            "18px",
                          background:
                            "#ffffff",
                        }}
                      >
                        {/* FEEDBACK TOP */}

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            gap: "15px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          {/* STUDENT */}

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              className="feedback-avatar"
                              style={{
                                width:
                                  "42px",
                                height:
                                  "42px",
                                borderRadius:
                                  "50%",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                background:
                                  "#eef2ff",
                              }}
                            >
                              <User
                                size={
                                  20
                                }
                              />
                            </div>

                            <div>
                              <strong
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#263238",
                                  fontSize:
                                    "15px",
                                }}
                              >
                                {item.studentName ||
                                  item.student ||
                                  "Student"}
                              </strong>

                              <span
                                style={{
                                  display:
                                    "block",
                                  marginTop:
                                    "3px",
                                  color:
                                    "#718096",
                                  fontSize:
                                    "12px",
                                }}
                              >
                                {
                                  t.registrationNo
                                }
                                :{" "}
                                {item.registrationNo ||
                                  item.studentId ||
                                  "—"}
                              </span>
                            </div>
                          </div>

                          {/* RATING */}

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "8px",
                            }}
                          >
                            {renderStars(
                              item.rating
                            )}

                            <strong
                              style={{
                                color:
                                  "#344054",
                              }}
                            >
                              {Number(
                                item.rating ||
                                  0
                              )}
                              /5
                            </strong>
                          </div>
                        </div>

                        {/* FEEDBACK DETAILS */}

                        <div
                          style={{
                            display:
                              "flex",
                            gap: "15px",
                            flexWrap:
                              "wrap",
                            marginTop:
                              "15px",
                            paddingTop:
                              "12px",
                            borderTop:
                              "1px solid #edf0f4",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "5px",
                              color:
                                "#667085",
                              fontSize:
                                "13px",
                            }}
                          >
                            <Utensils
                              size={
                                14
                              }
                            />

                            <strong>
                              {
                                t.meal
                              }
                              :
                            </strong>

                            {
                              getFeedbackMealName(
                                item.meal
                              )
                            }
                          </span>

                          <span
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "5px",
                              color:
                                "#667085",
                              fontSize:
                                "13px",
                            }}
                          >
                            <CalendarDays
                              size={
                                14
                              }
                            />

                            <strong>
                              {
                                t.date
                              }
                              :
                            </strong>

                            {item.date ||
                              "—"}
                          </span>
                        </div>

                        {/* COMMENT */}

                        <div
                          style={{
                            marginTop:
                              "14px",
                            padding:
                              "12px",
                            background:
                              "#f8fafc",
                            borderRadius:
                              "8px",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "6px",
                              marginBottom:
                                "6px",
                              color:
                                "#475467",
                              fontSize:
                                "13px",
                              fontWeight:
                                600,
                            }}
                          >
                            <MessageSquare
                              size={
                                14
                              }
                            />

                            {t.comment}
                          </div>

                          <p
                            style={{
                              margin:
                                0,
                              color:
                                "#667085",
                              fontSize:
                                "13px",
                              lineHeight:
                                1.6,
                            }}
                          >
                            {item.comment ||
                              t.noComment}
                          </p>
                        </div>

                        {/* DELETE */}

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "flex-end",
                            marginTop:
                              "12px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              deleteFeedback(
                                item.id
                              )
                            }
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "6px",
                              border:
                                "none",
                              background:
                                "transparent",
                              color:
                                "#dc2626",
                              cursor:
                                "pointer",
                              fontSize:
                                "12px",
                              padding:
                                "6px 8px",
                            }}
                          >
                            <Trash2
                              size={
                                14
                              }
                            />

                            {
                              t.deleteFeedback
                            }
                          </button>
                        </div>
                      </div>
                    )
                  )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}