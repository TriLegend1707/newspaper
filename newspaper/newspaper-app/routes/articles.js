const express = require('express');
const multer = require('multer');
const Article = require('../models/article');
const { authenticateWriter } = require('../utils/auth');

const router = express.Router();

// Configure image upload
const upload = multer({ dest: 'public/uploads/' });

// Create article
router.post('/', authenticateWriter, upload.array('images', 5), async (req, res) => {
    const { title, summary, content, category, tags } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);
    
    try {
        const article = new Article({
            title,
            summary,
            content,
            category,
            tags: tags.split(',').map(tag => tag.trim()),
            writer: req.writer._id,
            images,
        });
        await article.save();
        res.status(201).send('Article created successfully.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get articles by status
router.get('/status/:status', authenticateWriter, async (req, res) => {
    const { status } = req.params;
    try {
        const articles = await Article.find({ writer: req.writer._id, status });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).send('Error fetching articles');
    }
});

// Edit article (only if rejected or pending)
router.put('/:id', authenticateWriter, async (req, res) => {
    const { id } = req.params;
    const { title, summary, content, category, tags } = req.body;

    try {
        const article = await Article.findOne({ _id: id, writer: req.writer._id });
        if (!article || !['Rejected', 'Pending'].includes(article.status)) {
            return res.status(403).send('Cannot edit this article');
        }

        article.title = title || article.title;
        article.summary = summary || article.summary;
        article.content = content || article.content;
        article.category = category || article.category;
        article.tags = tags ? tags.split(',').map(tag => tag.trim()) : article.tags;

        await article.save();
        res.status(200).send('Article updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating article');
    }
});

module.exports = router;
