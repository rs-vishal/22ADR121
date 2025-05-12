const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000;
const stockCache = new Map();
const STOCK_API_BASE = 'http://20.244.56.144/evaluation-service';

app.use(express.json());
app.use(cors());

app.get('/stocks/:ticker', async (req, res) => {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;
    const token = req.headers.authorization?.split(" ")[1];

    if (!minutes || !aggregation) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const result = await calculateAveragePrice(ticker, minutes, token);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/stockcorrelation', async (req, res) => {
    const { minutes, ticker } = req.query;
    const token = req.headers.authorization?.split(" ")[1];

    if (!minutes || !ticker || ticker.length !== 2) {
        return res.status(400).json({ error: 'Exactly two tickers required' });
    }

    try {
        const result = await calculateCorrelation(ticker, minutes, token);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function calculateAveragePrice(ticker, minutes, token) {
    const cacheKey = `avg_${ticker}_${minutes}`;
    if (stockCache.has(cacheKey)) {
        return stockCache.get(cacheKey);
    }

    const response = await axios.get(`${STOCK_API_BASE}/stocks/${ticker}?minutes=${minutes}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const priceHistory = Array.isArray(response.data) ? response.data : [response.data.stock];
    const sum = priceHistory.reduce((acc, item) => acc + item.price, 0);
    const average = sum / priceHistory.length;

    const result = {
        averageStockPrice: average,
        priceHistory: priceHistory
    };

    stockCache.set(cacheKey, result);
    return result;
}

async function calculateCorrelation(tickers, minutes, token) {
    const [ticker1, ticker2] = tickers;
    const cacheKey = `corr_${ticker1}_${ticker2}_${minutes}`;

    if (stockCache.has(cacheKey)) {
        return stockCache.get(cacheKey);
    }

    const [stock1Data, stock2Data] = await Promise.all([
        calculateAveragePrice(ticker1, minutes, token),
        calculateAveragePrice(ticker2, minutes, token)
    ]);

    const alignedPrices = alignPriceData(stock1Data.priceHistory, stock2Data.priceHistory);

    const correlation = calculatePearsonCorrelation(
        alignedPrices.map(p => p.price1),
        alignedPrices.map(p => p.price2)
    );

    const result = {
        correlation: correlation,
        stocks: {
            [ticker1]: stock1Data,
            [ticker2]: stock2Data
        }
    };

    stockCache.set(cacheKey, result);
    return result;
}

function alignPriceData(priceHistory1, priceHistory2) {
    const priceMap1 = new Map();
    priceHistory1.forEach(item => {
        priceMap1.set(item.lastUpdatedAt, item.price);
    });

    const alignedPrices = [];
    priceHistory2.forEach(item => {
        if (priceMap1.has(item.lastUpdatedAt)) {
            alignedPrices.push({
                price1: priceMap1.get(item.lastUpdatedAt),
                price2: item.price,
                timestamp: item.lastUpdatedAt
            });
        }
    });

    return alignedPrices;
}

function calculatePearsonCorrelation(prices1, prices2) {
    if (prices1.length !== prices2.length || prices1.length < 2) {
        return 0;
    }

    const n = prices1.length;
    const avg1 = prices1.reduce((sum, p) => sum + p, 0) / n;
    const avg2 = prices2.reduce((sum, p) => sum + p, 0) / n;

    let covariance = 0;
    for (let i = 0; i < n; i++) {
        covariance += (prices1[i] - avg1) * (prices2[i] - avg2);
    }
    covariance /= (n - 1);

    const stdDev1 = Math.sqrt(prices1.reduce((sum, p) => sum + Math.pow(p - avg1, 2), 0) / (n - 1));
    const stdDev2 = Math.sqrt(prices2.reduce((sum, p) => sum + Math.pow(p - avg2, 2), 0) / (n - 1));

    return covariance / (stdDev1 * stdDev2);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
