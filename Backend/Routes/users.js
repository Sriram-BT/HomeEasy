const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UsersData = require('../Models/usersData');
const auth = require('../Middleware/auth');

// =====================
// REGISTER USER
// =====================
router.post('/', async (req, res) => {
  const { Name, Age, Email, PhoneNumber, Password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UsersData.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Save new user
    const user = new UsersData({
      Name,
      Age,
      Email,
      PhoneNumber,
      Password: hashedPassword,
    });

    const data = await user.save();

    // Remove password from response
    const safeUser = data.toObject();
    delete safeUser.Password;

    res.json({ message: 'User registered successfully', user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// LOGIN USER
// =====================
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await UsersData.findOne({ Email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
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

// =====================
// GET ALL USERS (admin/testing)
// =====================
router.get('/', async (req, res) => {
  try {
    const users = await UsersData.find().select('-Password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// PROTECTED PROFILE ROUTE
// =====================
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await UsersData.findById(req.user.userId).select('-Password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
