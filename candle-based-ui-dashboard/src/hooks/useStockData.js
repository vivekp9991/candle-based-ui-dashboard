import { useState, useEffect } from 'react';
import { stockService } from '../services/stockService';

export const useStockData = (ticker, timeframe) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) return;

    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await stockService.getStockData(ticker, timeframe);
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [ticker, timeframe]);

  return { data, loading, error };
};