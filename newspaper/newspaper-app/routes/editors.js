const express = require('express');
const Article = require('../models/article');
const { authenticateEditor } = require('../utils/auth');

const router = express.Router();

// Get drafts in categories managed by the editor
router.get('/drafts', authenticateEditor, async (req, res) => {
    try {
        const drafts = await Article.find({
            category: { $in: req.editor.categories },
            status: 'Pending',
        }).populate('writer', 'name email');

        res.status(200).json(drafts);
    } catch (error) {
        res.status(500).send('Error fetching drafts');
    }
});

// Approve article
router.put('/:id/approve', authenticateEditor, async (req, res) => {
    const { id } = req.params;
    const { category, tags, publishDate } = req.body;

    try {
        const article = await Article.findOne({ _id: id, category: { $in: req.editor.categories }, status: 'Pending' });
        if (!article) {
            return res.status(404).send('Article not found or not authorized to approve');
        }

        article.status = 'Approved';
        article.category = category || article.category;
        article.tags = tags || article.tags;
        article.publishDate = publishDate;
        article.editor = req.editor._id;

        await article.save();
        res.status(200).send('Article approved successfully');
    } catch (error) {
        res.status(500).send('Error approving article');
    }
});

// Reject article
router.put('/:id/reject', authenticateEditor, async (req, res) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    try {
        const article = await Article.findOne({ _id: id, category: { $in: req.editor.categories }, status: 'Pending' });
        if (!article) {
            return res.status(404).send('Article not found or not authorized to reject');
        }

        article.status = 'Rejected';
        article.rejectionReason = rejectionReason;
        article.editor = req.editor._id;

        await article.save();
        res.status(200).send('Article rejected successfully');
    } catch (error) {
        res.status(500).send('Error rejecting article');
    }
});

module.exports = router;
