// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UsersData = require("../Models/usersData");
const auth = require("../Middleware/auth");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// ======================
// TWILIO SETUP (optional SMS support)
// ======================
const twilioClient = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

// ======================
// REGISTER USER
// ======================
router.post("/", async (req, res) => {
  const { Name, Age, Email, PhoneNumber, Password } = req.body;

  try {
    const existingUser = await UsersData.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = new UsersData({
      Name,
      Age,
      Email,
      PhoneNumber,
      Password: hashedPassword,
    });

    const data = await user.save();
    const safeUser = data.toObject();
    delete safeUser.Password;

    res.status(201).json({ success: true, message: "User registered successfully", user: safeUser });
  } catch (err) {
    console.error("🔥 Register error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// LOGIN USER
// ======================
router.post("/login", async (req, res) => {
  console.log("📩 LOGIN REQUEST BODY:", req.body);

  const { Email, Password } = req.body;

  try {
    const user = await UsersData.findOne({ Email });
    console.log("🔍 FOUND USER:", user);

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("🔐 CHECKING PASSWORD...");
    const isMatch = await bcrypt.compare(Password, user.Password);
    console.log("🔓 PASSWORD MATCH RESULT:", isMatch);

    if (!isMatch) {
      console.log("❌ INVALID PASSWORD");
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT SECRET MISSING");
      return res.status(500).json({ success: false, message: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("🎉 LOGIN SUCCESS, TOKEN CREATED!");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.Name,
        email: user.Email,
        phoneNumber: user.PhoneNumber,
      },
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// FORGOT PASSWORD - Send OTP
// ======================
router.post("/forgot-password", async (req, res) => {
  const { Email } = req.body;

  try {
    const user = await UsersData.findOne({ Email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 1000 * 60 * 5;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Support Team" <${process.env.EMAIL_USER}>`,
        to: Email,
        subject: "Password Reset OTP",
        html: `
          <h2>Password Reset Request</h2>
          <p>Your OTP for password reset is <b>${otp}</b>.</p>
          <p>This OTP expires in <b>5 minutes</b>.</p>
        `,
      });

      console.log(`📧 OTP email sent to ${Email}`);
    } catch (emailErr) {
      console.error(`❌ Email send failed: ${emailErr.message}`);
      return res.status(500).json({ success: false, message: "Email sending failed" });
    }

    if (user.PhoneNumber && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your password reset OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.PhoneNumber,
        });
        console.log(`📩 OTP SMS sent to ${user.PhoneNumber}`);
      } catch (smsErr) {
        console.log("⚠️ SMS failed:", smsErr.message);
      }
    }

    res.json({ success: true, message: "OTP sent to email (and SMS if available)" });
  } catch (err) {
    console.error("🔥 OTP SEND ERROR:", err);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// ======================
// RESET PASSWORD
// ======================
router.post("/reset-password", async (req, res) => {
  const { Email, otp, newPassword } = req.body;

  try {
    const user = await UsersData.findOne({
      Email,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.Password = hashed;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    console.log(`🔐 Password reset successful for ${Email}`);

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("🔥 RESET PASSWORD ERROR:", err);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
});

// ======================
// GET ALL USERS
// ======================
router.get("/", async (req, res) => {
  try {
    const users = await UsersData.find().select("-Password");
    res.json({ success: true, users });
  } catch (err) {
    console.error("🔥 GET USERS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// PROTECTED PROFILE ROUTE
// ======================
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await UsersData.findById(req.user.userId).select("-Password");
    res.json({ success: true, user });
  } catch (err) {
    console.error("🔥 PROFILE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
