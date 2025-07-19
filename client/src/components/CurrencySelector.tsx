import React from 'react';

export enum CurrencySymbol {
  BTCUSDT = 'BTCUSDT',
  ETHUSDT = 'ETHUSDT',
  SOLUSDT = 'SOLUSDT',
  MATICUSDT = 'MATICUSDT',
  BNBUSDT = 'BNBUSDT',
  XRPUSDT = 'XRPUSDT',
  DOGEUSDT = 'DOGEUSDT',
  ADAUSDT = 'ADAUSDT',
  AVAXUSDT = 'AVAXUSDT',
  DOTUSDT = 'DOTUSDT',
}

export enum TimeInterval {
  '1m' = '1m',
  '5m' = '5m',
  '15m' = '15m',
  '30m' = '30m',
  '1h' = '1h',
  '4h' = '4h',
  '1d' = '1d',
  '1w' = '1w',
}

interface Currency {
  symbol: CurrencySymbol;
  name: string;
  displayName: string;
}

interface TimeIntervalOption {
  value: TimeInterval;
  label: string;
}

interface CurrencySelectorProps {
  selectedCurrency: CurrencySymbol;
  selectedInterval: TimeInterval;
  onCurrencyChange: (symbol: CurrencySymbol) => void;
  onIntervalChange: (interval: TimeInterval) => void;
}

const currencies: Currency[] = [
  { symbol: CurrencySymbol.BTCUSDT, name: 'Bitcoin', displayName: 'BTC' },
  { symbol: CurrencySymbol.ETHUSDT, name: 'Ethereum', displayName: 'ETH' },
  { symbol: CurrencySymbol.SOLUSDT, name: 'Solana', displayName: 'SOL' },
  { symbol: CurrencySymbol.MATICUSDT, name: 'Polygon', displayName: 'MATIC' },
  { symbol: CurrencySymbol.BNBUSDT, name: 'Binance Coin', displayName: 'BNB' },
  { symbol: CurrencySymbol.XRPUSDT, name: 'Ripple', displayName: 'XRP' },
  { symbol: CurrencySymbol.DOGEUSDT, name: 'Dogecoin', displayName: 'DOGE' },
  { symbol: CurrencySymbol.ADAUSDT, name: 'Cardano', displayName: 'ADA' },
  { symbol: CurrencySymbol.AVAXUSDT, name: 'Avalanche', displayName: 'AVAX' },
  { symbol: CurrencySymbol.DOTUSDT, name: 'Polkadot', displayName: 'DOT' },
];

const timeIntervals: TimeIntervalOption[] = [
  { value: TimeInterval['1m'], label: '1分鐘' },
  { value: TimeInterval['5m'], label: '5分鐘' },
  { value: TimeInterval['15m'], label: '15分鐘' },
  { value: TimeInterval['30m'], label: '30分鐘' },
  { value: TimeInterval['1h'], label: '1小時' },
  { value: TimeInterval['4h'], label: '4小時' },
  { value: TimeInterval['1d'], label: '日線' },
  { value: TimeInterval['1w'], label: '週線' },
];

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  selectedInterval,
  onCurrencyChange,
  onIntervalChange
}) => {
  return (
    <div>
      <h3 className="text-base font-medium text-white/90 mb-4">
        🎛️ 圖表設定
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* 幣種選擇 */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            選擇幣種
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencySymbol)}
            className="w-full px-3 py-2 border border-white/20 bg-[#1e1e1e] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
          >
            {currencies.map((currency) => (
              <option key={currency.symbol} value={currency.symbol} className="bg-[#1e1e1e] text-white">
                {currency.displayName} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* 時間間隔選擇 */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            時間間隔
          </label>
          <select
            value={selectedInterval}
            onChange={(e) => onIntervalChange(e.target.value as TimeInterval)}
            className="w-full px-3 py-2 border border-white/20 bg-[#1e1e1e] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
          >
            {timeIntervals.map((interval) => (
              <option key={interval.value} value={interval.value} className="bg-[#1e1e1e] text-white">
                {interval.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 當前選擇顯示 */}
      <div className="mt-4 p-3 bg-[#1e1e1e] rounded-xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">
            當前顯示：{currencies.find(c => c.symbol === selectedCurrency)?.displayName} / {timeIntervals.find(i => i.value === selectedInterval)?.label}
          </span>
          <span className="text-blue-400 font-medium">
            {currencies.find(c => c.symbol === selectedCurrency)?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector; 