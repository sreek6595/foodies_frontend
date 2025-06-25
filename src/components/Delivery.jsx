import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTruck, FaList, FaCommentDots, FaSignOutAlt, FaUserCircle, FaBell, FaEnvelope, FaPhone } from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { getUserNotificationsAPI } from "../services/notificationService";
import { useQuery } from "@tanstack/react-query";

const Delivery = () => {
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ["deliveryNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter(notif => !notif.read).length;

  const handleLogout = () => {
    logoutAction();
    sessionStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { label: "Order List", icon: <FaList />, route: "/vieworderlist" },
    { label: "View Feedback", icon: <FaCommentDots />, route: "/viewfeeddb" },
    { label: "Profile", icon: <FaUserCircle />, route: "/dbprofile" },
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex flex-col"
      style={{
        backgroundImage: "url('/dhome.webp')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
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
              className="flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition duration-300 ease-in-out hover:bg-gray-700"
              onClick={() => navigate(item.route)}
              whileHover={{ scale: 1.1 }}
            >
              {item.icon} {item.label}
            </motion.button>
          ))}
          {/* Notification Button */}
          <motion.button
            className="relative flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition duration-300 ease-in-out hover:bg-gray-700"
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
      <main className="pt-24 pb-20 flex items-center justify-center flex-grow text-center relative">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Delivery Partner
        </motion.h1>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-90 text-white py-6 w-full relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left Section: Brand and Copyright */}
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/image.jpeg" alt="Foodies Corner" className="h-12 mr-2 rounded-full" />
              <div>
                <span className="text-lg font-bold text-red-500">Foodies Corner - Delivery Partner</span>
                <p className="text-sm text-gray-400">© {new Date().getFullYear()} Foodies Corner. All rights reserved.</p>
              </div>
            </div>

            {/* Right Section: Contact Info */}
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm text-gray-300 flex items-center mb-2">
                <FaEnvelope className="mr-2" /> support@foodiescorner.com
              </p>
              <p className="text-sm text-gray-300 flex items-center">
                <FaPhone className="mr-2" /> 8304965128
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Delivery;