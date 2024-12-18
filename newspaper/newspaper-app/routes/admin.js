const express = require('express');
const Category = require('../models/category');
const Tag = require('../models/tag');
const Article = require('../models/article');
const User = require('../models/user'); // Generic user model (Writer, Editor, Subscriber)
const { authenticateAdmin } = require('../utils/auth');

const router = express.Router();

/** CATEGORY MANAGEMENT **/
// Get all categories
router.get('/categories', authenticateAdmin, async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).send('Error fetching categories');
    }
});

// Add category
router.post('/categories', authenticateAdmin, async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = new Category({ name, description });
        await category.save();
        res.status(201).send('Category created');
    } catch (error) {
        res.status(500).send('Error adding category');
    }
});

// Update category
router.put('/categories/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        await Category.findByIdAndUpdate(id, { name, description });
        res.status(200).send('Category updated');
    } catch (error) {
        res.status(500).send('Error updating category');
    }
});

// Delete category
router.delete('/categories/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Category.findByIdAndDelete(id);
        res.status(200).send('Category deleted');
    } catch (error) {
        res.status(500).send('Error deleting category');
    }
});

/** TAG MANAGEMENT **/
// Similar CRUD for Tags
router.get('/tags', authenticateAdmin, async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).send('Error fetching tags');
    }
});

router.post('/tags', authenticateAdmin, async (req, res) => {
    const { name } = req.body;
    try {
        const tag = new Tag({ name });
        await tag.save();
        res.status(201).send('Tag created');
    } catch (error) {
        res.status(500).send('Error adding tag');
    }
});

router.put('/tags/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await Tag.findByIdAndUpdate(id, { name });
        res.status(200).send('Tag updated');
    } catch (error) {
        res.status(500).send('Error updating tag');
    }
});

router.delete('/tags/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Tag.findByIdAndDelete(id);
        res.status(200).send('Tag deleted');
    } catch (error) {
        res.status(500).send('Error deleting tag');
    }
});

/** ARTICLE MANAGEMENT **/
// Get all articles
router.get('/articles', authenticateAdmin, async (req, res) => {
    try {
        const articles = await Article.find().populate('writer editor');
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).send('Error fetching articles');
    }
});

// Update article status
router.put('/articles/:id/status', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // e.g., "Published"
    try {
        await Article.findByIdAndUpdate(id, { status });
        res.status(200).send('Article status updated');
    } catch (error) {
        res.status(500).send('Error updating article status');
    }
});

/** USER MANAGEMENT **/
// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

// Assign categories to an editor
router.put('/users/:id/assign-category', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { categories } = req.body;
    try {
        const user = await User.findById(id);
        if (!user || user.role !== 'Editor') {
            return res.status(400).send('User not found or not an editor');
        }
        user.categories = categories;
        await user.save();
        res.status(200).send('Categories assigned to editor');
    } catch (error) {
        res.status(500).send('Error assigning categories');
    }
});

// Extend subscriber account
router.put('/users/:id/extend-subscription', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { days } = req.body; // Number of days to extend
    try {
        const user = await User.findById(id);
        if (!user || user.role !== 'Subscriber') {
            return res.status(400).send('User not found or not a subscriber');
        }
        const currentExpiry = user.subscriptionExpiry || new Date();
        user.subscriptionExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);
        await user.save();
        res.status(200).send('Subscription extended');
    } catch (error) {
        res.status(500).send('Error extending subscription');
    }
});

module.exports = router;
