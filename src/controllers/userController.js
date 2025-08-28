import User from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ✅ Add user
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password : hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// login

// In userController.js
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (username === "" || password === "") {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (user.hashedPassword !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token with user ID
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
