/* global google */
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
import { useUser } from "../components/userContext/userContext";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import { useLocation } from "react-router-dom";


export default function Header() {
  const { user, logoutUser, address, saveAddress } = useUser();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(() => {
    const savedService = localStorage.getItem("selectedService");
    return savedService ? JSON.parse(savedService) : null;
  });
  const [hoveredService, setHoveredService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addressTerm, setAddressTerm] = useState(address || "");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const searchBoxRef = useRef(null);
  const addressInputRef = useRef(null); // 🧭 ref for address autocomplete
  const navigate = useNavigate();
  const addressFieldRef = useRef(null);

  const location = useLocation();
  const { cartItems } = useContext(CartContext);


  const getServiceImage = (name) => {
    if (!name) return null;

    try {
      const formattedName = name.replace(/\s+/g, "_").toLowerCase(); // convert to lowercase + underscores

      try {
        return require(`../Assets/${formattedName}.png`);
      } catch (err) {
        return require(`../Assets/${formattedName}.jpg`);
      }

    } catch (error) {
      console.error("Image not found for:", name);
      return null;
    }
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
    if (!query || !query.trim()) {
      GetServices();
      return;
    }
    try {
      const { data } = await api.get(
        `/services/search?query=${encodeURIComponent(query)}`
      );
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

  // 🧭 Google Places Autocomplete Setup

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        if (!window.google?.maps || !addressFieldRef.current) return;

        const inputEl = addressFieldRef.current.querySelector("input");
        if (!inputEl) return;

        const { Autocomplete } = await google.maps.importLibrary("places");

        const autocomplete = new Autocomplete(inputEl, {
          fields: ["formatted_address", "geometry", "name"],
          componentRestrictions: { country: "in" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place?.formatted_address) {
            setAddressTerm(place.formatted_address);
            saveAddress(place.formatted_address);
          }
        });
      } catch (err) {
        console.error("Autocomplete init failed:", err);
      }
    };

    // retry until Google loads
    const interval = setInterval(() => {
      if (window.google?.maps && addressFieldRef.current) {
        initAutocomplete();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);



  const handleAddressSearch = (e) => {
    setAddressTerm(e.target.value);
  };

  const handleServiceSelect = (event, newValue) => {
    setSelectedService(newValue);
    if (newValue) {
      localStorage.setItem("selectedService", JSON.stringify(newValue));
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

  if (location.pathname === "/signin") {
    return null;
  }

  return (
    <>
      {/* ===================== DESKTOP HEADER ===================== */}
      <nav
        className="desktop-header"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "5px 20px",
          backgroundColor: "#a0bafd",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          position: "fixed",
          top: 0,
          left: "5px",     // margin from left
          right: "5px",    // margin from right
          zIndex: 5000,
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            className="left-block"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <Link
              to="/home"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#1e3c72",
                textDecoration: "none",
              }}
            >
              <HomeRepairServiceIcon sx={{ fontSize: 32, color: "#1e3c72" }} />
            </Link>

            <div ref={addressFieldRef} style={{ width: "250px", zIndex: 9999 }}>
              <TextField
                fullWidth
                placeholder="Search Address"
                size="small"
                value={addressTerm}
                onChange={(e) => setAddressTerm(e.target.value)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div style={{ marginLeft: '100px' }} ref={searchBoxRef}>
              <Autocomplete
                freeSolo
                options={[...new Map(
                  services
                    .filter(s =>
                      `${s.ServiceName} ${s.ServiceDescription || ""}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map(item => [item._id, item])
                ).values()]}
                getOptionLabel={(option) => option.ServiceName || ""}
                value={selectedService}
                onChange={handleServiceSelect}
                onInputChange={(e, newInput) => setSearchTerm(newInput)}
                onClose={() => setHoveredService(null)}
                sx={{
                  width: 350,
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
                      alignItems: "flex-start",
                      gap: 2,
                      p: 1.5,
                      borderRadius: 1,
                      "&:hover": { backgroundColor: "#e3f2fd" },
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={getServiceImage(option.ServiceName)}
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
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          lineHeight: 1.3,
                        }}
                      >
                        {option.ServiceDescription ||
                          "No description available"}
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <IconButton
              aria-label="cart"
              sx={{
                backgroundColor: "#1E73E8",  // Blue
                "&:hover": { backgroundColor: "#1E73E8" },
                width: "38px",
                height: "38px",
                color: "#fff",
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

            {user ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  marginRight: { xs: 0, md: "30px" },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#1e3c72" }}
                >
                  {user.name}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={logoutUser}
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    backgroundColor: "#1E73E8",   // Blue background
                    "&:hover": { backgroundColor: "#155BB8" }, // darker hover
                    color: "#fff",                 // white text
                    fontWeight: 600,
                    marginLeft: '10px'
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
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  padding: "6px 16px",
                  backgroundColor: "#1E73E8",         // Blue background
                  borderRadius: "6px",
                  transition: "0.3s",
                }}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ===================== MOBILE HEADER ===================== */}

      <nav
        className="mobile-header"
        style={{
          display: "none",
          flexDirection: "column",
          backgroundColor: "#6A4EF2",
          padding: "10px 8px",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "8px",
            width: "100%",
          }}
        >
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              color: "#fff",
              p: 0,
              width: 32,
              height: 32,
              flexShrink: 0,
            }}
          >
            <HomeRepairServiceIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <Box
            sx={{
              flex: "0 0 auto",
              width: "120px",
              "@media (max-width: 768px)": { width: "140px" },
            }}
          >
            <TextField
              fullWidth
              placeholder="Enter address"
              size="small"
              value={addressTerm}
              onChange={handleAddressSearch}
              InputProps={{
                sx: {
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  height: "34px",
                  px: "8px",
                },
              }}
            />
          </Box>

          <div style={{ flexGrow: 1 }} />

          {/* 🛒 Cart Button */}
          <IconButton
            sx={{
              backgroundColor: "#fff",
              width: "32px",
              height: "32px",
              flexShrink: 0,
            }}
            onClick={() => navigate("/cart")}
          >
            <Badge badgeContent={cartItems.length} color="error">
              <WorkIcon sx={{ color: "#6A4EF2", fontSize: 18 }} />
            </Badge>
          </IconButton>

          {/* 👤 User Avatar + Dropdown */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#fff",
                color: "#6A4EF2",
                fontWeight: "bold",
                flexShrink: 0,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
              onClick={() => setShowUserMenu((prev) => !prev)}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </Avatar>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Transparent backdrop to close on outside click */}
                <Box
                  onClick={() => setShowUserMenu(false)}
                  sx={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "transparent",
                    zIndex: 9998,
                  }}
                />
                <Box
                  sx={{
                    position: "fixed", // 🧩 changed from absolute
                    top: "55px",
                    right: "10px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                    width: "220px",
                    p: 1.5,
                    zIndex: 9999,
                  }}
                >
                  {user ? (
                    <>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="#6A4EF2"
                        sx={{ mb: 0.5 }}
                      >
                        {user.name}
                      </Typography>
                      {user.email && (
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      )}
                      {user.phone && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {user.phone}
                        </Typography>
                      )}
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setShowUserMenu(false);
                          logoutUser();
                        }}
                        sx={{
                          textTransform: "none",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          backgroundColor: "#1E73E8",   // BLUE
                          "&:hover": { backgroundColor: "#155BB8" }, // darker hover
                          color: "#fff",                 // white text
                          fontWeight: 600,
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/signin");
                      }}
                      sx={{
                        backgroundColor: "#1E73E8",   // BLUE
                        "&:hover": { backgroundColor: "#155BB8" }, // darker hover
                        color: "#fff",                 // white text
                        textTransform: "none",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      Login
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Box>
        </div>

        {/* 🔍 Service Search */}
        <Box sx={{ mt: 1.2, width: "100%", pr: 0 }}>
          <Autocomplete
            freeSolo
            options={[...new Map(
              services
                .filter(s =>
                  `${s.ServiceName} ${s.ServiceDescription || ""}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map(item => [item._id, item])
            ).values()]}
            getOptionLabel={(option) => option.ServiceName || ""}
            value={selectedService}
            onChange={handleServiceSelect}
            onInputChange={(e, newInput) => setSearchTerm(newInput)}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                height: 38,
                backgroundColor: "#fff",
                borderRadius: "8px",
                fontSize: "0.85rem",
              },
            }}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 1.5,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Avatar
                  variant="rounded"
                  src={getServiceImage(option.ServiceName)}
                  alt={option.ServiceName}
                  sx={{ width: 44, height: 44, borderRadius: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600}>{option.ServiceName}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                    {option.ServiceDescription || "No description available"}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for services" />
            )}
          />
        </Box>
      </nav>


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
            src={getServiceImage(hoveredService.ServiceName)}
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

      <style>{`
        @media (max-width: 700px) {
          .desktop-header { display: none !important; }
          .mobile-header { display: flex !important; }
        }
      `}</style>
      <style>{`
  .pac-container {
    z-index: 999999 !important;
  }
`}</style>
    </>
  );
}