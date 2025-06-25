import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  FaUser,
  FaUtensils,
  FaMotorcycle,
  FaChartLine,
  FaMoneyBill,
  FaShoppingCart,
  FaStar,
  FaBell,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getOrdersAPI } from "../services/orderServices";
import { getUsersAPI } from "../services/userServices";
import { getallReviewsAPI, viewAllRestaurantsAPI } from "../services/restaurantServices";
import { getUserNotificationsAPI } from "../services/notificationService"; // Import notification service
import { logoutAction } from "../redux/Userslice";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch data
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorObj,
  } = useQuery({
    queryFn: getOrdersAPI,
    queryKey: ["orders-view"],
    retry: 1,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryFn: getallReviewsAPI,
    queryKey: ["reviews-view"],
    retry: 1,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryFn: getUsersAPI,
    queryKey: ["users-view"],
    retry: 1,
  });

  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryFn: viewAllRestaurantsAPI,
    queryKey: ["restaurants-view"],
    retry: 1,
  });

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryFn: getUserNotificationsAPI,
    queryKey: ["adminNotifications"],
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter((notif) => !notif.read).length;

  // Handle 401 errors
  useEffect(() => {
    if (ordersError && ordersErrorObj?.response?.status === 401) {
      console.warn("Unauthorized access. Redirecting to login...");
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [ordersError, ordersErrorObj, navigate]);

  // Logout handler
  const handleLogout = () => {
    dispatch(logoutAction());
    sessionStorage.clear();
    navigate("/login");
  };

  // Bar Chart: Orders per restaurant
  const barChartData = {
    labels: restaurantsLoading || !restaurants ? [] : restaurants.map((restaurant) => restaurant.name || restaurant._id?.toString() || "Unknown"),
    datasets: [
      {
        label: "Orders per Restaurant",
        data: restaurantsLoading || !restaurants || ordersLoading || !orders
          ? []
          : restaurants.map((restaurant) =>
              orders.filter((order) => order.restaurant?._id?.toString() === restaurant._id?.toString()).length
            ),
        backgroundColor: restaurantsLoading || !restaurants
          ? []
          : restaurants.map((_, index) => [
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#22D3EE",
            ][index % 6]),
        borderRadius: 4,
      },
    ],
  };

  // Pie Chart: Order status distribution
  const pieChartData = {
    labels: ["Pending", "Accepted", "Preparing", "Ready for Pickup", "Delivered", "Cancelled"],
    datasets: [
      {
        data: ordersLoading
          ? [0, 0, 0, 0, 0, 0]
          : [
              orders?.filter((order) => order.status === "Pending").length || 0,
              orders?.filter((order) => order.status === "Accepted").length || 0,
              orders?.filter((order) => order.status === "Preparing").length || 0,
              orders?.filter((order) => order.status === "Ready for Pickup").length || 0,
              orders?.filter((order) => order.status === "Delivered").length || 0,
              orders?.filter((order) => order.status === "Cancelled").length || 0,
            ],
        backgroundColor: ["#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", "#22D3EE", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  // Line Chart: Orders over time (by month)
  const getOrdersByMonth = () => {
    if (ordersLoading || !orders) return { labels: [], data: [] };
    const monthlyCounts = {};
    
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    const sortedKeys = Object.keys(monthlyCounts).sort((a, b) => {
      const [monthA, yearA] = a.split("/").map(Number);
      const [monthB, yearB] = b.split("/").map(Number);
      const dateA = new Date(yearA, monthA - 1);
      const dateB = new Date(yearB, monthB - 1);
      return dateA - dateB;
    });

    return {
      labels: sortedKeys,
      data: sortedKeys.map((key) => monthlyCounts[key]),
    };
  };

  const lineChartData = {
    labels: getOrdersByMonth().labels,
    datasets: [
      {
        label: "Orders per Month",
        data: getOrdersByMonth().data,
        fill: false,
        borderColor: "#3B82F6",
        tension: 0.3,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };

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
          {[
            { label: "Verify Restaurants", icon: <FaChartLine />, route: "/adminverifyres" },
            { label: "Restaurants", icon: <FaUtensils />, route: "/adminrestview" },
            { label: "Delivery boy complaints", icon: <FaUser />, route: "/admincustview" },
            { label: "Delivery Boys", icon: <FaMotorcycle />, route: "/admindbview" },
            { label: "Payment Status", icon: <FaMoneyBill />, route: "/paystatus" },
          ].map((item, index) => (
            <li key={index}>
              <motion.button
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Notification Button */}
            <motion.button
              className="relative flex items-center gap-2 px-4 py-2 text-gray-800 font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-gray-100"
              onClick={() => navigate("/adminnot")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View notifications"
            >
              <FaBell />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {notificationCount}
                </span>
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

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Orders", value: ordersLoading ? "Loading..." : orders?.length || 0, icon: <FaShoppingCart /> },
            { title: "Total Users", value: usersLoading ? "Loading..." : users?.length || 0, icon: <FaUser /> },
            { title: "Total Reviews", value: reviewsLoading ? "Loading..." : reviews?.length || 0, icon: <FaStar /> },
            { title: "Total Restaurants", value: restaurantsLoading ? "Loading..." : restaurants?.length || 0, icon: <FaUtensils /> },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-3xl text-blue-600">{card.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <motion.div
              className="bg-white shadow-md rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Orders per Restaurant</h3>
              <Bar
                data={barChartData}
                options={{
                  plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1F2937" } },
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: "Number of Orders" } },
                    x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } },
                  },
                }}
                height={200}
              />
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              className="bg-white shadow-md rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Status Distribution</h3>
              <Pie
                data={pieChartData}
                options={{
                  plugins: {
                    legend: { position: "right", labels: { boxWidth: 12, font: { size: 12 } } },
                    tooltip: { backgroundColor: "#1F2937" },
                  },
                }}
                height={200}
              />
            </motion.div>

            {/* Line Chart */}
            <motion.div
              className="bg-white shadow-md rounded-xl p-6 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Orders Over Time</h3>
              <Line
                data={lineChartData}
                options={{
                  plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1F2937" } },
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: "Number of Orders" } },
                    x: { title: { display: true, text: "Month/Year" } },
                  },
                }}
                height={100}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;