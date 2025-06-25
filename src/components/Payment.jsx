import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { processPaymentAPI } from "../services/paymentServices";
import { loadStripe } from '@stripe/stripe-js';

// Debug and load Stripe key
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;


const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

const Payment = () => {
  const { id: orderId } = useParams();
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholder: "",
  });
  const [errors, setErrors] = useState({});

  const paymentMutation = useMutation({
    mutationFn: processPaymentAPI,
    onSuccess: (data) => {
      alert("✅ Order placed successfully!");
      setPaymentMethod("");
      setCardDetails({ cardNumber: "", expiryDate: "", cvv: "", cardholder: "" });
      setErrors({});
    },
    onError: (error) => {
      console.error("Payment error:", error);
      alert("❌ Payment failed. Please try again.");
    },
  });

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const validateCardDetails = () => {
    let errors = {};
    if (!cardDetails.cardNumber || !cardDetails.cardNumber.match(/^\d{16}$/))
      errors.cardNumber = "Enter a valid 16-digit card number.";
    if (!cardDetails.expiryDate || !cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/))
      errors.expiryDate = "Use MM/YY format.";
    if (!cardDetails.cvv || !cardDetails.cvv.match(/^\d{3}$/))
      errors.cvv = "CVV must be 3 digits.";
    if (!cardDetails.cardholder || !cardDetails.cardholder.trim())
      errors.cardholder = "Cardholder Name is required.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrder = async () => {
    if (!orderId) {
      alert("❌ No order ID provided.");
      return;
    }

    if (paymentMethod === "Card Payment" && !validateCardDetails()) return;

    if (paymentMethod === "Card Payment") {
      try {
        if (!stripePromise) {
          throw new Error("Stripe is not initialized. Please check your environment configuration.");
        }

        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Failed to load Stripe library");
        }

        // Here you would typically create a payment intent via your backend
        // and then use stripe.confirmCardPayment()
        const id =orderId;
        console.log("Order ID:", id);

        await paymentMutation.mutate({id:id});
        

      } catch (error) {
        console.error("Stripe initialization error:", error.message);
        alert(`❌ Payment processing error: ${error.message}`);
      }
    } else if (paymentMethod === "Cash on Delivery") {
      alert("✅ Cash on Delivery order placed successfully!");
      setPaymentMethod("");
      setCardDetails({ cardNumber: "", expiryDate: "", cvv: "", cardholder: "" });
      setErrors({});
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-4xl font-bold text-gray-900 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        💳 Secure Payment
      </motion.h2>

      <motion.div
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <label className="block text-lg font-semibold text-gray-700">Choose Payment Method</label>
        <select
          className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={paymentMethod}
          onChange={handlePaymentChange}
        >
          <option value="">-- Select Payment Method --</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Card Payment">Card Payment</option>
        </select>

        {paymentMethod === "Card Payment" && (
          <motion.div
            className="mt-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <label className="block text-lg font-semibold text-gray-700">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                maxLength="16"
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="1234 5678 9101 1121"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
              />
              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={handleInputChange}
                />
                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  maxLength="3"
                  className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700">Cardholder Name</label>
              <input
                type="text"
                name="cardholder"
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="John Doe"
                value={cardDetails.cardholder}
                onChange={handleInputChange}
              />
              {errors.cardholder && <p className="text-red-500 text-sm mt-1">{errors.cardholder}</p>}
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleOrder}
          className={`w-full mt-6 py-3 text-lg font-semibold rounded-lg transition-all ${
            paymentMethod && !paymentMutation.isLoading
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          whileTap={{ scale: 0.95 }}
          whileHover={paymentMethod && !paymentMutation.isLoading ? { scale: 1.05 } : {}}
          disabled={!paymentMethod || paymentMutation.isLoading}
        >
          {paymentMutation.isLoading
            ? "Processing..."
            : paymentMethod === "Card Payment"
            ? "💳 Pay Now"
            : "Place Order"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Payment;