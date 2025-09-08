// import { Router } from "express";
// import { createGame, spinGame, getGame } from "../controllers/gameController.js";



// const router = Router();
// router.post("/create", createGame);
// router.post("/spin/:gameId", spinGame);
// router.get("/:gameId", getGame);

// export default router;

import express from "express";
import { createGame, spinGame, getGame } from "../controllers/gameController.js";

const router = express.Router();

// Create a new game (no token required)
router.post("/create", createGame);

// Spin a game (no token required)
router.post("/spin", spinGame);

// Get game status
router.get("/:gameId", getGame);

export default router;
