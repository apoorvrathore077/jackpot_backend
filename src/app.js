import express from "express";
import dotenv from "dotenv";
import gameRoute from './routes/gameRoute.js';
import userRoutes from "./routes/userRoutes.js";
import path from "path";

dotenv.config()

const app = express();

app.use(express.json());

app.use('/static',express.static("public"));
app.use('/api/game', gameRoute);
app.use("/assets", express.static(path.join(path.resolve(), "assets")));
app.use("/api/users",userRoutes);
app.use("/api/game/", gameRoute);

app.get("/", (req, res) => {
  res.send("Jackpot Game API is running!");
});
export default app;