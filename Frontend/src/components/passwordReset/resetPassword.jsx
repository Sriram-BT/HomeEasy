import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Alert, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../Api/axios";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/usersData/reset-password", {
        Email: email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000); // redirect to login
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h5" mb={2}>Reset Password</Typography>
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
          <TextField
            fullWidth
            label="OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
          />
          {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
            Reset Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
