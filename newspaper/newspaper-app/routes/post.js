// routes/post.js
const express = require('express');
const router = express.Router();

// Dữ liệu mẫu bài viết
const posts = [
  { title: 'Bài viết 1', category: 'Kinh Doanh', tags: ['Nông Sản'], date: '2024-12-01', image: 'image1.jpg', content: 'Nội dung đầy đủ bài viết 1...', comments: [{ date: '2024-12-02', user: 'Guest1', content: 'Bình luận 1...' }] },
  { title: 'Bài viết 2', category: 'Giải Trí', tags: ['Điện Ảnh'], date: '2024-12-02', image: 'image2.jpg', content: 'Nội dung đầy đủ bài viết 2...', comments: [{ date: '2024-12-03', user: 'Guest2', content: 'Bình luận 2...' }] },
  // thêm các bài viết khác...
];

// Xem chi tiết bài viết
router.get('/:title', (req, res) => {
  const title = req.params.title;
  const post = posts.find(p => p.title === title);

  res.render('post', { post });
});

module.exports = router;
