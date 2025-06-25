import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUtensils, FaClock, FaIdCard, FaGlobe, FaChartLine, FaMotorcycle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUnverifiedRestaurants, verifyRestaurant } from "../services/adminService";

const Adminresverify = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const queryClient = useQueryClient();

  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ["unverifiedRestaurants"],
    queryFn: getUnverifiedRestaurants,
  });

  const verifyRestaurantMutation = useMutation({
    mutationFn: verifyRestaurant,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["unverifiedRestaurants"]);
      queryClient.setQueryData(["unverifiedRestaurants"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((rest) =>
          rest._id === variables.id
            ? { ...rest, status: variables.status, rejectReason: variables.reason || rest.rejectReason }
            : rest
        );
      });
    },
    onError: (err) => {
      console.error("Failed to verify/reject restaurant:", err);
      alert("An error occurred while processing the request");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["unverifiedRestaurants"]);
    },
  });

  const handleVerifyRestaurant = (id) => {
    verifyRestaurantMutation.mutate({ 
      id: id, 
      status: "approved" 
    });
  };

  const handleRejectRestaurantProcess = (id, action = "start", reason = "") => {
    if (action === "start") {
      setShowRejectModal(id);
      setRejectReason("");
    } else if (action === "submit" && reason.trim()) {
      setIsRejecting(true);
      verifyRestaurantMutation.mutate(
        { 
          id: id, 
          status: "rejected", 
          reason: reason 
        },
        {
          onSuccess: () => {
            setShowRejectModal(null);
            setRejectReason("");
            setIsRejecting(false);
          },
          onError: () => {
            setIsRejecting(false);
            alert("Failed to reject restaurant. Please try again.");
          },
        }
      );
    } else if (action === "cancel") {
      setShowRejectModal(null);
      setRejectReason("");
    }
  };

  if (isLoading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">Failed to fetch restaurants: {error.message}</div>;

  const isReasonValid = rejectReason.trim().length >= 5;

  return (
    <div className="flex min-h-screen">
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
              <FaUser /> Delivery boy complaints
            </NavLink>
          </li>
          <li>
            <NavLink to="/admindbview" className="flex items-center gap-3 text-gray-300 hover:text-white">
              <FaMotorcycle /> Delivery Boys
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <nav className="bg-white shadow-md p-4 flex justify-between items-center rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Back
          </button>
        </nav>

        <h1 className="text-4xl font-bold text-gray-800 text-center my-8">
          Restaurant Verification
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4 font-semibold text-gray-700">Restaurant Name</th>
                <th className="p-4 font-semibold text-gray-700">Email</th>
                <th className="p-4 font-semibold text-gray-700">Phone</th>
                <th className="p-4 font-semibold text-gray-700">Licence Number</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants?.map((restaurant) => (
                <tr key={restaurant._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-t border-gray-200 text-gray-800">{restaurant.name}</td>
                  <td className="p-4 border-t border-gray-200 text-gray-600">{restaurant.owner.email}</td>
                  <td className="p-4 border-t border-gray-200 text-gray-600">{restaurant.contact}</td>
                  <td className="p-4 border-t border-gray-200 text-gray-600">{restaurant.license}</td>
                  <td className="p-4 border-t border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        restaurant.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : restaurant.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {restaurant.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-4 border-t border-gray-200 flex gap-3">
                    <motion.button
                      onClick={() => setExpandedId(expandedId === restaurant._id ? null : restaurant._id)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      {expandedId === restaurant._id ? <FaChevronUp /> : <FaChevronDown />}
                      {expandedId === restaurant._id ? "Hide" : "View"}
                    </motion.button>

                    <motion.button
                      onClick={() => handleVerifyRestaurant(restaurant._id)}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      disabled={verifyRestaurantMutation.isLoading || restaurant.status === "approved"}
                    >
                      {verifyRestaurantMutation.isLoading ? "Processing..." : <><FaCheck /> Accept</>}
                    </motion.button>

                    <motion.button
                      onClick={() => handleRejectRestaurantProcess(restaurant._id, "start")}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      disabled={verifyRestaurantMutation.isLoading || isRejecting || restaurant.status === "rejected"}
                    >
                      {isRejecting ? "Processing..." : <><FaTimes /> Reject</>}
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Reason for Rejection</h2>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Enter reason for rejection (min 5 characters)..."
                rows="4"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => handleRejectRestaurantProcess(showRejectModal, "submit", rejectReason)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  disabled={!isReasonValid || isRejecting}
                >
                  {isRejecting ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={() => handleRejectRestaurantProcess(showRejectModal, "cancel")}
                  className="flex-1 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  disabled={isRejecting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {expandedId && (
          <motion.div
            className="mt-6 p-6 bg-white shadow-lg rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {restaurants.map((restaurant) =>
              restaurant._id === expandedId ? (
                <div key={restaurant._id}>
                  <h2 className="text-2xl font-bold">{restaurant.name} - Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p><strong>Owner Name:</strong> {restaurant.owner.username}</p>
                      <p><strong>Email:</strong> {restaurant.owner.email}</p>
                      <p><strong>Address:</strong> {restaurant.address}</p>
                      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                    </div>
                    <div>
                      <p><strong>Opening Hours:</strong> {restaurant.opening_hours}</p>
                      <p><strong>License:</strong> {restaurant.license}</p>
                      <p><strong>Location:</strong> {restaurant.location}</p>
                      <p><strong>Contact number:</strong> {restaurant.contact}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <strong>Map Link:</strong> 
                    <a href={restaurant.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block">
                      {restaurant.googleMapsUrl}
                    </a>
                  </div>

                  <div className="mt-4">
                    <strong>Image:</strong> 
                    <img 
                      src="https://res.cloudinary.com/dla1gx1qw/image/upload/v1743501569/images/vmimhrrlyadbcicgkuyn.jpg" 
                      alt="Restaurant" 
                      className="w-64 h-40 rounded-lg shadow-md mt-2" 
                    />
                  </div>
                  
                  {/* Fixed rejection reason display */}
                  {restaurant.status === "rejected" && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <h3 className="font-semibold text-lg text-red-700 mb-2">Rejection Details</h3>
                      <div className="space-y-2">
                        <p><strong className="text-gray-800">Reason:</strong> {restaurant.reason || "No reason provided"}</p>
                        <p className="text-sm text-gray-500">
                          <strong>Rejected on:</strong> {new Date(restaurant.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Adminresverify;