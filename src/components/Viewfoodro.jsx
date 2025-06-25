import React, { useState } from "react";
import { motion } from "framer-motion";

const Viewfoodro = ({ menuItems = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filterMenu = (category) => {
    setSelectedCategory(category);
  };

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Food Menu
        </h1>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 space-x-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => filterMenu(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No food items found.
            </p>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={item.imagePath}
                  alt={item.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-gray-800 font-bold mt-4">₹{item.price}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Category: {item.category}
                  </p>
                  {item.note && (
                    <p className="text-sm text-gray-500 mt-1">
                      Note: {item.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewfoodro;
