import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3, Search, Filter, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { TIMEFRAMES } from '../utils/constants';
import { getStatusColor, getDotSize, getFrequencyLabel } from '../utils/helpers';
import { mockPortfolioData } from '../data/mockData';
import { stockService } from '../services/stockService';

const CandleBasedDashboard = () => {
  const [ticker, setTicker] = useState('QQCL.TO');
  const [timeframe, setTimeframe] = useState('1W');
  const [quantity, setQuantity] = useState(10);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-07-26');
  const [showInputForm, setShowInputForm] = useState(true);
  const [analyzedTicker, setAnalyzedTicker] = useState('');
  const [autoHideForm, setAutoHideForm] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  const { portfolioData, loading, error, analyzePortfolio, resetPortfolio } = usePortfolio();

  // Use real data if available, otherwise use mock data
  const displayData = portfolioData || mockPortfolioData;
  
  // Create a safe version of displayData with default values
  const safeDisplayData = {
    pnL: displayData?.pnL ?? 0,
    pnLPercent: displayData?.pnLPercent ?? 0,
    pnLWithDividend: displayData?.pnLWithDividend ?? 0,
    pnLWithDividendPercent: displayData?.pnLWithDividendPercent ?? 0,
    totalDividend: displayData?.totalDividend ?? 0,
    totalDivPercent: displayData?.totalDivPercent ?? 0,
    lastDividendYield: displayData?.lastDividendYield ?? 0,
    ttmDividendYield: displayData?.ttmDividendYield ?? 0,
    yieldOnCost: displayData?.yieldOnCost ?? 0,
    dividendFrequency: displayData?.dividendFrequency ?? 'monthly',
    dividendFrequencyConfidence: displayData?.dividendFrequencyConfidence ?? 'medium',
    dividendFrequencyReason: displayData?.dividendFrequencyReason ?? 'Default',
    totalShares: displayData?.totalShares ?? 0,
    totalInvestment: displayData?.totalInvestment ?? 0,
    totalValueToday: displayData?.totalValueToday ?? 0,
    averageCost: displayData?.averageCost ?? 0,
    yearlyDividends: displayData?.yearlyDividends ?? [],
    dividendHistory: displayData?.dividendHistory ?? [],
    redCandlePeriods: displayData?.redCandlePeriods ?? 0,
    totalCandlePeriods: displayData?.totalCandlePeriods ?? 0,
    redCandleSuccessRate: displayData?.redCandleSuccessRate ?? 0,
    analysisPeriod: displayData?.analysisPeriod ?? {},
    dividendCalculationDetails: displayData?.dividendCalculationDetails ?? {}
  };

  // Debug logging
  useEffect(() => {
    console.log('🔍 Portfolio Data Debug:', {
      portfolioData: portfolioData,
      displayData: displayData,
      safeDisplayData: safeDisplayData,
      dividendHistoryExists: !!safeDisplayData.dividendHistory,
      dividendHistoryLength: safeDisplayData.dividendHistory?.length || 0,
      dividendFrequency: safeDisplayData.dividendFrequency
    });
  }, [portfolioData, displayData]);

  // Test backend connection on component mount
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        await stockService.testConnection();
        setConnectionStatus('connected');
      } catch (err) {
        console.log('Backend not reachable, using mock data');
        setConnectionStatus('disconnected');
      }
    };

    testBackendConnection();
  }, []);

  const handleAnalyze = async () => {
    setAnalyzedTicker(ticker);
    
    try {
      await analyzePortfolio(ticker, timeframe, quantity, startDate, endDate);
      
      if (autoHideForm && !error) {
        setShowInputForm(false);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2 text-xs">
      {connectionStatus === 'connected' ? (
        <>
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-green-600">Backend Connected</span>
        </>
      ) : connectionStatus === 'disconnected' ? (
        <>
          <AlertCircle className="w-3 h-3 text-orange-500" />
          <span className="text-orange-600">Using Mock Data</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-gray-500">Checking Connection...</span>
        </>
      )}
    </div>
  );

  const CompactCard = ({ title, value, subtitle, icon: Icon, trend, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-3 text-white shadow-sm`}>
      <div className="flex items-center justify-between mb-1">
        <Icon className="w-4 h-4" />
        {trend !== undefined && (
          trend >= 0 ? 
            <TrendingUp className="w-3 h-3 text-green-200" /> : 
            <TrendingDown className="w-3 h-3 text-red-200" />
        )}
      </div>
      <p className="text-xs opacity-90">{title}</p>
      <p className="text-base sm:text-lg font-bold leading-tight">{value}</p>
      {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
    </div>
  );

  const DividendTimeline = () => {
    console.log('📊 DividendTimeline Render Check:', {
      hasDividendHistory: !!safeDisplayData.dividendHistory,
      dividendHistoryLength: safeDisplayData.dividendHistory?.length || 0,
      dividendHistory: safeDisplayData.dividendHistory,
      totalDividend: safeDisplayData.totalDividend,
      dividendFrequency: safeDisplayData.dividendFrequency
    });

    // Check if we have meaningful dividend data
    const hasDividendData = safeDisplayData.dividendHistory && 
                           safeDisplayData.dividendHistory.length > 0;

    if (!hasDividendData) {
      console.log('⚠️ No dividend data to display');
      return (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">No Dividend Data</p>
              <p className="text-xs text-orange-600">
                {analyzedTicker || ticker} does not pay dividends or no dividend data was found for the selected period.
              </p>
            </div>
          </div>
        </div>
      );
    }

    console.log('✅ Rendering dividend timeline with data');

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Dividend Payment History</h3>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className="text-gray-600">
                Frequency: <span className="font-semibold text-blue-600">{safeDisplayData.dividendFrequency}</span>
              </span>
              {safeDisplayData.dividendFrequencyConfidence && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {safeDisplayData.dividendFrequencyConfidence} confidence
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Paid</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Upcoming</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">Pending</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {safeDisplayData.dividendHistory.map((yearData) => (
            <div key={yearData.year} className="flex items-center gap-3">
              <div className="w-10 text-xs font-semibold text-gray-700 flex-shrink-0">
                {yearData.year}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 mr-2">
                  {getFrequencyLabel(yearData.frequency)}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {yearData.payments?.map((paymentData) => {
                    // Determine dot color based on status
                    let dotColor = 'bg-gray-300'; // Default for pending
                    if (paymentData.status === 'paid') {
                      dotColor = 'bg-green-500';
                    } else if (paymentData.status === 'upcoming') {
                      dotColor = 'bg-yellow-500';
                    } else if (paymentData.status === 'not_eligible') {
                      dotColor = 'bg-gray-300';
                    }
                    
                    const isCurrentPeriod = yearData.year === 2025 && paymentData.period === 7;
                    return (
                      <div
                        key={paymentData.period}
                        className={`${getDotSize(yearData.frequency)} rounded-full ${dotColor} 
                          ${isCurrentPeriod ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                          transition-all duration-200 hover:scale-110 cursor-pointer flex items-center justify-center`}
                        title={`${paymentData.label} ${yearData.year}: ${
                          paymentData.amount > 0 ? formatCurrency(paymentData.amount) : 
                          paymentData.status === 'not_eligible' ? 'Not eligible (no shares)' : 'Pending'
                        }`}
                      >
                        {yearData.frequency === 'annually' && (
                          <span className="text-xs font-bold text-white">A</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-xs text-gray-600 ml-auto">
                {formatCurrency(yearData.payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Total Dividend History</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(safeDisplayData.dividendHistory.reduce((total, year) => 
                total + (year.payments?.reduce((yearTotal, payment) => yearTotal + (payment.amount || 0), 0) || 0), 0
              ))}
            </span>
          </div>
          
          {/* Analysis Info */}
          {safeDisplayData.dividendFrequencyReason && (
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Analysis:</span> {safeDisplayData.dividendFrequencyReason}
            </div>
          )}
          
          {/* Period Analysis */}
          {safeDisplayData.analysisPeriod?.actualDividendPeriods && (
            <div className="mt-1 text-xs text-gray-500">
              <span className="font-medium">Period:</span> {safeDisplayData.analysisPeriod.actualDividendPeriods} dividend periods, 
              {' '}{safeDisplayData.analysisPeriod.dividendPeriodsWithIncome} with income
            </div>
          )}
        </div>
      </div>
    );
  };

  const BacktestingInsights = () => {
    if (!safeDisplayData.redCandlePeriods) return null;

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50">
        <h3 className="text-sm font-bold text-gray-900 mb-2">Backtesting Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-center space-x-3 p-2 bg-purple-50/80 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900">Red Candle Success</p>
              <p className="text-sm font-bold text-purple-600">{formatPercent(safeDisplayData.redCandleSuccessRate)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-2 bg-indigo-50/80 rounded-lg">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900">Red Periods</p>
              <p className="text-sm font-bold text-indigo-600">
                {safeDisplayData.redCandlePeriods} / {safeDisplayData.totalCandlePeriods}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-2 bg-cyan-50/80 rounded-lg">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900">Analysis Period</p>
              <p className="text-sm font-bold text-cyan-600">
                {safeDisplayData.analysisPeriod?.durationMonths?.toFixed(1) || '0'} months
              </p>
            </div>
          </div>
        </div>
        
        {safeDisplayData.analysisPeriod?.timeframe && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Info className="w-3 h-3" />
              <span>
                Strategy: Buy {quantity} shares on each red {safeDisplayData.analysisPeriod.timeframe} candle 
                ({safeDisplayData.analysisPeriod.timeframe === '1W' ? 'weekly' : 
                  safeDisplayData.analysisPeriod.timeframe === '1M' ? 'monthly' : 'daily'} timeframe)
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-2 sm:p-3">
      <div className="max-w-6xl mx-auto space-y-3">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {analyzedTicker ? `${analyzedTicker} - Candle Analytics` : 'Candle-Based Financial Dashboard'}
              </h1>
              <p className="text-xs text-gray-600">Real-time candlestick & portfolio insights</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowInputForm(true)}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                Change Ticker
              </button>
              <ConnectionIndicator />
            </div>
          </div>
        </div>

        {/* Connection Status Warning */}
        {connectionStatus === 'disconnected' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">Backend Disconnected</p>
                <p className="text-xs text-orange-600">
                  Cannot connect to backend server at {process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}. 
                  Displaying mock data for demonstration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Analysis Error</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-blue-600">Analyzing portfolio... Please wait.</p>
            </div>
          </div>
        )}

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs">
            <details>
              <summary className="cursor-pointer font-medium">Debug Info</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify({
                  hasPortfolioData: !!portfolioData,
                  hasDividendHistory: !!safeDisplayData.dividendHistory,
                  dividendHistoryLength: safeDisplayData.dividendHistory?.length || 0,
                  totalDividend: safeDisplayData.totalDividend,
                  dividendFrequency: safeDisplayData.dividendFrequency,
                  redCandlePeriods: safeDisplayData.redCandlePeriods,
                  analysisPeriod: safeDisplayData.analysisPeriod
                }, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Input Form */}
        {showInputForm && (
          <>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                
                {/* Ticker Input */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ticker Symbol</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      className="w-full pl-7 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70"
                      placeholder="e.g., AAPL"
                    />
                  </div>
                </div>

                {/* Timeframe Dropdown */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Timeframe</label>
                  <div className="relative">
                    <Filter className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 appearance-none"
                    >
                      {TIMEFRAMES.map(tf => (
                        <option key={tf} value={tf}>{tf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70"
                    min="1"
                  />
                </div>

                {/* Start Date */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70"
                  />
                </div>

                {/* End Date */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70"
                  />
                </div>

                {/* Analyze Button */}
                <div className="sm:col-span-1">
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : 'Analyze'}
                  </button>
                </div>
              </div>
              
              {/* Auto-hide option */}
              <div className="mt-3 flex items-center justify-end">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoHideForm}
                    onChange={(e) => setAutoHideForm(e.target.checked)}
                    className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  Auto-hide form after analysis
                </label>
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-100">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="font-semibold text-blue-900">Ready to analyze:</span>
                <span className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono">{ticker}</span>
                <span className="text-blue-700">Period: {timeframe}</span>
                <span className="text-blue-700">Qty: {quantity}</span>
                <span className="text-blue-700">{startDate} to {endDate}</span>
              </div>
            </div>
          </>
        )}

        {/* Main Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <CompactCard
            title="Investment"
            value={formatCurrency(safeDisplayData.totalInvestment)}
            subtitle={`${safeDisplayData.totalShares} shares`}
            icon={DollarSign}
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <CompactCard
            title="Current Value"
            value={formatCurrency(safeDisplayData.totalValueToday)}
            subtitle={formatCurrency(safeDisplayData.averageCost) + " avg"}
            icon={BarChart3}
            trend={safeDisplayData.pnL}
            bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <CompactCard
            title="Capital P&L"
            value={formatCurrency(safeDisplayData.pnL)}
            subtitle={formatPercent(safeDisplayData.pnLPercent)}
            icon={TrendingUp}
            trend={safeDisplayData.pnL}
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <CompactCard
            title="Total Return"
            value={formatCurrency(safeDisplayData.pnLWithDividend)}
            subtitle={formatPercent(safeDisplayData.pnLWithDividendPercent)}
            icon={PieChart}
            trend={safeDisplayData.pnLWithDividend}
            bgColor="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
        </div>

        {/* Dividend Payment Timeline */}
        <DividendTimeline />

        {/* Dividend Details Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Dividend Analysis</h3>
          
          {/* Dividend Yields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
            <div className="flex items-center space-x-3 p-2 bg-green-50/80 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Last Dividend Yield</p>
                <p className="text-sm font-bold text-green-600">{formatPercent(safeDisplayData.lastDividendYield)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2 bg-teal-50/80 rounded-lg">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">TTM Dividend Yield</p>
                <p className="text-sm font-bold text-teal-600">{formatPercent(safeDisplayData.ttmDividendYield)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2 bg-amber-50/80 rounded-lg">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Yield on Cost</p>
                <p className="text-sm font-bold text-amber-600">{formatPercent(safeDisplayData.yieldOnCost)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2 bg-emerald-50/80 rounded-lg">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <PieChart className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Total Div Return</p>
                <p className="text-sm font-bold text-emerald-600">{formatPercent(safeDisplayData.totalDivPercent)}</p>
              </div>
            </div>
          </div>

          {/* Dividend Income Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-green-800">Total Dividend Income</span>
                <DollarSign className="w-3 h-3 text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-700">{formatCurrency(safeDisplayData.totalDividend)}</p>
              <p className="text-xs text-green-600">
                From {safeDisplayData.totalShares} shares
              </p>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-800">Average Dividend/Share</span>
                <BarChart3 className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-700">
                {safeDisplayData.totalShares > 0 ? 
                  formatCurrency(safeDisplayData.totalDividend / safeDisplayData.totalShares) : 
                  formatCurrency(0)
                }
              </p>
              <p className="text-xs text-blue-600">
                Per share earned
              </p>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-purple-800">Monthly Avg Income</span>
                <Calendar className="w-3 h-3 text-purple-600" />
              </div>
              <p className="text-lg font-bold text-purple-700">
                {safeDisplayData.analysisPeriod?.durationMonths > 0 ?
                  formatCurrency(safeDisplayData.totalDividend / safeDisplayData.analysisPeriod.durationMonths) :
                  formatCurrency(0)
                }
              </p>
              <p className="text-xs text-purple-600">
                {safeDisplayData.analysisPeriod?.durationMonths?.toFixed(1) || '0'} months period
              </p>
            </div>
          </div>
          
          {/* Investment Summary */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="text-center">
                <p className="text-gray-600 mb-1">Total Investment</p>
                <p className="font-bold text-gray-900">{formatCurrency(safeDisplayData.totalInvestment)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-1">Current Value</p>
                <p className="font-bold text-gray-900">{formatCurrency(safeDisplayData.totalValueToday)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-1">Total Shares</p>
                <p className="font-bold text-gray-900">{safeDisplayData.totalShares}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-1">Average Cost</p>
                <p className="font-bold text-gray-900">{formatCurrency(safeDisplayData.averageCost)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Backtesting Insights */}
        <BacktestingInsights />

        {/* Performance Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Performance Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center space-x-3 p-2 bg-blue-50/80 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Capital Growth</p>
                <p className="text-sm font-bold text-blue-600">{formatPercent(safeDisplayData.pnLPercent)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2 bg-emerald-50/80 rounded-lg">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Dividend Return</p>
                <p className="text-sm font-bold text-emerald-600">{formatPercent(safeDisplayData.totalDivPercent)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2 bg-purple-50/80 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Total Return</p>
                <p className="text-sm font-bold text-purple-600">{formatPercent(safeDisplayData.pnLWithDividendPercent)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandleBasedDashboard;