// routes/home.js
const express = require('express');
const router = express.Router();

// Dữ liệu mẫu bài viết
const posts = [
  { title: 'Bài viết 1', category: 'Kinh Doanh', date: '2024-12-01', image: 'image1.jpg', views: 150 },
  { title: 'Bài viết 2', category: 'Giải Trí', date: '2024-12-02', image: 'image2.jpg', views: 120 },
  // thêm các bài viết khác...
];

// 3-4 bài viết nổi bật nhất trong tuần qua
router.get('/', (req, res) => {
  const featuredPosts = posts.slice(0, 4);
  const popularPosts = posts.sort((a, b) => b.views - a.views).slice(0, 10);
  const latestPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  const topCategories = categories.map(category => {
    const latestPost = posts.find(post => post.category === category.name);
    return { ...category, latestPost };
  });

  res.render('home', { featuredPosts, popularPosts, latestPosts, topCategories });
});

module.exports = router;
