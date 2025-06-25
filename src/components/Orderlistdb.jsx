import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTruck, FaSearch, FaCheckCircle, FaClock, FaTimesCircle, FaShippingFast, FaList, FaCommentDots, FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { getDeliveryByOrderAPI, sendOTPAPI, updateDeliveryStatusAPI } from "../services/deliveryServices";
import { getUserNotificationsAPI } from "../services/notificationService";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../redux/Userslice";

const Orderlistdb = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ["deliveryNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter(notif => !notif.read).length;

  // Fetch orders
  const { data: orderData, isLoading, isError, error } = useQuery({
    queryKey: ["deliveryByOrder"],
    queryFn: getDeliveryByOrderAPI,
    retry: (failureCount, err) => {
      if (err.response?.status === 500) return false;
      return failureCount < 3;
    },
    onError: (err) => {
      if (err.response?.status === 500) return;
      toast.error(`Error loading orders: ${err.message}`);
    },
  });

  // Transform data to match expected structure
  const orders = orderData
    ? [
        {
          id: orderData._id || orderData?.order || "N/A",
          customer: orderData?.user?.username || "Unknown Customer",
          address: orderData?.address || "No address provided",
          contact: orderData?.contact || "No phone provided",
          otp: orderData?.otp || "No otp found",
          status: orderData?.status || "Pending",
        },
      ]
    : [];

  // Mutation for sending OTP
  const sendOtpMutation = useMutation({
    mutationFn: sendOTPAPI,
    onSuccess: (_, orderId) => {
      toast.success("OTP sent successfully!");
      queryClient.invalidateQueries(["deliveryByOrder"]);
    },
    onError: (err) => {
      toast.error(`Error sending OTP: ${err.message || "Unknown error"}`);
    },
  });

  // Mutation for updating delivery status
  const updateStatusMutation = useMutation({
    mutationFn: updateDeliveryStatusAPI,
    onSuccess: (_, { orderId }) => {
      toast.success("Delivery status updated to Delivered!");
      queryClient.invalidateQueries(["deliveryByOrder"]);
    },
    onError: (err) => {
      toast.error(`Error updating status: ${err.message || "Unknown error"}`);
    },
  });

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <FaCheckCircle /> Delivered
          </span>
        );
      case "Out for Delivery":
        return (
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <FaShippingFast /> Out for Delivery
          </span>
        );
      case "Pending":
        return (
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <FaClock /> Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <FaTimesCircle /> Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-gray-500 text-white px-3 py-1 rounded-full">{status}</span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Navbar */}
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
                item.route === "/vieworderlist" ? "bg-gray-700" : "hover:bg-gray-700"
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

      {/* Main Content */}
      <div className="p-6 pt-24">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <FaTruck /> Order List
            </h1>
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading order details...</p>
            </div>
          ) : isError && error.response?.status !== 500 ? (
            <div className="text-center py-12 text-red-500">
              <p className="text-lg">Error loading orders: {error.message}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">There are no orders.</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">OTP</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(
                    (order) =>
                      order.customer.toLowerCase().includes(search.toLowerCase()) ||
                      order.id.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((order, index) => (
                    <motion.tr
                      key={order.id}
                      className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="py-3 px-4">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.address}</td>
                      <td className="py-3 px-4">{order.contact}</td>
                      <td className="py-3 px-4">{order?.otp}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sendOtpMutation.mutate(order.id);
                          }}
                          disabled={
                            !["Pending", "Out for Delivery"].includes(order.status) ||
                            sendOtpMutation.isLoading
                          }
                          className={`px-3 py-1 rounded-lg text-sm ${
                            ["Pending", "Out for Delivery"].includes(order.status)
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Send OTP
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatusMutation.mutate({
                              id: order.id,
                              status: "Delivered",
                            });
                          }}
                          disabled={
                            !["Pending", "Out for Delivery"].includes(order.status) ||
                            sendOtpMutation.isLoading
                          }
                          className={`px-3 py-1 rounded-lg text-sm ${
                            ["Pending", "Out for Delivery"].includes(order.status)
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Delivery Successful
                        </button>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orderlistdb;