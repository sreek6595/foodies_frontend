import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaSave,
  FaLock,
  FaCamera,
  FaShoppingCart,
  FaTimes,
  FaUtensils,
  FaConciergeBell,
  FaTruck,
  FaHeadset,
  FaUser,
  FaBell,
  FaStar,
} from "react-icons/fa";
import { changePasswordAPI, editProfileAPI, getUserProfileAPI } from "../services/userServices";
import { getuserorder, cancelOrderAPI } from "../services/orderServices";
import { logoutAction } from "../redux/Userslice";
import { getUserNotificationsAPI } from "../services/notificationService";
import { useNavigate } from "react-router-dom";

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
    { label: "Menu", icon: <FaConciergeBell />, route: "/menu" },
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

const CustomerProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: userData, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfileAPI,
  });

  const { data: orders = [], isLoading: isOrdersLoading, error: ordersError } = useQuery({
    queryKey: ["userOrders"],
    queryFn: getuserorder,
    retry: 1,
  });

  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrderAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["userOrders"]);
      setCancelOrderId(null);
      setCancelReason("");
      alert("✅ Order cancelled successfully!");
    },
    onError: (error) => {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel order: " + (error.response?.data?.message || error.message));
    },
  });

  useEffect(() => {
    if ((profileError && profileError?.response?.status === 401) || (ordersError && ordersError?.response?.status === 401)) {
      console.warn("Unauthorized access. Redirecting to login...");
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [profileError, ordersError, navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const updateProfileMutation = useMutation({
    mutationFn: editProfileAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      setIsEditing(false);
      setPreviewImage(null);
      alert("✅ Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile: " + error.message);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: () => {
      setShowPasswordForm(false);
      alert("Password updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to change password:", error);
      alert("Failed to change password: " + error.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      username: userData?.username || "",
      email: userData?.email || "",
      address: userData?.address || "",
      dietaryPreferences: userData?.dietaryPreferences || "",
      allergies: userData?.allergies || "",
      image: null,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("address", values.address);
      formData.append("dietaryPreferences", values.dietaryPreferences);
      formData.append("allergies", values.allergies);
      if (values.image) {
        formData.append("image", values.image);
      }
      updateProfileMutation.mutate(formData);
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      if (values.newPassword !== values.confirmPassword) {
        alert("New passwords don't match");
        return;
      }
      changePasswordMutation.mutate({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isProfileLoading || isOrdersLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (profileError || ordersError) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-center">
        <CustomerNavbar />
        <p className="text-red-600 text-lg">
          {profileError?.response?.status === 401 || ordersError?.response?.status === 401
            ? "Please log in to view your profile."
            : profileError?.message || ordersError?.message || "Error fetching data."}
        </p>
        {(profileError?.response?.status === 401 || ordersError?.response?.status === 401) && (
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl pt-24">
      <CustomerNavbar />
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center tracking-tight">User Profile</h2>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={previewImage || userData?.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
          {isEditing && (
            <label
              htmlFor="profilePictureInput"
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all"
            >
              <FaCamera className="text-white" />
            </label>
          )}
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="mt-4">
        {isEditing ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                disabled
                className="border px-4 py-2 w-full rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Dietary Preferences</label>
              <input
                type="text"
                name="dietaryPreferences"
                value={formik.values.dietaryPreferences}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Allergies</label>
              <input
                type="text"
                name="allergies"
                value={formik.values.allergies}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <motion.button
                type="submit"
                disabled={updateProfileMutation.isLoading}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700 disabled:bg-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSave /> {updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setPreviewImage(null);
                  formik.resetForm();
                }}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 text-gray-700">
            <h2 className="text-xl font-semibold">{userData.username}</h2>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Address:</strong> {userData.address}</p>
            <p><strong>Dietary Preferences:</strong> {userData.dietaryPreferences || "None"}</p>
            <p><strong>Allergies:</strong> {userData.allergies || "None"}</p>
            <div className="flex gap-3 mt-4">
              <motion.button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Edit Profile
              </motion.button>
              <motion.button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-md flex items-center gap-2 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLock /> Change Password
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">No orders found.</p>
        ) : (
          <div className="grid gap-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                className="bg-gray-50 shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="space-y-3">
                  <div>
                    <strong className="font-medium text-gray-700">Items:</strong>
                    <ul className="list-disc pl-5 mt-1 text-gray-600">
                      {order.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <p>{item.menuItem.name} (Qty: {item.quantity})</p>
                          <p className="text-sm text-gray-500">Category: {item.menuItem.category || "N/A"}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong className="font-medium text-gray-700">Total Amount:</strong> ₹{order.totalAmount}</p>
                  <p>
                    <strong className="font-medium text-gray-700">Status:</strong>{" "}
                    <span className={order.status === "Delivered" ? "text-green-600" : "text-yellow-600"}>
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong className="font-medium text-gray-700">Payment Status:</strong>{" "}
                    <span className={order.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"}>
                      {order.paymentStatus}
                    </span>
                  </p>
                  <p>
                    <strong className="font-medium text-gray-700">Placed At:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                  <div className="flex justify-end gap-3">
                    {order.status !== "Delivered" && (
                      <motion.button
                        onClick={() => navigate(`/ordert/${order._id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Track order"
                      >
                        <FaTruck /> Track Order
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => navigate(`/complaintdb/${order._id}`)}
                      disabled={order.status !== "Delivered"}
                      className={`px-4 py-2 flex items-center gap-2 rounded-md text-white font-semibold transition-all duration-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none
                        ${order.status !== "Delivered" ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"}`}
                      whileHover={{
                        scale: order.status !== "Delivered" ? 1 : 1.05,
                      }}
                      whileTap={{
                        scale: order.status !== "Delivered" ? 1 : 0.95,
                      }}
                      aria-label={`Review order`}
                    >
                      <FaStar /> Review Order
                    </motion.button>
                    <motion.button
                      onClick={() => setCancelOrderId(order._id)}
                      disabled={
                        order.status === "Delivered" ||
                        order.status === "Cancelled" ||
                        order.status === "Out for Delivery" ||
                        cancelOrderMutation.isLoading
                      }
                      className={`px-4 py-2 flex items-center gap-2 rounded-md text-white font-semibold transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:outline-none
                        ${
                          order.status === "Delivered" ||
                          order.status === "Cancelled" ||
                          order.status === "Out for Delivery"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      whileHover={{
                        scale:
                          order.status === "Delivered" ||
                          order.status === "Cancelled" ||
                          order.status === "Out for Delivery"
                            ? 1
                            : 1.05,
                      }}
                      whileTap={{
                        scale:
                          order.status === "Delivered" ||
                          order.status === "Cancelled" ||
                          order.status === "Out for Delivery"
                            ? 1
                            : 0.95,
                      }}
                      aria-label={`Cancel order`}
                    >
                      <FaTimes /> Cancel Order
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Change Password</h3>
            <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordFormik.values.oldPassword}
                  onChange={passwordFormik.handleChange}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <motion.button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={changePasswordMutation.isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700 disabled:bg-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave /> {changePasswordMutation.isLoading ? "Updating..." : "Update Password"}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cancelOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Cancel Order</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!cancelReason.trim()) {
                  alert("Please provide a cancellation reason.");
                  return;
                }
                console.log(cancelOrderId, cancelReason);

                await cancelOrderMutation.mutateAsync({ orderId: cancelOrderId, reason: cancelReason });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-1">Cancellation Reason</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  rows="4"
                  placeholder="Please explain why you want to cancel this order"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <motion.button
                  type="button"
                  onClick={() => {
                    setCancelOrderId(null);
                    setCancelReason("");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={cancelOrderMutation.isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2 hover:bg-red-700 disabled:bg-red-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes /> {cancelOrderMutation.isLoading ? "Cancelling..." : "Submit Cancellation"}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;