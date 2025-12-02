import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import { CartContext } from "./CartProvoider";

export default function ServiceContents() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { serviceId, serviceName } = location.state || {};
  const [serviceData, setServiceData] = useState(null);

  // Load image dynamically
  const getServiceImage = (name) => {
    if (!name) return null;

    try {
      const formattedName = name
        .toLowerCase()
        .replace(/&/g, "")
        .replace(/-/g, "_")
        .replace(/\s+/g, "_");

      try {
        return require(`../../Assets/${formattedName}.png`);
      } catch (e) {
        return require(`../../Assets/${formattedName}.jpg`);
      }
    } catch (error) {
      console.error("Image not found:", name);
      return null;
    }
  };

  // Fetch service data
  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/getService/${serviceId}`);
        setServiceData(data);
      } catch (err) {
        console.error("Error fetching service:", err);
      }
    };

    fetchService();
  }, [serviceId]);

  // Add to cart
  const handleBookNow = () => {
    if (serviceData) {
      const itemToAdd = {
        id: serviceData._id,
        name: serviceData.ServiceName,
        cost: serviceData.ServiceCost,
        description: serviceData.ServiceDescription,
        image: getServiceImage(serviceData.ServiceName),
      };

      addToCart(itemToAdd);
      navigate("/cart");
    }
  };

  return (
    <div
      style={{
        padding: "5px",
        backgroundColor: "#f5f5f5",
        minHeight: "82vh",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "16px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "20px", display: "flex", gap: "8px" }}>
            <span>🔧</span> {serviceName || "Service Details"}
          </h1>
        </div>

        {serviceData ? (
          <div style={{ padding: "16px" }}>
            {/* GRID LAYOUT UPDATED */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "70% 30%",
                gap: "16px",
                alignItems: "start",
              }}
            >
              {/* LEFT SECTION */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* DESCRIPTION */}
                <div
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px", fontSize: "16px", color: "#1976d2" }}>
                    ℹ️ Description
                  </h3>
                  <hr style={{ borderTop: "1px solid #e0e0e0", margin: "8px 0" }} />
                  <p style={{ margin: 0, color: "#666", lineHeight: "1.5", fontSize: "14px" }}>
                    {serviceData.ServiceDescription}
                  </p>
                </div>

                {/* RESULT */}
                <div
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px", fontSize: "16px", color: "#4caf50" }}>
                    ✅ Result
                  </h3>
                  <hr style={{ borderTop: "1px solid #e0e0e0", margin: "8px 0" }} />
                  <div
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      padding: "10px 12px",
                      borderRadius: "20px",
                      textAlign: "center",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {serviceData.ServiceResult}
                  </div>
                </div>

                {/* DETAIL */}
                <div
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px", fontSize: "16px", color: "#333" }}>
                    Detail
                  </h3>
                  <hr style={{ borderTop: "1px solid #e0e0e0", margin: "8px 0" }} />
                  <p style={{ margin: 0, color: "#666", lineHeight: "1.5", fontSize: "14px" }}>
                    {serviceData.ServiceDetail}
                  </p>
                </div>
              </div>

              {/* RIGHT IMAGE SECTION UPDATED */}
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  height: "350px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e3f2fd",
                  overflow: "hidden",
                }}
              >
                {getServiceImage(serviceData?.ServiceName) ? (
                  <img
                    src={getServiceImage(serviceData?.ServiceName)}
                    alt={serviceData?.ServiceName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "60px", opacity: 0.3 }}>🔧</div>
                    <p style={{ color: "#666", marginTop: "12px" }}>Image not available</p>
                  </div>
                )}
              </div>
            </div>

            {/* BOOK SECTION */}
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#fff3e0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3>Book This Service</h3>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1976d2" }}>
                      ₹{serviceData.ServiceCost}
                    </div>
                  </div>

                  <button
                    style={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      padding: "12px 40px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={handleBookNow}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "30px", textAlign: "center" }}>
            <div style={{ fontSize: "40px" }}>⏳</div>
            <p>Loading service details...</p>
          </div>
        )}
      </div>
    </div>
  );
}
