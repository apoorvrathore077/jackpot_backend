import express from "express";
import connectDB from "./src/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import path from "path";
import gameRoute from "./src/routes/gameRoute.js";

const app = express();

// Middleware
app.use(express.json());

// Routes

// DB + Server start
connectDB();

app.use("/assets", express.static(path.join(path.resolve(), "assets")));
app.use("/api/users",userRoutes);
app.use("/api/game/", gameRoute);

app.get("/", (req, res) => {
  res.send("Jackpot Game API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
