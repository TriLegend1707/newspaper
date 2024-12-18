const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Hoặc SMTP
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Hàm gửi email

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    // Đọc file HTML template
    const templatePath = path.join(__dirname, '../templates/otp-email-template.html');
    let emailHTML = fs.readFileSync(templatePath, 'utf-8');

    // Thay thế placeholder {{OTP_CODE}} bằng mã OTP
    emailHTML = emailHTML.replace('{{OTP_CODE}}', otpCode);

    const mailOptions = {
        from: 'no-reply@yourdomain.com',
        to,
        subject: 'Your OTP Code for Password Reset',
        html: emailHTML, // Nội dung email HTML
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

module.exports = sendEmail;
