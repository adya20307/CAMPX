const STORAGE_KEY = "campx_notifications";

const NOTIFICATION_EVENT = "campx-notification";


// ============================================
// GET ALL NOTIFICATIONS
// ============================================

export function getNotifications(audience = null) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const notifications = JSON.parse(saved);

    if (!Array.isArray(notifications)) {
      return [];
    }

    // If no audience is provided,
    // return all notifications.
    if (!audience) {
      return notifications;
    }

    // Otherwise return only that audience.
    return notifications.filter(
      (notification) =>
        notification.audience === audience
    );

  } catch (error) {
    console.error(
      "Error loading notifications:",
      error
    );

    return [];
  }
}


// ============================================
// ADD NOTIFICATION
// ============================================

export function addNotification(notification) {

  const notifications =
    getNotifications();

  const newNotification = {

    id:
      notification.id ||
      `NOT-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    createdAt:
      new Date().toISOString(),

    read: false,

    ...notification,

  };

  const updatedNotifications = [
    newNotification,
    ...notifications,
  ];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      updatedNotifications
    )
  );

  // Notify components in the same tab
  window.dispatchEvent(
    new Event(NOTIFICATION_EVENT)
  );

  return newNotification;
}


// ============================================
// MARK ONE AS READ
// ============================================

export function markNotificationRead(id) {

  const notifications =
    getNotifications();

  const updatedNotifications =
    notifications.map(
      (notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
    );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      updatedNotifications
    )
  );

  window.dispatchEvent(
    new Event(NOTIFICATION_EVENT)
  );
}


// ============================================
// MARK ALL AS READ
// ============================================

export function markAllNotificationsRead(
  audience = null
) {

  const notifications =
    getNotifications();

  const updatedNotifications =
    notifications.map(
      (notification) => {

        if (
          !audience ||
          notification.audience ===
            audience
        ) {
          return {
            ...notification,
            read: true,
          };
        }

        return notification;
      }
    );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      updatedNotifications
    )
  );

  window.dispatchEvent(
    new Event(NOTIFICATION_EVENT)
  );
}