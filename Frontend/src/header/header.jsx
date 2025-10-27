import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import WorkIcon from "@mui/icons-material/Work";
import Autocomplete from "@mui/material/Autocomplete";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import api from "../Api/axios";
import { Box, Typography, Avatar, Card, CardContent } from "@mui/material";
import { CartContext } from "../components/serviceContent/CartProvoider";

// ✅ Local assets
import AC_repair from "../Assets/AC_Repair.jpg";
import Deepclean from "../Assets/Deepclean.jpg";
import Plumbing from "../Assets/Plumbing.jpg";
import SofaCleaning from "../Assets/SofaCleaning.jpg";
import { useUser } from "../components/userContext/userContext";

export default function Header() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [address, setAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const searchBoxRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Access cart context
  const { cartItems } = useContext(CartContext);

  // ✅ Access user context
  const { user, logoutUser } = useUser();

  const serviceImages = {
    "AC Repair": AC_repair,
    "Deep Cleaning": Deepclean,
    Plumbing: Plumbing,
    "Sofa Cleaning": SofaCleaning,
  };

  async function GetServices() {
    try {
      const { data } = await api.get("/services/getServices");
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  }

  async function SearchServices(query) {
    if (!query.trim()) {
      GetServices();
      return;
    }
    try {
      const { data } = await api.get(`/services/search?query=${query}`);
      setServices(data);
    } catch (err) {
      console.error("Error searching services:", err);
    }
  }

  useEffect(() => {
    GetServices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      SearchServices(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAddressChange = (e) => setAddress(e.target.value);

  const handleServiceSelect = (event, newValue) => {
    setSelectedService(newValue);
    setHoveredService(null);
    if (newValue) {
      navigate("/Contents", {
        state: { serviceId: newValue._id, serviceName: newValue.ServiceName },
      });
    }
  };

  const handleHoverEnter = (option) => {
    if (searchBoxRef.current) {
      const rect = searchBoxRef.current.getBoundingClientRect();
      setPreviewPosition({
        top: rect.bottom + 10,
        left: rect.left,
      });
    }
    setHoveredService(option);
  };

  const handleHoverLeave = () => setHoveredService(null);

  return (
    <>
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
        {/* Left - Logo + Service Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexShrink: 0,
          }}
        >
          <Link
            to="/home"
            style={{
              textDecoration: "none",
              color: "#1e3c72",
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            Company
          </Link>

          <div ref={searchBoxRef}>
            <Autocomplete
              freeSolo
              options={services}
              getOptionLabel={(option) => option.ServiceName || ""}
              value={selectedService}
              onChange={handleServiceSelect}
              onInputChange={(e, newInput) => setSearchTerm(newInput)}
              onClose={() => setHoveredService(null)}
              sx={{
                width: 280,
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  fontSize: "0.85rem",
                  backgroundColor: "#fff",
                },
              }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  onMouseEnter={() => handleHoverEnter(option)}
                  onMouseLeave={handleHoverLeave}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#e3f2fd" },
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={serviceImages[option.ServiceName]}
                    alt={option.ServiceName}
                    sx={{ width: 48, height: 48, borderRadius: 2 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={600}>
                      {option.ServiceName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {option.ServiceDescription || "No description available"}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Search Service" size="small" />
              )}
            />
          </div>
        </div>

        {/* Right - Address + User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <TextField
            label="Search address"
            variant="outlined"
            size="small"
            value={address}
            onChange={handleAddressChange}
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root": {
                height: 36,
                fontSize: "0.85rem",
                backgroundColor: "#fff",
              },
            }}
          />

          {/* Cart */}
          <IconButton
            sx={{
              backgroundColor: "#f0f0f0",
              "&:hover": { backgroundColor: "#e0e0e0" },
              width: "40px",
              height: "40px",
            }}
            onClick={() => navigate("/cart")}
          >
            <Badge
              badgeContent={cartItems.length}
              color="error"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.7rem",
                  minWidth: "16px",
                  height: "16px",
                },
              }}
            >
              <WorkIcon />
            </Badge>
          </IconButton>

          {/* ✅ Conditional User Display */}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#1e3c72" }}
              >
                {user.name}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={logoutUser}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  color: "#1e3c72",
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Link
              to="/signin"
              style={{
                textDecoration: "none",
                color: "#1e3c72",
                fontSize: "0.9rem",
                fontWeight: "600",
                padding: "8px 24px",
                backgroundColor: "#f0f0f0",
                borderRadius: "6px",
                transition: "0.3s",
              }}
            >
              Log in
            </Link>
          )}
        </div>
      </nav>

      {/* Hover Preview */}
      {hoveredService && (
        <Card
          sx={{
            position: "fixed",
            top: `${previewPosition.top}px`,
            left: `${previewPosition.left + 300}px`,
            width: "320px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            zIndex: 6000,
          }}
        >
          <Box
            component="img"
            src={serviceImages[hoveredService.ServiceName]}
            alt={hoveredService.ServiceName}
            sx={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
            }}
          />
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {hoveredService.ServiceName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hoveredService.ServiceDescription || "No description available"}
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                backgroundColor: "#e3f2fd",
                border: "1px solid #90caf9",
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
                mt: 1.5,
              }}
            >
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ fontWeight: 600 }}
              >
                ₹ {hoveredService.ServiceCost || "No cost specified"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
}
