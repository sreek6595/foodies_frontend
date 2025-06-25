import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addMenuItemAPI } from "../services/foodmenuServices";

const Addmenu = () => {
  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: addMenuItemAPI,
    mutationKey: ["add-food"],
  });

  const initialValues = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    note: "",
    stock: "", // Added stock field
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Food name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    category: Yup.string().required("Category is required"),
    image: Yup.mixed().required("Image is required"),
    note: Yup.string(),
    stock: Yup.number() // Added stock validation
      .required("Stock is required")
      .min(0, "Stock cannot be negative"),
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("category", values.category);
    formData.append("note", values.note);
    formData.append("stock", values.stock); // Added stock to formData

    if (values.image) {
      formData.append("image", values.image);
      console.log(values.image);
    }

    try {
      await mutateAsync(formData);
      alert("Menu item added successfully!");
    } catch (mutationError) {
      console.error("Error adding menu item:", mutationError);
      alert("An error occurred while adding the menu item.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add Food Menu</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Food Name</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
                <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
                <ErrorMessage name="description" component="div" className="text-red-600 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Price (₹)</label>
                <Field
                  type="number"
                  name="price"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
                <ErrorMessage name="price" component="div" className="text-red-600 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Category</label>
                <Field
                  as="select"
                  name="category"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select Category</option>
                  <option value="Starter">Starter</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-600 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Upload Food Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setFieldValue("image", e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <ErrorMessage name="image" component="div" className="text-red-600 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Stock</label>
                <Field
                  type="number"
                  name="stock"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
                <ErrorMessage name="stock" component="div" className="text-red-600 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Additional Note</label>
                <Field
                  as="textarea"
                  name="note"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
                <ErrorMessage name="note" component="div" className="text-red-600 text-sm" />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Menu Item"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {isError && (
          <div className="mt-4 text-red-600 text-center">
            {error?.message || "An error occurred. Please try again."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addmenu;