const Writer = require('../models/writer');

const authenticateWriter = async (req, res, next) => {
    const email = req.header('email'); // Assume email is passed in header for simplicity
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

module.exports = { authenticateWriter };
