import { useState } from "react";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getReviewsAPI, getReviewsResAPI } from "../services/restaurantServices";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUtensils, FaClipboardList, FaShoppingCart, FaMoneyBill, FaStar as FaStarIcon, FaUserTie, FaBell } from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { useQuery as useNotificationsQuery } from "@tanstack/react-query";
import { getUserNotificationsAPI } from "../services/notificationService";

const Viewreview = () => {
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useNotificationsQuery({
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
    { label: "Review & Rating", icon: <FaStarIcon />, route: "/viewreview" },
    { label: "Profile", icon: <FaUserTie />, route: "/resprofile" },
  ];

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviewsResAPI,
    retry: false,
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6 pt-24">
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

      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Customer Reviews & Ratings</h2>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-600">No reviews available yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{review.user.username}</h3>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="flex items-center mt-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-500" fill="currentColor" />
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, i) => (
                    <Star key={i + review.rating} size={18} className="text-gray-300" />
                  ))}
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewreview;