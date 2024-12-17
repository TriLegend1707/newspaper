const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");

// Trang chủ
router.get("/", guestController.homePage);

// Chi tiết bài viết
router.get("/article/:id", guestController.articleDetail);

// Danh sách bài viết theo chuyên mục
router.get("/category/:id", guestController.articlesByCategory);

// Tìm kiếm bài viết
router.get("/search", guestController.searchArticles);

module.exports = router;
