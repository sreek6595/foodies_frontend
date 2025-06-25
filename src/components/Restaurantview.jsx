import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { addReviewAPI, getReviewsAPI, viewAllRestaurantsAPI } from "../services/restaurantServices";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUtensils,
  FaConciergeBell,
  FaShoppingCart,
  FaTruck,
  FaCommentDots,
  FaHeadset,
  FaUser,
  FaBell,
} from "react-icons/fa";
import { logoutAction } from "../redux/Userslice";
import { getUserNotificationsAPI } from "../services/notificationService";

const CustomerNavbar = () => {
  const navigate = useNavigate();

  // Fetch notifications to get unread count
  const { data: notifications = [] } = useQuery({
    queryKey: ["customerNotifications"],
    queryFn: getUserNotificationsAPI,
  });

  // Count notifications where read is false
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
    // { label: "Feedback", icon: <FaCommentDots />, route: "/feedback" },
    { label: "Report an Issue", icon: <FaHeadset />, route: "/order" },
  ];

  return (
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

        {/* Logout Button */}
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

const RestaurantView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedReviews, setExpandedReviews] = useState(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [filterRating, setFilterRating] = useState(0);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError("Unable to retrieve your location. Please enable location services.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch restaurants with location parameters
  const {
    data: restaurants = [],
    isLoading: restaurantsLoading,
    isError: restaurantsError,
    error: restaurantsErrorObj,
  } = useQuery({
    queryKey: ["restaurants", userLocation.latitude, userLocation.longitude],
    queryFn: () =>
      viewAllRestaurantsAPI({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }),
    retry: false,
    enabled: !!userLocation.latitude && !!userLocation.longitude, // Only fetch when location is available
  });

  // Fetch reviews for all restaurants
  const reviewQueries = useQueries({
    queries: restaurants.map((restaurant) => ({
      queryKey: ["reviews", restaurant._id],
      queryFn: () => getReviewsAPI(restaurant._id),
      retry: false,
      enabled: !!restaurant._id,
    })),
  });

  // Combine reviews data
  const reviewsData = restaurants.map((restaurant, index) => ({
    restaurantId: restaurant._id,
    reviews: reviewQueries[index].data || [],
    isLoading: reviewQueries[index].isLoading,
    isError: reviewQueries[index].isError,
  }));

  // Debugging logs
  console.log("Restaurants:", restaurants);
  console.log("Restaurants Error:", restaurantsError && restaurantsErrorObj?.message);
  console.log("Reviews Data:", reviewsData);
  console.log("User Location:", userLocation);

  // Mutation for submitting a review
  const submitReviewMutation = useMutation({
    mutationFn: addReviewAPI,
    onSuccess: (_, { restaurantId }) => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries(["reviews", restaurantId]);
      setReviewFormOpen(null);
      setNewReview({ rating: 0, comment: "" });
    },
    onError: (err) => {
      toast.error(`Error submitting review: ${err.message || "Unknown error"}`);
    },
  });

  // Toggle reviews visibility
  const toggleReviews = (restaurantId) => {
    setExpandedReviews(expandedReviews === restaurantId ? null : restaurantId);
    setReviewFormOpen(null);
  };

  // Toggle review form
  const toggleReviewForm = (restaurantId) => {
    setReviewFormOpen(reviewFormOpen === restaurantId ? null : restaurantId);
    setExpandedReviews(null);
  };

  // Handle review submission
  const handleReviewSubmit = (restaurantId) => {
    if (newReview.rating < 1 || newReview.rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }
    submitReviewMutation.mutate({
      id: restaurantId,
      rating: newReview.rating,
      comment: newReview.comment,
    });
  };

  // Render star rating
  const renderStars = (rating) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= Math.round(rating) ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-gray-400" />
          )}
        </span>
      ))}
    </div>
  );

  // Handle restaurant click
  const handleRestaurantClick = (restaurantId) => {
    navigate(`/viewfoodcust/${restaurantId}`, { state: { restaurantId } });
  };

  // Filter restaurants based on rating
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const reviewData = reviewsData.find((rd) => rd.restaurantId === restaurant._id);
      const reviews = reviewData?.reviews || [];
      const averageRating =
        reviews.length > 0
          ? Math.round(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length)
          : 0;
      return filterRating === 0 ? true : averageRating === filterRating;
    });
  }, [restaurants, reviewsData, filterRating]);

  // Check if reviews are still loading
  const isReviewsLoading = reviewsData.some((rd) => rd.isLoading);

  if (locationError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{locationError}</p>
      </div>
    );
  }

  if (restaurantsLoading || isReviewsLoading || !userLocation.latitude) {
    return (
      <div className="text-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-gray-600 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
          ></path>
        </svg>
        <p className="text-center text-gray-500 mt-2">Loading restaurants and reviews...</p>
      </div>
    );
  }

  if (restaurantsError) {
    return (
      <p className="text-center text-red-500">
        Error loading restaurants: {restaurantsErrorObj?.message || "Unknown error"}
      </p>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-8 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Toaster position="top-right" />
      <CustomerNavbar />
      <h2 className="text-4xl font-bold text-center mb-8">Explore Top Restaurants</h2>

      {/* Filter Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Filter by Rating</h3>
        <div>
          <label className="block font-semibold mb-2">Minimum Rating:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
            className="w-full max-w-xs p-2 border rounded-lg"
          >
            <option value={0}>All Ratings</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      {(!filteredRestaurants || filteredRestaurants.length === 0) && (
        <p className="text-center text-gray-500">No restaurants match the selected rating.</p>
      )}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            expandedReviews={expandedReviews}
            reviewFormOpen={reviewFormOpen}
            newReview={newReview}
            setNewReview={setNewReview}
            toggleReviews={toggleReviews}
            toggleReviewForm={toggleReviewForm}
            handleReviewSubmit={handleReviewSubmit}
            handleRestaurantClick={handleRestaurantClick}
            renderStars={renderStars}
            reviewsData={reviewsData}
          />
        ))}
      </div>
    </motion.div>
  );
};

// RestaurantCard component remains unchanged
const RestaurantCard = ({
  restaurant,
  expandedReviews,
  reviewFormOpen,
  newReview,
  setNewReview,
  toggleReviews,
  toggleReviewForm,
  handleReviewSubmit,
  handleRestaurantClick,
  renderStars,
  reviewsData,
}) => {
  const reviewData = reviewsData.find((rd) => rd.restaurantId === restaurant._id) || {};
  const reviews = reviewData.reviews || [];
  const isLoading = reviewData.isLoading;
  const isError = reviewData.isError;

  const averageRating =
    reviews.length > 0
      ? Math.round(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length)
      : "No reviews";
  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={() => handleRestaurantClick(restaurant._id)}
    >
      <img
        src={restaurant.image || "https://via.placeholder.com/500x300?text=Image+Not+Available"}
        alt={restaurant.name || "Restaurant"}
        className="w-full h-56 object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{restaurant.name || "Unknown Restaurant"}</h3>
        <div className="flex items-center mb-4">
          <span className="font-semibold mr-2">Rating:</span>
          {renderStars(parseFloat(averageRating) || 0)}
          <span className="ml-2 text-gray-500">({averageRating})</span>
        </div>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Location:</span> {restaurant.location || "N/A"}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Cuisine:</span>{" "}
            {restaurant.cuisine?.join(", ") || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Opening Hours:</span>{" "}
            {restaurant.opening_hours || "N/A"}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Address:</span> {restaurant.address || "N/A"}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Contact:</span> {restaurant.contact || "N/A"}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Distance:</span>{" "}
            {restaurant.distance ? `${restaurant.distance.toFixed(2)} km` : "N/A"}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Directions:</span>{" "}
            <a
              href={restaurant.googleMapsUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Get Directions
            </a>
          </p>
        </div>

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            toggleReviews(restaurant._id);
          }}
        >
          {expandedReviews === restaurant._id ? "Hide Reviews" : "View Reviews"}
        </button>

        <button
          className="mt-2 ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={(e) => {
            e.stopPropagation();
            toggleReviewForm(restaurant._id);
          }}
        >
          {reviewFormOpen === restaurant._id ? "Cancel" : "Add Review"}
        </button>

        {expandedReviews === restaurant._id && (
          <motion.div
            className="mt-4 border-t pt-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <h4 className="text-lg font-semibold mb-2">Customer Reviews</h4>
            {isLoading ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : isError ? (
              <p className="text-red-500">Error loading reviews</p>
            ) : !reviews || reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id || Math.random()} className="mb-4 border-b pb-2">
                  <div className="flex items-center">
                    <p className="font-semibold">{review.user?.username || "Anonymous"}</p>
                    <span className="ml-2">{renderStars(review.rating || 0)}</span>
                  </div>
                  <p className="text-gray-600">{review.comment || "No comment"}</p>
                  <p className="text-gray-400 text-sm">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {reviewFormOpen === restaurant._id && (
          <motion.div
            className="mt-4 border-t pt-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <h4 className="text-lg font-semibold mb-2">Submit Your Review</h4>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold">Rating:</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewReview({ ...newReview, rating: star });
                      }}
                      className="focus:outline-none"
                    >
                      {star <= newReview.rating ? (
                        <FaStar className="text-yellow-400 text-2xl" />
                      ) : (
                        <FaRegStar className="text-gray-400 text-2xl" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold">Comment:</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  placeholder="Write your review..."
                />
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReviewSubmit(restaurant._id);
                }}
              >
                Submit Review
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantView;