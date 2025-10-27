
import React, { createContext, useState, useContext } from "react";

// Create context
const UserContext = createContext();

// Create provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  // user = { name: "John", phone: "9876543210" }

  const loginUser = (userData) => {
    setUser(userData);
    // optionally save in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // On app load, restore user from localStorage
  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create custom hook for easy access
export const useUser = () => useContext(UserContext);
