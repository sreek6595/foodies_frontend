import { useState, Component } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaChartLine, FaUtensils, FaUser, FaMotorcycle } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDeliveryBoyFeedback } from "../services/adminService";

import { delUserAPI } from "../services/userServices";
import { delDriverAPI } from "../services/complaintServices";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-gray-600 mt-2">Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Admincustview = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: feedback = [],
    isLoading: isFeedbackLoading,
    error: feedbackError,
    refetch,
  } = useQuery({
    queryKey: ["delivery-feedback"],
    queryFn: getDeliveryBoyFeedback,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    select: (data) => data || [], // fallback to empty array
  });

  // Mutation for deleting delivery boy
  const deleteDeliveryBoyMutation = useMutation({
    mutationFn: delDriverAPI,
    onSuccess: () => {
      refetch();
      setSuccessMessage("Delivery boy deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      setSuccessMessage(`Failed to delete delivery boy: ${error.message}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  console.log(feedback);

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/adminverifyres"
                className="flex items-center gap-3 text-gray-300 hover:text-white"
              >
                <FaChartLine /> Verify Restaurants
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminrestview"
                className="flex items-center gap-3 text-gray-300 hover:text-white"
              >
                <FaUtensils /> Restaurants
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admincustview"
                className="flex items-center gap-3 text-gray-300 hover:text-white"
              >
                <FaUser /> Delivery Boy Complaints
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admindbview"
                className="flex items-center gap-3 text-gray-300 hover:text-white"
              >
                <FaMotorcycle /> Delivery Boys
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6">
          {/* Navbar */}
          <nav className="bg-white shadow-md p-4 flex justify-between items-center rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Back
            </button>
          </nav>

          {/* Success/Error Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 p-4 rounded-lg shadow-lg text-center text-lg text-white ${
                successMessage.includes("Failed") ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {successMessage}
            </motion.div>
          )}

          {/* Delivery Boy Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl border border-gray-200 mt-6"
          >
            <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 border-b pb-4 uppercase">
              Delivery Boy Complaints
            </h2>
            {isFeedbackLoading ? (
              <div className="text-center">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                <p className="text-gray-500 mt-2">Loading feedback...</p>
              </div>
            ) : feedbackError ? (
              <div className="text-center">
                <p className="text-red-500">
                  Error loading feedback: {feedbackError.message}
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : !Array.isArray(feedback) || feedback.length === 0 ? (
              <p className="text-gray-500 text-center">No feedback found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-700 text-white text-lg">
                      <th className="p-4 text-left">Customer</th>
                      <th className="p-4 text-left">Delivery Boy</th>
                      <th className="p-4 text-left">Complaint</th>
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b hover:bg-gray-100 transition duration-300"
                      >
                        <td className="p-4 text-gray-900 font-medium">
                          {item.userId?.username || "Unknown"}
                        </td>
                        <td className="p-4 text-gray-900 font-medium">
                          {item.deliveryBoyId?.username || "Unknown"}
                        </td>
                        <td className="p-4 text-gray-700">{item.comment || "N/A"}</td>
                        <td className="p-4">
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            onClick={() => deleteDeliveryBoyMutation.mutate(item.deliveryBoyId._id)}
                            disabled={deleteDeliveryBoyMutation.isLoading}
                          >
                            {deleteDeliveryBoyMutation.isLoading ? "Deleting..." : "Delete Delivery Boy"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Admincustview;