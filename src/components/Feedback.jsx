import React, { useState } from "react";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Customer Feedback</h2>

        {submitted ? (
          <div className="text-center">
            <h3 className="text-lg text-green-600 font-semibold">Thank you for your feedback!</h3>
            <p className="text-gray-600">We appreciate your time and effort in helping us improve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                required
              />
            </div>

            {/* Rating Field */}
            <div>
              <label className="block text-gray-700 font-medium">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                required
              >
                <option value="">Select Rating</option>
                <option value="5">Excellent (5 Stars)</option>
                <option value="4">Very Good (4 Stars)</option>
                <option value="3">Good (3 Stars)</option>
                <option value="2">Fair (2 Stars)</option>
                <option value="1">Poor (1 Star)</option>
              </select>
            </div>

            {/* Comments Field */}
            <div>
              <label className="block text-gray-700 font-medium">Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                rows="4"
                placeholder="Share your experience..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
