const express = require('express');
const Subscriber = require('../models/subscriber');
const bcrypt = require('bcrypt');
const { authenticateSubscriber } = require('../utils/auth');

const router = express.Router();

// Register a subscriber
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 7); // Subscription expires in 7 minutes for testing
        const subscriber = new Subscriber({ email, password, subscriptionExpiry: expiryDate });
        await subscriber.save();
        res.status(201).send('Subscriber registered successfully.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login a subscriber
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const subscriber = await Subscriber.findOne({ email });
        if (!subscriber || !(await bcrypt.compare(password, subscriber.password))) {
            return res.status(401).send('Invalid credentials');
        }

        res.status(200).json({ message: 'Login successful', subscriber });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// Extend subscription
router.post('/extend', authenticateSubscriber, async (req, res) => {
    const { days } = req.body;
    try {
        req.subscriber.extendSubscription(days);
        await req.subscriber.save();
        res.status(200).send('Subscription extended successfully.');
    } catch (error) {
        res.status(500).send('Error extending subscription');
    }
});

module.exports = router;
