import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotAPI, loginAPI, resetAPI } from "../services/userServices";
import { loginUserAction } from "../redux/Userslice";
import { jwtDecode } from "jwt-decode";

const backgroundImageUrl = "/Foodies.jpg";

const Login = () => {
  console.log("Rendering Login Page"); // ✅ Debugging Log

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Login API Mutation
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: loginAPI,
    mutationKey: ["UserLogin"],
  });

  // ✅ Reset Password API Mutation
  const resetMutation = useMutation({
    mutationFn: forgotAPI,
    mutationKey: ["resetPassword"],
    onSuccess: (data) => {
      setForgotMessage(data.message || "Password reset link sent to your email!");
      setForgotEmail(""); // Clear email input
    },
    onError: (error) => {
      setForgotMessage(error?.response?.data?.message || "Failed to send reset link. Please try again.");
    },
  });

  // ✅ Forgot Password Function
  const handleForgotPassword = async () => {
    setForgotMessage(""); // Reset message
    if (!forgotEmail) {
      setForgotMessage("Please enter your email.");
      return;
    }

    resetMutation.mutate({ email: forgotEmail });
  };

  // ✅ Validation Schema
  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(2, "Password must be at least 6 characters").required("Password is required"),
  });

  // ✅ Formik Hook
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, action) => {
      try {
        const token = await mutateAsync(values);
        sessionStorage.setItem("userToken", token);
        const decodedData = jwtDecode(token);
        dispatch(loginUserAction(decodedData));
        action.resetForm();
        if (decodedData.role === "admin") {
          navigate("/admin");
        } else if (decodedData.role === "customer") {
          navigate("/customerp");
        } else if (decodedData.role === "driver") {
          navigate("/delivery");
        } else if (decodedData.role === "restaurant") {
          navigate("/restaurantreg");
        }
      } catch (error) {
        setSuccessMessage(null);
        setErrorMessage(error?.response?.data?.message || "Invalid email or password.");
      }
    },
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 bg-opacity-90 backdrop-blur-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h2>

        <form className="mt-4" onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              {...formik.getFieldProps("password")}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <p
          className="text-center text-sm mt-2 text-blue-500 cursor-pointer hover:underline"
          onClick={() => setForgotPasswordOpen(true)}
        >
          Forgot Password?
        </p>

        {/* Signup Link */}
        <p className="text-center text-sm mt-4">
          Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold text-gray-800">Forgot Password</h3>
            <p className="text-sm text-gray-600 mt-2">Enter your email to receive a password reset link.</p>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            {forgotMessage && (
              <p className={`text-sm mt-2 ${forgotMessage.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
                {forgotMessage}
              </p>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2"
                onClick={() => setForgotPasswordOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={handleForgotPassword}
                disabled={resetMutation.isLoading}
              >
                {resetMutation.isLoading ? "Sending..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;