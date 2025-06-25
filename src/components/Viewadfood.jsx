import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Viewadfood = ({ foodId, apiUrl = "" }) => {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch food item data using react-query
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["foodItem", foodId],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/${foodId}`);
      return response.data;
    },
  });
  console.log(data);
  
const foodItem=data
  const handleEdit = () => {
    setEditMode(true);
    setEditedData(foodItem);
    setSelectedImage(foodItem?.image || null);
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

      await axios.put(`${apiUrl}/${foodId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Food details updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating food item:", error);
      alert("Failed to update food details.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food item?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${apiUrl}/${foodId}`);
        alert("Food item deleted successfully!");
        navigate("/food-list"); // Navigate back to the list page
      } catch (error) {
        console.error("Error deleting food item:", error);
        alert("Failed to delete food item.");
      }
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return <p className="text-center mt-10">Loading food details...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">
        Error fetching data: {error.message}
      </p>
    );
  }

  if (!foodItem) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No food item found. Please try again later.
      </p>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Food Item Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-lg rounded-lg p-6">
        <div>
          <h2 className="text-lg font-semibold">Food Name</h2>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={editedData.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          ) : (
            <p>{foodItem?.name || "N/A"}</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Description</h2>
          {editMode ? (
            <textarea
              name="description"
              value={editedData.description || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          ) : (
            <p>{foodItem?.description || "N/A"}</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Price</h2>
          {editMode ? (
            <input
              type="number"
              name="price"
              value={editedData.price || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          ) : (
            <p>₹{foodItem?.price || "N/A"}</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Category</h2>
          {editMode ? (
            <input
              type="text"
              name="category"
              value={editedData.category || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          ) : (
            <p>{foodItem?.category || "N/A"}</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Food Image</h2>
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
              src={foodItem?.image || "https://via.placeholder.com/150"}
              alt="Food Item"
              className="w-32 h-32 rounded-lg shadow-md"
            />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Additional Note</h2>
          {editMode ? (
            <textarea
              name="additionalNote"
              value={editedData.additionalNote || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          ) : (
            <p>{foodItem?.additionalNote || "No additional notes provided."}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/food-list")}
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

export default Viewadfood;
