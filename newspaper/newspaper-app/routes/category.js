// routes/category.js
const express = require('express');
const router = express.Router();

// Dữ liệu mẫu bài viết theo chuyên mục/tag
const posts = [
  { title: 'Bài viết 1', category: 'Kinh Doanh', tags: ['Nông Sản'], date: '2024-12-01', image: 'image1.jpg', content: 'Nội dung tóm tắt bài viết 1...' },
  { title: 'Bài viết 2', category: 'Giải Trí', tags: ['Điện Ảnh'], date: '2024-12-02', image: 'image2.jpg', content: 'Nội dung tóm tắt bài viết 2...' },
  // thêm các bài viết khác...
];

// Xem danh sách bài viết theo chuyên mục
router.get('/:category', (req, res) => {
  const category = req.params.category;
  const categoryPosts = posts.filter(post => post.category === category);

  res.render('category', { category, categoryPosts });
});

module.exports = router;
