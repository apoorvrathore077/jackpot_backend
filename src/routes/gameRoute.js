import { Router } from "express";
import { createGame,spinGame,getGame } from "../controllers/gameController.js";
import auth from "../middleware/auth.js";



const router = Router();
router.post("/create", auth, createGame);
router.post("/spin/:gameId", auth, spinGame);
router.get("/:gameId", auth, getGame);

export default router;
