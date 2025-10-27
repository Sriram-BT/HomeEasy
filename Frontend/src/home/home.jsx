import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SideBox from "../components/sidebox";
import api from "../Api/axios";

import AC_repair from "../Assets/AC_Repair.jpg";
import Deepclean from "../Assets/Deepclean.jpg";
import Plumbing from "../Assets/Plumbing.jpg";
import SofaCleaning from "../Assets/SofaCleaning.jpg";

export default function Home() {
  const [services, setServices] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  const cardWidth = 250;
  const gap = 16;
  const cardsToShow = 3;
  const scrollAmount = 2;

  const collageImages = [AC_repair, Deepclean, Plumbing, SofaCleaning];

  const serviceImages = {
    "AC Repair": AC_repair,
    "Deep Cleaning": Deepclean,
    Plumbing: Plumbing,
    "Sofa Cleaning": SofaCleaning,
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services/getServices");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleCardClick = (service) => {
    navigate("/Contents", {
      state: { serviceId: service._id, serviceName: service.ServiceName },
    });
  };

  const handleScrollRight = () => {
    const maxScroll = (services.length - cardsToShow) * (cardWidth + gap);
    const newPosition = Math.min(
      scrollPosition + scrollAmount * (cardWidth + gap),
      maxScroll
    );
    setScrollPosition(newPosition);
  };

  const handleScrollLeft = () => {
    const newPosition = Math.max(
      scrollPosition - scrollAmount * (cardWidth + gap),
      0
    );
    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight =
    scrollPosition < (services.length - cardsToShow) * (cardWidth + gap);

  return (
    <>
      {/* === SideBox + Collage Section === */}
<Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          p: { xs: 1, sm: 2, md: 2 },
          gap: { xs: 2, md: 3 },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* SideBox */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            flexShrink: 0,
            width: 280,
            height: { xs: 180, md: 350 },
          }}
        >
          <SideBox />
        </Box>

        {/* Collage Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: { xs: "100%", md: "auto" },
            maxWidth: { xs: "100%", md: `calc(100% - 300px)` },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              width: "100%",
              maxWidth: {
                xs: "100%",
                sm: 500,
                md: cardWidth * cardsToShow + gap * (cardsToShow - 1),
              },
              height: { xs: 150, sm: 180, md: 350 },
              gap: { xs: 0.75, sm: 1, md: 1.5 },
              mb: { xs: 2, md: 4 },
              borderRadius: { xs: 2, md: 3 },
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              },
            }}
          >
            {collageImages.map((img, i) => (
              <Box
                key={i}
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                  },
                  "&:hover": {
                    "& img": {
                      transform: "scale(1.1)",
                      filter: "brightness(1.1)",
                    },
                    "&::after": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <img
                  src={img}
                  alt={`service collage ${i}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* === Our Services Section === */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={{ xs: 2, md: 3 }}
          color="primary"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            alignSelf: "flex-start",
          }}
        >
          Our Services
        </Typography>

        {/* Cards Carousel */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "1200px",
            px: { xs: 1, md: 0 },
            ml: 0,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {canScrollLeft && (
            <IconButton
              onClick={handleScrollLeft}
              sx={{
                display: { xs: "none", md: "flex" },
                position: "absolute",
                left: { md: -50 },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}

<Box
  sx={{
    display: "flex",
    gap: 3,
    overflow: { xs: "auto", md: "hidden" },
    width: "100%",
    justifyContent: "flex-start",
    scrollSnapType: { xs: "x mandatory", md: "none" },
    WebkitOverflowScrolling: "touch",
    "&::-webkit-scrollbar": { 
      height: { xs: 8, md: 0 },
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(0,0,0,0.05)",
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0,0,0,0.2)",
      borderRadius: 4,
      "&:hover": {
        background: "rgba(0,0,0,0.3)",
      },
    },
    pb: { xs: 2, md: 0 },
  }}
>
  <Box
    sx={{
      display: "flex",
      gap: 3,
      transition: { xs: "none", md: "transform 0.5s ease-in-out" },
      transform: { xs: "none", md: `translateX(-${scrollPosition}px)` },
    }}
  >
    {services.map((service) => (
      <Card
        key={service._id}
        onClick={() => handleCardClick(service)}
        sx={{
          cursor: "pointer",
          width: { xs: 240, sm: 260, md: cardWidth },
          minWidth: { xs: 240, sm: 260, md: cardWidth },
          height: { xs: 280, sm: 300, md: 380 },
          flexShrink: 0,
          scrollSnapAlign: { xs: "center", md: "none" },
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          border: "1px solid",
          borderColor: "divider",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
            opacity: 0,
            transition: "opacity 0.4s ease",
            zIndex: 1,
          },
          "&:hover": {
            transform: "translateY(-12px) scale(1.02)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(99, 102, 241, 0.1)",
            borderColor: "primary.main",
            "&::before": {
              opacity: 1,
            },
          },
        }}
      >
        <CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Image Container */}
          <Box
            sx={{
              height: { xs: 120, md: 220 },
              width: "100%",
              overflow: "hidden",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
                opacity: 0,
                transition: "opacity 0.4s ease",
              },
              "&:hover::after": {
                opacity: 1,
              },
            }}
          >
            {serviceImages[service.ServiceName] ? (
              <img
                src={serviceImages[service.ServiceName]}
                alt={service.ServiceName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                No Image
              </Box>
            )}
          </Box>

          {/* Content Container */}
          <Box 
            sx={{ 
              p: { xs: 2, md: 2.5 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Service Name */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 15, md: 18 },
                color: "text.primary",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 0.5,
                letterSpacing: "-0.01em",
              }}
            >
              {service.ServiceName}
            </Typography>

            {/* Service Description */}
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: 13, md: 14 },
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {service.ServiceDescription}
            </Typography>

            {/* Action Indicator */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "primary.main",
                fontSize: 13,
                fontWeight: 600,
                mt: 1,
                opacity: 0.8,
                transition: "all 0.3s ease",
                "& svg": {
                  transition: "transform 0.3s ease",
                },
                "&:hover": {
                  opacity: 1,
                  "& svg": {
                    transform: "translateX(4px)",
                  },
                },
              }}
            >
              Learn more
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
          </Box>

          {canScrollRight && (
            <IconButton
              onClick={handleScrollRight}
              sx={{
                display: { xs: "none", md: "flex" },
                position: "absolute",
                right: { md: -50 },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>

        <Typography
          sx={{
            display: { xs: "block", md: "none" },
            mt: 2,
            fontSize: "0.75rem",
            color: "text.secondary",
            fontStyle: "italic",
          }}
        >
          Swipe to see more services →
        </Typography>
      </Box>
    </>
  );
}