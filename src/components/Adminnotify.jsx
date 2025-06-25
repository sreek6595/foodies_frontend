import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserNotificationsAPI,
  markNotificationAsReadAPI,
  deleteNotificationAPI,
} from "../services/notificationService";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaUtensils, FaUser, FaMotorcycle, FaMoneyBill, FaBell, FaSignOutAlt } from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";

const AdminNotify = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch notifications with refetch function
  const { data: notifications = [], isLoading: notificationsLoading, isError: notificationsError, error: notificationsErrorObj, refetch } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: getUserNotificationsAPI,
    retry: 1,
    onError: (error) => {
      console.error("Notification fetch error:", error);
    },
  });
console.log(notifications);

  // Count notifications where read is false
  const notificationCount = notifications.filter((notif) => !notif.read).length;

  // Mutation for marking a single notification as read
  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationAsReadAPI,
    onMutate: async (id) => {
      await queryClient.cancelQueries(["adminNotifications"]);
      const previousNotifications = queryClient.getQueryData(["adminNotifications"]);

      queryClient.setQueryData(["adminNotifications"], (old) =>
        old.map((notif) => (notif._id === id ? { ...notif, read: true } : notif))
      );

      return { previousNotifications };
    },
    onError: (err, id, context) => {
      console.error("Mark as read error:", err);
      queryClient.setQueryData(["adminNotifications"], context.previousNotifications);
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(["adminNotifications"], (old) =>
        old.map((notif) => (notif._id === id ? { ...notif, read: true } : notif))
      );
    },
  });

  // Mutation for marking all notifications as read
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: deleteNotificationAPI,
    onSuccess: () => {
      queryClient.setQueryData(["adminNotifications"], []);
    },
    onError: (err) => {
      console.error("Mark all as read error:", err);
    },
  });

  // Handle Logout
  const handleLogout = () => {
    logoutAction();
    sessionStorage.clear();
    navigate("/login");
  };

  // Menu items for sidebar
  const menuItems = [
    { label: "Verify Restaurants", icon: <FaChartLine />, route: "/adminverifyres" },
    { label: "Restaurants", icon: <FaUtensils />, route: "/adminrestview" },
    { label: "Customers", icon: <FaUser />, route: "/admincustview" },
    { label: "Delivery Boys", icon: <FaMotorcycle />, route: "/admindbview" },
    { label: "Payment Status", icon: <FaMoneyBill />, route: "/paystatus" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 fixed h-full shadow-lg"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight">Admin Panel</h2>
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <motion.button
                className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  item.route === "/adminnot" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => navigate(item.route)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.icon}
                {item.label}
              </motion.button>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {/* Navbar */}
        <nav className="bg-white shadow-lg rounded-xl p-4 flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Notifications</h1>
          <div className="flex items-center gap-4">
            {/* Notification Button */}
            <motion.button
              className="relative flex items-center gap-2 px-4 py-2 text-gray-800 font-semibold rounded-lg transition duration-300 ease-in-out bg-gray-100"
              onClick={() => navigate("/adminnot")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View notifications"
            >
              <FaBell />
              {notificationsLoading ? (
                <span>Loading...</span>
              ) : notificationsError ? (
                <span>Error</span>
              ) : (
                notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                    {notificationCount}
                  </span>
                )
              )}
              Notifications
            </motion.button>
            {/* Logout Button */}
            <motion.button
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Log out"
            >
              Logout
            </motion.button>
          </div>
        </nav>

        {/* Notifications Content */}
        <motion.div
          className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl mx-auto border border-gray-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 flex items-center gap-2">
              <FaBell /> Admin Notifications
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
                disabled={notificationsLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                {notificationsLoading ? "Loading..." : "Refresh"}
              </button>
              <button
                onClick={() => markAllAsRead()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                disabled={notificationsLoading || notifications.length === 0}
              >
                Mark All as Read
              </button>
            </div>
          </div>

          {notificationsLoading ? (
            <p className="text-center text-gray-500">Loading notifications...</p>
          ) : notificationsError ? (
            <p className="text-center text-red-500">
              Error loading notifications: {notificationsErrorObj?.message || "Unknown error"}
            </p>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <motion.div
                  key={notif._id}
                  className={`p-4 rounded-lg shadow-md ${
                    notif.read ? "bg-gray-200" : "bg-blue-100"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {"New Complaint Registered"}
                  </h3>
                  <p className="text-gray-700">{notif.message || "No Message"}</p>
                  <span className="text-gray-500 text-sm">
                    {notif.timestamp || (notif.date ? new Date(notif.date).toLocaleString() : "No Date")}
                  </span>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                    >
                      Mark as Read
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No new notifications.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNotify;