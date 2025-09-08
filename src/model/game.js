import mongoose, { Schema } from "mongoose";

const gameSchema = new Schema({
  player: { type: String, required: true }, // store userId as string
  bet: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 }, // track current balance during game
  winnings: { type: Number, default: 0 },
  symbols: { type: [String], default: [] },
  result: { type: String, enum: ["win", "lose", null], default: null },
  status: { type: String, enum: ["ongoing", "finished"], default: "ongoing" },
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
