import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Addcart = () => {
  const location = useLocation();
  const food = location.state?.food;

  // Retrieve existing cart from local storage
  const [cart, setCart] = useState(() => {
    const storedCart = sessionStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (!food) {
    return <p className="text-center text-red-500 mt-10 text-xl">⚠ No food details available.</p>;
  }

  // Function to add item to cart
  const handleAddToCart = () => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === food.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...food, quantity: 1 }];
      }
    });
  };

  // Function to increase or decrease quantity in cart
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(item.quantity + amount, 1) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Your Cart</h2>

      <div className="border p-4 rounded-lg">
        <img src={food.image} alt={food.name} className="w-full h-56 object-cover rounded-lg mb-4" />
        <h3 className="text-xl font-semibold">{food.name}</h3>
        <p className="text-gray-600">{food.description}</p>
        <p className="mt-2 font-semibold">Price: ₹{food.price}</p>

        <button
          onClick={handleAddToCart}
          className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full"
        >
          Add to Cart
        </button>
      </div>

      {/* Cart Items */}
      {cart.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-bold mb-2">Cart Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  -
                </button>
                <span className="mx-3 text-lg">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 text-right font-bold text-lg">
            Total: ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Addcart;
