import { useState } from 'react';
import { stockService } from '../services/stockService';
import { mockPortfolioData } from '../data/mockData';

export const usePortfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzePortfolio = async (ticker, timeframe, quantity, startDate, endDate) => {
    if (!ticker || !startDate || !endDate) {
      setError('Please provide all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting portfolio analysis...');
      
      // Try to call the real API
      const result = await stockService.backtestPortfolio(
        ticker, 
        timeframe, 
        quantity, 
        startDate, 
        endDate
      );
      
      console.log('API Success:', result);
      setPortfolioData(result);
      
    } catch (err) {
      console.error('Portfolio analysis failed:', err);
      setError(err.message || 'Failed to analyze portfolio');
      
      // For development: Use mock data when API fails
      console.log('Using mock data for development...');
      setPortfolioData(mockPortfolioData);
      
    } finally {
      setLoading(false);
    }
  };

  const resetPortfolio = () => {
    setPortfolioData(null);
    setError(null);
  };

  return { 
    portfolioData, 
    loading, 
    error, 
    analyzePortfolio,
    resetPortfolio
  };
};