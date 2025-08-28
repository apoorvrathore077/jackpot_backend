import { Router } from "express";
import {
  createUser,
  getUsers,
  loginUser,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import User from "../model/user.js";

const router = Router();
router.post("/register", createUser); // Correct
router.get("/", auth, getUsers); // Correct
router.post("/login", loginUser); // Remove 'auth' middleware here
// fetch user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      message: "User profile",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
