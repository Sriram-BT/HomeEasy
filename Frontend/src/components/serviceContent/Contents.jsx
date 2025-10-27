import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import AC_repair from "../../Assets/AC_Repair.jpg";
import Deepclean from "../../Assets/Deepclean.jpg";
import Plumbing from "../../Assets/Plumbing.jpg";
import SofaCleaning from "../../Assets/SofaCleaning.jpg";
import { CartContext } from "./CartProvoider";

export default function ServiceContents() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); // ✅ Get addToCart function from context
  const { serviceId, serviceName } = location.state || {};
  const [serviceData, setServiceData] = useState(null);

  // 🔧 Image mapping
  const getServiceImage = (name) => {
    const serviceName = name?.toLowerCase() || "";
    if (serviceName.includes("ac") || serviceName.includes("air conditioner")) {
      return AC_repair;
    } else if (serviceName.includes("deep clean") || serviceName.includes("cleaning")) {
      return Deepclean;
    } else if (serviceName.includes("plumb")) {
      return Plumbing;
    } else if (serviceName.includes("sofa")) {
      return SofaCleaning;
    }
    return null;
  };

  // 📦 Fetch service details
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

  // 🛒 Handle "Book Now" click
const handleBookNow = () => {
  if (serviceData) {
    const itemToAdd = {
      id: serviceData._id,  // always use the real _id
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
    <div style={{ padding: "5px", backgroundColor: "#f5f5f5", minHeight: "82vh", maxHeight: "82vh" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "16px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🔧</span>
            {serviceName || "Service Details"}
          </h1>
        </div>

        {serviceData ? (
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Description Section */}
                <div
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                      color: "#1976d2",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>ℹ️</span>
                    Description
                  </h3>
                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid #e0e0e0",
                      margin: "8px 0",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      color: "#666",
                      lineHeight: "1.5",
                      fontSize: "14px",
                    }}
                  >
                    {serviceData.ServiceDescription}
                  </p>
                </div>

                {/* Result Section */}
                <div
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                      color: "#4caf50",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>✅</span>
                    Result
                  </h3>
                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid #e0e0e0",
                      margin: "8px 0",
                    }}
                  />
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

                {/* Detail Section */}
                <div
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                      color: "#333",
                    }}
                  >
                    Detail
                  </h3>
                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid #e0e0e0",
                      margin: "8px 0",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      color: "#666",
                      lineHeight: "1.5",
                      fontSize: "14px",
                    }}
                  >
                    {serviceData.ServiceDetail}
                  </p>
                </div>
              </div>

              {/* Right Column - Image */}
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  height: "280px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e3f2fd",
                  overflow: "hidden",
                  padding: 0,
                }}
              >
                {getServiceImage(serviceName || serviceData?.ServiceName) ? (
                  <img
                    src={getServiceImage(serviceName || serviceData?.ServiceName)}
                    alt={serviceName || "Service"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "60px", opacity: "0.3" }}>🔧</div>
                    <h2 style={{ color: "#666", marginTop: "12px", fontSize: "18px" }}>Image</h2>
                    <p style={{ color: "#999", fontSize: "13px" }}>Service image placeholder</p>
                  </div>
                )}
              </div>
            </div>

            {/* Book Section */}
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
                    gap: "12px",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "18px" }}>Book This Service</h3>
                    <div
                      style={{
                        fontSize: "28px",
                        color: "#1976d2",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
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
                      fontWeight: "500",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
                    onClick={handleBookNow} // ✅ Added click handler
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "30px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
            <p style={{ fontSize: "16px", color: "#666" }}>Loading service details...</p>
          </div>
        )}
      </div>
    </div>
  );
}
