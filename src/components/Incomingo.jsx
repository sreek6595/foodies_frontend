import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaClipboardList,
  FaShoppingCart,
  FaMoneyBill,
  FaStar,
  FaUserTie,
  FaBell,
} from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { useQuery } from "@tanstack/react-query";
import { getUserNotificationsAPI } from "../services/notificationService";
import { getOrdersowner } from "../services/orderServices";

const Incomingo = () => {
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ["restaurantNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Fetch orders using useQuery
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ["ownerOrders"],
    queryFn: getOrdersowner,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    select: (data) => data || [], // Ensure empty array if data is undefined
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter((notif) => !notif.read).length;

  // Handle unauthorized error
  useEffect(() => {
    if (isError && error?.response?.status === 401) {
      console.warn("Unauthorized access. Redirecting to login...");
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [isError, error, navigate]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6 pt-24">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg p-4 flex flex-col md:flex-row justify-between items-center text-white z-20">
        <div className="flex items-center ml-6">
          <img
            src="/image.jpeg"
            alt="Foodies Corner"
            className="h-12 mr-3 rounded-full object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/48?text=Logo")}
          />
          <span className="text-2xl font-extrabold text-red-500 tracking-tight">
            Foodies Corner
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-300 hover:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
              onClick={() => navigate(item.route)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Navigate to ${item.label}`}
            >
              {item.icon}
              {item.label}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-4 mr-6">
          <motion.button
            onClick={() => navigate("/restnotify")}
            className="relative text-white text-lg p-2 rounded-full hover:bg-gray-700 transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`View notifications (${notificationCount} unread)`}
          >
            <FaBell />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {notificationCount}
              </span>
            )}
          </motion.button>

          <button
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            onClick={handleLogout}
            aria-label="Log out"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl w-full mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center tracking-tight">
          Incoming Orders
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading orders...</p>
          </div>
        ) : isError ? (
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Error Loading Orders</h3>
            <p className="text-gray-600 mb-6">
              {error?.response?.status === 401
                ? "Please log in to view orders."
                : error?.response?.status === 404
                ? "Orders endpoint not found. Please check the server configuration or contact support."
                : error?.message || "Failed to fetch orders. Please try again later."}
            </p>
            {error?.response?.status === 401 && (
              <button
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onClick={() => navigate("/login")}
                aria-label="Go to login page"
              >
                Go to Login
              </button>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Orders Available</h3>
            <p className="text-gray-600 text-lg">There are no orders at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">
                      <strong className="font-medium">Customer:</strong>{" "}
                      {order.user?.username || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong className="font-medium">Contact:</strong> {order.contact || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong className="font-medium">Email:</strong> {order.user?.email || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong className="font-medium">Address:</strong> {order.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                      <div>
                        <strong className="font-medium text-gray-700">Items:</strong>
                        <ul className="list-disc pl-5 mt-1 text-gray-600">
                          {order.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="mb-2">
                              <p>
                                <strong className="font-medium">Category:</strong>{" "}
                                {item?.menuItem?.category || "N/A"}
                              </p>
                              <p>
                                <strong className="font-medium">Item Name:</strong>{" "}
                                {item?.menuItem?.name || "N/A"}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        <strong className="font-medium">Items:</strong> {order.orderItems || "N/A"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <p className="text-gray-700">
                    <strong className="font-medium">Total Amount:</strong> ₹
                    {order.totalAmount || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium">Payment Status:</strong>{" "}
                    <span
                      className={
                        order.paymentStatus === "Completed" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {order.paymentStatus || "N/A"}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium">Delivery Option:</strong>{" "}
                    {order.paymentDetails || "N/A"}
                  </p>
                  {order.specialInstructions && (
                    <p className="text-gray-700">
                      <strong className="font-medium">Instructions:</strong>{" "}
                      {order.specialInstructions}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Incomingo;