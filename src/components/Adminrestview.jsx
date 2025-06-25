import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaChartLine, FaUtensils, FaUser, FaMotorcycle } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { viewComplaintAPI } from "../services/complaintServices";
import { deleteRestaurantAPI } from "../services/restaurantServices";

// API functions


const Adminrestview = () => {
  const queryClient = useQueryClient();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Fetch restaurants using useQuery
  const { data: restaurants, isLoading, isError, error } = useQuery({
    queryKey: ["restaurants"],
    queryFn: viewComplaintAPI,
  });
console.log(restaurants);

  // Delete restaurant using useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteRestaurantAPI,
    onSuccess: (id) => {
      // Invalidate and refetch restaurants query
      queryClient.invalidateQueries(["restaurants"]);
      // Optimistic update
      queryClient.setQueryData(["restaurants"], (old) =>
        old.filter((restaurant) => restaurant.id !== id)
      );
    },
    onError: (error) => {
      console.error("Delete error:", error.message);
      // Optionally show a toast or alert for the error
    },
  });

  const handleView = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <NavLink to="/adminverifyres" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaChartLine /> Verify Restaurants
            </NavLink>
          </li>
          <li>
            <NavLink to="/adminrestview" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaUtensils /> Restaurants
            </NavLink>
          </li>
          <li>
            <NavLink to="/admincustview" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaUser /> Delivery boy Complaints
            </NavLink>
          </li>
          <li>
            <NavLink to="/admindbview" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaMotorcycle /> Delivery Boys
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={() => window.history.back()} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Back
          </button>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl border border-gray-200 mt-6"
        >
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 border-b pb-4 uppercase">
            Restaurant Management
          </h2>

          {/* Loading State */}
          {isLoading && <p className="text-center text-gray-600">Loading restaurants...</p>}

          {/* Error State */}
          {isError && (
            <p className="text-center text-red-600">
              Error: {error.message || "Could not fetch restaurants. Please try again later."}
            </p>
          )}

          {/* Data Display */}
          {!isLoading && !isError && restaurants && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-green-700 text-white text-lg">
                  <th className="p-4 text-left">Complaint Title</th>
                  <th className="p-4 text-left">Comment</th>
                  <th className="p-4 text-left">Restaurant Name</th>
                    <th className="p-4 text-left">Cuisine</th>
                    <th className="p-4 text-left">Owner</th>
                    <th className="p-4 text-left">Contact</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="border-b hover:bg-gray-100 transition duration-300">
                      <td className="p-4 text-gray-900 font-semibold">{restaurant.subject}</td>
                      <td className="p-4 text-gray-900 font-semibold">{restaurant.description}</td>
                      <td className="p-4 text-gray-900 font-semibold">{restaurant.restaurant.name}</td>
                      <td className="p-4 text-gray-700">{restaurant.restaurant.cuisine}</td>
                      <td className="p-4 text-gray-700">{restaurant.restaurant.owner.username}</td>
                      <td className="p-4 text-gray-700">{restaurant.restaurant.contact}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                          onClick={() => handleView(restaurant)}
                        >
                          View
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                          onClick={() => handleDelete(restaurant.restaurant._id)}
                          disabled={deleteMutation.isLoading}
                        >
                          {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Restaurant Detail Modal */}
        {selectedRestaurant && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-300"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-2">Restaurant Details</h3>
              <div className="text-left space-y-2">
                <p className="text-gray-900 text-lg font-semibold">{selectedRestaurant.restaurant.name}</p>
                <p className="text-gray-700">Cuisine: <span className="font-medium">{selectedRestaurant.restaurant.cuisine}</span></p>
                <p className="text-gray-700">Opening Hours: {selectedRestaurant.restaurant.opening_hours}</p>
                <p className="text-gray-700">Owner: {selectedRestaurant.restaurant.owner.username}</p>
                <p className="text-gray-700">Contact: {selectedRestaurant.restaurant.contact}</p>
                <p className="text-gray-700">Email: {selectedRestaurant.restaurant.owner.email}</p>
                <p className="text-gray-700">Address: {selectedRestaurant.restaurant.address}</p>
                <p className="text-gray-700">
                  Google Maps: <a href={selectedRestaurant.restaurant.googleMapsUrl} className="text-blue-500 font-medium" target="_blank" rel="noopener noreferrer">View Location</a>
                </p>
                
              </div>
              <button
                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full text-lg"
                onClick={() => setSelectedRestaurant(null)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Adminrestview;