import React, { useContext, useState } from "react";
import { CartContext } from "../serviceContent/CartProvoider";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import { useUser } from "../userContext/userContext";

export default function WorkCart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useUser(); // ✅ Get logged-in user info
  const [openDialog, setOpenDialog] = useState(false); // Confirmation dialog
  const [loading, setLoading] = useState(false); // Loader for booking
  const [message, setMessage] = useState(""); // Success/error message

  // 🧮 Calculate total cost
  const totalCost = cartItems.reduce(
    (total, item) => total + (item.cost || 0),
    0
  );
          console.log("phone",user?.phoneNumber)

        console.log("name",user?.name)


  // ✉️ Book & Pay - open confirmation dialog
  const handleBookPayment = () => {
    setOpenDialog(true);
  };

  // ✅ Confirm booking & send message
  const handleConfirmPayment = async () => {
    setLoading(true);
    setMessage("");
    try {
      const services = cartItems.map((item) => item.name);

      // Send user info along with services and total
      const response = await fetch("http://localhost:9000/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: user?.name || "Unknown User", // ✅ Pass name
          userPhone: user?.phoneNumber || "Unknown Phone", // ✅ Pass phone
          services,
          total: totalCost,
        }),
      });


      const data = await response.json();
      if (data.success) {
        setMessage("✅ Booking confirmed and message sent to admin!");
        clearCart();
      } else {
        setMessage("❌ Failed to send message. Try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleCancelPayment = () => {
    setOpenDialog(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>{message || "No services added yet."}</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "10px",
                backgroundColor: "#fafafa",
              }}
            >
              <h3 style={{ margin: "0 0 5px 0" }}>{item.name}</h3>
              <p style={{ margin: 0, color: "#555" }}>{item.description}</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#1976d2" }}>
                  ₹{item.cost}
                </span>
                <button
                  style={{
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* 💰 Total Section */}
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              borderTop: "2px solid #1976d2",
              textAlign: "right",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Total: ₹{totalCost}
          </div>

          {/* 🧹 Clear All & 💳 Book Payment Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
            }}
          >
            {/* Left - Clear All */}
            <button
              style={{
                backgroundColor: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
              onClick={clearCart}
            >
              Clear All
            </button>

            {/* Right - Book & Pay */}
            <button
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
              onClick={handleBookPayment}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Book & Pay"}
            </button>
          </div>

          {/* 🧾 Confirmation Dialog */}
          <Dialog open={openDialog} onClose={handleCancelPayment}>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to confirm your booking and proceed with
                payment of ₹{totalCost}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelPayment} color="error">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                color="primary"
                variant="contained"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Optional success message */}
      {message && (
        <p style={{ marginTop: "15px", color: "#1976d2", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
}
