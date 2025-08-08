// backend/controllers/authController.js
import bcrypt from 'bcrypt';
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';

// Helper to create JWT
const createToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  // expires in 7 days, change as needed
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// Signup
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: true, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashed
    });

    const saved = await newUser.save();

    // create token payload (store minimal info)
    const token = createToken({ id: saved._id, email: saved.email });

    // set cookie (httpOnly)
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({ user: { id: saved._id, username: saved.username, email: saved.email }, message: 'User created', token });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: true, message: 'Server error during signup' });
  }
};

// Signin
export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: true, message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: true, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: true, message: 'Invalid credentials' });

    const token = createToken({ id: user._id, email: user.email });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ user: { id: user._id, username: user.username, email: user.email }, message: 'Signed in', token });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ error: true, message: 'Server error during signin' });
  }
};

// Signout
export const signout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return res.status(200).json({ message: 'Signed out' });
};

// get current user (verify middleware must have set req.userRef)
export const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.userRef.id).select('-password');
    if (!user) return res.status(404).json({ error: true, message: 'User not found' });

    return res.status(200).json({ user, message: 'User data retrieved successfully.' });
  } catch (error) {
    console.error('getuser error:', error);
    return res.status(500).json({ error: true, message: 'Server error fetching user data.' });
  }
};
