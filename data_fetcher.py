import requests
import pandas as pd
import numpy as np
from datetime import datetime
import streamlit as st

class CryptoDataFetcher:
    """虛擬貨幣數據獲取類"""
    
    def __init__(self):
        self.base_url = "https://api.binance.com/api/v3"
        
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
            st.error(f"網絡請求錯誤: {str(e)}")
            return None
        except Exception as e:
            st.error(f"數據處理錯誤: {str(e)}")
            return None
    
    def get_24h_ticker(self, symbol):
        """
        獲取24小時價格變動統計
        
        Args:
            symbol (str): 交易對符號
            
        Returns:
            dict: 24小時統計數據
        """
        try:
            url = f"{self.base_url}/ticker/24hr"
            params = {'symbol': symbol}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            st.error(f"獲取24h統計數據失敗: {str(e)}")
            return None
    
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
        try:
            url = f"{self.base_url}/ticker/price"
            params = {'symbol': symbol}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            return float(data['price'])
            
        except Exception as e:
            st.error(f"獲取當前價格失敗: {str(e)}")
            return None
