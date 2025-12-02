import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#0B2447",
        color: "white",
        mt: 6,
        pt: 5,
        pb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 4,
          px: { xs: 2, md: 8 },
        }}
      >
        {/* Company Overview */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            HOME EASY
          </Typography>
          <Typography sx={{ opacity: 0.8, maxWidth: 360 }}>
            Making home management effortless with reliable and skilled service
            professionals available at your doorstep.
          </Typography>
        </Box>

        {/* Contact Information */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Contact Information
          </Typography>

          <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1 }} /> Madurai, TamilNadu, India
          </Typography>

          <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneIcon sx={{ mr: 1 }} /> +91 9942404356
          </Typography>

          {/* <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <EmailIcon sx={{ mr: 1 }} /> support@homeeasy.com
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <IconButton sx={{ color: "white" }}><FacebookIcon /></IconButton>
            <IconButton sx={{ color: "white" }}><InstagramIcon /></IconButton>
            <IconButton sx={{ color: "white" }}><TwitterIcon /></IconButton>
          </Box> */}
        </Box>
      </Box>

      {/* Bottom strip */}
      <Box
        sx={{
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          mt: 3,
          pt: 2,
          opacity: 0.7,
        }}
      >
        <Typography fontSize={14}>
          © {new Date().getFullYear()} Home Easy — All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
