const mongoose = require('mongoose');

const UsersDataSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Age: { type: Number, required: true },
    Email: { type: String, required: true },
    PhoneNumber: { type: Number, required: true },
    Password: { type: String, required: true }
});

module.exports = mongoose.model("UsersData", UsersDataSchema);
