const Writer = require('../models/writer');
const Editor = require('../models/editor');
const Subscriber = require('../models/subscriber');

// Middleware để xác thực Writer
const authenticateWriter = (req, res, next) => {
    if (req.user && req.user.role === 'Writer') {
        return next();
    }
    res.status(403).send('Access denied.');
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

// Middleware để xác thực Subscriber
const authenticateSubscriber = async (req, res, next) => {
    const email = req.header('email'); // Email được truyền qua header
    try {
        const subscriber = await Subscriber.findOne({ email });
        if (!subscriber) {
            return res.status(401).send('Unauthorized: Invalid subscriber');
        }
        req.subscriber = subscriber; // Đặt đối tượng subscriber vào req
        next();
    } catch (error) {
        res.status(500).send('Error authenticating subscriber');
    }
};

// Xuất tất cả middleware
module.exports = {
    authenticateWriter,
    authenticateEditor,
    authenticateSubscriber,
};
const Admin = require('../models/admin'); // Model Admin của bạn, thay đổi nếu cần

// Middleware để xác thực Admin
const authenticateAdmin = async (req, res, next) => {
    const email = req.header('email'); // Email được truyền qua header
    try {
        const admin = await Admin.findOne({ email }); // Kiểm tra admin trong cơ sở dữ liệu
        if (!admin) {
            return res.status(401).send('Unauthorized: Invalid admin');
        }
        req.admin = admin; // Đặt đối tượng admin vào req
        next();
    } catch (error) {
        res.status(500).send('Error authenticating admin');
    }
};

// Xuất tất cả middleware
module.exports = {
    authenticateWriter,
    authenticateEditor,
    authenticateSubscriber,
    authenticateAdmin, // Xuất middleware authenticateAdmin
};
