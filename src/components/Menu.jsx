import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { viewfoodrestAPI } from "../services/foodmenuServices";
import { motion } from "framer-motion";
import { addToCartAPI } from "../services/addtocartServices";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate=useNavigate()
//   const [activeTab, setActiveTab] = useState("menu-starters");

//   // Fetch menu items using useQuery
//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["allMenuItems"],
//     queryFn: viewfoodrestAPI,
//     // retry: 3,
//     // retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
//     // staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
//   });
// console.log(data);

//   // Process menu items
//   const processedMenu = Array.isArray(data)
//     ? data.map((item) => ({
//         id: item._id || `${Math.random()}`,
//         name: item.name || "Unnamed Item",
//         category: item.category || "Unknown",
//         description: item.description || "No description available",
//         price: Number(item.price) || 0,
//         image: item.image || "https://via.placeholder.com/500x300?text=Image+Not+Available",
//       }))
//     : [];

//   // Filter menu items by category
//   const getMenuItemsByCategory = (category) => {
//     return processedMenu.filter((item) => item.category.toLowerCase() === category.toLowerCase());
//   };

//   // Tab configuration
//   const tabs = [
//     { id: "menu-starters", label: "Starters", category: "Starters" },
//     { id: "menu-breakfast", label: "Breakfast", category: "Breakfast" },
//     { id: "menu-lunch", label: "Lunch", category: "Lunch" },
//     { id: "menu-dinner", label: "Dinner", category: "Dinner" },
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
//         <p className="text-gray-700 font-medium">Loading menu items...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-6">
//         <div className="bg-white p-8 rounded-xl shadow-md max-w-lg w-full text-center">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-3">Error Loading Menu</h2>
//           <p className="text-gray-600 mb-6">{error?.message || "Failed to fetch menu items."}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section id="menu" className="menu section py-16 bg-white">
//       {/* Section Title */}
//       <div className="container text-center mb-12" data-aos="fade-up">
//         <h2 className="text-3xl font-bold">Our Menu</h2>
//         <p>
//           <span className="text-xl">Check Our</span>{" "}
//           <span className="description-title text-2xl font-semibold">Yummy Menu</span>
//         </p>
//       </div>
//       {/* End Section Title */}

//       <div className="container">
//         {/* Navigation Tabs */}
//         <ul className="nav nav-tabs flex justify-center space-x-6" data-aos="fade-up" data-aos-delay="100">
//           {tabs.map((tab) => (
//             <li key={tab.id} className="nav-item">
//               <a
//                 className={`nav-link text-xl font-medium ${activeTab === tab.id ? "active show" : ""}`}
//                 data-bs-toggle="tab"
//                 data-bs-target={`#${tab.id}`}
//                 onClick={() => setActiveTab(tab.id)}
//               >
//                 <h4>{tab.label}</h4>
//               </a>
//             </li>
//           ))}
//         </ul>

//         {/* Tab Content */}
//         <div className="tab-content mt-8" data-aos="fade-up" data-aos-delay="200">
//           {tabs.map((tab) => (
//             <div
//               key={tab.id}
//               className={`tab-pane fade ${activeTab === tab.id ? "active show" : ""}`}
//               id={tab.id}
//             >
//               <div className="tab-header text-center mb-12">
//                 <p className="text-xl">Menu</p>
//                 <h3 className="text-2xl font-semibold">{tab.label}</h3>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {getMenuItemsByCategory(tab.category).length > 0 ? (
//                   getMenuItemsByCategory(tab.category).map((item, index) => (
//                     <motion.div
//                       key={item.id}
//                       className="menu-item text-center"
//                       initial={{ opacity: 0, y: 50 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5, delay: index * 0.1 }}
//                     >
//                       <a href={item.image} className="glightbox">
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="menu-img w-full h-auto rounded-lg shadow-lg"
//                           onError={(e) =>
//                             (e.target.src = "https://via.placeholder.com/500x300?text=Image+Not+Available")
//                           }
//                         />
//                       </a>
//                       <h4 className="text-xl font-semibold mt-4">{item.name}</h4>
//                       <p className="ingredients text-gray-600 mb-2">{item.description}</p>
//                       <p className="price text-lg font-bold">${item.price.toFixed(2)}</p>
//                     </motion.div>
//                   ))
//                 ) : (
//                   <p className="text-gray-600 col-span-full text-center">
//                     No {tab.label.toLowerCase()} items available.
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
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
        image: item.image || "https://via.placeholder.com/500x300?text=Image+Not+Available",
        restaurantName: item.restaurant?.name || "Unknown Restaurant",
      }));

      let filtered = processedMenu;

      // Category Filter
      if (selectedCategory !== "All") {
        filtered = filtered.filter((food) => food.category === selectedCategory);
      }

      // Diet Filter
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

      // Allergen Filter
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

  const handleCart = () => {
    
    navigate('/login')
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
    <div id="menu">
    <motion.div
      className="min-h-screen bg-gray-100 p-10 flex flex-col items-center pt-24" // Adjusted padding-top to account for navbar
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Toaster position="top-right" />
      
      <motion.h2
        className="text-4xl font-extrabold mb-8 text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        🍽️ Explore All Food Menus
      </motion.h2>

      {/* Filters */}
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

      {/* Food Menu Grid */}
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
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-semibold text-green-600">₹{food.price}</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-5 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all hover:bg-green-600 flex items-center justify-center gap-2"
                  onClick={() => handleCart()}
                >
                  Buy
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
    </div>
  );
};

export default Menu;