import express from "express";
import dotenv from "dotenv";
import gameRoutes from './routes/gameRoute.js';

dotenv.config()

const app = express();

app.use(express.json());

app.use('/static',express.static("public"));
app.use('/api/game', gameRoutes);
export default app;