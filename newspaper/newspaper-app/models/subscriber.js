const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscriptionExpiry: { type: Date, required: true },
});

subscriberSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

subscriberSchema.methods.isSubscriptionActive = function () {
    return new Date() <= this.subscriptionExpiry;
};

subscriberSchema.methods.extendSubscription = function (days) {
    this.subscriptionExpiry = new Date(this.subscriptionExpiry.getTime() + days * 24 * 60 * 60 * 1000);
};

module.exports = mongoose.model('Subscriber', subscriberSchema);
