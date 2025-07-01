import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

class ChartRenderer:
    """圖表渲染類"""
    
    def __init__(self):
        # 設置圖表主題顏色
        self.colors = {
            'up': '#00d4aa',      # 上漲蠟燭顏色（綠色）
            'down': '#ff4757',    # 下跌蠟燭顏色（紅色）
            'sma': '#ffa502',     # SMA線顏色（橙色）
            'ema': '#3742fa',     # EMA線顏色（藍色）
            'rsi': '#ff6b6b',     # RSI線顏色
            'macd': '#4834d4',    # MACD線顏色
            'signal': '#ff9ff3',  # 信號線顏色
            'volume': '#70a1ff',  # 成交量顏色
            'bb_upper': '#7bed9f', # 布林上軌
            'bb_lower': '#7bed9f', # 布林下軌
            'bb_middle': '#70a1ff' # 布林中軌
        }
    
    def create_candlestick_chart(self, df, symbol, indicators_config, smc_results=None):
        """
        創建蠟燭圖
        
        Args:
            df (pandas.DataFrame): 包含OHLCV和技術指標的數據
            symbol (str): 交易對符號
            indicators_config (dict): 指標配置
            smc_results (dict): SMC分析結果
            
        Returns:
            plotly.graph_objects.Figure: Plotly圖表對象
        """
        # 計算子圖數量
        subplot_count = 1  # 主圖（價格圖）
        subplot_titles = [f"{symbol} 價格走勢"]
        
        # 檢查是否需要RSI子圖
        if "rsi" in indicators_config:
            subplot_count += 1
            subplot_titles.append("RSI")
        
        # 檢查是否需要MACD子圖
        if "macd" in indicators_config:
            subplot_count += 1
            subplot_titles.append("MACD")
        
        # 檢查是否需要成交量子圖
        if "volume" in indicators_config:
            subplot_count += 1
            subplot_titles.append("成交量")
        
        # 創建子圖
        if subplot_count == 1:
            fig = go.Figure()
        else:
            # 設置子圖高度比例
            row_heights = [0.6]  # 主圖佔60%
            if "rsi" in indicators_config:
                row_heights.append(0.15)
            if "macd" in indicators_config:
                row_heights.append(0.15)
            if "volume" in indicators_config:
                row_heights.append(0.1)
            
            fig = make_subplots(
                rows=subplot_count,
                cols=1,
                shared_xaxes=True,
                vertical_spacing=0.05,
                subplot_titles=subplot_titles,
                row_heights=row_heights
            )
        
        # 主圖：蠟燭圖
        fig.add_trace(
            go.Candlestick(
                x=df.index,
                open=df['open'],
                high=df['high'],
                low=df['low'],
                close=df['close'],
                name="Price",
                increasing_line_color=self.colors['up'],
                decreasing_line_color=self.colors['down'],
                increasing_fillcolor=self.colors['up'],
                decreasing_fillcolor=self.colors['down']
            ),
            row=1, col=1
        )
        
        # 添加移動平均線
        if "sma" in indicators_config:
            period = indicators_config["sma"]
            if f'sma_{period}' in df.columns:
                fig.add_trace(
                    go.Scatter(
                        x=df.index,
                        y=df[f'sma_{period}'],
                        mode='lines',
                        name=f'SMA({period})',
                        line=dict(color=self.colors['sma'], width=2)
                    ),
                    row=1, col=1
                )
        
        if "ema" in indicators_config:
            period = indicators_config["ema"]
            if f'ema_{period}' in df.columns:
                fig.add_trace(
                    go.Scatter(
                        x=df.index,
                        y=df[f'ema_{period}'],
                        mode='lines',
                        name=f'EMA({period})',
                        line=dict(color=self.colors['ema'], width=2)
                    ),
                    row=1, col=1
                )
        
        # 添加布林通道
        if "bb" in indicators_config:
            if all(col in df.columns for col in ['bb_upper', 'bb_middle', 'bb_lower']):
                # 上軌
                fig.add_trace(
                    go.Scatter(
                        x=df.index,
                        y=df['bb_upper'],
                        mode='lines',
                        name='布林上軌',
                        line=dict(color=self.colors['bb_upper'], width=1),
                        opacity=0.7
                    ),
                    row=1, col=1
                )
                
                # 下軌
                fig.add_trace(
                    go.Scatter(
                        x=df.index,
                        y=df['bb_lower'],
                        mode='lines',
                        name='布林下軌',
                        line=dict(color=self.colors['bb_lower'], width=1),
                        fill='tonexty',
                        fillcolor='rgba(126, 237, 159, 0.1)',
                        opacity=0.7
                    ),
                    row=1, col=1
                )
                
                # 中軌
                fig.add_trace(
                    go.Scatter(
                        x=df.index,
                        y=df['bb_middle'],
                        mode='lines',
                        name='布林中軌',
                        line=dict(color=self.colors['bb_middle'], width=1, dash='dash'),
                        opacity=0.7
                    ),
                    row=1, col=1
                )
        
        current_row = 2
        
        # RSI子圖
        if "rsi" in indicators_config and 'rsi' in df.columns:
            fig.add_trace(
                go.Scatter(
                    x=df.index,
                    y=df['rsi'],
                    mode='lines',
                    name='RSI',
                    line=dict(color=self.colors['rsi'], width=2)
                ),
                row=current_row, col=1
            )
            
            # 添加RSI水平線
            fig.add_hline(y=70, line_dash="dash", line_color="red", opacity=0.7, row=current_row, col=1)
            fig.add_hline(y=30, line_dash="dash", line_color="green", opacity=0.7, row=current_row, col=1)
            fig.add_hline(y=50, line_dash="dash", line_color="gray", opacity=0.5, row=current_row, col=1)
            
            # 設置RSI Y軸範圍
            fig.update_yaxes(range=[0, 100], row=current_row, col=1)
            current_row += 1
        
        # MACD子圖
        if "macd" in indicators_config and all(col in df.columns for col in ['macd', 'macd_signal', 'macd_hist']):
            # MACD線
            fig.add_trace(
                go.Scatter(
                    x=df.index,
                    y=df['macd'],
                    mode='lines',
                    name='MACD',
                    line=dict(color=self.colors['macd'], width=2)
                ),
                row=current_row, col=1
            )
            
            # 信號線
            fig.add_trace(
                go.Scatter(
                    x=df.index,
                    y=df['macd_signal'],
                    mode='lines',
                    name='信號線',
                    line=dict(color=self.colors['signal'], width=2)
                ),
                row=current_row, col=1
            )
            
            # MACD柱狀圖
            colors = ['red' if x < 0 else 'green' for x in df['macd_hist']]
            fig.add_trace(
                go.Bar(
                    x=df.index,
                    y=df['macd_hist'],
                    name='MACD柱狀圖',
                    marker_color=colors,
                    opacity=0.7
                ),
                row=current_row, col=1
            )
            
            # 添加零軸線
            fig.add_hline(y=0, line_dash="dash", line_color="gray", opacity=0.5, row=current_row, col=1)
            current_row += 1
        
        # 成交量子圖
        if "volume" in indicators_config:
            # 計算成交量顏色（基於價格變化）
            volume_colors = []
            for i in range(len(df)):
                if df['close'].iloc[i] >= df['open'].iloc[i]:
                    volume_colors.append(self.colors['up'])
                else:
                    volume_colors.append(self.colors['down'])
            
            fig.add_trace(
                go.Bar(
                    x=df.index,
                    y=df['volume'],
                    name='成交量',
                    marker_color=volume_colors,
                    opacity=0.7
                ),
                row=current_row, col=1
            )
        
        # 更新佈局
        fig.update_layout(
            title=f"{symbol} 技術分析圖表",
            xaxis_title="時間",
            yaxis_title="價格 (USDT)",
            template="plotly_dark",
            height=600 if subplot_count == 1 else 800,
            showlegend=True,
            legend=dict(
                orientation="h",
                yanchor="bottom",
                y=1.02,
                xanchor="right",
                x=1
            ),
            margin=dict(t=100, b=50, l=50, r=50),
            xaxis_rangeslider_visible=False  # 隱藏下方的範圍滑塊
        )
        
        # 更新X軸格式
        fig.update_xaxes(
            type='date',
            tickformat='%H:%M\n%m-%d'
        )
        
        # 為每個子圖設置網格
        for i in range(1, subplot_count + 1):
            fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='rgba(128,128,128,0.2)', row=i, col=1)
            fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='rgba(128,128,128,0.2)', row=i, col=1)
        
        # 添加SMC標記
        if smc_results and "smc" in indicators_config:
            # 添加擺動高點和低點
            swing_highs = smc_results.get('swing_highs', [])
            swing_lows = smc_results.get('swing_lows', [])
            
            if swing_highs:
                swing_high_times = [sh[0] for sh in swing_highs]
                swing_high_prices = [sh[1] for sh in swing_highs]
                fig.add_trace(
                    go.Scatter(
                        x=swing_high_times,
                        y=swing_high_prices,
                        mode='markers',
                        name='擺動高點',
                        marker=dict(color='red', size=8, symbol='triangle-down'),
                        showlegend=True
                    ),
                    row=1, col=1
                )
            
            if swing_lows:
                swing_low_times = [sl[0] for sl in swing_lows]
                swing_low_prices = [sl[1] for sl in swing_lows]
                fig.add_trace(
                    go.Scatter(
                        x=swing_low_times,
                        y=swing_low_prices,
                        mode='markers',
                        name='擺動低點',
                        marker=dict(color='green', size=8, symbol='triangle-up'),
                        showlegend=True
                    ),
                    row=1, col=1
                )
            
            # 添加訂單區塊
            order_blocks = smc_results.get('order_blocks', [])
            for ob in order_blocks:
                color = 'rgba(0, 255, 0, 0.2)' if ob['type'] == 'bullish_ob' else 'rgba(255, 0, 0, 0.2)'
                fig.add_shape(
                    type="rect",
                    x0=ob['time'],
                    y0=ob['low'],
                    x1=df.index[-1],  # 延伸到圖表結束
                    y1=ob['high'],
                    fillcolor=color,
                    line=dict(color=color.replace('0.2', '0.8'), width=1),
                    row=1, col=1
                )
            
            # 添加流動性水平線
            liquidity_zones = smc_results.get('liquidity_zones', {})
            for zone_type, zones in liquidity_zones.items():
                color = 'yellow' if zone_type == 'buy_side_liquidity' else 'orange'
                for zone in zones:
                    fig.add_hline(
                        y=zone['price'],
                        line_dash="dot",
                        line_color=color,
                        opacity=0.7,
                        annotation_text=f"{zone['description']} (${zone['price']:.2f})",
                        annotation_position="right",
                        row=1, col=1
                    )
        
        return fig
    
    def create_heatmap(self, data, title="相關性熱力圖"):
        """創建相關性熱力圖"""
        correlation_matrix = data.corr()
        
        fig = go.Figure(data=go.Heatmap(
            z=correlation_matrix.values,
            x=correlation_matrix.columns,
            y=correlation_matrix.index,
            colorscale='RdYlBu',
            text=correlation_matrix.values,
            texttemplate="%{text:.2f}",
            textfont={"size": 10},
            hoverongaps=False
        ))
        
        fig.update_layout(
            title=title,
            template="plotly_dark",
            height=500
        )
        
        return fig
