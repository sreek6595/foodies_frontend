import { useQuery } from "@tanstack/react-query";
import { getPaymentsownerAPI } from "../services/paymentServices";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUtensils, FaClipboardList, FaShoppingCart, FaMoneyBill, FaStar, FaUserTie, FaBell } from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { useQuery as useNotificationsQuery } from "@tanstack/react-query";
import { getUserNotificationsAPI } from "../services/notificationService";

const ViewPay = () => {
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
    { label: "Review & Rating", icon: <FaStar />, route: "/viewreview" },
    { label: "Profile", icon: <FaUserTie />, route: "/resprofile" },
  ];

  // Fetch payment data using useQuery
  const {
    data: paymentData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ownerPayments"],
    queryFn: async () => {
      try {
        // Add a timeout for the API call
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("API request timed out")), 10000); // 10 seconds
        });
        const data = await Promise.race([getPaymentsownerAPI(), timeoutPromise]);
        console.log("Payments data fetched:", data);
        return data || []; // Ensure array is returned
      } catch (err) {
        console.error("Error in useQuery:", err.message);
        throw err; // Propagate error to useQuery
      }
    },
    retry: 1, // Allow one retry
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
console.log(paymentData)

  // Loading state
  if (isLoading) {
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
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-gray-600 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            ></path>
          </svg>
          <p className="text-gray-500 mt-2">Loading owner payments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
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
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Error loading owner payments: {error?.message || "Unknown error"}
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Success state
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">View Owner Payments</h2>

        {paymentData.length === 0 ? (
          <p className="text-center text-gray-500">No payments found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                <th className="border border-gray-300 px-4 py-2">Total Amount (₹)</th>
                <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                <th className="border border-gray-300 px-4 py-2">Payment Method</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((payment, index) => (
                <tr key={index} className="text-center bg-white">
                  <td className="border border-gray-300 px-4 py-2">{payment.orderId?._id}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment?.user?.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.amount}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 font-semibold ${
                      payment.paymentStatus === "Completed"
                        ? "text-green-600"
                        : payment.paymentStatus === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {payment.paymentStatus}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{payment.paymentMethod}</td>
                  <td className="border border-gray-300 px-4 py-2">
  {payment.createdAt
    ? new Date(payment.createdAt).toLocaleDateString()
    : "N/A"}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewPay;