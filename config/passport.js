const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = []; // Lưu trữ người dùng tạm thời

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  done(null, user);
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(user => user.username === username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  }
));

// Tạo người dùng mới (để đăng ký)
passport.createUser = (username, password, done) => {
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  done(null, newUser);
};
// passport.js
module.exports = function(passport) {
  // Định nghĩa chiến lược và cấu hình Passport ở đây
};
