import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Viewcart = () => {
  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleCartUpdate = (id, action) => {
    let updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: action === "increase" ? item.quantity + 1 : Math.max(item.quantity - 1, 1) }
        : item
    );

    if (action === "remove") {
      updatedCart = cart.filter((item) => item.id !== id);
    }

    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleOrderNow = () => {
    if (cart.length === 0) {
      alert("🛒 Your cart is empty! Add items before ordering.");
      return;
    }
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!customerDetails.name.trim()) newErrors.name = "Name is required.";
    if (!/^\d{10}$/.test(customerDetails.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!customerDetails.address.trim()) newErrors.address = "Delivery address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;
    
    sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails));
    navigate("/payment");
  };

  return (
    <motion.div className="min-h-screen flex flex-col items-center bg-gray-50 py-16 px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      
      <motion.h2 className="text-4xl font-extrabold text-gray-900 mb-8"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        🛒 Your Shopping Cart
      </motion.h2>

      <motion.div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8"
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>

        {showForm ? (
          // Delivery Form Section
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <h3 className="text-2xl font-semibold mb-6">📍 Enter Delivery Details</h3>

            <div className="mb-4">
              <label className="block font-semibold">Full Name</label>
              <input type="text" name="name" placeholder="Enter your name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={customerDetails.name} onChange={handleFormChange} />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Phone Number</label>
              <input type="text" name="phone" placeholder="Enter your 10-digit phone number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={customerDetails.phone} onChange={handleFormChange} />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Delivery Address</label>
              <textarea name="address" rows="3" placeholder="Enter your delivery address"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={customerDetails.address} onChange={handleFormChange} />
              {errors.address && <p className="text-red-500">{errors.address}</p>}
            </div>

            <motion.button onClick={handleProceedToPayment}
              className="w-full mt-6 bg-green-500 text-white font-bold py-4 text-xl rounded-lg hover:bg-green-600 transition-all"
              whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
              Proceed to Payment 💳
            </motion.button>

            <motion.button onClick={() => setShowForm(false)}
              className="w-full mt-4 bg-gray-500 text-white font-bold py-3 text-lg rounded-lg hover:bg-gray-600 transition-all"
              whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
              ← Back to Cart
            </motion.button>
          </motion.div>
        ) : cart.length === 0 ? (
          <motion.p className="text-center text-gray-500 text-xl py-16"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            Your cart is empty.
          </motion.p>
        ) : (
          <div className="space-y-6">
            {cart.map((item, index) => (
              <motion.div key={item.id} className="flex items-center justify-between border-b py-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}>
                
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="ml-5">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleCartUpdate(item.id, "decrease")}
                    className="w-10 h-10 flex items-center justify-center text-lg font-semibold bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition">
                    −
                  </motion.button>

                  <span className="text-xl font-bold">{item.quantity}</span>

                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleCartUpdate(item.id, "increase")}
                    className="w-10 h-10 flex items-center justify-center text-lg font-semibold bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition">
                    +
                  </motion.button>
                </div>

                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleCartUpdate(item.id, "remove")}
                  className="px-4 py-2 text-lg font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                  Remove
                </motion.button>
              </motion.div>
            ))}

            <motion.button onClick={handleOrderNow} className="w-full mt-8 bg-green-500 text-white font-bold py-4 text-xl rounded-lg hover:bg-green-600 transition-all"
              whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
              Order Now
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Viewcart;
