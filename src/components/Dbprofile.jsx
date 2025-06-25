import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { FaCamera, FaEdit, FaSave, FaLock, FaTruck, FaList, FaCommentDots, FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  changePasswordDeliveryBoyAPI,
  editDeliveryBoyProfileAPI,
  getDeliveryBoyProfileAPI,
} from "../services/deliveryboyServices";
import { changePasswordAPI } from "../services/userServices";
import { useNavigate } from "react-router-dom";
import { getUserNotificationsAPI } from "../services/notificationService";
import { logoutAction } from "../redux/Userslice";

const Dbprofile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ["deliveryNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter(notif => !notif.read).length;

  // Fetch delivery boy profile data
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ["deliveryBoyProfile"],
    queryFn: getDeliveryBoyProfileAPI,
  });
console.log(userData)
  // Mutation for updating profile
  const mutation = useMutation({
    mutationFn: editDeliveryBoyProfileAPI,
    onSuccess: () => {
      refetch();
      alert("✅ Profile updated successfully!");
      setIsEditing(false);
      setProfilePicFile(null);
      setProfilePic(userData?.image || "/default-profile.jpg");
    },
    onError: (error) => {
      alert(`❌ Failed to update profile: ${error.response?.data?.message || error.message || "Please try again."}`);
    },
  });

  // Mutation for changing password
  const passwordMutation = useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: () => {
      alert("✅ Password changed successfully!");
      setIsChangingPassword(false);
      passwordFormik.resetForm();
    },
    onError: (error) => {
      alert(`❌ Failed to change password: ${error.response?.data?.message || error.message || "Please try again."}`);
    },
  });

  // Formik for profile edit
  const profileFormik = useFormik({
    initialValues: {
      username: userData?.username || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      vehicleNumber: userData?.vehicleNumber || "",
      address: userData?.address || "",
      licenceno: userData?.licenceno || "",
      adhar: userData?.adhar || "",
      exp: userData?.exp || "",
      image: userData?.image || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email); // Include email to maintain backend consistency
      formData.append("phone", values.phone);
      formData.append("vehicleNumber", values.vehicleNumber);
      formData.append("address", values.address);
      formData.append("licenceno", values.licenceno);
      formData.append("adhar", values.adhar);
      formData.append("exp", values.exp);
      if (profilePicFile) {
        formData.append("image", profilePicFile);
      }console.log(profilePicFile);
      
      mutation.mutate(formData);
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
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
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
    { label: "Order List", icon: <FaList />, route: "/vieworderlist" },
    { label: "View Feedback", icon: <FaCommentDots />, route: "/viewfeeddb" },
    { label: "Profile", icon: <FaUserCircle />, route: "/dbprofile" },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-xl text-gray-600">Loading delivery boy profile...</p>
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

  return (
    <div className="min-h-screen bg-gray-100">
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
                item.route === "/dbprofile" ? "bg-gray-700" : "hover:bg-gray-700"
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
      <div className="pt-24 p-6">
        <motion.div
          className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700 flex items-center gap-2 justify-center">
            <FaUserCircle /> Delivery Boy Profile
          </h2>

          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={userData?.image || profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-gray-300 object-cover cursor-pointer"
                onClick={() => isEditing && document.getElementById("profilePicInput").click()}
              />
              {isEditing && (
                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              )}
              {isEditing && (
                <FaCamera
                  className="absolute bottom-2 right-2 text-white bg-gray-700 p-2 rounded-full cursor-pointer"
                  size={24}
                  onClick={() => document.getElementById("profilePicInput").click()}
                />
              )}
            </div>

            {isEditing ? (
              <motion.form
                onSubmit={profileFormik.handleSubmit}
                className="mt-4 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profileFormik.values.username}
                    onChange={profileFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileFormik.values.email}
                    disabled
                    className="border px-4 py-2 w-full rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileFormik.values.phone}
                    onChange={profileFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={profileFormik.values.vehicleNumber}
                    onChange={profileFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter vehicle number plate"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileFormik.values.address}
                    onChange={profileFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter address"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">License Number</label>
                  <input
                    type="text"
                    name="licenceno"
                    value={profileFormik.values.licenceno || ""}
                    onChange={profileFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter license number"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Aadhar Number</label>
                  <input
                    type="text"
                    name="adhar"
                    value={profileFormik.values.adhar}
                    onChange={profileFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Aadhar number"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Years of Experience</label>
                  <input
                    type="number"
                    name="exp"
                    value={profileFormik.values.exp}
                    onChange={profileFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter years of experience"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    type="submit"
                    disabled={mutation.isLoading}
                    className={`mt-2 px-4 py-2 rounded-lg text-white transition ${
                      mutation.isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } w-full flex items-center justify-center gap-2`}
                    whileHover={{ scale: mutation.isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: mutation.isLoading ? 1 : 0.95 }}
                  >
                    <FaSave /> {mutation.isLoading ? "Saving..." : "Save Changes"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfilePicFile(null);
                      setProfilePic(userData?.image || "/default-profile.jpg");
                      profileFormik.resetForm();
                    }}
                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md w-full"
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
                className="mt-4 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordFormik.values.confirmNewPassword}
                    onChange={passwordFormik.handleChange}
                    className="border px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    type="submit"
                    disabled={passwordMutation.isLoading}
                    className={`mt-2 px-4 py-2 rounded-lg text-white transition ${
                      passwordMutation.isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } w-full flex items-center justify-center gap-2`}
                    whileHover={{ scale: passwordMutation.isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: passwordMutation.isLoading ? 1 : 0.95 }}
                  >
                    <FaSave /> {passwordMutation.isLoading ? "Changing..." : "Change Password"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-bold">{userData?.username}</h2>
                <p className="text-gray-500"><strong>Email:</strong> {userData?.email}</p>
                <p className="text-gray-500"><strong>Phone:</strong> {userData?.phone}</p>
                <p className="text-gray-500"><strong>Vehicle Number:</strong> {userData?.vehicleNumber}</p>
                <p className="text-gray-500"><strong>Address:</strong> {userData?.address}</p>
                <p className="text-gray-500"><strong>License Number:</strong> {userData?.licenceno || "Not available"}</p>
                <p className="text-gray-500"><strong>Aadhar Number:</strong> {userData?.adhar}</p>
                <p className="text-gray-500"><strong>Experience:</strong> {userData?.exp} years</p>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 justify-center hover:bg-blue-700 w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEdit /> Edit Profile
                  </motion.button>
                  <motion.button
                    onClick={() => setIsChangingPassword(true)}
                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md flex items-center gap-2 justify-center hover:bg-yellow-700 w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLock /> Change Password
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dbprofile;