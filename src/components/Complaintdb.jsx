import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FaUtensils,
  FaConciergeBell,
  FaShoppingCart,
  FaTruck,
  FaHeadset,
  FaUser,
  FaBell,
  FaChevronDown,
  FaStar,
} from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { getUserNotificationsAPI } from "../services/notificationService";
import { useNavigate, useParams } from "react-router-dom";
import { submitDeliveryFeedbackAPI } from "../services/complaintServices";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ["customerNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  const notificationCount = notifications.filter((notif) => !notif.read).length;

  const handleLogout = () => {
    logoutAction();
    sessionStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { label: "View Restaurants", icon: <FaUtensils />, route: "/restaurantview" },
    { label: "Menu", icon: <FaConciergeBell />, route: "/foodmenuview" },
    { label: "View Cart", icon: <FaShoppingCart />, route: "/carto" },
    { label: "Order Tracking", icon: <FaTruck />, route: "/ordert" },
    { label: "Profile", icon: <FaUser />, route: "/customerprofile" },
  ];

  const complaintOptions = [
    { label: "Restaurant Complaint", route: "/order" },
    { label: "Delivery Complaint", route: "/complaintdb" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg p-4 flex flex-col md:flex-row justify-between items-center text-white z-20">
      <div className="flex items-center ml-6">
        <img
          src="/image.jpeg"
          alt="Foodies Corner"
          className="h-12 mr-3 rounded-full object-cover"
          onError={(e) => (e.target.src = "https://via.placeholder.com/48?text=Logo")}
        />
        <span className="text-2xl font-extrabold text-red-500 tracking-tight">Foodies Corner</span>
      </div>

      <ul className="flex flex-wrap gap-4 mt-4 md:mt-0">
        {menuItems.map((item, index) => (
          <li key={index}>
            <motion.button
              className="nav-link flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
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
        <li className="relative">
          <motion.button
            className="nav-link flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Report an Issue"
          >
            <FaHeadset />
            Report an Issue
            <FaChevronDown className={`ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </motion.button>
          {isDropdownOpen && (
            <motion.ul
              className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {complaintOptions.map((option, index) => (
                <li key={index}>
                  <motion.button
                    className="w-full text-left px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 rounded-lg"
                    onClick={() => {
                      navigate(option.route);
                      setIsDropdownOpen(false);
                    }}
                    whileHover={{ backgroundColor: "#4B5563" }}
                    aria-label={`Navigate to ${option.label}`}
                  >
                    {option.label}
                  </motion.button>
                </li>
              ))}
            </motion.ul>
          )}
        </li>
      </ul>

      <div className="flex items-center gap-4 mr-6">
        <motion.button
          onClick={() => navigate("/custnotify")}
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
  );
};

const Complaintdb = () => {
  const order=useParams()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    rating: 0,
  });

  const [errors, setErrors] = useState({});

  const feedbackTypes = ["Feedback", "Complaint"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRating = (rating) => {
    setFormData({ ...formData, rating });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.type) newErrors.type = "Please select a type";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.type === "Feedback" && formData.rating === 0) {
      newErrors.rating = "Please provide a star rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const feedbackMutation = useMutation({
    mutationFn: submitDeliveryFeedbackAPI,
    mutationKey: ["submit-feedback"],
    onSuccess: () => {
      alert("Your submission has been received successfully!");
      setFormData({
        type: "",
        description: "",
        rating: 0,
      });
      setErrors({});
      // Redirect to order tracking after submission
    },
    onError: (error) => {
      console.error("Error submitting feedback:", error);
      alert(` ${error.response?.data?.message || error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      orderId:order.id,
      type: formData.type,
      comment: formData.description,
      ...(formData.type === "Feedback" && { rating: formData.rating }),
    };

    feedbackMutation.mutate(data);
  };

  return (
    <div className="pt-24">
      <CustomerNavbar />
      <motion.div
        className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg mt-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Submit Delivery Feedback or Complaint
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select</option>
              {feedbackTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}
          </div>

          {formData.type === "Feedback" && (
            <div>
              <label className="block font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-2xl ${
                      formData.rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <FaStar />
                  </motion.button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating}</p>
              )}
            </div>
          )}

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows="4"
              placeholder="Describe your feedback or complaint about the delivery"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={feedbackMutation.isPending}
          >
            {feedbackMutation.isPending ? "Submitting..." : "Submit"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Complaintdb;