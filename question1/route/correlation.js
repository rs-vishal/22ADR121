const express = require('express');
const router = express.Router();
const config = require('../config/config')
function Average(prices) {
    const sum = prices.reduce((acc, p) => acc + p.price, 0);
    return sum / prices.length;
}

const pcorr = (x, y) => {
    let sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumX2 = 0,
        sumY2 = 0;
    
    const n = Math.min(x.length, y.length);
    x = x.slice(0, n);
    y = y.slice(0, n);

    for (let i = 0; i < n; i++) {
        const xi = x[i];
        const yi = y[i];
        sumX += xi;
        sumY += yi;
        sumXY += xi * yi;
        sumX2 += xi * xi;
        sumY2 += yi * yi;
    }

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? null : numerator / denominator;
};

router.get('/stockcorrelation', async (req, res) => {
    const { minutes, ticker } = req.query;

    if (!minutes || !ticker || !Array.isArray(ticker) || ticker.length !== 2) {
        return res.status(400).json({ error: 'Provide exactly two stock tickers and a valid time in minutes' });
    }

    try {
        const [tickerA, tickerB] = ticker;

        const [resA, resB] = await Promise.all([
            config.get(`/${tickerA}?minutes=${minutes}`),
            config.get(`/${tickerB}?minutes=${minutes}`)
        ]);

        const pricesA = resA.data.sort((a, b) => new Date(a.lastUpdatedAt) - new Date(b.lastUpdatedAt));
        const pricesB = resB.data.sort((a, b) => new Date(a.lastUpdatedAt) - new Date(b.lastUpdatedAt));

        const pricesOnlyA = pricesA.map(p => p.price);
        const pricesOnlyB = pricesB.map(p => p.price);

        if (pricesOnlyA.length < 2 || pricesOnlyB.length < 2) {
            return res.status(400).json({ error: 'Insufficient data to calculate correlation' });
        }

        const correlation = pcorr(pricesOnlyA, pricesOnlyB);
        const avgA = Average(pricesA);
        const avgB = Average(pricesB);

        res.json({
            correlation,
            stocks: {
                [tickerA]: {
                    averagePrice: avgA,
                    priceHistory: pricesA
                },
                [tickerB]: {
                    averagePrice: avgB,
                    priceHistory: pricesB
                }
            }
        });
    } catch (err) {
        console.error('Error fetching or processing stock data:', err.message);
        res.status(500).json({ error: 'Failed to fetch or process stock data' });
    }
});

module.exports = router;