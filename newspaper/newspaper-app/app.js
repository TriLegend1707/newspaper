const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport'); // require the object, not function
passportConfig(passport); // now use it directly


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// Route chính (trang chủ)
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Route đăng nhập
app.post('/login', (req, res) => {
  // Xử lý đăng nhập với Passport
  passport.authenticate('local', (err, user, info) => {
    if (err) { return res.status(500).send(err); }
    if (!user) { return res.status(401).send(info); }
    req.login(user, (loginErr) => {
      if (loginErr) { return res.status(500).send(loginErr); }
      return res.status(200).send('Đăng nhập thành công');
    });
  })(req, res);
});

// Route đăng ký
app.post('/register', (req, res) => {
  // Xử lý đăng ký mới
  const { username, password } = req.body;
  // Bạn cần phải tạo phương thức createUser trong passportConfig.js
  passportConfig.createUser(username, password, (err, user) => {
    if (err) { return res.status(500).send(err); }
    return res.status(200).send('Đăng ký thành công');
  });
});

// Route khác ví dụ về profile cá nhân
app.get('/profile', passport.authenticate('local', { session: false }), (req, res) => {
  res.json(req.user);
});

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
