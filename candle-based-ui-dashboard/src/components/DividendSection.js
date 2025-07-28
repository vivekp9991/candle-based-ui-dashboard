import React from 'react';
import { Calendar, DollarSign, TrendingUp, BarChart3, Clock, Target, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';
import { getStatusColor, getDotSize, getFrequencyLabel } from '../utils/helpers';

const DividendSection = ({ portfolioData }) => {
  // Don't render if no dividends
  if (!portfolioData?.hasDividends || portfolioData.totalDividend === 0) {
    return null;
  }

  const { dividendMetrics } = portfolioData;

  const DividendMetricCard = ({ title, value, subtitle, icon: Icon, bgColor, badge }) => (
    <div className={`${bgColor} rounded-lg p-3 text-white shadow-sm relative`}>
      {badge && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
          {badge}
        </div>
      )}
      <div className="flex items-center justify-between mb-1">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xs opacity-90">{title}</p>
      <p className="text-base sm:text-lg font-bold leading-tight">{value}</p>
      {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
    </div>
  );

  const DividendTimeline = () => {
    if (!portfolioData?.dividendHistory || portfolioData.dividendHistory.length === 0) {
      return null;
    }

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Dividend Payment History</h3>
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
        
        <div className="space-y-4">
          {portfolioData.dividendHistory.map((yearData) => (
            <div key={yearData.year} className="flex items-center gap-4">
              <div className="w-12 text-sm font-semibold text-gray-700 flex-shrink-0">
                {yearData.year}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 mr-3 min-w-[80px]">
                  {getFrequencyLabel(yearData.frequency)}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {yearData.payments.map((paymentData) => {
                    const isCurrentPeriod = yearData.year === new Date().getFullYear() && 
                      paymentData.status === 'upcoming';
                    return (
                      <div
                        key={paymentData.period}
                        className={`${getDotSize(yearData.frequency)} rounded-full ${getStatusColor(paymentData.status)} 
                          ${isCurrentPeriod ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                          transition-all duration-200 hover:scale-110 cursor-pointer flex items-center justify-center`}
                        title={`${paymentData.label} ${yearData.year}: ${
                          paymentData.amount > 0 ? formatCurrency(paymentData.amount) : 'Pending'
                        }`}
                      >
                        {yearData.frequency === 'annual' && (
                          <span className="text-xs font-bold text-white">A</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-sm text-gray-600 ml-auto font-medium">
                {formatCurrency(yearData.totalAmount)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Dividend History</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(portfolioData.dividendHistory.reduce((total, year) => 
                total + year.totalAmount, 0
              ))}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const DividendDateInfo = () => {
    if (!dividendMetrics?.exDividendDate) return null;

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Key Dividend Dates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-800">Last Ex-Dividend Date</h4>
            </div>
            <p className="text-lg font-bold text-blue-700">
              {formatDate(dividendMetrics.exDividendDate)}
            </p>
            <p className="text-xs text-blue-600">
              Last dividend payment date
            </p>
          </div>
          
          {dividendMetrics.nextExDividendDate && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-semibold text-green-800">Next Ex-Dividend Date</h4>
                <span className="bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  EST
                </span>
              </div>
              <p className="text-lg font-bold text-green-700">
                {formatDate(dividendMetrics.nextExDividendDate)}
              </p>
              <p className="text-xs text-green-600">
                Estimated based on frequency
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Primary Dividend Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <DividendMetricCard
          title="Total Dividends"
          value={formatCurrency(portfolioData.totalDividend)}
          subtitle={formatPercent(portfolioData.totalDivPercent) + " of investment"}
          icon={DollarSign}
          bgColor="bg-gradient-to-br from-green-500 to-green-600"
        />
        <DividendMetricCard
          title="Dividend Yield"
          value={formatPercent(dividendMetrics?.dividendYield || 0)}
          subtitle="Current annualized yield"
          icon={TrendingUp}
          bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <DividendMetricCard
          title="Trailing Dividend Yield"
          value={formatPercent(dividendMetrics?.trailingDividendYield || 0)}
          subtitle="TTM actual yield"
          icon={BarChart3}
          bgColor="bg-gradient-to-br from-teal-500 to-teal-600"
        />
        <DividendMetricCard
          title="Forward Dividend Yield"
          value={formatPercent(dividendMetrics?.forwardDividendYield || 0)}
          subtitle="Projected annual yield"
          icon={Target}
          bgColor="bg-gradient-to-br from-cyan-500 to-cyan-600"
        />
      </div>

      {/* Secondary Dividend Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <DividendMetricCard
          title="Dividend Per Share (DPS)"
          value={formatCurrency(dividendMetrics?.dividendPerShare || 0)}
          subtitle="Last dividend payment"
          icon={DollarSign}
          bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <DividendMetricCard
          title="Dividend Growth Rate"
          value={formatPercent(dividendMetrics?.dividendGrowthRate || 0)}
          subtitle="Year-over-year growth"
          icon={ArrowUpRight}
          bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
          badge={dividendMetrics?.dividendGrowthRate > 0 ? "GROWTH" : undefined}
        />
        <DividendMetricCard
          title="Dividend Frequency"
          value={getFrequencyLabel(portfolioData.dividendFrequency)}
          subtitle={`${portfolioData.summary?.dividendsFound || 0} payments found`}
          icon={Calendar}
          bgColor="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
      </div>

      {/* TTM Summary Card */}
      {dividendMetrics?.ttmDividendSum > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-green-800">Trailing Twelve Months (TTM)</h4>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(dividendMetrics.ttmDividendSum)}
              </p>
              <p className="text-sm text-green-600">
                Total dividends received in the last 12 months
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">Annualized Estimate</p>
              <p className="text-xl font-bold text-green-700">
                {formatCurrency(dividendMetrics.annualizedDividend || 0)}
              </p>
              <p className="text-xs text-green-600">
                Based on {getFrequencyLabel(portfolioData.dividendFrequency).toLowerCase()} frequency
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dividend Dates Information */}
      <DividendDateInfo />

      {/* Payment Timeline */}
      <DividendTimeline />

      {/* Additional Dividend Insights */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Dividend Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Payment Frequency:</span>
              <span className="text-sm font-semibold text-gray-900 capitalize">
                {getFrequencyLabel(portfolioData.dividendFrequency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Payments Found:</span>
              <span className="text-sm font-semibold text-gray-900">
                {portfolioData.summary?.dividendsFound || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Dividend as % of Total Return:</span>
              <span className="text-sm font-semibold text-gray-900">
                {portfolioData.pnLWithDividend > 0 ? 
                  formatPercent((portfolioData.totalDividend / portfolioData.pnLWithDividend) * 100) : 
                  "0.00%"
                }
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Yield on Cost:</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatPercent(dividendMetrics?.dividendYield || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Dividend Coverage Ratio:</span>
              <span className="text-sm font-semibold text-gray-900">
                {dividendMetrics?.dividendGrowthRate >= 0 ? "Stable" : "Declining"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Investment Grade:</span>
              <span className={`text-sm font-semibold ${
                dividendMetrics?.dividendYield > 3 ? 'text-green-700' : 
                dividendMetrics?.dividendYield > 1 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {dividendMetrics?.dividendYield > 3 ? "High Yield" : 
                 dividendMetrics?.dividendYield > 1 ? "Moderate Yield" : "Low Yield"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendSection;