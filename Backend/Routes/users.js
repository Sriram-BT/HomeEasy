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
      return res.status(400).json({ message: "Email already registered" });
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

    res.json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================
// LOGIN USER
// ======================
router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await UsersData.findOne({ Email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
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
    res.status(500).json({ message: err.message });
  }
});

// ======================
// FORGOT PASSWORD - Send OTP
// ======================
router.post("/forgot-password", async (req, res) => {
  const { Email } = req.body;

  try {
    const user = await UsersData.findOne({ Email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 1000 * 60 * 5; // 5 minutes expiry
    await user.save();

    // ✅ Create a secure Gmail transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
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
          <p>If you didn’t request this, please ignore this email.</p>
        `,
      });

      console.log(`✅ OTP email sent successfully to ${Email}`);
    } catch (emailErr) {
      console.error(`❌ Failed to send OTP email: ${emailErr.message}`);
      return res
        .status(500)
        .json({ message: "Email sending failed. Please check your credentials." });
    }

    // ✅ Optional: send via Twilio SMS
    if (user.PhoneNumber && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your password reset OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.PhoneNumber,
        });
        console.log(`✅ OTP SMS sent to ${user.PhoneNumber}`);
      } catch (smsErr) {
        console.log("⚠️ Twilio SMS failed:", smsErr.message);
      }
    }

    res.json({ message: "OTP sent to your email (and SMS if available)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// ======================
// RESET PASSWORD USING OTP
// ======================
router.post("/reset-password", async (req, res) => {
  const { Email, otp, newPassword } = req.body;

  try {
    const user = await UsersData.findOne({
      Email,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.Password = hashed;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    console.log(`✅ Password reset successful for ${Email}`);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Error resetting password:", err.message);
    res.status(500).json({ message: "Error resetting password" });
  }
});

// ======================
// GET ALL USERS
// ======================
router.get("/", async (req, res) => {
  try {
    const users = await UsersData.find().select("-Password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================
// PROTECTED PROFILE ROUTE
// ======================
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await UsersData.findById(req.user.userId).select("-Password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
