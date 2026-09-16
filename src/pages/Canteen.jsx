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
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Canteen() {
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      title: "Breakfast",
      time: "7:30 AM - 9:00 AM",
      icon: Coffee,
    },
    {
      title: "Lunch",
      time: "12:30 PM - 2:30 PM",
      icon: Sun,
    },
    {
      title: "Evening Snacks",
      time: "4:30 PM - 6:00 PM",
      icon: Cookie,
    },
    {
      title: "Dinner",
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
  // FETCH TODAY'S MENU
  // ============================================

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const API_URL =
        import.meta.env.VITE_API_URL || "/api";

      const response = await fetch(
        `${API_URL}/canteen/today`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
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
        "Unable to load today's menu. Please try again."
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
  // GROUP MENU BY MEAL
  // ============================================

  const groupedMenu = {
    BREAKFAST: [],
    LUNCH: [],
    SNACKS: [],
    DINNER: [],
  };

  menu.forEach((item) => {
    if (groupedMenu[item.meal_type]) {
      groupedMenu[item.meal_type].push(item);
    }
  });

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
              Canteen Access
            </h2>

            <p>
              Canteen services are available
              only for hostel students.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/student")
              }
            >
              <ArrowLeft size={18} />

              Back to Dashboard
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
                  Today's Menu
                </h1>

                <p>
                  Campus Canteen
                </p>

              </div>

            </div>

            <div className="canteen-student-info">

              <span>
                Student
              </span>

              <strong>
                {user?.name || "Student"}
              </strong>

              <small>
                {user?.hostel || "Hosteller"}
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
                Today's Menu
              </strong>

              <p>
                Menu is updated by the
                administration.
              </p>

            </div>

            <button
              type="button"
              className="canteen-refresh-btn"
              onClick={fetchMenu}
              title="Refresh menu"
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
                Canteen Timings
              </h2>

              <div className="timing-list">

                {canteenTimings.map(
                  (timing) => {

                    const Icon = timing.icon;

                    return (
                      <div
                        key={timing.title}
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
                Retry
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
                Loading today's menu...
              </p>

            </div>

          ) : (

            /* ==================================
               MENU
            ================================== */

            <div className="canteen-menu-grid">

              {Object.entries(
                groupedMenu
              ).map(
                ([mealType, items]) => {

                  const Icon =
                    mealIcons[mealType];

                  const mealTitle =
                    mealType === "SNACKS"
                      ? "Evening Snacks"
                      : mealType.charAt(0) +
                        mealType
                          .slice(1)
                          .toLowerCase();

                  const timing =
                    canteenTimings.find(
                      (item) =>
                        item.title
                          .toUpperCase()
                          .replace(" ", "") ===
                        mealType.replace(
                          "SNACKS",
                          "EVENINGSNACKS"
                        )
                    );

                  return (
                    <div
                      className="canteen-meal-card"
                      key={mealType}
                    >

                      {/* MEAL HEADER */}

                      <div className="meal-card-header">

                        <div className="meal-icon">

                          {Icon && (
                            <Icon size={22} />
                          )}

                        </div>

                        <div>

                          <h2>
                            {mealTitle}
                          </h2>

                          <div className="meal-time">

                            <Clock size={13} />

                            <span>
                              {mealType ===
                              "BREAKFAST"
                                ? "7:30 AM - 9:00 AM"
                                : mealType ===
                                  "LUNCH"
                                ? "12:30 PM - 2:30 PM"
                                : mealType ===
                                  "SNACKS"
                                ? "4:30 PM - 6:00 PM"
                                : "7:30 PM - 9:30 PM"}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* FOOD */}

                      {items.length > 0 ? (

                        <div className="food-list">

                          {items.map(
                            (item) => (

                              <div
                                className="food-item"
                                key={item.id}
                              >

                                <span className="food-dot">
                                  •
                                </span>

                                <span>
                                  {item.item_name}
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      ) : (

                        <div className="no-menu-item">

                          <span>
                            No menu available
                            for this meal.
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
                Canteen Information
              </strong>

              <p>
                Today's menu is managed by
                the administration. Menu items
                may change depending on
                availability.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}