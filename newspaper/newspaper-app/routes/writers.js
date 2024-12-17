const express = require('express');
const Writer = require('../models/writer');
const bcrypt = require('bcrypt');
const { authenticateWriter } = require('../utils/auth');

const router = express.Router();

// Register writer
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const writer = new Writer({ name, email, password });
        await writer.save();
        res.status(201).send('Writer registered successfully.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login writer
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const writer = await Writer.findOne({ email });
        if (!writer || !(await bcrypt.compare(password, writer.password))) {
            return res.status(401).send('Invalid credentials');
        }
        res.status(200).json({ message: 'Login successful', writer });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

module.exports = router;
