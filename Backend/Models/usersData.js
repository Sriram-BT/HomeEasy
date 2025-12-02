const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: String,
  Age: Number,
  Email: { type: String, required: true, unique: true },
  PhoneNumber: String,
  Password: String,
  otp: String,
  otpExpiry: Date,
});

module.exports = mongoose.model("UsersData", userSchema);
