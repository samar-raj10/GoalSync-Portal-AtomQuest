const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();
const sign = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ token: sign(user), user });
});

router.post('/switch-role', auth, async (req, res) => {
  const roleToEmail = {
    employee: 'employee@demo.com',
    manager: 'manager@demo.com',
    admin: 'admin@demo.com'
  };
  const email = roleToEmail[req.body.role];
  if (!email) return res.status(400).json({ message: 'Invalid demo role' });
  const user = await User.findOne({ email });
  res.json({ token: sign(user), user });
});

router.get('/me', auth, (req, res) => res.json({ user: req.user }));
module.exports = router;
