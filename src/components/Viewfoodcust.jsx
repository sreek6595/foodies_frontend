import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMenusOfRestaurantAPI } from "../services/restaurantServices";
import { viewAllMenuItemsAPI } from "../services/foodmenuServices";
import toast, { Toaster } from "react-hot-toast";
import { addToCartAPI } from "../services/addtocartServices";

const Viewfoodcust = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurantId } = location.state || {};

  const [menuItems, setMenuItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([
    "All",
    "Starter",
    "Main Course",
    "Dessert",
    "Beverage",
  ]);

  const fetchMenuData = restaurantId
    ? () => getMenusOfRestaurantAPI(restaurantId)
    : viewAllMenuItemsAPI;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: restaurantId ? ["restaurantMenus", restaurantId] : ["allMenuItems"],
    queryFn: fetchMenuData,
    enabled: true,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    staleTime: 5 * 60 * 1000,
  });

  const { mutate } = useMutation({
    mutationFn: addToCartAPI,
    mutationKey: ["add-cart"],
    onSuccess: (data, variables) => {
      toast.success(`${variables.name} added to cart!`);
    },
    onError: (error) => {
      console.error("Add to cart failed:", error);
      const errorMessage = typeof error === "string" ? error : error.message || "Failed to add item to cart";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (data) {
      const items = Array.isArray(data) ? data : data?.menus || [];
      const processedItems = items.map((item) => ({
        id: item._id || item.id,
        _id: item._id,
        name: item.name,
        price: Number(item.price),
        category: item.category,
        image: item.image || "/default-food-image.jpg",
        description: item.description || "No description available",
        note: item.note,
        restaurantName: item.restaurant?.name || restaurantName,
        restaurantId: item.restaurant?._id || restaurantId,
        stock: Number(item.stock) || 0, // Ensure stock is a number, default to 0 if undefined
      }));
      setMenuItems(processedItems);
      // Extract unique categories from menu items and merge with default categories
      const fetchedCategories = [...new Set(processedItems.map((item) => item.category))];
      const updatedCategories = [
        "All",
        "Starter",
        "Main Course",
        "Dessert",
        "Beverage",
        ...fetchedCategories.filter(
          (category) =>
            !["Starter", "Main Course", "Dessert", "Beverage"].includes(category)
        ),
      ];
      // Remove duplicates while preserving order
      setCategories([...new Set(updatedCategories)]);
      if (restaurantId && processedItems.length > 0) {
        setRestaurantName(processedItems[0].restaurantName || "Restaurant");
      }
    }
  }, [data, restaurantId]);

  const handleAddToCart = (menuItem) => {
    if (!menuItem._id) {
      toast.error("Invalid menu item - missing ID");
      return;
    }
    if (menuItem.stock <= 0) {
      toast.error(`${menuItem.name} is out of stock`);
      return;
    }

    const cartItem = {
      id: menuItem._id,
      quantity: 1,
      name: menuItem.name,
    };

    console.log("Sending to cart:", cartItem);
    mutate(cartItem);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredMenuItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-700 font-medium">
        {restaurantId
          ? `Loading menu for ${restaurantName || "restaurant"}...`
          : "Retrieving all menu items..."}
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-lg w-full">
        <div className="text-red-600 mb-6">
          <svg className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-3">Error Loading Menu</h2>
        <p className="text-gray-600 text-center mb-6">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={refetch}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const renderMenuItem = (item) => (
    <div
      key={item.id}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <div className="relative h-56 w-full">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => (e.target.src = "/default-food-image.jpg")}
        />
      </div>
      <div className="p-5 flex-grow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            <span className="font-medium text-gray-700">Name: </span>{item.name}
          </h3>
          <p className="text-indigo-600 font-medium">
            <span className="font-medium text-gray-700">Price: </span>₹{item.price.toFixed(2)}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Category: </span>
            <span className="inline-block px-2.5 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
              {item.category}
            </span>
          </p>
          {!restaurantId && item.restaurantName && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium text-gray-700">Restaurant: </span>
              <span className="inline-block px-2.5 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                {item.restaurantName}
              </span>
            </p>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium text-gray-700">Description: </span>{item.description}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium text-gray-700">Stock: </span>
          {item.stock > 0 ? (
            <span className="text-green-600">{item.stock} available</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </p>
        {item.note && (
          <div className="mt-2 p-2 bg-amber-50 rounded-md border border-amber-200">
            <p className="text-xs text-amber-800">
              <span className="font-medium">Note: </span>{item.note}
            </p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => handleAddToCart(item)}
          disabled={item.stock <= 0}
          className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
            item.stock > 0
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          {item.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900">No Items Available</h3>
      <p className="mt-1 text-sm text-gray-500">
        {restaurantId
          ? "This restaurant currently has no menu items available."
          : selectedCategory === "All"
          ? "No menu items found at this time."
          : `No items found in the ${selectedCategory} category.`}
      </p>
    </div>
  );

  if (isLoading) return renderLoadingState();
  if (isError) return renderErrorState();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {restaurantId ? `${restaurantName || "Restaurant"} Menu` : "Menu Catalog"}
          </h1>
          <p className="mt-2 text-base text-gray-600">
            {filteredMenuItems.length} {filteredMenuItems.length === 1 ? "Item" : "Items"} Available
          </p>
          <div className="mt-4 max-w-xs mx-auto">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
              Filter by Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </header>
        <main>
          {filteredMenuItems.length === 0 ? renderEmptyState() : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMenuItems.map(renderMenuItem)}
            </div>
          )}
        </main>
        <footer className="mt-12 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Return to Dashboard
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Viewfoodcust;