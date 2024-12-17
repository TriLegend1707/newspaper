// config/database.js
module.exports = {
  database: 'mongodb://localhost:27017/newspaper' // Địa chỉ kết nối MongoDB
};

// app.js
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/database'); // Cấu hình database

const app = express();

// Middleware và các cài đặt khác...

// Kết nối tới cơ sở dữ liệu
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Các sự kiện kết nối tới MongoDB
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('Database connection error: ' + err);
});

// Cài đặt Passport
require('./config/passport')(passport);

// Các route khác...

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
