import express, { Router, Request, Response } from "express";
import axios from "axios";

const coinRouter =  express.Router();

coinRouter.get('/', async(req: Request, res: Response): Promise<void> => {
    const coin = typeof req.query.coin === 'string' ? req.query.coin: "solana";

    try {
        const { data } = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price",
            {
                params: {
                    ids: coin,
                    vs_currencies: "inr",
                },
            }
        );

        if (!data[coin]) {
            res.status(404).json({ error: "Coin not found "});
            return;
        }

        res.json({
            coin,
            price: data[coin].inr,
        });
    } catch (err: any) {
        console.error("Failed to fetch coin price:", err.message);
        res.status(500).json({ error: "Failed to fetch coin price" });
    }
});

export default coinRouter;