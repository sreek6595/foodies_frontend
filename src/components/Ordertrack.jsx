import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUtensils,
  FaConciergeBell,
  FaShoppingCart,
  FaTruck,
  FaCommentDots,
  FaHeadset,
  FaUser,
  FaBell,
} from 'react-icons/fa';
import { logoutAction } from '../redux/Userslice';
import { getUserNotificationsAPI } from '../services/notificationService';
import { getOrderAPI } from '../services/orderServices';

const Ordertrack = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ['customerNotifications'],
    queryFn: getUserNotificationsAPI,
  });

  // Count notifications where read is false
  const notificationCount = notifications.filter((notif) => !notif.read).length;

  const handleLogout = () => {
    logoutAction();
    sessionStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { label: 'View Restaurants', icon: <FaUtensils />, route: '/restaurantview' },
    { label: 'View Food Menu', icon: <FaConciergeBell />, route: '/foodmenuview' },
    { label: 'View Cart', icon: <FaShoppingCart />, route: '/carto' },
    // { label: 'Order Tracking', icon: <FaTruck />, route: '/ordert' },
    { label: 'Profile', icon: <FaUser />, route: '/customerprofile' },
    // { label: 'Feedback', icon: <FaCommentDots />, route: '/feedback' },
    { label: 'Report an Issue', icon: <FaHeadset />, route: '/order' },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['order-details', id],
    queryFn: () => getOrderAPI(id),
    enabled: !!id,
  });

  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  // Generate Google Maps Embed URL for directions
  const embedUrl =
    data && data.restaurant?.address && data.user?.address && apiKey
      ? `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(
          data.restaurant.address
        )}&destination=${encodeURIComponent(data.user.address)}&mode=driving`
      : null;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/public/a.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-opacity-10"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 shadow-md p-4 flex flex-col md:flex-row justify-between items-center text-white z-20">
        {/* Logo and Name */}
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

        {/* Right Side Icons (Bell + Logout) */}
        <div className="flex items-center space-x-6 mr-6">
          {/* Notification Bell Icon */}
          <motion.button
            onClick={() => navigate('/custnotify')}
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
      <main className="pt-24 flex flex-col items-center min-h-screen relative z-10">
        <div className="max-w-4xl w-full px-4">
          {/* <h1 className="text-2xl font-bold mb-4 text-white">Order Route Map</h1> */}

          {isLoading && <p className="text-gray-300">Loading order details...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}

          {!apiKey && (
            <p className="text-red-500">
              Google Maps API key is missing. Please contact support.
            </p>
          )}

          {data && !isLoading && !error ? (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Order Route</h2>
              <p>From: {data.restaurant.address}</p>
              <p>To: {data.user.address}</p>

              {embedUrl ? (
                <div className="mt-4">
                  <iframe
                    width="100%"
                    height="500"
                    style={{ border: 0 }}
                    src={embedUrl}
                    allowFullScreen
                    loading="lazy"
                    title="Order Route Map"
                  ></iframe>
                </div>
              ) : (
                <p className="text-gray-500 mt-4">
                  Unable to display map: Missing address data or API key
                </p>
              )}
            </div>
          ) : (
            !isLoading &&
            !error && <p className="text-gray-300">No order data available</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 bg-opacity-90 text-white py-6 mt-auto">
        <div className="container mx-auto text-center px-4">
          <p className="text-sm mb-2">© {new Date().getFullYear()} Foodies Corner. All rights reserved.</p>
          <p className="text-sm mb-2">Contact us: support@foodiescorner.com | Phone: 8304965128</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="/terms" className="text-sm hover:text-red-500 transition">Terms of Service</a>
            <a href="/privacy" className="text-sm hover:text-red-500 transition">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Ordertrack;