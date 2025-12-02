// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { google } = require("googleapis");
const path = require("path");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

/* ======================================================
🔹 1. Connect to MongoDB
====================================================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connection established"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ======================================================
🔹 2. Initialize Twilio Client
====================================================== */
const client = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

/* ======================================================
🔹 3. Initialize Google Sheets API
====================================================== */
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, process.env.GOOGLE_CREDENTIALS_PATH),
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

/* ======================================================
🔹 4. Log All Incoming Requests
====================================================== */
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

/* ======================================================
🔹 5. Test Endpoint
====================================================== */
app.post("/test", (req, res) => {
  console.log("Body:", req.body);
  res.json({ success: true, message: "Test successful", received: req.body });
});

/* ======================================================
🔹 6. Booking Route
====================================================== */
app.post("/send-message", async (req, res) => {
  console.log("----------------------------------------");
  console.log("📥 RECEIVED BOOKING REQUEST");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("----------------------------------------");

  const { userName, userPhone, address, services, total } = req.body;

  if (!userName || !userPhone || !services || !total) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  let formattedUserPhone = String(userPhone).trim();
  if (!formattedUserPhone.startsWith("+")) {
    formattedUserPhone = formattedUserPhone.replace(/^0+/, "");
    formattedUserPhone = "+91" + formattedUserPhone;
  }

  try {
    /* ================= SMS to Admin ================== */
    const messageBody = `📦 New Booking!
User: ${userName}
Phone: ${userPhone}
Address: ${address || "Not provided"}
Services:
${services.map((s) => `- ${s.name} (₹${s.cost})`).join("\n")}
Total: ₹${total}`;

    try {
      await client.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.ADMIN_PHONE_NUMBER,
      });
      console.log("📩 SMS sent to admin");
    } catch (err) {
      console.error("❌ Admin SMS failed:", err.message);
    }

    /* ================= Confirmation SMS to User ================= */
    const userMessageBody = `✅ Booking Confirmed!
Hi ${userName},
Thank you for your booking!

Services booked:
${services.map((s) => `- ${s.name} (₹${s.cost})`).join("\n")}

Total: ₹${total}
Delivery Address: ${address || "N/A"}
We'll contact you shortly.

Thank you! 🙏`;

    try {
      await client.messages.create({
        body: userMessageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedUserPhone,
      });
      console.log("📩 SMS sent to user");
    } catch (err) {
      console.error("❌ User SMS failed:", err.message);
    }

    /* ================= Add to Google Sheet ================= */
    try {
      const googleClient = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: googleClient });

      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

      const now = new Date();
      const bookingDate = now.toLocaleDateString("en-IN");
      const bookingTime = now.toLocaleTimeString("en-IN");

      const bookingRows = services.map((service) => [
        userName,
        address || "N/A",
        formattedUserPhone,
        service.name,
        service.cost,
        "Pending",
        "System",
        bookingDate,
        bookingTime,
      ]);

      console.log("📤 Sending rows to Google Sheets:", bookingRows);

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Bookings!A:I",
        valueInputOption: "RAW",
        resource: { values: bookingRows },
      });

      console.log("✅ Added to Google Sheet successfully!");
    } catch (sheetError) {
      console.error("❌ Google Sheet Update Error:", sheetError);
    }

    res.json({
      success: true,
      message: "Booking confirmed & saved",
    });
  } catch (error) {
    console.error("❌ Booking Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ======================================================
🔹 7. Import Routes
====================================================== */
const postUserData = require("./Routes/users");
app.use("/usersData", postUserData);

const showServices = require("./Routes/service");
app.use("/services", showServices);

/* ======================================================
🔹 8. Start Server
====================================================== */
const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
