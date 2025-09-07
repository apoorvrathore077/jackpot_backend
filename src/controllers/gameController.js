import Game from "../model/game.js";
import User from "../model/user.js";
import { symbols, paytable } from "../utils/symbols.js";

export const createGame = async (req, res) => {
  console.log("req.user:", req.user);

  const userId = req.user.id;
  const { bet } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.balance < bet) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.balance -= bet;
    await user.save();

    const game = await Game.create({ player: userId, bet });

    res.json({
      message: "Game started",
      gameId: game._id,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const spinGame = async (req, res) => {
  const userId = req.user.id;
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).populate("player");
    if (!game || game.status === "finished") {
      return res
        .status(404)
        .json({ message: "Game not found or already finished" });
    }

    if (game.player._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Spin 4 wheels
    const spinResult = Array.from({ length: 4 }, () => {
      const index = Math.floor(Math.random() * symbols.length);
      const symbol = symbols[index];
      return { name: symbol.name, image: symbol.image };
    });

    // Check win
    const isWinner = spinResult.every((s) => s.name === spinResult[0].name);

    let winnings = 0;
    if (isWinner) {
      const firstSymbol = spinResult[0].name;
      winnings = game.bet * paytable[firstSymbol].multiplier; // use paytable
      game.winnings = winnings;
      game.result = "win";
      game.player.balance += winnings;
      await game.player.save();
    } else {
      game.result = "lose";
      game.winnings = 0;
    }

    game.symbols = spinResult.map((s) => s.name);
    game.status = "finished";
    await game.save();

    res.json({
      gameId,
      symbols: spinResult,
      result: game.result,
      winnings,
      balance: game.player.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Game status
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
