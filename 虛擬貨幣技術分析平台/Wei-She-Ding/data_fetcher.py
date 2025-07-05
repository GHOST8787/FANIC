import requests
import pandas as pd
import numpy as np
from datetime import datetime
import streamlit as st
from mock_data_generator import MockDataGenerator

class CryptoDataFetcher:
    """虛擬貨幣數據獲取類"""
    
    def __init__(self):
        self.base_url = "https://api.binance.com/api/v3"
        self.mock_generator = MockDataGenerator()
        self.use_mock_data = True  # 預設使用模擬數據
        
    def get_kline_data(self, symbol, interval, limit=500):
        """
        獲取K線數據
        
        Args:
            symbol (str): 交易對符號，如 'BTCUSDT'
            interval (str): 時間間隔，如 '1h', '1d'
            limit (int): 返回的數據條數，最大1000
            
        Returns:
            pandas.DataFrame: K線數據
        """
        # 檢查是否使用模擬數據
        if self.use_mock_data:
            return self.mock_generator.generate_kline_data(symbol, interval, limit)
        
        try:
            url = f"{self.base_url}/klines"
            params = {
                'symbol': symbol,
                'interval': interval,
                'limit': limit
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # 檢查API響應是否包含錯誤
            if isinstance(data, dict) and 'code' in data:
                st.warning("Binance API受地理位置限制，正在使用模擬數據進行展示")
                self.use_mock_data = True
                return self.mock_generator.generate_kline_data(symbol, interval, limit)
            
            if not data:
                return None
                
            # 轉換為DataFrame
            df = pd.DataFrame(data, columns=[
                'timestamp', 'open', 'high', 'low', 'close', 'volume',
                'close_time', 'quote_asset_volume', 'number_of_trades',
                'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
            ])
            
            # 數據類型轉換
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            for col in ['open', 'high', 'low', 'close', 'volume']:
                df[col] = df[col].astype(float)
                
            # 設置時間戳為索引
            df.set_index('timestamp', inplace=True)
            
            # 只保留需要的列
            df = df[['open', 'high', 'low', 'close', 'volume']]
            
            return df
            
        except requests.exceptions.RequestException as e:
            st.warning("網絡連接問題，正在使用模擬數據進行展示")
            self.use_mock_data = True
            return self.mock_generator.generate_kline_data(symbol, interval, limit)
        except Exception as e:
            st.warning("數據獲取錯誤，正在使用模擬數據進行展示")
            self.use_mock_data = True
            return self.mock_generator.generate_kline_data(symbol, interval, limit)
    
    def get_24h_ticker(self, symbol):
        """
        獲取24小時價格變動統計
        
        Args:
            symbol (str): 交易對符號
            
        Returns:
            dict: 24小時統計數據
        """
        if self.use_mock_data:
            return self.mock_generator.get_24h_ticker(symbol)
            
        try:
            url = f"{self.base_url}/ticker/24hr"
            params = {'symbol': symbol}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # 檢查API響應是否包含錯誤
            if isinstance(data, dict) and 'code' in data:
                self.use_mock_data = True
                return self.mock_generator.get_24h_ticker(symbol)
            
            return data
            
        except Exception as e:
            self.use_mock_data = True
            return self.mock_generator.get_24h_ticker(symbol)
    
    def get_symbol_info(self, symbol):
        """
        獲取交易對信息
        
        Args:
            symbol (str): 交易對符號
            
        Returns:
            dict: 交易對信息
        """
        try:
            url = f"{self.base_url}/exchangeInfo"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            for symbol_info in data['symbols']:
                if symbol_info['symbol'] == symbol:
                    return symbol_info
                    
            return None
            
        except Exception as e:
            st.error(f"獲取交易對信息失敗: {str(e)}")
            return None
    
    def get_current_price(self, symbol):
        """
        獲取當前價格
        
        Args:
            symbol (str): 交易對符號
            
        Returns:
            float: 當前價格
        """
        if self.use_mock_data:
            return self.mock_generator.get_current_price(symbol)
            
        try:
            url = f"{self.base_url}/ticker/price"
            params = {'symbol': symbol}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # 檢查API響應是否包含錯誤
            if isinstance(data, dict) and 'code' in data:
                self.use_mock_data = True
                return self.mock_generator.get_current_price(symbol)
            
            return float(data['price'])
            
        except Exception as e:
            self.use_mock_data = True
            return self.mock_generator.get_current_price(symbol)
