import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getUserNotificationsAPI, 
  markNotificationAsReadAPI,
  deleteNotificationAPI
} from "../services/notificationService";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaList, FaCommentDots, FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";
import { logoutAction } from "../redux/userslice";

const Deliveryno = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch notifications with refetch function
  const { data: notifications = [], refetch } = useQuery({
    queryKey: ["deliveryNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter(notif => !notif.read).length;

  // Mutation for marking a single notification as read
  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationAsReadAPI,
    onMutate: async (id) => {
      await queryClient.cancelQueries(["deliveryNotifications"]);
      const previousNotifications = queryClient.getQueryData(["deliveryNotifications"]);

      queryClient.setQueryData(["deliveryNotifications"], (old) =>
        old.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );

      return { previousNotifications };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["deliveryNotifications"], context.previousNotifications);
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(["deliveryNotifications"], (old) =>
        old.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    },
  });

  // Mutation for marking all notifications as read
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: deleteNotificationAPI,
    onSuccess: () => {
      queryClient.setQueryData(["deliveryNotifications"], []);
    },
  });

  // Handle Logout
  const handleLogout = () => {
    logoutAction();
    sessionStorage.clear();
    navigate("/login");
  };

  // Menu items for navbar
  const menuItems = [
    { label: "Order List", icon: <FaList />, route: "/vieworderlist" },
    { label: "View Feedback", icon: <FaCommentDots />, route: "/viewfeeddb" },
    { label: "Profile", icon: <FaUserCircle />, route: "/dbprofile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 shadow-md p-4 flex flex-col md:flex-row justify-between items-center text-white z-20">
        <h1 className="text-2xl font-bold ml-6 flex items-center gap-2">
          <FaTruck /> Foodies Corner-Delivery Partner
        </h1>

        {/* Navigation Buttons */}
        <div className="flex space-x-6 mt-4 md:mt-0 items-center">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition duration-300 ease-in-out ${
                item.route === "/deliverynot" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => navigate(item.route)}
              whileHover={{ scale: 1.1 }}
            >
              {item.icon} {item.label}
            </motion.button>
          ))}
          {/* Notification Button */}
          <motion.button
            className="relative flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition duration-300 ease-in-out bg-gray-700"
            onClick={() => navigate("/deliverynot")}
            whileHover={{ scale: 1.1 }}
          >
            <FaBell />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {notificationCount}
              </span>
            )}
            Notifications
          </motion.button>
        </div>

        {/* Logout Button */}
        <button
          className="mr-6 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="pt-24 p-6">
        <motion.div
          className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl mx-auto border border-gray-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 flex items-center gap-2">
              <FaBell /> Delivery Partner Notifications
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
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
                Refresh
              </button>
              <button
                onClick={() => markAllAsRead()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Mark All as Read
              </button>
            </div>
          </div>

          {notifications.length > 0 ? (
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
                    {notif.title}
                  </h3>
                  <p className="text-gray-700">{notif.message}</p>
                  <span className="text-gray-500 text-sm">
                    {notif.timestamp || new Date(notif.date).toLocaleString()}
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

export default Deliveryno;