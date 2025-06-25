import { useState } from "react";
import { motion } from "framer-motion";

const Customerregis = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    profilePic: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    console.log("Form Data Submitted: ", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Create Your Account</h2>
        {error && <p className="text-red-600 text-sm mb-4 text-center font-semibold">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
          <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
          <button type="submit" className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">Register</button>
        </form>
      </motion.div>
    </div>
  );
};

export default Customerregis;
