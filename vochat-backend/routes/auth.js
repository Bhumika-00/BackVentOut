const express = require('express');
const passport = require('passport');
const router = express.Router();

// === Google OAuth Routes ===
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect('http://localhost:5173/select-role'); // ✅ Redirect to frontend after login
  }
);

// === Authenticated User Info ===
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user); // ✅ Return logged-in user info
  }
  res.status(401).json({ error: 'Not authenticated' });
});

// === Set Role (from frontend) ===
router.post('/set-role', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not logged in' });

  const { role } = req.body;
  try {
    req.user.role = role;
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to set role' });
  }
});

module.exports = router;
