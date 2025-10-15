import React, { useEffect, useState } from "react";
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

// Example static images for collage (top 4)
import AC_repair from "../Assets/AC_Repair.jpg";
import Deepclean from "../Assets/Deepclean.jpg";
import Plumbing from "../Assets/Plumbing.jpg";
import SofaCleaning from "../Assets/SofaCleaning.jpg";

export default function Home() {
  const [services, setServices] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  console.log("home",services)

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
                md: (cardWidth * cardsToShow) + (gap * (cardsToShow - 1)),
              },
              height: { xs: 150, sm: 180, md: 350 },
              gap: 1,
              mb: { xs: 2, md: 4 },
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            {collageImages.map((img, i) => (
              <Box
                key={i}
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <img
                  src={img}
                  alt={`service collage ${i}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
          alignItems: "flex-start", // align text and cards to left
          width: "100%",
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Section Title */}
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
            justifyContent: "flex-start", // ensure cards align from left
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
              gap: 2,
              overflow: { xs: "auto", md: "hidden" },
              width: "100%",
              justifyContent: "flex-start", // left-aligned cards
              scrollSnapType: { xs: "x mandatory", md: "none" },
              WebkitOverflowScrolling: "touch",
              "&::-webkit-scrollbar": { height: { xs: 6, md: 0 } },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                transition: { xs: "none", md: "transform 0.5s ease-in-out" },
                transform: { xs: "none", md: `translateX(-${scrollPosition}px)` },
              }}
            >
              {services.map((service) => (
                <Card
                  key={service.id}
                  sx={{
                    width: { xs: 220, sm: 240, md: cardWidth },
                    minWidth: { xs: 220, sm: 240, md: cardWidth },
                    height: { xs: 230, sm: 240, md: 350 },
                    flexShrink: 0,
                    scrollSnapAlign: { xs: "center", md: "none" },
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        height: { xs: 90, md: 200 },
                        width: "100%",
                        overflow: "hidden",
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
                            backgroundColor: "#e0e0e0",
                            color: "#555",
                            fontSize: 12,
                          }}
                        >
                          No Image
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ p: { xs: 1.5, md: 2 } }}>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: 13, md: 14 },
                          mt: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {service.ServiceDescription}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", pb: 2 }} />
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

        {/* Mobile swipe hint */}
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
