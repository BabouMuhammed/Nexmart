const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ── @desc    Register a new user
// ── @route   POST /api/auth/register
// ── @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  // Prevent self-assigning admin role
  const assignedRole = role === 'seller' ? 'seller' : 'customer';

  const user = await User.create({ name, email, password, role: assignedRole });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// ── @desc    Login user
// ── @route   POST /api/auth/login
// ── @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Your account has been deactivated');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id, user.role),
  });
});

// ── @desc    Get logged-in user profile
// ── @route   GET /api/auth/me
// ── @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

// ── @desc    Update user profile
// ── @route   PUT /api/auth/profile
// ── @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.address = req.body.address || user.address;

  if (req.body.password) {
    user.password = req.body.password; // will be hashed by pre-save hook
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    token: generateToken(updatedUser._id, updatedUser.role),
  });
});

module.exports = { register, login, getMe, updateProfile };