import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTruck } from "react-icons/fa";

const Dboyhome = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover flex flex-col justify-between"
      style={{
        backgroundImage: "url('/deli.webp')", // Ensure this image is in the public folder
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 shadow-md p-4 flex justify-between items-center text-white z-20">
        <div className="flex items-center gap-4 ml-6">
          {/* Logo */}
          <img
            src="/image.jpeg" // Ensure /abc.png is in the public folder
            alt="Foodies Corner Logo"
            className="h-16 w-16 rounded-full object-cover border-2 border-white"
            width="64"
            height="64"
          />
          {/* Title */}
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaTruck /> Foodies Corner - Delivery Partner
          </h1>
        </div>

        <div className="flex space-x-6 mr-6">
          <motion.button
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate("/dboyregis")}
            whileHover={{ scale: 1.1 }}
          >
            Register
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.1 }}
          >
            Login
          </motion.button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen text-center relative pt-24 px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Foodies Corner
        </motion.h1>

        <p className="text-lg text-white mt-4">
          Join our team as a delivery partner and start earning today!
        </p>
        <motion.button
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:bg-blue-700"
          onClick={() => navigate("/dboyregis")}
          whileHover={{ scale: 1.05 }}
        >
          Become a Delivery Partner
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <div className="container mx-auto">
          <p className="text-lg font-semibold">
            © {new Date().getFullYear()} Foodies Corner. All Rights Reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-2">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
            <a href="/support" className="hover:underline">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dboyhome;
