import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SideBox from "../components/sidebox";
import api from "../Api/axios";
import Footer from "../components/Footer/footer";
const images = require.context("../Assets", false, /\.(png|jpe?g|webp)$/);




export default function Home() {
  const [services, setServices] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  const cardWidth = 250;
  const gap = 16;
  const cardsToShow = 3;
  const scrollAmount = 2;

  const getServiceImage = (name) => {
    if (!name) return null;

    const formattedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

    console.log("Searching:", formattedName);   // <-- ADD THIS

    const pngPath = `./${formattedName}.png`;
    const jpgPath = `./${formattedName}.jpg`;

    try {
      return images(pngPath);
    } catch (error) {
      try {
        return images(jpgPath);
      } catch (err) {
        console.warn("Image not found:", formattedName);
        return null;
      }
    }
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
          marginTop: { xs: "40px", md: "60px" },
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
              width: "100%",            // expand fully
              maxWidth: "100%",         // allow full responsive size
              height: { xs: 250, sm: 180, md: 350 },
              gap: { xs: 0.75, sm: 1, md: 1.5 },
              mb: { xs: 2, md: 4 },
              borderRadius: { xs: 2, md: 3 },
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              position: "relative",
            }}
          >
            {services.slice(0, 4).map((service, i) => (
              <Box
                key={i}
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  "&:hover img": {
                    transform: "scale(1.1)",
                    filter: "brightness(1.1)",
                  },
                }}
              >

                <img src={getServiceImage(service.ServiceName)}
                  alt={`service collage ${i}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center", transition:
                      "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease",
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
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={{ xs: 2, md: 3 }}
          color="primary"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            textAlign: "left",
            width: "100%",        // forces full width so left align works
            pl: { xs: 1, md: 0 }, // optional small padding for mobile
          }}
        >
          Our Services
        </Typography>

        {/* === Mobile View (Vertical Scroll) === */}
        {/* === Mobile View (Vertical Scroll) === */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxHeight: "auto",
            overflowY: "auto",
            pb: 2,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0,0,0,0.2)",
              borderRadius: 4,
            },
          }}
        >
          {services.map((service) => (
            <Card
              key={service._id}
              onClick={() => handleCardClick(service)}
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* 🔼 Increased image height from 200 to 280 */}
                <Box sx={{ height: 280, overflow: "hidden" }}>
                  {getServiceImage(service.ServiceName) ? (
                    <img src={getServiceImage(service.ServiceName)}
                      alt={service.ServiceName}
                      style={{
                        width: "95%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.200",
                        color: "text.secondary",
                      }}
                    >
                      No Image
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {service.ServiceName}
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: 14,
                      lineHeight: 1.4,
                      maxHeight: 60,      // limits description height
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2, // limit to 3 lines
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {service.ServiceDescription}
                  </Typography>
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: "auto",      // <--- Push to bottom ALWAYS
                    }}
                  >
                    Learn more →
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* === Desktop View (Horizontal Carousel) === */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            position: "relative",
            width: "100%",
            maxWidth: "1200px",
            justifyContent: "flex-start",
          }}
        >
          {canScrollLeft && (
            <IconButton
              onClick={handleScrollLeft}
              sx={{
                position: "absolute",
                left: -20,
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
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 3,
                transition: "transform 0.5s ease-in-out",
                transform: `translateX(-${scrollPosition}px)`,
              }}
            >
              {services.map((service) => (
                <Card
                  key={service._id}
                  onClick={() => handleCardClick(service)}
                  sx={{
                    cursor: "pointer",
                    width: cardWidth,
                    minWidth: cardWidth,
                    height: 400,
                    flexShrink: 0,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(99,102,241,0.1)",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 0,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{
                      height: 200,
                      minHeight: 200,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}>
                      {getServiceImage(service.ServiceName) ? (
                        <img src={getServiceImage(service.ServiceName)}
                          alt={service.ServiceName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center", transition: "transform 0.4s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.200",
                            color: "text.secondary",
                          }}
                        >
                          No Image
                        </Box>
                      )}
                    </Box>

                    <Box sx={{
                      p: 2.5,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}>
                      <Typography variant="h6" fontWeight={700}>
                        {service.ServiceName}
                      </Typography>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: 14,
                          lineHeight: 1.4,
                          maxHeight: 60,      // limits description height
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2, // limit to 3 lines
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {service.ServiceDescription}
                      </Typography>
                      <Typography
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 1,
                        }}
                      >
                        Learn more →
                      </Typography>
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
                position: "absolute",
                right: -20,
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
      </Box>
      <div>
      <Footer />
        </div>
    </>
  );
}