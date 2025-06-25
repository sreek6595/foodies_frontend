import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../services/userServices";
import { loginUserAction } from "../redux/Userslice";
import { jwtDecode } from "jwt-decode";

const Signup = () => {
  // ✅ Validation Schema
  const validationSchema = yup.object().shape({
    username: yup.string()
      .min(5, "Username must be at least 5 characters")
      .required("Username is required"),
    email: yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: yup.string()
      .required("Role is required")
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // ✅ React Query Mutation for API Call
  const { mutateAsync } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register-user"],
  });

  // ✅ Formik Hook (Ensure fields are controlled)
  const formik = useFormik({
    initialValues: { 
      username: "", 
      email: "", 
      password: "", 
      role: "" // Default role set to 'customer'
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = await mutateAsync(values); 
            sessionStorage.setItem("userToken", token);
            const decodedData = jwtDecode(token);
            dispatch(loginUserAction(decodedData));
            // setSuccessMessage("Login Successful!");
            resetForm();
          navigate("/login"); 
      } catch (error) {
        console.error("Signup Error:", error);
        alert("Signup failed. Please try again.");
      }
    },
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Food_Spot_Finder_Background.jpg')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 bg-opacity-90">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>

        <form className="mt-4" onSubmit={formik.handleSubmit}>
          {/* ✅ Username Field */}
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm">{formik.errors.username}</p>
            )}
          </div>

          {/* ✅ Email Field */}
          <div className="mt-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* ✅ Password Field */}
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          {/* ✅ Role Dropdown Field - Added this section */}
          <div className="mt-4">
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant Owner</option>
              <option value="driver">Delivery Boy</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <p className="text-red-500 text-sm">{formik.errors.role}</p>
            )}
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;