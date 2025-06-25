import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import { viewfoodrestAPI } from "../services/foodmenuServices";
import { addToCartAPI } from "../services/addtocartServices";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUtensils,
  FaConciergeBell,
  FaTruck,
  FaHeadset,
  FaUser,
  FaBell,
} from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { getUserNotificationsAPI } from "../services/notificationService";
import { useNavigate } from "react-router-dom";

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

const Viewfoodmenu = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allMenuItems"],
    queryFn: viewfoodrestAPI,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    staleTime: 5 * 60 * 1000,
  });

  const [cart, setCart] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDiet, setSelectedDiet] = useState("All");
  const [selectedAllergen, setSelectedAllergen] = useState("All");

  const { mutate } = useMutation({
    mutationFn: addToCartAPI,
    mutationKey: ["add-cart"],
    onSuccess: (data, variables) => {
      toast.success(`${variables.name} added to cart!`);
    },
    onError: (error) => {
      const errorMessage = typeof error === "string" ? error : error.message || "Failed to add item to cart";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    setCart(JSON.parse(sessionStorage.getItem("cart")) || []);
  }, []);

  useEffect(() => {
    let foodMenu = [];
    if (Array.isArray(data)) {
      foodMenu = data;
    } else if (data?.data && Array.isArray(data.data)) {
      foodMenu = data.data;
    } else if (data?.message) {
      console.warn("API Message:", data.message);
    }

    if (foodMenu.length > 0) {
      const processedMenu = foodMenu.map((item) => ({
        id: item._id || item.id || `${Math.random()}`,
        _id: item._id,
        name: item.name || "Unnamed Item",
        category: item.category || "Unknown",
        diet: item.diet || "Unknown",
        allergens: Array.isArray(item.allergens) ? item.allergens : [],
        description: item.description || "No description available",
        price: Number(item.price) || 0,
        note: item.note || "",
        stock: Number(item.stock) || 0, // Added stock field
        image: item.image || "https://via.placeholder.com/500x300?text=Image+Not+Available",
        restaurantName: item.restaurant?.name || "Unknown Restaurant",
      }));

      let filtered = processedMenu;

      if (selectedCategory !== "All") {
        filtered = filtered.filter((food) => food.category === selectedCategory);
      }

      if (selectedDiet !== "All") {
        filtered = filtered.filter((food) => {
          const dietLower = selectedDiet.toLowerCase();
          const foodDiet = food.diet.toLowerCase();
          const noteLower = food.note.toLowerCase();
          const nameLower = food.name.toLowerCase();

          const nonVegIndicators = ["chicken", "meat", "fish", "egg", "pepperoni", "mutton", "beef", "non-veg", "non vegetarian"];
          const vegetarianIndicators = ["veg", "vegetarian"];
          const veganIndicators = ["vegan"];

          const containsKeyword = (keywords) =>
            keywords.some((keyword) => noteLower.includes(keyword) || nameLower.includes(keyword));

          if (dietLower === "vegan") {
            return foodDiet === "vegan" || (containsKeyword(veganIndicators) && !containsKeyword(nonVegIndicators));
          }

          if (dietLower === "vegetarian") {
            if (containsKeyword(nonVegIndicators)) return false;
            return foodDiet === "vegetarian" || containsKeyword(vegetarianIndicators);
          }

          if (dietLower === "non-vegetarian") {
            return foodDiet === "non-vegetarian" || containsKeyword(nonVegIndicators);
          }

          return true;
        });
      }

      if (selectedAllergen !== "All") {
        filtered = filtered.filter((food) => {
          const allergenLower = selectedAllergen.toLowerCase();
          const noteLower = food.note.toLowerCase();

          if (food.allergens.length > 0) {
            return !food.allergens.map((a) => a.toLowerCase()).includes(allergenLower);
          }

          const allergenKeywords = {
            gluten: ["gluten", "wheat"],
            dairy: ["dairy", "milk", "cheese"],
            nuts: ["nuts", "peanut", "almond", "cashew"],
            seafood: ["seafood", "fish", "shrimp", "crab"],
          };

          const selectedAllergenKeywords = allergenKeywords[allergenLower] || [allergenLower];
          return !selectedAllergenKeywords.some((keyword) => noteLower.includes(keyword));
        });
      }

      setFilteredMenu(filtered);
    } else {
      setFilteredMenu([]);
    }
  }, [data, selectedCategory, selectedDiet, selectedAllergen]);

  const handleCart = (food) => {
    if (!food._id) {
      toast.error("Invalid menu item - missing ID");
      return;
    }

    if (food.stock <= 0) {
      toast.error(`${food.name} is out of stock!`);
      return;
    }

    const cartItem = {
      id: food._id,
      quantity: 1,
      name: food.name,
    };

    mutate(cartItem);

    let updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item.id === food.id);

    if (itemIndex >= 0) {
      updatedCart[itemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...food, quantity: 1 });
    }

    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-700 font-medium">Loading menu items...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Error Loading Menu</h2>
          <p className="text-gray-600 mb-6">{error?.message || "Failed to fetch menu items."}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-10 flex flex-col items-center pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Toaster position="top-right" />
      <CustomerNavbar />
      <motion.h2
        className="text-4xl font-extrabold mb-8 text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        🍽️ Explore All Food Menus
      </motion.h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded-md focus:ring-2 focus:ring-green-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Starter">Starter</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
        </select>

        <select
          className="border p-2 rounded-md focus:ring-2 focus:ring-green-500"
          value={selectedDiet}
          onChange={(e) => setSelectedDiet(e.target.value)}
        >
          <option value="All">All Diets</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
        </select>

        <select
          className="border p-2 rounded-md focus:ring-2 focus:ring-green-500"
          value={selectedAllergen}
          onChange={(e) => setSelectedAllergen(e.target.value)}
        >
          <option value="All">No Allergy Filter</option>
          <option value="Gluten">No Gluten</option>
          <option value="Dairy">No Dairy</option>
          <option value="Nuts">No Nuts</option>
          <option value="Seafood">No Seafood</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((food, index) => (
            <motion.div
              key={food.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-56 object-cover bg-gray-200 transition-transform duration-300 ease-in-out hover:scale-110"
                loading="lazy"
                onError={(e) => (e.target.src = "https://via.placeholder.com/500x300?text=Image+Not+Available")}
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900">{food.name}</h3>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Description: </span>{food.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Category: </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                    {food.category}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">From: </span>{food.restaurantName}
                </p>
                {food.note && (
                  <p className="text-sm text-amber-700 mt-2 bg-amber-50 p-2 rounded-md">
                    <span className="font-medium">Note: </span>{food.note}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Stock: </span>
                  {food.stock > 0 ? `${food.stock} available` : "Out of stock"}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-semibold text-green-600">₹{food.price}</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-5 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all hover:bg-green-600 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => handleCart(food)}
                  disabled={food.stock <= 0}
                >
                  <FaShoppingCart /> Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">
            {data?.message || "No menu items available."}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Viewfoodmenu;