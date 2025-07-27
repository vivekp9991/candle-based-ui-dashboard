import { mockPortfolioData } from './mockData';

export const getPortfolioData = (ticker) => {
  // In a real app, this would make an API call
  // For now, return mock data
  return mockPortfolioData;
};

export const getDefaultFormData = () => ({
  ticker: 'QQCL.TO',
  timeframe: '1D',
  quantity: 1,
  startDate: '2024-05-01',
  endDate: '2025-07-26'
});