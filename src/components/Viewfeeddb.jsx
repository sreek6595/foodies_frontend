import React from "react";
import { motion } from "framer-motion";
import { FaTruck, FaList, FaCommentDots, FaUserCircle, FaBell, FaSignOutAlt, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserNotificationsAPI } from "../services/notificationService";
import { logoutAction } from "../redux/Userslice";
import { getDeliveryBoyfeedbackAPI } from "../services/deliveryboyServices";

const Viewfeeddb = () => {
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ["deliveryNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Fetch feedback data
  const { 
    data: feedback = [], 
    isLoading, 
    isError
  } = useQuery({
    queryKey: ["deliveryFeedback"],
    queryFn: getDeliveryBoyfeedbackAPI,
  });

  console.log(feedback);

  // Count notifications where read is false
  const notificationCount = notifications.filter(notif => !notif.read).length;

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

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= rating ? "text-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  // Animation variants for feedback cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar (Unchanged) */}
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
                item.route === "/viewfeeddb" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
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

      {/* Main Content (Enhanced) */}
      <div className="pt-24 px-4 md:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaCommentDots className="text-blue-500" /> Customer Feedback
            </h2>

            <div className="mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 text-lg mt-4">Loading feedback...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-10">
                  <p className="text-red-500 text-lg font-medium">Error loading feedback</p>
                  <p className="text-gray-500 mt-2">Please try again later.</p>
                </div>
              ) : feedback.length > 0 ? (
                <div className="space-y-4">
                  {feedback.map((fb, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            Order ID: <span className="text-blue-600">{fb.orderId || "N/A"}</span>
                          </h3>
                          <p className="text-gray-600 mt-2">
                            <span className="font-medium">Comment:</span> {fb.comment || "No comment provided"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Rating:</span>
                          <div className="flex items-center gap-1">
                            {fb.rating ? renderStars(fb.rating) : (
                              <span className="text-gray-500 text-sm">No rating</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FaCommentDots className="text-gray-400 text-4xl mx-auto" />
                  <p className="text-gray-600 text-lg font-medium mt-4">No feedback received yet.</p>
                  <p className="text-gray-500 mt-2">Check back later for customer reviews.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Viewfeeddb;