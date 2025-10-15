import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import WorkIcon from "@mui/icons-material/Work";
import Autocomplete from "@mui/material/Autocomplete";
import api from "../Api/axios";

export default function Header() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [address, setAddress] = useState("");
  let debounceTimer;

 const navigate = useNavigate();

  // ✅ Fetch all services (full objects, not just names)
  async function GetServices() {
    try {
      const { data } = await api.get("/services/getServices");
      setServices(data); // keep full service object
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  }

  useEffect(() => {
    GetServices();
  }, []);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // optional address suggestion API
    }, 400);
  };

  const handleServiceSelect = (event, newValue) => {
    setSelectedService(newValue);
    if (newValue) {
      console.log("Selected Service:", newValue.ServiceName);
      console.log("Selected ID:", newValue._id);
      // 👉 You can now call API, navigate, or store this info
    }
          navigate("/Contents", {
        state: { serviceId: newValue._id, serviceName: newValue.ServiceName },
      });
  };



  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        backgroundColor: "#a0bafdff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flexWrap: "wrap",
        gap: "24px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5000,
      }}
    >
      {/* Left - Logo + Address field */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexShrink: 0,
        }}
      >
        <Link
          style={{
            textDecoration: "none",
            color: "#1e3c72",
            fontSize: "1.5rem",
            fontWeight: "700",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
          }}
          to="/home"
        >
          Company
        </Link>

        <TextField
          label="Search address"
          variant="outlined"
          size="small"
          value={address}
          onChange={handleAddressChange}
          style={{ marginLeft: "50px" }}
          sx={{
            width: "300px",
            "& .MuiOutlinedInput-root": {
              height: 36,
              fontSize: "0.85rem",
              backgroundColor: "#fff",
            },
            "& .MuiInputBase-input": { padding: "4px 8px" },
            "& .MuiInputLabel-root": { fontSize: "0.8rem" },
          }}
        />
      </div>

      {/* Right - Service search + WorkIcon + Login */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        {/* ✅ Service Auto Suggest */}
        <Autocomplete
          freeSolo
          options={services}
          getOptionLabel={(option) => option.ServiceName || ""}
          value={selectedService}
          onChange={handleServiceSelect}
          sx={{
            width: "220px",
            "& .MuiOutlinedInput-root": {
              height: 36,
              fontSize: "0.85rem",
              backgroundColor: "#fff",
            },
            "& .MuiInputBase-input": { padding: "4px 8px" },
            "& .MuiInputLabel-root": { fontSize: "0.8rem" },
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search Service" size="small" variant="outlined" />
          )}
        />

        <IconButton
          sx={{
            backgroundColor: "#f0f0f0",
            "&:hover": { backgroundColor: "#e0e0e0" },
            width: "40px",
            height: "40px",
          }}
        >
          <WorkIcon />
        </IconButton>

        <Link
          style={{
            textDecoration: "none",
            color: "#1e3c72",
            fontSize: "0.9rem",
            fontWeight: "600",
            padding: "8px 24px",
            backgroundColor: "#f0f0f0",
            borderRadius: "6px",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
          }}
          to="/signin"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#e0e0e0";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f0f0f0";
          }}
        >
          Log in
        </Link>
      </div>
    </nav>
  );
}
