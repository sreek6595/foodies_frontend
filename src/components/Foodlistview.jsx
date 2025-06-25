import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  viewAllMenuItemsAPI, 
  deleteMenuItemAPI, 
  editMenuItemAPI 
} from "../services/foodmenuServices";
import { motion } from "framer-motion";
import { FaUtensils, FaClipboardList, FaShoppingCart, FaMoneyBill, FaStar, FaUserTie, FaBell } from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { useQuery as useNotificationsQuery } from "@tanstack/react-query";
import { getUserNotificationsAPI } from "../services/notificationService";

const Foodlistview = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingItemId, setEditingItemId] = useState(null);
  const [editData, setEditData] = useState({});
  const [uniqueFoodItems, setUniqueFoodItems] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteLock, setDeleteLock] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["foodItems"],
    queryFn: async () => {
      const result = await viewAllMenuItemsAPI();
      console.log("Raw data from API:", result);
      return result;
    },
  });
console.log(data);

  const { data: notifications = [] } = useNotificationsQuery({
    queryKey: ["restaurantNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  const notificationCount = notifications.filter((notif) => !notif.read).length;

  const handleLogout = () => {
    logoutAction();
    sessionStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { label: "Registration", icon: <FaUtensils />, route: "/regis" },
    { label: "Add Food Menu", icon: <FaClipboardList />, route: "/viewfoodlist" },
    { label: "Incoming Orders", icon: <FaShoppingCart />, route: "/incoming" },
    { label: "Payment", icon: <FaMoneyBill />, route: "/viewpay" },
    { label: "Review & Rating", icon: <FaStar />, route: "/viewreview" },
    { label: "Profile", icon: <FaUserTie />, route: "/resprofile" },
  ];

  const { mutateAsync: updateMenuItem, isPending: isUpdating } = useMutation({
    mutationFn: editMenuItemAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["foodItems"]);
      setEditingItemId(null);
      setImagePreview(null);
    },
    onError: (error) => {
      alert(`Error updating item: ${error.message}`);
    },
  });

  const { mutate: deleteMenuItem, isPending: isDeleting } = useMutation({
    mutationFn: deleteMenuItemAPI,
    onSuccess: (response, id) => {
      console.log(`Delete succeeded for ID: ${id}`, response);
      queryClient.invalidateQueries(["foodItems"]);
      setDeleteLock(false);
    },
    onError: (error, id) => {
      console.error(`Delete failed for ID: ${id}`, error);
      alert(`Error deleting item: ${error.message}`);
      setDeleteLock(false);
    },
  });

  useEffect(() => {
    if (data) {
      const items = Array.isArray(data) ? data : [];
      const itemsWithUniqueIds = items.map((item, index) => ({
        ...item,
        uniqueId: `${item.id}-${index}`,
      }));
      console.log("Processed items with unique IDs:", itemsWithUniqueIds);
      const idCount = items.reduce((acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + 1;
        return acc;
      }, {});
      console.log("ID occurrence count:", idCount);
      setUniqueFoodItems(itemsWithUniqueIds);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditData((prevData) => ({
          ...prevData,
          imageFile: file,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    const priceValue = parseFloat(editData.price);
    const stockValue = parseInt(editData.stock);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Please enter a valid price greater than 0");
      return;
    }
    if (isNaN(stockValue) || stockValue < 0) {
      alert("Please enter a valid stock value (non-negative)");
      return;
    }
  
    const formData = new FormData();
    formData.append("id", editData._id);
    formData.append("name", editData.name);
    formData.append("price", priceValue);
    formData.append("category", editData.category);
    formData.append("description", editData.description);
    formData.append("note", editData.note);
    formData.append("stock", stockValue); // Added stock to formData
  
    if (editData.imageFile) {
      formData.append("image", editData.imageFile);
    }
  
    console.log("Saving edited data:", formData);
  
    try {
      await updateMenuItem(formData);
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };
  

  const handleDelete = (id) => {
    if (isDeleting || deleteLock) {
      console.log(`Delete blocked for ID: ${id} - Operation in progress`);
      alert("Please wait, an item is currently being deleted.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this item?")) {
      console.log(`User confirmed delete for ID: ${id}`);
      setDeleteLock(true);
      console.log(id);
      
      deleteMenuItem(id);
    }
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setImagePreview(null);
    setEditData({});
  };

  if (isLoading) {
    return <p className="text-center text-gray-600">Loading food items...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-600">
        Error fetching food items: {error.message || "Something went wrong."}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen pt-24">
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

        <div className="flex items-center space-x-4 mr-6">
          <motion.button
            onClick={() => navigate("/restnotify")}
            className="relative text-white text-xl p-2 rounded-full hover:bg-gray-700 transition"
            whileHover={{ scale: 1.2 }}
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

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Manage Food Items
      </h1>

      {uniqueFoodItems.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No food items available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uniqueFoodItems.map((item) => (
            <div
              key={item.uniqueId}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              {editingItemId === item.uniqueId ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-24 h-24">
                        <img
                          src={imagePreview || item.image || "https://via.placeholder.com/300"}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <label className="cursor-pointer">
                        <span className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                          {isUpdating ? "Uploading..." : "Change Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isUpdating || isDeleting || deleteLock}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Name
                    </label>
                    <input
                    type="text"
                    name="name"
                    value={editData.name ?? ""}
                    onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editData.price ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          setEditData((prevData) => ({
                            ...prevData,
                            price: value,
                          }));
                        }
                      }}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={isUpdating || isDeleting || deleteLock}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={editData.category || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={isUpdating || isDeleting || deleteLock}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      <option value="Starter">Starter</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverage">Beverage</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editData.description || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={isUpdating || isDeleting || deleteLock}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={editData.stock ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[0-9]*$/.test(value)) {
                          setEditData((prevData) => ({
                            ...prevData,
                            stock: value,
                          }));
                        }
                      }}
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={isUpdating || isDeleting || deleteLock}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Additional Note
                    </label>
                    <textarea
                      name="note"
                      value={editData.note || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled={isUpdating || isDeleting || deleteLock}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:bg-green-300"
                      onClick={saveChanges}
                      disabled={isUpdating || isDeleting || deleteLock}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition disabled:bg-gray-300"
                      onClick={cancelEdit}
                      disabled={isUpdating || isDeleting || deleteLock}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative w-full h-48 mb-4">
                    <img
                      src={item.image || "https://via.placeholder.com/300"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Description:</span>{" "}
                    {item.description || "No description provided."}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Price:</span> ₹
                    {typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Category:</span>{" "}
                    {item.category || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Stock:</span>{" "}
                    {item.stock || 0} available
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Additional Note:</span>{" "}
                    {item.note || "No additional notes provided."}
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300"
                      onClick={() => {
                        setEditingItemId(item.uniqueId);
                        setEditData(item);
                      }}
                      disabled={isDeleting || deleteLock}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:bg-red-300"
                      onClick={() => handleDelete(item._id)}
                      disabled={isDeleting || deleteLock}
                    >
                      {isDeleting && deleteLock ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition disabled:bg-green-300"
          onClick={() => navigate("/addmenu")}
          disabled={isDeleting || deleteLock}
        >
          Add New Item
        </button>
      </div>
    </div>
  );
};

export default Foodlistview;