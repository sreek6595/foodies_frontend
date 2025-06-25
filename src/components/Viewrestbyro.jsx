import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { viewRestaurantsAPI } from "../services/restaurantServices";

const Viewrestbyro = ({ id, apiUrl = "" }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-restaurant"],
    queryFn: viewRestaurantsAPI,
  });

  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // Loading state
  if (isLoading) {
    return <p className="text-center mt-10">Loading restaurant details...</p>;
  }

  // Error state
  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">
        Error fetching data: {error.message}
      </p>
    );
  }

  // Fallback values for missing data
  const {
    restaurantName = "N/A",
    location = "N/A",
    contactNumber = "N/A",
    cuisineType = "N/A",
    openingHours = "N/A",
    address = "N/A",
    license = "N/A",
    image = "https://via.placeholder.com/150",
  } = data || {};

  const handleEdit = () => {
    setEditMode(true);
    setEditedData({
      restaurantName,
      location,
      contactNumber,
      cuisineType,
      openingHours,
      address,
      license,
      image,
    });
    setSelectedImage(image);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData({});
    setSelectedImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setEditedData((prev) => ({ ...prev, image: file })); // Store the file for upload
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in editedData) {
        formData.append(key, editedData[key]);
      }

      await axios.put(`${apiUrl}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Restaurant details updated successfully!");
      setEditMode(false);
      queryClient.invalidateQueries(["get-restaurant"]); // Refetch data
    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert("Failed to update restaurant details.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        alert("Restaurant deleted successfully!");
        navigate("/regis"); // Navigate back to the list page
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        alert("Failed to delete restaurant.");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Restaurant Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-lg rounded-lg p-6">
        {[
          { label: "Restaurant Name", value: "name" },
          { label: "Location", value: "location" },
          { label: "Contact Number", value: "contact" },
          { label: "Cuisine Type", value: "cuisine" },
          { label: "Opening Hours", value: "opening_hours" },
          { label: "Address", value: "address" },
          { label: "License", value: "license" },
        ].map(({ label, value }) => (
          <div key={value}>
            <h2 className="text-lg font-semibold">{label}</h2>
            {editMode ? (
              <input
                type="text"
                name={value}
                value={editedData[value]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            ) : (
              <p>{data[value] || "N/A"}</p>
            )}
          </div>
        ))}

        <div>
          <h2 className="text-lg font-semibold">Image</h2>
          {editMode ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-32 h-32 rounded-lg shadow-md"
                />
              )}
            </>
          ) : (
            <img
              src={data.image}
              alt="Restaurant"
              className="w-32 h-32 rounded-lg shadow-md"
            />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/regis")}
        >
          Back
        </button>
        <div className="flex space-x-4">
          {editMode ? (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewrestbyro;
