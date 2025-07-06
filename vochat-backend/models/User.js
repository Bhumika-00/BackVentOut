const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: String,
  isPaid: { type: Boolean, default: false },
  googleId: String,
});
module.exports = mongoose.model('User', userSchema);
