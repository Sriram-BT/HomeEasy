require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost/e_commerse", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const con = mongoose.connection;
con.on("open", () => console.log("MongoDB connection established ✅"));

// ✅ Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// 📩 Send message route with user info
app.post("/send-message", async (req, res) => {
  const { userName, userPhone, services, total } = req.body;

  try {
    const messageBody = `📦 New Booking!\nUser: ${userName}\nPhone: ${userPhone}\nServices: ${services.join(
      ", "
    )}\nTotal: ₹${total}`;

    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ADMIN_PHONE_NUMBER,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ User routes
const postUserData = require("./Routes/users");
app.use("/usersData", postUserData);

// ✅ Services routes
const showServices = require("./Routes/service");
app.use("/services", showServices);

// ✅ Start server
app.listen(9000, () => console.log("Listening on port 9000 🚀"));
