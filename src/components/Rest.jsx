import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUtensils, FaClipboardList, FaShoppingCart, FaMoneyBill, FaStar, FaUserTie, FaBell, FaEnvelope, FaPhone } from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { useQuery } from "@tanstack/react-query";
import { getUserNotificationsAPI } from "../services/notificationService";

const Rest = () => {
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ["restaurantNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter((notif) => !notif.read).length;

  const handleLogout = () => {
    logoutAction();
    sessionStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { label: "Registration", icon: <FaUtensils />, route: "/regis" },
    { label: "Add Food Menu", icon: <FaClipboardList />, route: "/viewfoodlist" },
    { label: "Incoming Orders", icon: <FaShoppingCart />, route: "/incoming" },
    { label: "Payment", icon: <FaMoneyBill />, route: "/viewpay" },
    { label: "Review & Rating", icon: <FaStar />, route: "/viewreview" },
    { label: "Profile", icon: <FaUserTie />, route: "/resprofile" },
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex flex-col"
      style={{
        backgroundImage: "url('/restaurant_dashboard_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-opacity-60"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 shadow-md p-4 flex flex-col md:flex-row justify-between items-center text-white z-20">
        <div className="flex items-center ml-6">
          <img src="/image.jpeg" alt="Foodies Corner" className="h-16 mr-2 rounded-full" />
          <span className="text-2xl font-bold text-red-500">Foodies Corner</span>
        </div>

        {/* Functionalities in a Horizontal Row */}
        <div className="flex space-x-6 mt-4 md:mt-0">
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
        </div>

        {/* Right Section: Bell Icon + Logout Button */}
        <div className="flex items-center space-x-4 mr-6">
          {/* Bell Icon (🔔) */}
          <motion.button
            onClick={() => navigate("/restnotify")}
            className="relative text-white text-xl p-2 rounded-full hover:bg-gray-700 transition"
            whileHover={{ scale: 1.2 }}
          >
            <FaBell />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {notificationCount}
              </span>
            )}
          </motion.button>

          {/* Logout Button */}
          <button
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 flex flex-col items-center justify-center flex-grow text-center relative z-10">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Your Restaurant Page
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
                <span className="text-lg font-bold text-red-500">Foodies Corner</span>
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

export default Rest;