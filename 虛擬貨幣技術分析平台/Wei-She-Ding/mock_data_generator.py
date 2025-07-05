import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

class MockDataGenerator:
    """模擬數據生成器"""
    
    def __init__(self):
        # 各種虛擬貨幣的基準價格
        self.base_prices = {
            "BTCUSDT": 43000,
            "ETHUSDT": 2600,
            "BNBUSDT": 315,
            "ADAUSDT": 0.52,
            "XRPUSDT": 0.61,
            "SOLUSDT": 98,
            "DOTUSDT": 7.2,
            "DOGEUSDT": 0.089,
            "AVAXUSDT": 37,
            "MATICUSDT": 0.85
        }
        
        # 波動率設定
        self.volatility = {
            "BTCUSDT": 0.03,
            "ETHUSDT": 0.04,
            "BNBUSDT": 0.035,
            "ADAUSDT": 0.05,
            "XRPUSDT": 0.045,
            "SOLUSDT": 0.06,
            "DOTUSDT": 0.05,
            "DOGEUSDT": 0.08,
            "AVAXUSDT": 0.055,
            "MATICUSDT": 0.06
        }
    
    def generate_kline_data(self, symbol, interval, limit=500):
        """
        生成模擬K線數據
        
        Args:
            symbol (str): 交易對符號
            interval (str): 時間間隔
            limit (int): 數據條數
            
        Returns:
            pandas.DataFrame: K線數據
        """
        # 設定時間間隔
        interval_minutes = {
            "1m": 1,
            "5m": 5,
            "15m": 15,
            "1h": 60,
            "4h": 240,
            "1d": 1440
        }
        
        minutes = interval_minutes.get(interval, 60)
        
        # 生成時間序列
        end_time = datetime.now()
        start_time = end_time - timedelta(minutes=minutes * limit)
        timestamps = pd.date_range(start=start_time, end=end_time, periods=limit)
        
        # 獲取基準價格和波動率
        base_price = self.base_prices.get(symbol, 1000)
        vol = self.volatility.get(symbol, 0.03)
        
        # 生成價格數據（使用隨機遊走模型）
        prices = []
        current_price = base_price
        
        for i in range(limit):
            # 隨機價格變動
            change = np.random.normal(0, vol * current_price / 100)
            current_price = max(current_price + change, current_price * 0.9)  # 防止價格過低
            prices.append(current_price)
        
        # 生成OHLCV數據
        data = []
        for i, price in enumerate(prices):
            # 開盤價（如果是第一條，使用基準價格）
            if i == 0:
                open_price = base_price
            else:
                open_price = prices[i-1]
            
            # 收盤價
            close_price = price
            
            # 高低價（在開盤和收盤價附近隨機生成）
            high_price = max(open_price, close_price) + random.uniform(0, abs(close_price - open_price) * 0.5)
            low_price = min(open_price, close_price) - random.uniform(0, abs(close_price - open_price) * 0.5)
            
            # 成交量（隨機生成）
            volume = random.uniform(1000, 10000) * (base_price / 1000)
            
            data.append({
                'timestamp': timestamps[i],
                'open': open_price,
                'high': high_price,
                'low': low_price,
                'close': close_price,
                'volume': volume
            })
        
        # 轉換為DataFrame
        df = pd.DataFrame(data)
        df.set_index('timestamp', inplace=True)
        
        return df
    
    def get_24h_ticker(self, symbol):
        """生成24小時統計數據"""
        base_price = self.base_prices.get(symbol, 1000)
        
        # 模擬24小時變化
        price_change = random.uniform(-base_price * 0.1, base_price * 0.1)
        price_change_percent = (price_change / base_price) * 100
        
        return {
            'symbol': symbol,
            'priceChange': f"{price_change:.2f}",
            'priceChangePercent': f"{price_change_percent:.2f}",
            'lastPrice': f"{base_price + price_change:.2f}",
            'volume': f"{random.uniform(10000, 100000):.2f}",
            'count': random.randint(50000, 200000)
        }
    
    def get_current_price(self, symbol):
        """獲取當前價格"""
        base_price = self.base_prices.get(symbol, 1000)
        # 添加小幅隨機變動
        current_price = base_price + random.uniform(-base_price * 0.02, base_price * 0.02)
        return current_price