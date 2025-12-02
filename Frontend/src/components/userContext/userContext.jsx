import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [address, setAddress] = useState(() => {
    return localStorage.getItem("address") || "";
  });

  const saveAddress = (newAddress) => {
    setAddress(newAddress);
    localStorage.setItem("address", newAddress);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("address");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logoutUser, address, saveAddress }}>
      {children}
    </UserContext.Provider>
  );
};
