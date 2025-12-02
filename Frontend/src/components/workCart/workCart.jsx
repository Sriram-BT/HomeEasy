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
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useUser } from "../userContext/userContext";
import { QRCodeCanvas } from "qrcode.react";

export default function WorkCart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user, address } = useUser();
  const savedCart = localStorage.getItem("cart");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showUPILink, setShowUPILink] = useState(false);

  // 💼 Admin UPI ID
  const ADMIN_UPI_ID = "bt.sriram2343-2@okicici";

  // ✅ Calculate total cost
  const totalCost = cartItems.reduce(
    (total, item) => total + (item.cost || 0),
    0
  );

  // ✅ Step 1: Open dialog
  const handleBookPayment = () => {
    if (!user || !user.phoneNumber) {
      setMessage("⚠️ Please login before booking a service.");
      return;
    }

    if (!address) {
      setMessage("⚠️ Please select or add your address before booking.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("⚠️ Your cart is empty.");
      return;
    }

    setMessage("");
    setOpenDialog(true);
  };

  // ✅ Step 2: Confirm booking
  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      setMessage("⚠️ Please select a payment method.");
      return;
    }

    if (paymentMethod === "cash") {
      await sendBookingToBackend("Cash");
      return;
    }

    if (paymentMethod === "upi") {
      setShowUPILink(true);
    }
  };

  // 🧾 UPI payment confirmation
  const handleUPIPaymentDone = async () => {
    setShowUPILink(false);
    await sendBookingToBackend("UPI");
  };

  // 🧰 Send booking to backend
  const sendBookingToBackend = async (paymentType) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:9000/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: user?.name || "Unknown User",
          userPhone: user?.phoneNumber || "Unknown Phone",
          address: address || "N/A",
          paymentMethod: paymentType,
          upiId: ADMIN_UPI_ID,
          services: cartItems.map((item) => ({
            name: item.name || item.ServiceName,
            cost: item.cost || item.ServiceCost,
          })),
          total: totalCost,
            bookingDate: new Date().toLocaleDateString(),
  bookingTime: new Date().toLocaleTimeString(),
        }),
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Booking failed.");

      setMessage(
        `✅ Booking confirmed! ${
          paymentType === "Cash"
            ? "Pay in cash during delivery."
            : `Paid or will pay via UPI (${ADMIN_UPI_ID})`
        }`
      );
      clearCart();
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Something went wrong: " + error.message);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleCancelPayment = () => {
    setOpenDialog(false);
    setPaymentMethod("");
    setShowUPILink(false);
  };

  // 📱 Detect if user is on mobile
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ padding: "20px",marginTop:'60px', }}>
      <h2 style={{marginTop:'30px'}}>🛒 Your Cart</h2>

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
                marginTop:'40px',
                backgroundColor: "#fafafa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ margin: "0 0 5px 0" }}>
                {item.name || item.ServiceName}
              </h3>
              <p style={{ margin: 0, color: "#555" }}>
                {item.description || item.ServiceDescription}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#1976d2" }}>
                  ₹{item.cost || item.ServiceCost}
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

          {/* 💰 Total */}
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              borderTop: "2px solid #1976d2",
              textAlign: "right",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Total: ₹{totalCost}
          </div>

          {/* 🧹 Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
            }}
          >
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

            <button
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onClick={handleBookPayment}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Book & Confirm"
              )}
            </button>
          </div>

          {/* 🧾 Confirmation Dialog */}
          <Dialog open={openDialog} onClose={handleCancelPayment}>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Name:</strong> {user?.name || "N/A"}
                <br />
                <strong>Phone:</strong> {user?.phoneNumber || "N/A"}
                <br />
                <strong>Address:</strong> {address || "N/A"}
                <br />
                <br />
                Proceed with payment of ₹{totalCost}?
              </DialogContentText>

              {/* 🆕 Payment Options */}
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label="Pay via Cash"
                />
                <FormControlLabel
                  value="upi"
                  control={<Radio />}
                  label="Pay via UPI"
                />
              </RadioGroup>

              {/* 🆕 UPI Payment Section */}
              {showUPILink && (
                <div
                  style={{
                    marginTop: "15px",
                    backgroundColor: "#f1f8ff",
                    padding: "10px",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  <p>📱 Please pay using this UPI ID:</p>
                  <h3 style={{ color: "#1976d2" }}>{ADMIN_UPI_ID}</h3>

                  {isMobile ? (
                    <a
                      href={`upi://pay?pa=${ADMIN_UPI_ID}&pn=ServiceApp&am=${totalCost}&tn=Booking`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        color: "white",
                        backgroundColor: "#1976d2",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        textDecoration: "none",
                      }}
                    >
                      👉 Pay ₹{totalCost} via UPI App
                    </a>
                  ) : (
                    <div style={{ marginTop: "10px" }}>
                      <p>🖥 Scan this QR with your UPI app to pay:</p>
                      <QRCodeCanvas
                        value={`upi://pay?pa=${ADMIN_UPI_ID}&pn=ServiceApp&am=${totalCost}&tn=Booking`}
                        size={180}
                        includeMargin={true}
                      />
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#555",
                          marginTop: "6px",
                        }}
                      >
                        UPI ID: <strong>{ADMIN_UPI_ID}</strong>
                      </p>
                    </div>
                  )}

                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginTop: "10px" }}
                    onClick={handleUPIPaymentDone}
                  >
                    I’ve Paid
                  </Button>
                </div>
              )}
            </DialogContent>

            {!showUPILink && (
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
            )}
          </Dialog>
        </>
      )}

      {/* ✅ Message */}
      {message && (
        <p
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            textAlign: "center",
            backgroundColor: message.startsWith("⚠️")
              ? "#ffe6e6"
              : "#e6f4ff",
            color: message.startsWith("⚠️") ? "#d32f2f" : "#1976d2",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
