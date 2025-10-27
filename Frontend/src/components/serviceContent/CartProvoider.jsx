import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    // Convert IDs to string to avoid type mismatches
    const exists = cartItems.some((cartItem) => String(cartItem.id) === String(item.id));

    if (exists) {
      alert("This service is already in your cart!");
    } else {
      setCartItems((prev) => [...prev, item]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
