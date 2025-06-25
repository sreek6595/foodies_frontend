import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTruck, FaSignInAlt } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { registerDeliveryBoyAPI } from "../services/deliveryServices";

const Dbregistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    vehicleNumber: "",
    licenceno: "", 
    adhar: "",
    exp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: registerDeliveryBoyAPI,
    onSuccess: (data) => {
      alert("✅ Registration Successful!");
      setFormData({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        vehicleNumber: "",
        licenceno: "", 
        adhar: "",
        exp: "",
      });
      navigate("/Login");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      alert(`❌ Registration failed: ${error.message || "Please try again."}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleLogin = () => {
    navigate("/Login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaTruck /> Foodies Corner - Delivery Partner
        </h1>
        <button
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          onClick={handleLogin}
        >
          <FaSignInAlt /> Login
        </button>
      </nav>

      {/* Registration Form */}
      <motion.div
        className="max-w-3xl w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200 mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Delivery Partner Registration
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Address", name: "address", type: "text" },
            { label: "Phone Number", name: "phone", type: "tel" },
            { label: "Vehicle Number", name: "vehicleNumber", type: "text" },
            { label: "License Number", name: "licenceno", type: "text" }, // Added licenseNumber
            { label: "Aadhar Number", name: "adhar", type: "text" },
            { label: "Experience (in years)", name: "exp", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="col-span-2 flex justify-center">
            <motion.button
              type="submit"
              className={`w-full md:w-auto py-3 px-6 rounded-lg text-white transition ${
                mutation.isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              whileHover={{ scale: mutation.isLoading ? 1 : 1.05 }}
              whileTap={{ scale: mutation.isLoading ? 1 : 0.95 }}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Registering..." : "Register Now"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Dbregistration;