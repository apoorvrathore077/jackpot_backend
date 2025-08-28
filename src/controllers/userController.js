import User from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ✅ Add user
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Create a user object to send back, without the password
    const userWithoutPassword = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      // You can add other user fields here, but not the password
    };

    // Send a consistent success response
    res.status(201).json({ success: true, message: "User registered successfully", user: userWithoutPassword });

  } catch (err) {
    // Send a consistent error response for server errors
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (username === "" || password === "") {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Return a consistent success response
    res.json({
      success: true, // Corrected: Added a 'success' flag
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
    res.status(500).json({ success: false, message: err.message });
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
