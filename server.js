<<<<<<< HEAD
import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db.js";

dotenv.config();

// Render/Railway apna port ENV me bhejta hai, warna 5000 use karo
const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
=======
import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db.js";

dotenv.config();

// Render/Railway apna port ENV me bhejta hai, warna 5000 use karo
const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
>>>>>>> 9b7ea67f02d84e4df60a13b57edc73da74b1c0be
