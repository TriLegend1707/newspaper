const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    tags: [String],
    content: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        trim: true
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [{
        name: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        content: {
            type: String,
            required: true
        }
    }]
});

// Tạo mô hình Article
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
