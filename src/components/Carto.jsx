import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  clearCartAPI,
  getCartAPI,
  removeFromCartAPI,
} from "../services/addtocartServices";
import { createOrderAPI } from "../services/orderServices";
import { getToken } from "../utils/storageHandler";
import {
  FaUtensils,
  FaConciergeBell,
  FaShoppingCart,
  FaTruck,
  FaHeadset,
  FaUser,
  FaBell,
} from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { getUserNotificationsAPI } from "../services/notificationService";
import { useQuery } from "@tanstack/react-query";

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
    { label: "View Food Menu", icon: <FaConciergeBell />, route: "/foodmenuview" },
    { label: "View Cart", icon: <FaShoppingCart />, route: "/carto" },
    // { label: "Order Tracking", icon: <FaTruck />, route: "/ordert" },
    { label: "Profile", icon: <FaUser />, route: "/customerprofile" },
    { label: "Report an Issue", icon: <FaHeadset />, route: "/order" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 shadow-md p-4 flex flex-col md:flex-row justify-between items-center text-white z-20">
      <div className="flex items-center ml-6">
        <img src="/image.jpeg" alt="Foodies Corner" className="h-16 mr-2 rounded-full" />
        <span className="text-2xl font-bold text-red-500">Foodies Corner</span>
      </div>

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

      <div className="flex items-center space-x-6 mr-6">
        <motion.button
          onClick={() => navigate("/custnotify")}
          className="relative text-white text-xl hover:text-yellow-400 transition"
          whileHover={{ scale: 1.1 }}
        >
          <FaBell />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {notificationCount}
            </span>
          )}
        </motion.button>

        <button
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

const Carto = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await getCartAPI();
      const items = response?.items || [];
      setCartItems(items);
    } catch (error) {
      toast.error("Unable to load cart items. Please try again.");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { mutateAsync: removeItem } = useMutation({
    mutationFn: removeFromCartAPI,
    onSuccess: () => {
      toast.success("Item successfully removed from cart");
      fetchCartItems();
    },
    onError: (error) => {
      const errorMessage =
        error?.status === 404
          ? "Item not found in cart"
          : error?.message || "Failed to remove item. Please try again.";
      toast.error(errorMessage);
      console.error("Remove Item Error:", error);
    },
  });

  const { mutateAsync: createOrder, isLoading: isOrderLoading } = useMutation({
    mutationFn: createOrderAPI,
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      sessionStorage.setItem("orderDetails", JSON.stringify(data));
      navigate(`/payment/${data.order._id}`, { state: data.order._id });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create order. Please try again.";
      toast.error(errorMessage);
      console.error("Create Order Error:", error);
    },
  });

  const handleRemoveItem = async (menuItemId) => {
    if (!menuItemId) {
      toast.error("Invalid item ID");
      return;
    }
    try {
      await removeItem(menuItemId);
    } catch (error) {
      console.error("Remove Item Error:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartAPI();
      toast.success("Cart successfully cleared");
      setCartItems([]);
    } catch (error) {
      toast.error("Failed to clear cart. Please try again.");
      console.error("Clear Cart Error:", error);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.quantity + change, item.menuItem.stock || Infinity)),
            }
          : item
      )
    );
  };

  const calculateTotal = useCallback(() => {
    return cartItems
      .reduce((acc, item) => acc + item.quantity * item.menuItem.price, 0)
      .toFixed(2);
  }, [cartItems]);

  const handleFormChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!customerDetails.name.trim()) newErrors.name = "Name is required.";
    if (!/^\d{10}$/.test(customerDetails.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!customerDetails.address.trim())
      newErrors.address = "Delivery address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    console.log("Proceeding to payment with:", customerDetails);
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    const orderData = {
      address: customerDetails.address,
      contact: customerDetails.phone,
    };

    try {
      await createOrder(orderData);
    } catch (error) {
      console.error("Proceed to Payment Error:", error);
    }
  };

  const handleCheckoutClick = () => {
    console.log("Checkout clicked, cartItems:", cartItems);
    if (cartItems.length === 0) {
      toast.error("Your cart is empty! Add items before checking out.");
      return;
    }
    setShowForm(true);
  };

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const CartItem = ({ item, onRemove, onQuantityChange }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6 border border-gray-100">
      <img
        src={item.menuItem.image}
        alt={item.menuItem.name}
        className="w-28 h-28 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">{item.menuItem.name}</h3>
          <dl className="space-y-2 text-sm text-gray-600">
            <div>
              <dt className="inline font-medium">Category:</dt>
              <dd className="inline ml-1">{item.menuItem.category}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Description:</dt>
              <dd className="inline ml-1">{item.menuItem.description}</dd>
            </div>
            {item.menuItem.note && (
              <div>
                <dt className="inline font-medium">Note:</dt>
                <dd className="inline ml-1">{item.menuItem.note}</dd>
              </div>
            )}
            <div>
              <dt className="inline font-medium">Restaurant:</dt>
              <dd className="inline ml-1">{item.menuItem.restaurant.name}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Price:</dt>
              <dd className="inline ml-1">₹{item.menuItem.price.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Stock:</dt>
              <dd className="inline ml-1">{item.menuItem.stock || 0} available</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-col items-start md:items-end space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Qty:</span>
            <button
              onClick={() => onQuantityChange(item._id, -1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item._id, 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Increase quantity"
              disabled={item.quantity >= (item.menuItem.stock || Infinity)}
            >
              +
            </button>
          </div>
          <span className="font-semibold text-gray-900">
            Subtotal: ₹{(item.menuItem.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.menuItem._id)}
        className="self-start px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label={`Remove ${item.menuItem.name} from cart`}
      >
        Remove
      </button>
    </div>
  );

  CartItem.propTypes = {
    item: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      menuItem: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        note: PropTypes.string,
        price: PropTypes.number.isRequired,
        stock: PropTypes.number, // Added stock to PropTypes
        restaurant: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
    onQuantityChange: PropTypes.func.isRequired,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <Toaster position="top-right" />
      <CustomerNavbar />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your items and proceed to checkout
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600">Your cart is currently empty.</p>
          <p className="mt-2 text-sm text-gray-500">
            Add some items to get started!
          </p>
        </div>
      ) : showForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-2xl font-semibold mb-6">📍 Enter Delivery Details</h3>

          <div className="mb-4">
            <label className="block font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={customerDetails.name}
              onChange={handleFormChange}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your 10-digit phone number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={customerDetails.phone}
              onChange={handleFormChange}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Delivery Address</label>
            <textarea
              name="address"
              rows="3"
              placeholder="Enter your delivery address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={customerDetails.address}
              onChange={handleFormChange}
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
          </div>

          <motion.button
            onClick={handleProceedToPayment}
            disabled={isOrderLoading}
            className={`w-full mt-6 bg-green-500 text-white font-bold py-4 text-xl rounded-lg hover:bg-green-600 transition-all ${
              isOrderLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {isOrderLoading ? "Processing..." : "Proceed to Payment 💳"}
          </motion.button>

          <motion.button
            onClick={() => setShowForm(false)}
            className="w-full mt-4 bg-gray-500 text-white font-bold py-3 text-lg rounded-lg hover:bg-gray-600 transition-all"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            ← Back to Cart
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onRemove={handleRemoveItem}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="mb-4 sm:mb-0">
              <span className="text-lg font-semibold text-gray-900">
                Grand Total: ₹{calculateTotal()}
              </span>
            </div>
            <div className="space-x-4">
              <button
                onClick={handleClearCart}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckoutClick}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carto;