import pandas as pd
import numpy as np

class SMCAnalysis:
    """Smart Money Concepts (SMC) 技術分析"""
    
    def __init__(self):
        pass
    
    def identify_swing_points(self, df, swing_length=5):
        """
        識別擺動高點和低點
        
        Args:
            df: OHLCV數據
            swing_length: 擺動點識別週期
            
        Returns:
            tuple: (swing_highs, swing_lows)
        """
        highs = df['high'].values
        lows = df['low'].values
        
        swing_highs = []
        swing_lows = []
        
        for i in range(swing_length, len(highs) - swing_length):
            # 檢查是否為擺動高點
            is_swing_high = True
            for j in range(i - swing_length, i + swing_length + 1):
                if j != i and highs[j] >= highs[i]:
                    is_swing_high = False
                    break
            
            if is_swing_high:
                swing_highs.append((df.index[i], highs[i]))
            
            # 檢查是否為擺動低點
            is_swing_low = True
            for j in range(i - swing_length, i + swing_length + 1):
                if j != i and lows[j] <= lows[i]:
                    is_swing_low = False
                    break
            
            if is_swing_low:
                swing_lows.append((df.index[i], lows[i]))
        
        return swing_highs, swing_lows
    
    def identify_structure_breaks(self, df, swing_highs, swing_lows):
        """
        識別市場結構突破 (BOS - Break of Structure)
        
        Args:
            df: OHLCV數據
            swing_highs: 擺動高點列表
            swing_lows: 擺動低點列表
            
        Returns:
            dict: 結構突破信息
        """
        bos_signals = []
        
        if len(swing_highs) >= 2 and len(swing_lows) >= 2:
            # 檢查上升趨勢中的結構突破
            for i in range(1, len(swing_highs)):
                prev_high = swing_highs[i-1][1]
                current_high = swing_highs[i][1]
                
                if current_high > prev_high:
                    # 找到相應的低點突破
                    relevant_lows = [low for low in swing_lows if low[0] < swing_highs[i][0]]
                    if relevant_lows:
                        last_low = relevant_lows[-1][1]
                        # 檢查是否突破了前一個低點
                        recent_prices = df[df.index > swing_highs[i][0]]['low']
                        if len(recent_prices) > 0 and recent_prices.min() < last_low:
                            bos_signals.append({
                                'type': 'bullish_bos',
                                'time': swing_highs[i][0],
                                'price': swing_highs[i][1],
                                'description': '看漲結構突破'
                            })
            
            # 檢查下降趨勢中的結構突破
            for i in range(1, len(swing_lows)):
                prev_low = swing_lows[i-1][1]
                current_low = swing_lows[i][1]
                
                if current_low < prev_low:
                    # 找到相應的高點突破
                    relevant_highs = [high for high in swing_highs if high[0] < swing_lows[i][0]]
                    if relevant_highs:
                        last_high = relevant_highs[-1][1]
                        # 檢查是否突破了前一個高點
                        recent_prices = df[df.index > swing_lows[i][0]]['high']
                        if len(recent_prices) > 0 and recent_prices.max() > last_high:
                            bos_signals.append({
                                'type': 'bearish_bos',
                                'time': swing_lows[i][0],
                                'price': swing_lows[i][1],
                                'description': '看跌結構突破'
                            })
        
        return bos_signals
    
    def identify_order_blocks(self, df, swing_highs, swing_lows):
        """
        識別訂單區塊 (Order Blocks)
        
        Args:
            df: OHLCV數據
            swing_highs: 擺動高點列表
            swing_lows: 擺動低點列表
            
        Returns:
            list: 訂單區塊列表
        """
        order_blocks = []
        
        # 看漲訂單區塊：在擺動低點前的最後一根下跌蠟燭
        for swing_low in swing_lows:
            swing_time, swing_price = swing_low
            # 找到擺動點前的蠟燭
            before_swing = df[df.index < swing_time]
            if len(before_swing) > 0:
                # 找最後一根下跌蠟燭
                for i in range(len(before_swing) - 1, -1, -1):
                    candle = before_swing.iloc[i]
                    if candle['close'] < candle['open']:  # 下跌蠟燭
                        order_blocks.append({
                            'type': 'bullish_ob',
                            'time': before_swing.index[i],
                            'high': candle['high'],
                            'low': candle['low'],
                            'description': '看漲訂單區塊'
                        })
                        break
        
        # 看跌訂單區塊：在擺動高點前的最後一根上漲蠟燭
        for swing_high in swing_highs:
            swing_time, swing_price = swing_high
            # 找到擺動點前的蠟燭
            before_swing = df[df.index < swing_time]
            if len(before_swing) > 0:
                # 找最後一根上漲蠟燭
                for i in range(len(before_swing) - 1, -1, -1):
                    candle = before_swing.iloc[i]
                    if candle['close'] > candle['open']:  # 上漲蠟燭
                        order_blocks.append({
                            'type': 'bearish_ob',
                            'time': before_swing.index[i],
                            'high': candle['high'],
                            'low': candle['low'],
                            'description': '看跌訂單區塊'
                        })
                        break
        
        return order_blocks
    
    def identify_liquidity_zones(self, df, swing_highs, swing_lows):
        """
        識別流動性區域
        
        Args:
            df: OHLCV數據
            swing_highs: 擺動高點列表
            swing_lows: 擺動低點列表
            
        Returns:
            dict: 流動性區域信息
        """
        liquidity_zones = {
            'buy_side_liquidity': [],  # 買方流動性（阻力位上方）
            'sell_side_liquidity': []  # 賣方流動性（支撐位下方）
        }
        
        # 買方流動性：擺動高點上方
        for swing_high in swing_highs[-3:]:  # 只看最近3個高點
            liquidity_zones['buy_side_liquidity'].append({
                'price': swing_high[1],
                'time': swing_high[0],
                'type': 'resistance',
                'description': '買方流動性區域'
            })
        
        # 賣方流動性：擺動低點下方
        for swing_low in swing_lows[-3:]:  # 只看最近3個低點
            liquidity_zones['sell_side_liquidity'].append({
                'price': swing_low[1],
                'time': swing_low[0],
                'type': 'support',
                'description': '賣方流動性區域'
            })
        
        return liquidity_zones
    
    def generate_trading_signals(self, df, bos_signals, order_blocks, liquidity_zones):
        """
        基於SMC概念生成交易信號
        
        Args:
            df: OHLCV數據
            bos_signals: 結構突破信號
            order_blocks: 訂單區塊
            liquidity_zones: 流動性區域
            
        Returns:
            dict: 交易信號和建議
        """
        current_price = df['close'].iloc[-1]
        signals = {
            'buy_signals': [],
            'sell_signals': [],
            'market_bias': 'neutral',
            'key_levels': []
        }
        
        # 分析市場偏向
        recent_bos = [signal for signal in bos_signals if signal['time'] >= df.index[-50]]
        if recent_bos:
            bullish_bos = sum(1 for signal in recent_bos if signal['type'] == 'bullish_bos')
            bearish_bos = sum(1 for signal in recent_bos if signal['type'] == 'bearish_bos')
            
            if bullish_bos > bearish_bos:
                signals['market_bias'] = 'bullish'
            elif bearish_bos > bullish_bos:
                signals['market_bias'] = 'bearish'
        
        # 尋找買入信號
        for ob in order_blocks:
            if ob['type'] == 'bullish_ob':
                if ob['low'] <= current_price <= ob['high']:
                    signals['buy_signals'].append({
                        'type': 'order_block_entry',
                        'price': current_price,
                        'reason': '價格在看漲訂單區塊內，尋找買入機會',
                        'target': None,
                        'stop_loss': ob['low'] * 0.99
                    })
        
        # 尋找賣出信號
        for ob in order_blocks:
            if ob['type'] == 'bearish_ob':
                if ob['low'] <= current_price <= ob['high']:
                    signals['sell_signals'].append({
                        'type': 'order_block_entry',
                        'price': current_price,
                        'reason': '價格在看跌訂單區塊內，尋找賣出機會',
                        'target': None,
                        'stop_loss': ob['high'] * 1.01
                    })
        
        # 關鍵價格水平
        for zone_type, zones in liquidity_zones.items():
            for zone in zones:
                signals['key_levels'].append({
                    'price': zone['price'],
                    'type': zone['type'],
                    'description': zone['description']
                })
        
        return signals
    
    def analyze_smc(self, df):
        """
        完整的SMC分析
        
        Args:
            df: OHLCV數據
            
        Returns:
            dict: 完整的SMC分析結果
        """
        # 識別擺動點
        swing_highs, swing_lows = self.identify_swing_points(df)
        
        # 識別結構突破
        bos_signals = self.identify_structure_breaks(df, swing_highs, swing_lows)
        
        # 識別訂單區塊
        order_blocks = self.identify_order_blocks(df, swing_highs, swing_lows)
        
        # 識別流動性區域
        liquidity_zones = self.identify_liquidity_zones(df, swing_highs, swing_lows)
        
        # 生成交易信號
        trading_signals = self.generate_trading_signals(df, bos_signals, order_blocks, liquidity_zones)
        
        return {
            'swing_highs': swing_highs,
            'swing_lows': swing_lows,
            'bos_signals': bos_signals,
            'order_blocks': order_blocks,
            'liquidity_zones': liquidity_zones,
            'trading_signals': trading_signals
        }