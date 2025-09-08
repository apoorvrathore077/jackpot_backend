export const symbols = [
    { name: "Slot1", image: "/assets/ic_slot1.png", probability: 0.0876 },
    { name: "Slot2", image: "/assets/ic_slot2.png", probability: 0.1095 },
    { name: "Slot3", image: "/assets/ic_slot3.png", probability: 0.1462 },
    { name: "Slot4", image: "/assets/ic_slot4.png", probability: 0.2193 },
    { name: "Slot5", image: "/assets/ic_slot5.png", probability: 0.4386 },

];

export const paytable = {
    "Slot1": { multiplier: 10, message: "Won x10" },
    "Slot2": { multiplier: 8, message: "Won x8" },
    "Slot3": { multiplier: 6, message: "Won x6" },
    "Slot4": { multiplier: 4, message: "Won x4" },
    "Slot5": { multiplier: 2, message: "Won x2" },
};

export const pickWeightedSymbol = () => {
    // Weight is inversely proportional to multiplier: higher payout -> lower probability
    const weights = symbols.map(s => {
        const multiplier = paytable[s.name]?.multiplier ?? 1;
        return { symbol: s, weight: 1 / Math.max(multiplier, 1) };
    });

    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0) || 1;
    const r = Math.random() * totalWeight;
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i].weight;
        if (r <= cumulative) return weights[i].symbol;
    }
    return weights[weights.length - 1].symbol;
};