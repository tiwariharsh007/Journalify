import bcrypt from 'bcrypt';
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';

// Signup
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    return res.status(201).json({
      user: { username: newUser.username, email: newUser.email },
      message: "Registration successful",
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: "An error occurred during registration" });
  }
};

// signin 

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: true, message: "All credentials are required" });
    }

    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(400).json({ error: true, message: "User not found." });
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ error: true, message: "Wrong credentials." });
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({
        user: rest,
        message: "Logged in successfully",
      });
  } catch (error) {
    return res.status(500).json({ error: true, message: "An error occurred during logging-in." });
  }
};

// sign-out 
export const signout = (req, res, next) => {
  try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
}