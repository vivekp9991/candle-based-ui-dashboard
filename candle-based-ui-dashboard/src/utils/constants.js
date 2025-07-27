export const TIMEFRAMES = ['1D', '5D', '1M', '3M', '6M', '1Y', '2Y', '5Y', 'YTD', 'MAX'];

export const DIVIDEND_FREQUENCIES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUAL: 'half-yearly',
  ANNUAL: 'annually'
};

export const PAYMENT_STATUS = {
  PAID: 'paid',
  UPCOMING: 'upcoming',
  PENDING: 'pending'
};

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#22c55e',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#06b6d4'
};

export const API_ENDPOINTS = {
  STOCK_DATA: '/api/stocks',
  PORTFOLIO: '/api/portfolio',
  DIVIDENDS: '/api/dividends'
};