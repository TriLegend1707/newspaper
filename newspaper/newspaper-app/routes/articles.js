const express = require('express');
const multer = require('multer');
const Article = require('../models/article');
const { authenticateWriter } = require('../utils/auth');

const router = express.Router();

// Configure image upload
const upload = multer({
    dest: 'public/uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Create article
router.post('/', authenticateWriter, upload.array('images', 5), async (req, res) => {
    const { title, summary, content, category, tags } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    try {
        if (!title || !summary || !content || !category) {
            return res.status(400).json({ error: 'Missing required fields: title, summary, content, category.' });
        }

        const article = new Article({
            title,
            summary,
            content,
            category,
            tags: tags
                ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) // Remove empty tags
                : [],
            writer: req.writer._id,
            images,
        });

        await article.save();
        res.status(201).json({ message: 'Article created successfully.', article });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get articles by status
router.get('/status/:status', authenticateWriter, async (req, res) => {
    const { status } = req.params;

    const validStatuses = ['Published', 'Rejected', 'Pending'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid article status.' });
    }

    try {
        const articles = await Article.find({ writer: req.writer._id, status });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles by status:', error);
        res.status(500).json({ error: 'Error fetching articles.' });
    }
});

// Edit article (only if rejected or pending)
router.put('/:id', authenticateWriter, async (req, res) => {
    const { id } = req.params;
    const { title, summary, content, category, tags } = req.body;

    try {
        const article = await Article.findOne({ _id: id, writer: req.writer._id });
        if (!article) {
            return res.status(404).json({ error: 'Article not found.' });
        }

        if (!['Rejected', 'Pending'].includes(article.status)) {
            return res.status(403).json({ error: 'You can only edit articles that are "Rejected" or "Pending".' });
        }

        // Update fields
        article.title = title || article.title;
        article.summary = summary || article.summary;
        article.content = content || article.content;
        article.category = category || article.category;
        article.tags = tags
            ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) // Remove empty tags
            : article.tags;

        await article.save();
        res.status(200).json({ message: 'Article updated successfully.', article });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Error updating article.' });
    }
});

module.exports = router;
