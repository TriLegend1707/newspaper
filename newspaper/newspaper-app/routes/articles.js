const express = require('express');
const Article = require('../models/article');
const { authenticateSubscriber } = require('../utils/auth');

const router = express.Router();

// Get all articles (Premium first for subscribers)
router.get('/', authenticateSubscriber, async (req, res) => {
    try {
        const articles = await Article.find().sort({ isPremium: -1, views: -1 });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).send('Error fetching articles');
    }
});

// Download premium article PDF
router.get('/download/:id', authenticateSubscriber, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article || !article.isPremium) {
            return res.status(404).send('Article not found or not premium.');
        }

        if (!req.subscriber.isSubscriptionActive()) {
            return res.status(403).send('Subscription expired. Please extend your subscription.');
        }

        res.download(article.pdfPath); // Ensure the PDF path is correctly configured
    } catch (error) {
        res.status(500).send('Error downloading article');
    }
});

module.exports = router;
