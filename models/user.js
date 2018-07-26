const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
