import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaUser, FaUtensils, FaMotorcycle, FaChartLine, FaMoneyBill } from "react-icons/fa";
import { getPaymentadminAPI } from "../services/paymentServices";


const Paymentstatusad = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // UseQuery to fetch payment data
  const { data: paymentData, isLoading, error } = useQuery({
    queryKey: ["paymentData"],
    queryFn: getPaymentadminAPI,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry failed requests twice
    onError: () => {
      setMessage("Error fetching payment data");
    },
  });

  const handleLogout = () => {
    // Implement logout logic (e.g., clear token)
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-semibold mb-5">Admin Panel</h2>
        <ul className="list-none p-0">
          <li className="mb-5">
            <a href="/adminverifyres" className="text-white no-underline flex items-center gap-2">
              <FaChartLine /> Verify restaurants
            </a>
          </li>
          <li className="mb-5">
            <a href="/adminrestview" className="text-white no-underline flex items-center gap-2">
              <FaUtensils /> Restaurants
            </a>
          </li>
          <li className="mb-5">
            <a href="/admincustview" className="text-white no-underline flex items-center gap-2">
              <FaUser /> Customers
            </a>
          </li>
          <li className="mb-5">
            <a href="/admindbview" className="text-white no-underline flex items-center gap-2">
              <FaMotorcycle /> Delivery Boys
            </a>
          </li>
          <li className="mb-5">
            <a href="/paystatus" className="text-white no-underline flex items-center gap-2">
              <FaMoneyBill /> Payment Status
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        {/* Navbar */}
        <nav className="bg-white p-4 shadow-md flex justify-between items-center rounded-xl mb-5">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Logout
          </button>
        </nav>

        {/* Payment Status Table */}
        <motion.div
          className="bg-white shadow-md p-8 rounded-xl w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4">Admin Payment Status</h2>

          {isLoading && (
            <p className="text-center text-gray-600">Loading payment data...</p>
          )}

          {message && (
            <p className="text-center text-red-500 mb-4">{message}</p>
          )}

          {paymentData && paymentData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Order ID</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Username</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentData.map((payment, index) => (
                    <motion.tr
                      key={payment.orderId}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="px-4 py-2">{payment.orderId}</td>
                      <td className="px-4 py-2">{payment.user.username}</td>
                      <td className="px-4 py-2">₹{payment.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{payment.paymentMethod}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !isLoading && (
              <p className="text-center text-gray-600">No payment data available.</p>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Paymentstatusad;