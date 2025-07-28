export const mockPortfolioData = {
  "pnL": 3838.5,
  "pnLPercent": 10.49,
  "pnLWithDividend": 3915.2,
  "pnLWithDividendPercent": 10.7,
  "totalDividend": 76.7,
  "totalDivPercent": 0.21,
  "lastDividendYield": 0.5,
  "ttmDividendYield": 0,
  "yieldOnCost": 0.55,
  "dividendFrequency": "quarterly",
  "hasDividends": true,
  "totalShares": 210,
  "totalInvestment": 36592.8,
  "totalValueToday": 40431.3,
  "averageCost": 174.25,
  "yearlyDividends": [
    {
      "year": 2012,
      "totalDividend": 2.84
    },
    {
      "year": 2013,
      "totalDividend": 2.84
    },
    {
      "year": 2014,
      "totalDividend": 2.84
    },
    {
      "year": 2015,
      "totalDividend": 2.84
    },
    {
      "year": 2016,
      "totalDividend": 2.84
    },
    {
      "year": 2017,
      "totalDividend": 2.84
    },
    {
      "year": 2018,
      "totalDividend": 2.84
    },
    {
      "year": 2019,
      "totalDividend": 2.84
    },
    {
      "year": 2020,
      "totalDividend": 2.84
    },
    {
      "year": 2021,
      "totalDividend": 2.84
    },
    {
      "year": 2022,
      "totalDividend": 2.84
    },
    {
      "year": 2023,
      "totalDividend": 2.85
    },
    {
      "year": 2024,
      "totalDividend": 2.84
    },
    {
      "year": 2025,
      "totalDividend": 1.66
    }
  ],
  "dividendHistory": [
    {
      "year": 2024,
      "frequency": "quarterly",
      "totalAmount": 1.0,
      "payments": [
        {"period": 1, "amount": 0.24, "status": "paid", "label": "Q1"},
        {"period": 2, "amount": 0.25, "status": "paid", "label": "Q2"},
        {"period": 3, "amount": 0.25, "status": "paid", "label": "Q3"},
        {"period": 4, "amount": 0.25, "status": "paid", "label": "Q4"}
      ]
    },
    {
      "year": 2025,
      "frequency": "quarterly",
      "totalAmount": 0.51,
      "payments": [
        {"period": 1, "amount": 0.25, "status": "paid", "label": "Q1"},
        {"period": 2, "amount": 0.26, "status": "upcoming", "label": "Q2"},
        {"period": 3, "amount": 0, "status": "pending", "label": "Q3"},
        {"period": 4, "amount": 0, "status": "pending", "label": "Q4"}
      ]
    }
  ]
};

export const mockCandlestickData = [
  { date: '2024-01-01', open: 100, high: 110, low: 95, close: 105, volume: 1000000 },
  { date: '2024-01-02', open: 105, high: 115, low: 100, close: 112, volume: 1200000 },
  { date: '2024-01-03', open: 112, high: 118, low: 108, close: 115, volume: 980000 },
  // Add more mock data as needed
];