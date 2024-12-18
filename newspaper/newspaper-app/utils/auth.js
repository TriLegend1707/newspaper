const Writer = require('../models/writer');
const Editor = require('../models/editor');
const Admin = require('../models/admin'); // Nếu bạn có model Admin

// Middleware để xác thực Writer
const authenticateWriter = async (req, res, next) => {
    const email = req.header('email');
    try {
        const writer = await Writer.findOne({ email });
        if (!writer) {
            return res.status(401).send('Unauthorized: Invalid writer');
        }
        req.writer = writer;
        next();
    } catch (error) {
        res.status(500).send('Error authenticating writer');
    }
};

// Middleware để xác thực Editor
const authenticateEditor = async (req, res, next) => {
    const email = req.header('email');
    try {
        const editor = await Editor.findOne({ email });
        if (!editor) {
            return res.status(401).send('Unauthorized: Invalid editor');
        }
        req.editor = editor;
        next();
    } catch (error) {
        res.status(500).send('Error authenticating editor');
    }
};

// Middleware để xác thực Admin
const authenticateAdmin = async (req, res, next) => {
    const isAdmin = req.header('admin'); // Pass admin flag in header
    if (!isAdmin) {
        return res.status(401).send('Unauthorized: Admin access required');
    }
    next();
};

module.exports = { 
    authenticateWriter, 
    authenticateEditor, 
    authenticateAdmin 
};
