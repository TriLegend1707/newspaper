// routes/menu.js
const express = require('express');
const router = express.Router();

// Các chuyên mục
const categories = [
  { name: 'Kinh Doanh', subCategories: ['Nông Sản', 'Hải Sản'] },
  { name: 'Giải Trí', subCategories: ['Điện Ảnh', 'Âm Nhạc'] },
  { name: 'Thể Thao', subCategories: ['Bóng Đá', 'Cầu Lông'] }
];

// Hiển thị danh sách chuyên mục
router.get('/', (req, res) => {
  res.render('menu', { categories });
});

module.exports = router;
