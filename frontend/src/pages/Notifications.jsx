import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import EmptyState from "../components/EmptyState";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications/my");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await API.put("/notifications/read", {
        notificationId,
      });

      toast.success("Notification marked as read");
      fetchNotifications();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");

      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="md:flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50 p-10">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-500 mt-1">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            subtitle="Updates about applications, payments, and jobs will appear here."
          />
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white border rounded-2xl p-5 shadow-sm transition ${
                  notification.isRead
                    ? "border-gray-100"
                    : "border-indigo-300 ring-2 ring-indigo-100"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {!notification.isRead && (
                        <span className="h-3 w-3 rounded-full bg-indigo-600" />
                      )}

                      <h2 className="text-lg font-semibold">
                        {notification.title}
                      </h2>

                      {notification.type && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          {notification.type}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600">
                      {notification.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;