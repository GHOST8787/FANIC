import pandas as pd
import numpy as np

class TechnicalIndicators:
    """技術指標計算類"""
    
    def __init__(self):
        pass
    
    def calculate_indicators(self, df, indicators_config):
        """
        計算技術指標
        
        Args:
            df (pandas.DataFrame): OHLCV數據
            indicators_config (dict): 指標配置
            
        Returns:
            pandas.DataFrame: 包含技術指標的數據框
        """
        df_result = df.copy()
        
        # 簡單移動平均線 (SMA)
        if "sma" in indicators_config:
            period = indicators_config["sma"]
            df_result[f'sma_{period}'] = self.sma(df['close'], period)
        
        # 指數移動平均線 (EMA)
        if "ema" in indicators_config:
            period = indicators_config["ema"]
            df_result[f'ema_{period}'] = self.ema(df['close'], period)
        
        # 相對強弱指標 (RSI)
        if "rsi" in indicators_config:
            period = indicators_config["rsi"]
            df_result['rsi'] = self.rsi(df['close'], period)
        
        # MACD
        if "macd" in indicators_config:
            macd_line, macd_signal, macd_hist = self.macd(df['close'])
            df_result['macd'] = macd_line
            df_result['macd_signal'] = macd_signal
            df_result['macd_hist'] = macd_hist
        
        # 布林通道 (Bollinger Bands)
        if "bb" in indicators_config:
            period = indicators_config["bb"]
            bb_upper, bb_middle, bb_lower = self.bollinger_bands(df['close'], period)
            df_result['bb_upper'] = bb_upper
            df_result['bb_middle'] = bb_middle
            df_result['bb_lower'] = bb_lower
        
        return df_result
    
    def sma(self, data, period):
        """簡單移動平均線"""
        return data.rolling(window=period).mean()
    
    def ema(self, data, period):
        """指數移動平均線"""
        return data.ewm(span=period).mean()
    
    def rsi(self, data, period=14):
        """相對強弱指標"""
        delta = data.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    def macd(self, data, fast=12, slow=26, signal=9):
        """MACD指標"""
        exp1 = data.ewm(span=fast).mean()
        exp2 = data.ewm(span=slow).mean()
        
        macd_line = exp1 - exp2
        macd_signal = macd_line.ewm(span=signal).mean()
        macd_hist = macd_line - macd_signal
        
        return macd_line, macd_signal, macd_hist
    
    def bollinger_bands(self, data, period=20, std_dev=2):
        """布林通道"""
        middle = data.rolling(window=period).mean()
        std = data.rolling(window=period).std()
        
        upper = middle + (std * std_dev)
        lower = middle - (std * std_dev)
        
        return upper, middle, lower
    
    def stochastic(self, high, low, close, k_period=14, d_period=3):
        """隨機指標"""
        lowest_low = low.rolling(window=k_period).min()
        highest_high = high.rolling(window=k_period).max()
        
        k_percent = 100 * ((close - lowest_low) / (highest_high - lowest_low))
        d_percent = k_percent.rolling(window=d_period).mean()
        
        return k_percent, d_percent
    
    def williams_r(self, high, low, close, period=14):
        """威廉指標"""
        highest_high = high.rolling(window=period).max()
        lowest_low = low.rolling(window=period).min()
        
        wr = -100 * ((highest_high - close) / (highest_high - lowest_low))
        
        return wr
    
    def cci(self, high, low, close, period=20):
        """順勢指標"""
        tp = (high + low + close) / 3
        sma_tp = tp.rolling(window=period).mean()
        mad = tp.rolling(window=period).apply(lambda x: np.mean(np.abs(x - x.mean())))
        
        cci = (tp - sma_tp) / (0.015 * mad)
        
        return cci
    
    def atr(self, high, low, close, period=14):
        """平均真實範圍"""
        high_low = high - low
        high_close = np.abs(high - close.shift())
        low_close = np.abs(low - close.shift())
        
        tr = np.maximum(high_low, np.maximum(high_close, low_close))
        atr = tr.rolling(window=period).mean()
        
        return atr
