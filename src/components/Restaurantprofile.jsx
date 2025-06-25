import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { FaCamera, FaEdit, FaSave, FaUtensils, FaLock, FaClipboardList, FaShoppingCart, FaMoneyBill, FaStar as FaStarIcon, FaUserTie, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { changePasswordRestaurantOwnerAPI, editRestaurantOwnerProfileAPI, getRestaurantOwnerProfileAPI } from "../services/restprofileServices";
import { getUserNotificationsAPI } from "../services/notificationService";
import { logoutAction } from "../redux/Userslice";

const RestaurantProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: restaurantData, isLoading, error } = useQuery({
    queryKey: ["restaurantProfile"],
    queryFn: getRestaurantOwnerProfileAPI,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ["restaurantNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter((notif) => !notif.read).length;

  // Normalize backend data to match frontend field names
  const normalizedData = restaurantData
    ? {
        username: restaurantData.owner?.username || restaurantData.username || "",
        email: restaurantData.owner?.email || restaurantData.email || "",
        restname: restaurantData.name || "",
        location: restaurantData.location || "",
        googleMapsUrl: restaurantData.googleMapsUrl || "",
        contactno: restaurantData.contact || "",
        cuisine: Array.isArray(restaurantData.cuisine) ? restaurantData.cuisine.join(", ") : restaurantData.cuisine || "",
        openinghour: restaurantData.opening_hours || "",
        address: restaurantData.address || "",
        licence: restaurantData.license || "",
        image: restaurantData.image || "",
      }
    : {};

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: editRestaurantOwnerProfileAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["restaurantProfile"]);
      setIsEditing(false);
      setPreviewImage(null);
      alert("✅ Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert(`❌ Failed to update profile: ${error.response?.data?.message || error.message || "Please try again."}`);
    },
  });

  // Mutation for changing password
  const passwordMutation = useMutation({
    mutationFn: changePasswordRestaurantOwnerAPI,
    onSuccess: () => {
      alert("✅ Password changed successfully!");
      setIsChangingPassword(false);
      passwordFormik.resetForm();
    },
    onError: (error) => {
      console.error("Password change error:", error);
      alert(`❌ Failed to change password: ${error.response?.data?.message || error.message || "Please try again."}`);
    },
  });

  // Formik for profile edit
  const formik = useFormik({
    initialValues: {
      username: normalizedData.username || "",
      email: normalizedData.email || "",
      restname: normalizedData.restname || "",
      location: normalizedData.location || "",
      googleMapsUrl: normalizedData.googleMapsUrl || "",
      contactno: normalizedData.contactno || "",
      cuisine: normalizedData.cuisine || "",
      openinghour: normalizedData.openinghour || "",
      address: normalizedData.address || "",
      licence: normalizedData.licence || "",
      image: null,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("name", values.restname);
      formData.append("location", values.location);
      formData.append("googleMapsUrl", values.googleMapsUrl);
      formData.append("contact", values.contactno);
      formData.append("cuisine", values.cuisine);
      formData.append("opening_hours", values.openinghour);
      formData.append("address", values.address);
      formData.append("license", values.licence);
      if (values.image) {
        formData.append("image", values.image);
      }
      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      updateProfileMutation.mutate(formData);
    },
  });

  // Formik for password change
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: (values) => {
      if (values.newPassword !== values.confirmNewPassword) {
        alert("New password and confirmation do not match!");
        return;
      }
      passwordMutation.mutate({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    },
  });

  // Handle Profile Picture Change
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

  // Handle Logout
  const handleLogout = () => {
    logoutAction();
    sessionStorage.clear();
    navigate("/login");
  };

  // Menu items for navbar
  const menuItems = [
    { label: "Registration", icon: <FaUtensils />, route: "/regis" },
    { label: "Add Food Menu", icon: <FaClipboardList />, route: "/viewfoodlist" },
    { label: "Incoming Orders", icon: <FaShoppingCart />, route: "/incoming" },
    { label: "Payment", icon: <FaMoneyBill />, route: "/viewpay" },
    { label: "Review & Rating", icon: <FaStarIcon />, route: "/viewreview" },
    { label: "Profile", icon: <FaUserTie />, route: "/resprofile" },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-xl text-gray-600">Loading restaurant profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-xl text-red-600">Error loading profile: {error.message}</p>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-xl text-gray-600">No restaurant profile found. Please create one.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
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
              className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition duration-300 ease-in-out ${
                item.route === "/resprofile" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
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

      {/* Main Content */}
      <motion.div
        className="flex justify-center items-center min-h-screen bg-gray-100 p-4 pt-24"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 text-gray-800">
            <FaUtensils className="text-red-500" /> Restaurant Profile
          </h2>

          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              <img
                src={previewImage || normalizedData.image || "/default-restaurant.jpg"}
                alt="Restaurant"
                className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
              />
              {isEditing && (
                <label
                  htmlFor="profilePicInput"
                  className="absolute bottom-2 right-2 bg-gray-700 p-2 rounded-full cursor-pointer text-white hover:bg-gray-800"
                >
                  <FaCamera size={24} />
                </label>
              )}
              <input
                type="file"
                id="profilePicInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing ? (
            <motion.form
              onSubmit={formik.handleSubmit}
              className="mt-6 space-y-4 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  disabled
                  className="border px-4 py-2 w-full rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Restaurant Name</label>
                <input
                  type="text"
                  name="restname"
                  value={formik.values.restname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter restaurant name"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Google Maps URL</label>
                <input
                  type="text"
                  name="googleMapsUrl"
                  value={formik.values.googleMapsUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Google Maps URL"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Contact No</label>
                <input
                  type="tel"
                  name="contactno"
                  value={formik.values.contactno}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Cuisine Type</label>
                <input
                  type="text"
                  name="cuisine"
                  value={formik.values.cuisine}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter cuisine (comma-separated)"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Opening Hour</label>
                <input
                  type="text"
                  name="openinghour"
                  value={formik.values.openinghour}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter opening hour"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Licence</label>
                <input
                  type="text"
                  name="licence"
                  value={formik.values.licence}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter licence"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <motion.button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
                    updateProfileMutation.isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  whileHover={{ scale: updateProfileMutation.isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: updateProfileMutation.isLoading ? 1 : 0.95 }}
                >
                  <FaSave className="inline mr-2" />
                  {updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewImage(null);
                    formik.resetForm();
                  }}
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          ) : isChangingPassword ? (
            <motion.form
              onSubmit={passwordFormik.handleSubmit}
              className="mt-6 space-y-4 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordFormik.values.confirmNewPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div className="flex gap-3 justify-center">
                <motion.button
                  type="submit"
                  disabled={passwordMutation.isLoading}
                  className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
                    passwordMutation.isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  whileHover={{ scale: passwordMutation.isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: passwordMutation.isLoading ? 1 : 0.95 }}
                >
                  <FaSave className="inline mr-2" />
                  {passwordMutation.isLoading ? "Changing..." : "Change Password"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800">{normalizedData.restname || "N/A"}</h2>
              <p className="text-gray-600">
                <strong>Username:</strong> {normalizedData.username || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {normalizedData.email || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Location:</strong> {normalizedData.location || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Google Maps URL:</strong>{" "}
                {normalizedData.googleMapsUrl ? (
                  <a href={normalizedData.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View on Google Maps
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p className="text-gray-600">
                <strong>Contact No:</strong> {normalizedData.contactno || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Cuisine Type:</strong> {normalizedData.cuisine || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Opening Hour:</strong> {normalizedData.openinghour || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> {normalizedData.address || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Licence:</strong> {normalizedData.licence || "N/A"}
              </p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEdit /> Edit Profile
                </motion.button>
                <motion.button
                  onClick={() => setIsChangingPassword(true)}
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md flex items-center gap-2 hover:bg-yellow-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLock /> Change Password
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RestaurantProfile;