const express = require('express');
const router = express.Router();
const UsersData = require('../Models/usersData');

// POST /usersData
router.post('/', async (req, res) => {
    const user = new UsersData({
        Name: req.body.Name,
        Age: req.body.Age,
        Email: req.body.Email,
        PhoneNumber: req.body.PhoneNumber,
        Password: req.body.Password
    });

    try {
        const data = await user.save(); 
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /usersData
router.get('/', async (req, res) => {
    try {
        const data = await UsersData.find(); // use correct variable
        res.json(data);
    } catch (err) {
        console.error("err", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
