import Game from "../model/game.js";
import User from "../model/user.js";
import { symbols, paytable } from "../utils/symbols.js";

// CREATE GAME
export const createGame = async (req, res) => {
  const { userId, bet, startingBalance = 500000 } = req.body;

  if (!userId) return res.status(400).json({ message: "userId is required" });
  if (!bet) return res.status(400).json({ message: "bet is required" });

  try {
    // Create game with starting balance (default: 500000)
    const game = await Game.create({
      player: userId,
      bet,
      currentBalance: startingBalance
    });

    res.json({
      message: "Game started",
      gameId: game._id,
      balance: game.currentBalance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// SPIN GAME
export const spinGame = async (req, res) => {
  const { userId, gameId } = req.body;

  if (!userId || !gameId) return res.status(400).json({ message: "userId and gameId required" });

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });
    if (game.status === "finished") return res.status(400).json({ message: "Game already finished" });
    if (game.player !== userId) return res.status(403).json({ message: "Unauthorized" });

    // Check if user has enough balance to continue spinning
    if (game.currentBalance < game.bet) {
      game.status = "finished";
      game.result = "insufficient_balance";
      await game.save();

      return res.json({
        gameId,
        message: "Insufficient balance to continue spinning",
        currentBalance: game.currentBalance,
        bet: game.bet,
        result: "insufficient_balance"
      });
    }

    // Deduct bet from balance
    game.currentBalance -= game.bet;

    // Spin 3 wheels
    const spinResult = Array.from({ length: 3 }, () => {
      const index = Math.floor(Math.random() * symbols.length);
      return { name: symbols[index].name, image: symbols[index].image };
    });

    const isWinner = spinResult.every(s => s.name === spinResult[0].name);

    let winnings = 0;
    if (isWinner) {
      const firstSymbol = spinResult[0].name;
      winnings = game.bet * paytable[firstSymbol].multiplier;
      game.currentBalance += winnings; // Add winnings to balance
      game.winnings += winnings; // Track total winnings
      game.result = "win";
    } else {
      game.result = "lose";
    }

    // Store the latest spin result
    game.symbols = spinResult.map(s => s.name);

    // Check if user can continue spinning
    const canContinue = game.currentBalance >= game.bet;

    // Only finish game if balance is insufficient for next spin
    if (!canContinue) {
      game.status = "finished";
    }

    await game.save();

    res.json({
      gameId,
      symbols: spinResult,
      result: game.result,
      winnings,
      currentBalance: game.currentBalance,
      canContinue,
      totalWinnings: game.winnings
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET GAME STATUS
export const getGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).populate(
      "player",
      "username email balance"
    );
    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
