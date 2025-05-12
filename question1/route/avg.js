const express = require('express');
const router = express.Router();
const config  =require('../config/config')


function calculateAverage(prices) {
    const sum = prices.reduce((acc, p) => acc + p.price, 0);
    return prices.length ? sum / prices.length : 0;
}

router.get('/stocks/:ticker', async (req, res) => {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    if (!minutes || aggregation !== 'average') {
        return res.status(400).json({ error: 'Missing or invalid query params' });
    }

    try {
        const response = await config.get(`/${ticker}?minutes=${minutes}`);
        const priceHistory = response.data;
        const average = calculateAverage(priceHistory);

        res.json({
            averageStockPrice: average,
            priceHistory: priceHistory
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

module.exports = router;