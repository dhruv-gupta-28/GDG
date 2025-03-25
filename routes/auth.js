const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      userType
    });

    // Save user to database
    await user.save();

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      userType: user.userType
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/auth/google
// @desc    Auth with Google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard based on user type
    const token = req.user.getSignedJwtToken();
    res.redirect(`/auth/success?token=${token}&userType=${req.user.userType}`);
  }
);

// @route   GET api/auth/facebook
// @desc    Auth with Facebook
// @access  Public
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// @route   GET api/auth/facebook/callback
// @desc    Facebook auth callback
// @access  Public
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard based on user type
    const token = req.user.getSignedJwtToken();
    res.redirect(`/auth/success?token=${token}&userType=${req.user.userType}`);
  }
);

// @route   GET api/auth/apple
// @desc    Auth with Apple
// @access  Public
router.get('/apple', passport.authenticate('apple'));

// @route   GET api/auth/apple/callback
// @desc    Apple auth callback
// @access  Public
router.get(
  '/apple/callback',
  passport.authenticate('apple', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard based on user type
    const token = req.user.getSignedJwtToken();
    res.redirect(`/auth/success?token=${token}&userType=${req.user.userType}`);
  }
);

// @route   GET api/auth/success
// @desc    Auth success redirect
// @access  Private
router.get('/success', (req, res) => {
  res.sendFile('auth-success.html', { root: './public' });
});

module.exports = router;