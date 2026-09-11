import {
  Search,
  Bell,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function Topbar({ title }) {

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin =
    location.pathname.startsWith("/admin");

  const handleNotificationClick = () => {

    if (isAdmin) {
      navigate("/admin/notifications");
    } else {
      navigate("/notifications");
    }

  };

  return (
    <header className="topbar">

      <div>
        <h2>{title}</h2>
      </div>

      <div className="topbar-actions">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search CampX..."
          />

        </div>


        {/* NOTIFICATION BUTTON */}

        <button
          className="notification-btn"
          onClick={handleNotificationClick}
          title="Notifications"
        >

          <Bell size={20} />

          <span className="notification-dot"></span>

        </button>


        <div className="avatar">
          AD
        </div>

      </div>

    </header>
  );
}