import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../Api/axios";

export default function ServiceContents() {
  const location = useLocation();
  const { serviceId, serviceName } = location.state || {}; // <- get from navigate state
  const [serviceData, setServiceData] = useState(null);

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

  console.log("desc",serviceData)

  return (
    <div style={{ padding: "20px" }}>
      <h1>{serviceName || "Service Details"}</h1>
      {serviceData ? (
        <div>
          <p><b>Description:</b> {serviceData.ServiceDescription}</p>
          <p><b>Detail:</b> {serviceData.ServiceDetail}</p>
          <p><b>Result:</b> {serviceData.ServiceResult}</p>
          <p><b>Cost:</b> ₹{serviceData.ServiceCost}</p>
        </div>
      ) : (
        <p>Loading service details...</p>
      )}
    </div>
  );
}
