import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { addComplaintAPI } from "../services/complaintServices";
import {
  FaUtensils,
  FaConciergeBell,
  FaShoppingCart,
  FaTruck,
  FaHeadset,
  FaUser,
  FaBell,
} from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { getUserNotificationsAPI } from "../services/notificationService";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const CustomerNavbar = () => {
  const navigate = useNavigate();

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
    // { label: "Order Tracking", icon: <FaTruck />, route: "/ordert" },
    { label: "Profile", icon: <FaUser />, route: "/customerprofile" },
    { label: "Report an Issue", icon: <FaHeadset />, route: "/order" },
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

const Complaint = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const complaintTypes = [
    "Order Issue",
    "Delivery Delay",
    "Incorrect Item",
    "Payment Issue",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Restaurant Name is required";
    if (!formData.subject) newErrors.subject = "Select a complaint type";
    if (!formData.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const complaintMutation = useMutation({
    mutationFn: addComplaintAPI,
    mutationKey: ["add-complaint"],
    onSuccess: () => {
      alert("Your complaint has been submitted successfully!");
      setFormData({
        name: "",
        subject: "",
        description: "",
      });
      setErrors({});
    },
    onError: (error) => {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("subject", formData.subject);
    data.append("description", formData.description);

    complaintMutation.mutate(data);
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
          Submit a Restaurant Complaint
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Restaurant Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter restaurant name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Complaint Type</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select</option>
              {complaintTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows="4"
              placeholder="Describe the issue with the restaurant"
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
            disabled={complaintMutation.isPending}
          >
            {complaintMutation.isPending ? "Submitting..." : "Submit Complaint"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Complaint;