const sendEmail = require('../utils/mailer');
const OTP = require('../models/OTP'); // Model OTP

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000); // Mã OTP gồm 6 số

        // Lưu OTP vào DB
        await OTP.create({
            email,
            code: otpCode,
            expiresAt: Date.now() + 3 * 60 * 60 * 1000, // Hết hạn sau 3 giờ
        });

        // Gửi Email OTP
        await sendEmail(email, otpCode);

        res.json({ message: 'OTP has been sent to your email' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});
