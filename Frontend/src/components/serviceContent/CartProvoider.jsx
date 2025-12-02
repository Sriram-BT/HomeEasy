import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // Load saved cart from localStorage on first render
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const exists = cartItems.some(
      (cartItem) => String(cartItem.id) === String(item.id)
    );

    if (exists) {
      alert("This service is already in your cart!");
    } else {
      setCartItems((prev) => [...prev, item]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
