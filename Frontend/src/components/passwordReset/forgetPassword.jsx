
import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper, Alert, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../Api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
const res = await api.post("/usersData/forgot-password", { Email: email });
      setMessage(res.data.message);
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h5" mb={2}>Forgot Password</Typography>
        <Typography variant="body2" mb={3}>
          Enter your registered email to receive an OTP.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
            Send OTP
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
