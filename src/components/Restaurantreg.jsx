import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaShoppingCart, FaCreditCard, FaStar } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { addRestaurantAPI } from "../services/restaurantServices";
import { FaUtensils, FaUserTie, FaBell } from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { useQuery } from "@tanstack/react-query";
import { getUserNotificationsAPI } from "../services/notificationService";
import { useNavigate } from "react-router-dom";

const Restaurantreg = () => {
  useEffect(() => {
    document.title = "Restaurant Registration - Foodies Corner";
  }, []);

  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: addRestaurantAPI,
    mutationKey: ["add-restaurant"],
  });

  const initialValues = {
    name: "",
    location: "",
    image: null,
    contact: "",
    cuisine: "",
    opening_hours: "",
    address: "",
    license: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Restaurant Name is required"),
    location: Yup.string().required("Location is required"),
    contact: Yup.string()
      .matches(/^[0-9]+$/, "Must be a valid number")
      .min(10, "Must be at least 10 digits")
      .required("Contact Number is required"),
    cuisine: Yup.string().required("Cuisine Type is required"),
    opening_hours: Yup.string().required("Opening Hours is required"),
    address: Yup.string().required("Address is required"),
    license: Yup.string().required("License is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("location", values.location);
    formData.append("contact", values.contact);
    formData.append("cuisine", values.cuisine);
    formData.append("opening_hours", values.opening_hours);
    formData.append("address", values.address);
    formData.append("license", values.license);

    if (values.image) {
      formData.append("image", values.image); // Append the image
    }

    try {
      await mutateAsync(formData);
      alert("Restaurant registered successfully!");
      resetForm();
    } catch (mutationError) {
      console.error("Error registering restaurant:", mutationError);
      alert("Failed to register the restaurant. Please try again.");
    }
  };

  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
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
    { label: "Payment", icon: <FaCreditCard />, route: "/viewpay" },
    { label: "Review & Rating", icon: <FaStar />, route: "/viewreview" },
    { label: "Profile", icon: <FaUserTie />, route: "/resprofile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
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

      {/* Registration Form */}
      <div className="flex justify-center items-center p-6">
        <motion.div
          className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Restaurant Registration</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Restaurant Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Location</label>
                  <Field
                    type="text"
                    name="location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <ErrorMessage name="location" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                  <Field
                    type="text"
                    name="contact"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <ErrorMessage name="contact" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Cuisine Type</label>
                  <Field
                    type="text"
                    name="cuisine"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <ErrorMessage name="cuisine" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Opening Hours</label>
                  <Field
                    type="text"
                    name="opening_hours"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <ErrorMessage name="opening_hours" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Address</label>
                  <Field
                    type="text"
                    name="address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">License</label>
                  <Field
                    type="text"
                    name="license"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <ErrorMessage name="license" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Upload Restaurant Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => setFieldValue("image", e.target.files[0])}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                  <ErrorMessage name="image" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="col-span-2 flex justify-center">
                  <motion.button
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Register Restaurant"}
                  </motion.button>
                </div>
              </Form>
            )}
          </Formik>

          {isError && (
            <div className="mt-4 text-red-600 text-center">
              {error?.message || "An error occurred. Please try again."}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Restaurantreg;