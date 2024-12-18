const Writer = require('../models/writer');

const authenticateWriter = async (req, res, next) => {
    const email = req.header('email'); // Assume email is passed in header for simplicity
    try {
        const writer = await Writer.findOne({ email });
        if (!writer) {
            return res.status(401).send('Unauthorized: Invalid writer');
        }
        req.writer = writer;
        next();
    } catch (error) {
        res.status(500).send('Error authenticating writer');
    }
};

module.exports = { authenticateWriter };
const Editor = require('../models/editor');

const authenticateEditor = async (req, res, next) => {
    const email = req.header('email'); // Assume email is passed in the header for simplicity
    try {
        const editor = await Editor.findOne({ email });
        if (!editor) {
            return res.status(401).send('Unauthorized: Invalid editor');
        }
        req.editor = editor;
        next();
    } catch (error) {
        res.status(500).send('Error authenticating editor');
    }
};

module.exports = { authenticateEditor };
const authenticateAdmin = async (req, res, next) => {
    const isAdmin = req.header('admin'); // Simplified: Pass admin flag in header
    if (!isAdmin) {
        return res.status(401).send('Unauthorized: Admin access required');
    }
    next();
};

module.exports = { authenticateAdmin };
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login User
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        req.login(user, (err) => {
            if (err) return next(err);
            res.json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

// Logout User
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Failed to logout' });
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
const sendEmail = require('../utils/mailer');
const OTP = require('../models/OTP'); // Model OTP
const crypto = require('crypto');

// Request OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000); // 6 số OTP

        // Lưu OTP vào DB
        await OTP.create({
            email,
            code: otpCode,
            expiresAt: Date.now() + 3 * 60 * 60 * 1000 // Hết hạn sau 3 giờ
        });

        // Gửi Email
        await sendEmail(email, 'Password Reset OTP', `Your OTP code is: ${otpCode}`);

        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Verify OTP & Reset Password
router.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;

    try {
        const otp = await OTP.findOne({ email, code });
        if (!otp || otp.expiresAt < Date.now())
            return res.status(400).json({ error: 'Invalid or expired OTP' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
});
router.post('/update-profile', async (req, res) => {
    const { name, email, birthDate, penName } = req.body;

    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            birthDate,
            penName
        });

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Change Password
router.post('/change-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
});
