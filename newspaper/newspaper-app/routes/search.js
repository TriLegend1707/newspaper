// routes/search.js
const express = require('express');
const router = express.Router();

// Dữ liệu mẫu bài viết
const posts = [
  { title: 'Bài viết 1', content: 'Nội dung bài viết 1...', abstract: 'Tóm tắt bài viết 1...', tags: ['Nông Sản'], date: '2024-12-01', category: 'Kinh Doanh' },
  { title: 'Bài viết 2', content: 'Nội dung bài viết 2...', abstract: 'Tóm tắt bài viết 2...', tags: ['Điện Ảnh'], date: '2024-12-02', category: 'Giải Trí' },
  // thêm các bài viết khác...
];

// Tìm kiếm bài viết
router.get('/', (req, res) => {
  const query = req.query.q;
  const searchResults = posts.filter(post => 
    post.title.includes(query) || 
    post.content.includes(query) || 
    post.abstract.includes(query)
  );

  res.render('search', { query, searchResults });
});

module.exports = router;

