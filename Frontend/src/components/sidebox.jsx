import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function SideBox() {
  return (
    <Paper
      sx={{
        width: "280px",
        padding: 2,
        position: "sticky",
        top: 20,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: 3,
        height: "320px",
        marginRight: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Section */}
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <HomeIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            HomeEase
          </Typography>
        </Box>

        <Typography
          variant="body2"
          paragraph
          sx={{ lineHeight: 1.5, opacity: 0.95, mb: 2, fontSize: "0.875rem" }}
        >
         Your trusted partner for premium household services. We connect you with verified professionals who deliver excellence.
        </Typography>

        <Box sx={{ mt: 1.5 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <VerifiedUserIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              Certified Professionals
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <SupportAgentIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              24/7 Customer Support
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <HomeIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              10,000+ Happy Homes
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          pt: 2,
          borderTop: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <Box display="flex" justifyContent="space-around" mb={1.5}>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
              500+
            </Typography>
            <Typography variant="caption" sx={{ fontSize: "0.65rem", opacity: 0.9 }}>
              Professionals
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
              4.8★
            </Typography>
            <Typography variant="caption" sx={{ fontSize: "0.65rem", opacity: 0.9 }}>
              Avg Rating
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
              98%
            </Typography>
            <Typography variant="caption" sx={{ fontSize: "0.65rem", opacity: 0.9 }}>
              Satisfaction
            </Typography>
          </Box>
        </Box>
        
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
            opacity: 0.9,
            textAlign: "center",
            lineHeight: 1.4,
            fontSize: "0.75rem",
          }}
        >
          "Making home management effortless, one service at a time."
        </Typography>
      </Box>
    </Paper>
  );
}