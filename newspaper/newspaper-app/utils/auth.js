const Subscriber = require('../models/subscriber');

const authenticateSubscriber = async (req, res, next) => {
    const email = req.header('email'); // Assume email is passed in the header for simplicity
    try {
        const subscriber = await Subscriber.findOne({ email });
        if (!subscriber) {
            return res.status(401).send('Unauthorized: Invalid subscriber');
        }
        req.subscriber = subscriber;
        next();
    } catch (error) {
        res.status(500).send('Error authenticating subscriber');
    }
};

module.exports = { authenticateSubscriber };
