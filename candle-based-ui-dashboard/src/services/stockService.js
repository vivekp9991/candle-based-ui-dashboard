import api from './api';

export const stockService = {
  // Test if backend is reachable
  testConnection: async () => {
    try {
      const response = await api.get('/health');
      return response;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      throw error;
    }
  },

  // Backtest portfolio using your API
  backtestPortfolio: async (ticker, timeframe, quantity, startDate, endDate) => {
    try {
      console.log('Calling backtest API with:', { ticker, timeframe, quantity, startDate, endDate });
      
      const response = await api.post('/api/v1/backtest', {
        ticker,
        timeframe,
        quantity,
        startDate,
        endDate
      });
      
      return response;
    } catch (error) {
      console.error('Backtest API Error:', error);
      
      // Enhanced error information
      if (error.response) {
        // Server responded with error status
        throw new Error(`Server Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check if backend is running on port 3005.');
      } else {
        // Something else happened
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }
};