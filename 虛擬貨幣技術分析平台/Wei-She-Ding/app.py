import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime, timedelta
import time
from data_fetcher import CryptoDataFetcher
from technical_indicators import TechnicalIndicators
from chart_renderer import ChartRenderer
from smc_analysis import SMCAnalysis

# 設置頁面配置
st.set_page_config(
    page_title="虛擬貨幣技術分析平台",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 初始化組件
@st.cache_resource
def init_components():
    data_fetcher = CryptoDataFetcher()
    tech_indicators = TechnicalIndicators()
    chart_renderer = ChartRenderer()
    smc_analyzer = SMCAnalysis()
    return data_fetcher, tech_indicators, chart_renderer, smc_analyzer

data_fetcher, tech_indicators, chart_renderer, smc_analyzer = init_components()

# 主要虛擬貨幣列表
CRYPTOCURRENCIES = {
    "BTCUSDT": "比特幣 (BTC)",
    "ETHUSDT": "以太坊 (ETH)",
    "BNBUSDT": "幣安幣 (BNB)",
    "ADAUSDT": "卡爾達諾 (ADA)",
    "XRPUSDT": "瑞波幣 (XRP)",
    "SOLUSDT": "索拉納 (SOL)",
    "DOTUSDT": "波卡 (DOT)",
    "DOGEUSDT": "狗狗幣 (DOGE)",
    "AVAXUSDT": "雪崩 (AVAX)",
    "MATICUSDT": "多邊形 (MATIC)"
}

# 時間週期選項
TIMEFRAMES = {
    "1m": "1分鐘",
    "5m": "5分鐘",
    "15m": "15分鐘",
    "1h": "1小時",
    "4h": "4小時",
    "1d": "1天"
}

# 技術指標選項
INDICATORS = {
    "sma": "簡單移動平均線 (SMA)",
    "ema": "指數移動平均線 (EMA)",
    "rsi": "相對強弱指標 (RSI)",
    "macd": "MACD",
    "bb": "布林通道 (Bollinger Bands)",
    "volume": "成交量"
}

def main():
    # 主標題
    st.title("📈 虛擬貨幣技術分析平台")
    st.markdown("---")
    
    # 側邊欄控制
    with st.sidebar:
        st.header("⚙️ 設置")
        
        # 幣種選擇
        selected_symbol = st.selectbox(
            "選擇虛擬貨幣",
            options=list(CRYPTOCURRENCIES.keys()),
            format_func=lambda x: CRYPTOCURRENCIES[x],
            index=0
        )
        
        # 時間週期選擇
        selected_timeframe = st.selectbox(
            "選擇時間週期",
            options=list(TIMEFRAMES.keys()),
            format_func=lambda x: TIMEFRAMES[x],
            index=3  # 預設1小時
        )
        
        # 技術指標選擇
        st.subheader("技術指標")
        selected_indicators = {}
        
        # SMA設置
        if st.checkbox("簡單移動平均線 (SMA)", value=True):
            sma_period = st.slider("SMA週期", 5, 200, 20, key="sma")
            selected_indicators["sma"] = sma_period
            
        # EMA設置
        if st.checkbox("指數移動平均線 (EMA)"):
            ema_period = st.slider("EMA週期", 5, 200, 12, key="ema")
            selected_indicators["ema"] = ema_period
            
        # RSI設置
        show_rsi = st.checkbox("相對強弱指標 (RSI)", value=True)
        if show_rsi:
            rsi_period = st.slider("RSI週期", 5, 50, 14, key="rsi")
            selected_indicators["rsi"] = rsi_period
            
        # MACD設置
        show_macd = st.checkbox("MACD")
        if show_macd:
            selected_indicators["macd"] = True
            
        # 布林通道設置
        show_bb = st.checkbox("布林通道")
        if show_bb:
            bb_period = st.slider("布林通道週期", 10, 50, 20, key="bb")
            selected_indicators["bb"] = bb_period
            
        # 成交量
        show_volume = st.checkbox("成交量", value=True)
        if show_volume:
            selected_indicators["volume"] = True
            
        # SMC分析
        show_smc = st.checkbox("SMC 智能資金概念分析")
        if show_smc:
            selected_indicators["smc"] = True
            
        # 自動刷新設置（固定10分鐘）
        auto_refresh = True
        refresh_interval = 600  # 10分鐘 = 600秒
    
    # 主要內容區域
    col1, col2 = st.columns([3, 1])
    
    with col1:
        # 顯示當前選擇的幣種信息
        st.subheader(f"{CRYPTOCURRENCIES[selected_symbol]} - {TIMEFRAMES[selected_timeframe]}")
        
        # 創建圖表容器
        chart_container = st.empty()
        
    with col2:
        # 顯示市場信息
        st.subheader("市場信息")
        info_container = st.empty()
        
        # 顯示技術指標數值
        st.subheader("技術指標數值")
        indicators_container = st.empty()
        
        # 顯示交易信號
        st.subheader("交易信號")
        signals_container = st.empty()
    
    # 顯示數據來源提示
    if hasattr(data_fetcher, 'use_mock_data') and data_fetcher.use_mock_data:
        st.info("💡 目前使用模擬數據進行展示。這些數據具有真實的市場波動特性，可以完整展示平台功能。")
    
    # 數據加載和顯示
    try:
        # 獲取歷史數據
        with st.spinner("正在加載數據..."):
            df = data_fetcher.get_kline_data(selected_symbol, selected_timeframe, limit=500)
            
        if df is not None and not df.empty:
            # 計算技術指標
            df_with_indicators = tech_indicators.calculate_indicators(df, selected_indicators)
            
            # SMC分析
            smc_results = None
            if "smc" in selected_indicators:
                smc_results = smc_analyzer.analyze_smc(df_with_indicators)
            
            # 渲染圖表
            fig = chart_renderer.create_candlestick_chart(
                df_with_indicators, 
                selected_symbol, 
                selected_indicators,
                smc_results
            )
            
            # 顯示圖表
            with chart_container.container():
                st.plotly_chart(fig, use_container_width=True, height=600)
            
            # 顯示市場信息
            with info_container.container():
                latest_data = df_with_indicators.iloc[-1]
                current_price = latest_data['close']
                price_change = latest_data['close'] - latest_data['open']
                price_change_pct = (price_change / latest_data['open']) * 100
                
                # 價格信息
                st.metric(
                    label="當前價格",
                    value=f"${current_price:.2f}",
                    delta=f"{price_change_pct:.2f}%"
                )
                
                st.write(f"**開盤:** ${latest_data['open']:.2f}")
                st.write(f"**最高:** ${latest_data['high']:.2f}")
                st.write(f"**最低:** ${latest_data['low']:.2f}")
                st.write(f"**成交量:** {latest_data['volume']:,.0f}")
                
                # 24小時統計
                if len(df_with_indicators) >= 24:
                    daily_high = df_with_indicators.tail(24)['high'].max()
                    daily_low = df_with_indicators.tail(24)['low'].min()
                    st.write(f"**24h最高:** ${daily_high:.2f}")
                    st.write(f"**24h最低:** ${daily_low:.2f}")
            
            # 顯示技術指標數值
            with indicators_container.container():
                if "sma" in selected_indicators:
                    sma_value = latest_data.get(f'sma_{selected_indicators["sma"]}', 0)
                    st.write(f"**SMA({selected_indicators['sma']}):** ${sma_value:.2f}")
                    
                if "ema" in selected_indicators:
                    ema_value = latest_data.get(f'ema_{selected_indicators["ema"]}', 0)
                    st.write(f"**EMA({selected_indicators['ema']}):** ${ema_value:.2f}")
                    
                if "rsi" in selected_indicators:
                    rsi_value = latest_data.get('rsi', 0)
                    rsi_color = "🔴" if rsi_value > 70 else "🟢" if rsi_value < 30 else "🟡"
                    st.write(f"**RSI:** {rsi_value:.2f} {rsi_color}")
                    
                if "macd" in selected_indicators:
                    macd_value = latest_data.get('macd', 0)
                    macd_signal = latest_data.get('macd_signal', 0)
                    macd_hist = latest_data.get('macd_hist', 0)
                    st.write(f"**MACD:** {macd_value:.4f}")
                    st.write(f"**MACD信號:** {macd_signal:.4f}")
                    st.write(f"**MACD柱狀圖:** {macd_hist:.4f}")
                    
                if "bb" in selected_indicators:
                    bb_upper = latest_data.get('bb_upper', 0)
                    bb_lower = latest_data.get('bb_lower', 0)
                    st.write(f"**布林上軌:** ${bb_upper:.2f}")
                    st.write(f"**布林下軌:** ${bb_lower:.2f}")
                    
            # 顯示交易信號和買賣點
            with signals_container.container():
                if smc_results:
                    trading_signals = smc_results['trading_signals']
                    
                    # 市場偏向
                    bias_color = {"bullish": "🟢", "bearish": "🔴", "neutral": "🟡"}
                    st.write(f"**市場偏向:** {bias_color.get(trading_signals['market_bias'], '🟡')} {trading_signals['market_bias'].upper()}")
                    
                    # 買入信號
                    if trading_signals['buy_signals']:
                        st.write("**🟢 買入信號:**")
                        for signal in trading_signals['buy_signals']:
                            st.write(f"• {signal['reason']}")
                            if signal['stop_loss']:
                                st.write(f"  止損: ${signal['stop_loss']:.2f}")
                    
                    # 賣出信號
                    if trading_signals['sell_signals']:
                        st.write("**🔴 賣出信號:**")
                        for signal in trading_signals['sell_signals']:
                            st.write(f"• {signal['reason']}")
                            if signal['stop_loss']:
                                st.write(f"  止損: ${signal['stop_loss']:.2f}")
                    
                    # 關鍵價格水平
                    if trading_signals['key_levels']:
                        st.write("**🎯 關鍵價格水平:**")
                        for level in trading_signals['key_levels'][:5]:  # 只顯示前5個
                            level_type = "支撐" if level['type'] == 'support' else "阻力"
                            st.write(f"• {level_type}: ${level['price']:.2f}")
                
                # 傳統技術指標的買賣建議
                if "rsi" in selected_indicators:
                    rsi_value = latest_data.get('rsi', 50)
                    if rsi_value > 70:
                        st.write("**RSI建議:** 🔴 超買區域，考慮賣出")
                    elif rsi_value < 30:
                        st.write("**RSI建議:** 🟢 超賣區域，考慮買入")
                    else:
                        st.write("**RSI建議:** 🟡 中性區域，觀望")
                
                if "macd" in selected_indicators:
                    macd_value = latest_data.get('macd', 0)
                    macd_signal_value = latest_data.get('macd_signal', 0)
                    if macd_value > macd_signal_value:
                        st.write("**MACD建議:** 🟢 黃金交叉，看漲信號")
                    else:
                        st.write("**MACD建議:** 🔴 死亡交叉，看跌信號")
        
        else:
            st.error("無法獲取數據，請檢查網絡連接或稍後再試")
            
    except Exception as e:
        st.error(f"發生錯誤: {str(e)}")
        st.write("請檢查網絡連接或稍後再試")
    
    # 自動刷新功能
    if auto_refresh:
        time.sleep(refresh_interval)
        st.rerun()

if __name__ == "__main__":
    main()
