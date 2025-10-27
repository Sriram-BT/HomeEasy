import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    Container,
    InputAdornment,
    IconButton,
    Fade,
    Divider,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    LockOutlined,
    PersonOutline,
} from "@mui/icons-material";
import api from "../Api/axios";
import { useUser } from "../components/userContext/userContext";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useUser(); // ✅ Get loginUser from context

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    // ✅ Call backend login API
    async function handleLogin(e) {
        e.preventDefault();
        setLoginError("");


        try {
            const res = await api.post("/usersData/login", {
                Email: email,
                Password: password,
            });

            // ✅ Login success
            const { token, user } = res.data;

            // Save to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // ✅ Update context with user details
   loginUser({
  name: user.name || "Unknown",
  phoneNumber: user.phoneNumber || "N/A",
  email: user.email || email,
});

        console.log("mobile",user.phoneNumber)


            console.log("✅ Login success:", user);
            navigate("/home");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404)
                setLoginError("User not found. Please check your email.");
            else if (err.response?.status === 401)
                setLoginError("Incorrect password. Please try again.");
            else setLoginError("Login failed. Please try again later.");
        }
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Fade in timeout={800}>
                    <Paper
                        elevation={8}
                        sx={{
                            p: 4,
                            width: "100%",
                            maxWidth: 400,
                            borderRadius: 3,
                            background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
                        }}
                    >
                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    p: 2,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    mb: 2,
                                }}
                            >
                                <LockOutlined sx={{ fontSize: 40, color: "white" }} />
                            </Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                fontWeight="bold"
                                color="primary"
                                gutterBottom
                            >
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sign in to continue to your account
                            </Typography>
                        </Box>

                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutline color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 1 }}
                            />

                            {loginError && (
                                <Fade in>
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {loginError}
                                    </Alert>
                                </Fade>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 2,
                                    mb: 2,
                                    py: 1.5,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    "&:hover": { boxShadow: 6 },
                                }}
                            >
                                Sign In
                            </Button>

                            <Divider sx={{ my: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    OR
                                </Typography>
                            </Divider>

                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Don’t have an account?
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/create"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 2,
                                        py: 1,
                                    }}
                                >
                                    Create New Account
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Fade>
            </Box>
        </Container>
    );
}
