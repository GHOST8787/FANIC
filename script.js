// 虛擬貨幣技術分析平台 JavaScript
class CryptoAnalysisPlatform {
    constructor() {
        this.basePrices = {
            'BTCUSDT': 43000,
            'ETHUSDT': 2600,
            'BNBUSDT': 315,
            'ADAUSDT': 0.52,
            'XRPUSDT': 0.61,
            'SOLUSDT': 98,
            'DOTUSDT': 7.2,
            'DOGEUSDT': 0.089,
            'AVAXUSDT': 37,
            'MATICUSDT': 0.85
        };
        
        this.cryptoNames = {
            'BTCUSDT': '比特幣 (BTC)',
            'ETHUSDT': '以太坊 (ETH)',
            'BNBUSDT': '幣安幣 (BNB)',
            'ADAUSDT': '卡爾達諾 (ADA)',
            'XRPUSDT': '瑞波幣 (XRP)',
            'SOLUSDT': '索拉納 (SOL)',
            'DOTUSDT': '波卡 (DOT)',
            'DOGEUSDT': '狗狗幣 (DOGE)',
            'AVAXUSDT': '雪崩 (AVAX)',
            'MATICUSDT': '多邊形 (MATIC)'
        };
        
        this.timeframes = {
            '1m': '1分鐘',
            '5m': '5分鐘',
            '15m': '15分鐘',
            '1h': '1小時',
            '4h': '4小時',
            '1d': '1天'
        };
        
        this.currentData = null;
        this.currentIndicators = {};
        this.refreshInterval = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateData();
        this.startAutoRefresh();
    }
    
    setupEventListeners() {
        // 選擇框變更事件
        document.getElementById('symbolSelect').addEventListener('change', () => this.updateData());
        document.getElementById('timeframeSelect').addEventListener('change', () => this.updateData());
        
        // 指標切換事件
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateChart());
        });
        
        // 滑桿變更事件
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueSpan = document.getElementById(e.target.id.replace('Period', 'Value'));
                if (valueSpan) {
                    valueSpan.textContent = e.target.value;
                }
                this.updateChart();
            });
        });
    }
    
    generateMockData(symbol, timeframe, limit = 500) {
        const basePrice = this.basePrices[symbol] || 1000;
        const volatility = 0.03;
        const data = [];
        
        // 計算時間間隔（分鐘）
        const intervals = { '1m': 1, '5m': 5, '15m': 15, '1h': 60, '4h': 240, '1d': 1440 };
        const intervalMinutes = intervals[timeframe] || 60;
        
        // 生成時間戳
        const now = new Date();
        const timestamps = [];
        for (let i = limit - 1; i >= 0; i--) {
            timestamps.push(new Date(now - i * intervalMinutes * 60000));
        }
        
        // 生成價格數據
        let currentPrice = basePrice;
        for (let i = 0; i < limit; i++) {
            const change = (Math.random() - 0.5) * volatility * currentPrice / 50;
            currentPrice = Math.max(currentPrice + change, currentPrice * 0.95);
            
            const open = i === 0 ? basePrice : data[i-1].close;
            const close = currentPrice;
            const high = Math.max(open, close) + Math.random() * Math.abs(close - open) * 0.3;
            const low = Math.min(open, close) - Math.random() * Math.abs(close - open) * 0.3;
            const volume = Math.random() * 10000 + 1000;
            
            data.push({
                timestamp: timestamps[i],
                open: parseFloat(open.toFixed(8)),
                high: parseFloat(high.toFixed(8)),
                low: parseFloat(low.toFixed(8)),
                close: parseFloat(close.toFixed(8)),
                volume: parseFloat(volume.toFixed(2))
            });
        }
        
        return data;
    }
    
    calculateIndicators(data) {
        const indicators = {};
        
        // SMA
        if (document.getElementById('smaCheck').checked) {
            const period = parseInt(document.getElementById('smaPeriod').value);
            indicators.sma = this.calculateSMA(data, period);
        }
        
        // EMA
        if (document.getElementById('emaCheck').checked) {
            const period = parseInt(document.getElementById('emaPeriod').value);
            indicators.ema = this.calculateEMA(data, period);
        }
        
        // RSI
        if (document.getElementById('rsiCheck').checked) {
            const period = parseInt(document.getElementById('rsiPeriod').value);
            indicators.rsi = this.calculateRSI(data, period);
        }
        
        // MACD
        if (document.getElementById('macdCheck').checked) {
            indicators.macd = this.calculateMACD(data);
        }
        
        // 布林通道
        if (document.getElementById('bbCheck').checked) {
            const period = parseInt(document.getElementById('bbPeriod').value);
            indicators.bb = this.calculateBollingerBands(data, period);
        }
        
        return indicators;
    }
    
    calculateSMA(data, period) {
        const sma = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                sma.push(null);
            } else {
                const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
                sma.push(sum / period);
            }
        }
        return sma;
    }
    
    calculateEMA(data, period) {
        const ema = [];
        const multiplier = 2 / (period + 1);
        
        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                ema.push(data[i].close);
            } else {
                ema.push((data[i].close - ema[i - 1]) * multiplier + ema[i - 1]);
            }
        }
        return ema;
    }
    
    calculateRSI(data, period) {
        const rsi = [];
        const gains = [];
        const losses = [];
        
        for (let i = 1; i < data.length; i++) {
            const change = data[i].close - data[i - 1].close;
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        for (let i = 0; i < data.length; i++) {
            if (i < period) {
                rsi.push(null);
            } else {
                const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
                const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
                const rs = avgGain / avgLoss;
                rsi.push(100 - (100 / (1 + rs)));
            }
        }
        return rsi;
    }
    
    calculateMACD(data) {
        const ema12 = this.calculateEMA(data, 12);
        const ema26 = this.calculateEMA(data, 26);
        const macdLine = ema12.map((val, i) => val && ema26[i] ? val - ema26[i] : null);
        const signalLine = this.calculateEMAFromArray(macdLine, 9);
        const histogram = macdLine.map((val, i) => val && signalLine[i] ? val - signalLine[i] : null);
        
        return { line: macdLine, signal: signalLine, histogram: histogram };
    }
    
    calculateEMAFromArray(values, period) {
        const ema = [];
        const multiplier = 2 / (period + 1);
        
        for (let i = 0; i < values.length; i++) {
            if (values[i] === null) {
                ema.push(null);
            } else if (i === 0 || ema[i - 1] === null) {
                ema.push(values[i]);
            } else {
                ema.push((values[i] - ema[i - 1]) * multiplier + ema[i - 1]);
            }
        }
        return ema;
    }
    
    calculateBollingerBands(data, period) {
        const sma = this.calculateSMA(data, period);
        const upper = [];
        const lower = [];
        
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                upper.push(null);
                lower.push(null);
            } else {
                const slice = data.slice(i - period + 1, i + 1);
                const mean = sma[i];
                const variance = slice.reduce((acc, item) => acc + Math.pow(item.close - mean, 2), 0) / period;
                const stdDev = Math.sqrt(variance);
                upper.push(mean + (stdDev * 2));
                lower.push(mean - (stdDev * 2));
            }
        }
        
        return { upper, middle: sma, lower };
    }
    
    generateTradingSignals(data, indicators) {
        const signals = {
            buySignals: [],
            sellSignals: [],
            marketBias: 'neutral',
            keyLevels: []
        };
        
        const latest = data[data.length - 1];
        
        // RSI 信號
        if (indicators.rsi) {
            const currentRSI = indicators.rsi[indicators.rsi.length - 1];
            if (currentRSI > 70) {
                signals.sellSignals.push('RSI超買區域，考慮賣出');
            } else if (currentRSI < 30) {
                signals.buySignals.push('RSI超賣區域，考慮買入');
            }
        }
        
        // MACD 信號
        if (indicators.macd) {
            const macdLine = indicators.macd.line[indicators.macd.line.length - 1];
            const signalLine = indicators.macd.signal[indicators.macd.signal.length - 1];
            if (macdLine > signalLine) {
                signals.buySignals.push('MACD黃金交叉，看漲信號');
            } else {
                signals.sellSignals.push('MACD死亡交叉，看跌信號');
            }
        }
        
        // 移動平均線信號
        if (indicators.sma) {
            const currentSMA = indicators.sma[indicators.sma.length - 1];
            if (latest.close > currentSMA) {
                signals.buySignals.push('價格高於SMA，趨勢看漲');
            } else {
                signals.sellSignals.push('價格低於SMA，趨勢看跌');
            }
        }
        
        // 布林通道信號
        if (indicators.bb) {
            const currentUpper = indicators.bb.upper[indicators.bb.upper.length - 1];
            const currentLower = indicators.bb.lower[indicators.bb.lower.length - 1];
            if (latest.close >= currentUpper) {
                signals.sellSignals.push('價格觸及布林上軌，可能回調');
            } else if (latest.close <= currentLower) {
                signals.buySignals.push('價格觸及布林下軌，可能反彈');
            }
        }
        
        // 計算支撐阻力位
        const highs = data.slice(-20).map(d => d.high);
        const lows = data.slice(-20).map(d => d.low);
        signals.keyLevels.push({
            type: '阻力',
            price: Math.max(...highs),
            description: '近期高點阻力位'
        });
        signals.keyLevels.push({
            type: '支撐',
            price: Math.min(...lows),
            description: '近期低點支撐位'
        });
        
        return signals;
    }
    
    updateData() {
        const symbol = document.getElementById('symbolSelect').value;
        const timeframe = document.getElementById('timeframeSelect').value;
        
        // 更新當前配對顯示
        document.getElementById('currentPair').textContent = 
            `${this.cryptoNames[symbol]} - ${this.timeframes[timeframe]}`;
        
        // 生成模擬數據
        this.currentData = this.generateMockData(symbol, timeframe);
        this.currentIndicators = this.calculateIndicators(this.currentData);
        
        this.updateChart();
        this.updateMarketInfo();
        this.updateIndicatorValues();
        this.updateTradingSignals();
    }
    
    updateChart() {
        if (!this.currentData) return;
        
        const data = this.currentData;
        const indicators = this.currentIndicators;
        
        // 準備蠟燭圖數據
        const candlestickTrace = {
            x: data.map(d => d.timestamp),
            open: data.map(d => d.open),
            high: data.map(d => d.high),
            low: data.map(d => d.low),
            close: data.map(d => d.close),
            type: 'candlestick',
            name: '價格',
            increasing: { line: { color: '#00d4aa' } },
            decreasing: { line: { color: '#ff4757' } }
        };
        
        const traces = [candlestickTrace];
        
        // 添加技術指標
        if (indicators.sma) {
            traces.push({
                x: data.map(d => d.timestamp),
                y: indicators.sma,
                type: 'scatter',
                mode: 'lines',
                name: `SMA(${document.getElementById('smaPeriod').value})`,
                line: { color: '#ffa502', width: 2 }
            });
        }
        
        if (indicators.ema) {
            traces.push({
                x: data.map(d => d.timestamp),
                y: indicators.ema,
                type: 'scatter',
                mode: 'lines',
                name: `EMA(${document.getElementById('emaPeriod').value})`,
                line: { color: '#3742fa', width: 2 }
            });
        }
        
        if (indicators.bb) {
            traces.push({
                x: data.map(d => d.timestamp),
                y: indicators.bb.upper,
                type: 'scatter',
                mode: 'lines',
                name: '布林上軌',
                line: { color: '#7bed9f', width: 1 }
            });
            traces.push({
                x: data.map(d => d.timestamp),
                y: indicators.bb.middle,
                type: 'scatter',
                mode: 'lines',
                name: '布林中軌',
                line: { color: '#70a1ff', width: 1, dash: 'dash' }
            });
            traces.push({
                x: data.map(d => d.timestamp),
                y: indicators.bb.lower,
                type: 'scatter',
                mode: 'lines',
                name: '布林下軌',
                line: { color: '#7bed9f', width: 1 }
            });
        }
        
        // 佈局設置
        const layout = {
            title: {
                text: document.getElementById('currentPair').textContent,
                font: { color: '#fafafa' }
            },
            paper_bgcolor: '#262730',
            plot_bgcolor: '#262730',
            font: { color: '#fafafa' },
            xaxis: {
                title: '時間',
                gridcolor: 'rgba(128,128,128,0.2)',
                rangeslider: { visible: false }
            },
            yaxis: {
                title: '價格 (USDT)',
                gridcolor: 'rgba(128,128,128,0.2)'
            },
            showlegend: true,
            legend: {
                orientation: 'h',
                y: 1.02,
                x: 0
            },
            margin: { t: 80, b: 50, l: 60, r: 60 }
        };
        
        // 創建圖表
        Plotly.newPlot('chartContainer', traces, layout, {
            responsive: true,
            displayModeBar: false
        });
    }
    
    updateMarketInfo() {
        if (!this.currentData) return;
        
        const latest = this.currentData[this.currentData.length - 1];
        const previous = this.currentData[this.currentData.length - 2];
        const priceChange = latest.close - previous.close;
        const priceChangePercent = (priceChange / previous.close) * 100;
        
        const marketData = document.getElementById('marketData');
        marketData.innerHTML = `
            <div class="price-metric">
                <span class="metric-label">當前價格</span>
                <span class="metric-value ${priceChange >= 0 ? 'price-change-positive' : 'price-change-negative'}">
                    $${latest.close.toFixed(8)}
                </span>
            </div>
            <div class="price-metric">
                <span class="metric-label">24h變化</span>
                <span class="metric-value ${priceChange >= 0 ? 'price-change-positive' : 'price-change-negative'}">
                    ${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%
                </span>
            </div>
            <div class="price-metric">
                <span class="metric-label">開盤價</span>
                <span class="metric-value">$${latest.open.toFixed(8)}</span>
            </div>
            <div class="price-metric">
                <span class="metric-label">最高價</span>
                <span class="metric-value">$${latest.high.toFixed(8)}</span>
            </div>
            <div class="price-metric">
                <span class="metric-label">最低價</span>
                <span class="metric-value">$${latest.low.toFixed(8)}</span>
            </div>
            <div class="price-metric">
                <span class="metric-label">成交量</span>
                <span class="metric-value">${latest.volume.toLocaleString()}</span>
            </div>
        `;
    }
    
    updateIndicatorValues() {
        if (!this.currentIndicators) return;
        
        let html = '';
        
        if (this.currentIndicators.sma) {
            const value = this.currentIndicators.sma[this.currentIndicators.sma.length - 1];
            if (value) {
                html += `<div class="price-metric">
                    <span class="metric-label">SMA(${document.getElementById('smaPeriod').value})</span>
                    <span class="metric-value">$${value.toFixed(8)}</span>
                </div>`;
            }
        }
        
        if (this.currentIndicators.ema) {
            const value = this.currentIndicators.ema[this.currentIndicators.ema.length - 1];
            html += `<div class="price-metric">
                <span class="metric-label">EMA(${document.getElementById('emaPeriod').value})</span>
                <span class="metric-value">$${value.toFixed(8)}</span>
            </div>`;
        }
        
        if (this.currentIndicators.rsi) {
            const value = this.currentIndicators.rsi[this.currentIndicators.rsi.length - 1];
            if (value) {
                const color = value > 70 ? 'price-change-negative' : value < 30 ? 'price-change-positive' : '';
                html += `<div class="price-metric">
                    <span class="metric-label">RSI(${document.getElementById('rsiPeriod').value})</span>
                    <span class="metric-value ${color}">${value.toFixed(2)}</span>
                </div>`;
            }
        }
        
        if (this.currentIndicators.macd) {
            const macdValue = this.currentIndicators.macd.line[this.currentIndicators.macd.line.length - 1];
            const signalValue = this.currentIndicators.macd.signal[this.currentIndicators.macd.signal.length - 1];
            if (macdValue && signalValue) {
                html += `<div class="price-metric">
                    <span class="metric-label">MACD</span>
                    <span class="metric-value">${macdValue.toFixed(6)}</span>
                </div>`;
                html += `<div class="price-metric">
                    <span class="metric-label">MACD信號</span>
                    <span class="metric-value">${signalValue.toFixed(6)}</span>
                </div>`;
            }
        }
        
        document.getElementById('indicatorValues').innerHTML = html;
    }
    
    updateTradingSignals() {
        if (!this.currentData || !this.currentIndicators) return;
        
        const signals = this.generateTradingSignals(this.currentData, this.currentIndicators);
        let html = '';
        
        // 市場偏向
        const biasColor = signals.marketBias === 'bullish' ? 'signal-buy' : 
                         signals.marketBias === 'bearish' ? 'signal-sell' : 'signal-neutral';
        html += `<div class="signal-item ${biasColor}">
            <strong>市場偏向:</strong> ${signals.marketBias.toUpperCase()}
        </div>`;
        
        // 買入信號
        if (signals.buySignals.length > 0) {
            html += '<div style="margin: 1rem 0; font-weight: bold; color: #28a745;">🟢 買入信號:</div>';
            signals.buySignals.forEach(signal => {
                html += `<div class="signal-item signal-buy">• ${signal}</div>`;
            });
        }
        
        // 賣出信號
        if (signals.sellSignals.length > 0) {
            html += '<div style="margin: 1rem 0; font-weight: bold; color: #dc3545;">🔴 賣出信號:</div>';
            signals.sellSignals.forEach(signal => {
                html += `<div class="signal-item signal-sell">• ${signal}</div>`;
            });
        }
        
        // 關鍵價格水平
        if (signals.keyLevels.length > 0) {
            html += '<div style="margin: 1rem 0; font-weight: bold; color: #ffc107;">🎯 關鍵價格水平:</div>';
            signals.keyLevels.forEach(level => {
                html += `<div class="signal-item signal-neutral">
                    ${level.type}: $${level.price.toFixed(8)} - ${level.description}
                </div>`;
            });
        }
        
        document.getElementById('tradingSignals').innerHTML = html;
    }
    
    startAutoRefresh() {
        // 每10分鐘自動刷新
        this.refreshInterval = setInterval(() => {
            this.updateData();
        }, 600000); // 600秒 = 10分鐘
    }
    
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    new CryptoAnalysisPlatform();
});