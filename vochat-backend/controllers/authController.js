const User = require('../models/User');
exports.setRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.session.userId);
  user.role = role;
  await user.save();
  res.json({ message: 'Role updated', role });
};