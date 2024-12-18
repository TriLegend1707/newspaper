const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Import User Model

module.exports = function (passport) {
    // Local Strategy for Login
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) return done(null, false, { message: 'Email not registered' });

                // Compare Password
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) return done(null, user);
                else return done(null, false, { message: 'Incorrect password' });
            } catch (err) {
                return done(err);
            }
        })
    );

    // Serialize and Deserialize User
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};
