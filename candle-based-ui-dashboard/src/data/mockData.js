export const mockPortfolioData = {
  "pnL": 11.10999899999996,
  "pnLPercent": 2.7331543144157093,
  "pnLWithDividend": 75.85999899999997,
  "pnLWithDividendPercent": 18.662205420398514,
  "totalDividend": 64.75000000000001,
  "totalDivPercent": 15.929051105982806,
  "lastDividendYield": 15.258620689655173,
  "ttmDividendYield": 14.00862068965517,
  "yieldOnCost": 15.675662339354812,
  "dividendFrequency": "monthly",
  "totalShares": 18,
  "totalInvestment": 406.490001,
  "totalValueToday": 417.59999999999997,
  "averageCost": 22.582777833333335,
  "yearlyDividends": [
    {
      "year": 2024,
      "totalDividend": 33.25
    },
    {
      "year": 2025,
      "totalDividend": 31.499999999999996
    }
  ],
  "dividendHistory": [
    {
      "year": 2024,
      "frequency": "monthly",
      "totalAmount": 3.071428571428571,
      "payments": [
        {"period": 1, "amount": 0.26785714285714285, "status": "paid", "label": "Jan"},
        {"period": 2, "amount": 0.26785714285714285, "status": "paid", "label": "Feb"},
        {"period": 3, "amount": 0.26785714285714285, "status": "paid", "label": "Mar"},
        {"period": 4, "amount": 0.26785714285714285, "status": "paid", "label": "Apr"},
        {"period": 5, "amount": 0.25, "status": "paid", "label": "May"},
        {"period": 6, "amount": 0.25, "status": "paid", "label": "Jun"},
        {"period": 7, "amount": 0.25, "status": "paid", "label": "Jul"},
        {"period": 8, "amount": 0.25, "status": "paid", "label": "Aug"},
        {"period": 9, "amount": 0.25, "status": "paid", "label": "Sep"},
        {"period": 10, "amount": 0.25, "status": "paid", "label": "Oct"},
        {"period": 11, "amount": 0.25, "status": "paid", "label": "Nov"},
        {"period": 12, "amount": 0.25, "status": "paid", "label": "Dec"}
      ]
    },
    {
      "year": 2025,
      "frequency": "monthly", 
      "totalAmount": 2.017857142857143,
      "payments": [
        {"period": 1, "amount": 0.295, "status": "paid", "label": "Jan"},
        {"period": 2, "amount": 0.295, "status": "paid", "label": "Feb"},
        {"period": 3, "amount": 0.295, "status": "paid", "label": "Mar"},
        {"period": 4, "amount": 0.275, "status": "paid", "label": "Apr"},
        {"period": 5, "amount": 0.295, "status": "paid", "label": "May"},
        {"period": 6, "amount": 0.295, "status": "paid", "label": "Jun"},
        {"period": 7, "amount": 0.26785714285714285, "status": "upcoming", "label": "Jul"},
        {"period": 8, "amount": 0, "status": "pending", "label": "Aug"},
        {"period": 9, "amount": 0, "status": "pending", "label": "Sep"},
        {"period": 10, "amount": 0, "status": "pending", "label": "Oct"},
        {"period": 11, "amount": 0, "status": "pending", "label": "Nov"},
        {"period": 12, "amount": 0, "status": "pending", "label": "Dec"}
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