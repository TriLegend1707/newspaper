const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Hàm gửi email (ví dụ gửi OTP)
const sendEmail = async (to, subject, text, otpCode = null) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Hoặc SMTP
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    let mailOptions;

    if (otpCode) {
        // Đọc file HTML template nếu có OTP
        const templatePath = path.join(__dirname, '../templates/otp-email-template.html');
        let emailHTML = fs.readFileSync(templatePath, 'utf-8');

        // Thay thế placeholder {{OTP_CODE}} bằng mã OTP
        emailHTML = emailHTML.replace('{{OTP_CODE}}', otpCode);

        mailOptions = {
            from: 'no-reply@yourdomain.com',
            to,
            subject: 'Your OTP Code for Password Reset',
            html: emailHTML, // Nội dung email HTML
        };
    } else {
        // Gửi email thông thường nếu không có OTP
        mailOptions = {
            from: 'your-email@gmail.com',
            to,
            subject,
            text
        };
    }

    // Gửi email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
