# Cryptocurrency Technical Analysis Platform

## Overview

This is a Streamlit-based cryptocurrency technical analysis platform that provides real-time market data visualization and technical indicator analysis for major cryptocurrencies. The platform fetches data from Binance API and presents interactive charts with various technical indicators including moving averages, RSI, MACD, and Bollinger Bands.

## System Architecture

The application follows a modular architecture with clear separation of concerns:

- **Frontend**: Streamlit web application with interactive UI components
- **Data Layer**: Real-time cryptocurrency data fetching from Binance API
- **Analysis Layer**: Technical indicator calculations and chart rendering
- **Visualization**: Interactive Plotly charts for data presentation

## Key Components

### 1. Main Application (`app.py`)
- **Purpose**: Entry point and UI orchestration
- **Features**: Page configuration, component initialization, cryptocurrency selection interface
- **Caching**: Uses Streamlit's `@st.cache_resource` for performance optimization
- **Supported Assets**: 10 major cryptocurrencies (BTC, ETH, BNB, ADA, XRP, SOL, DOT, DOGE, AVAX, MATIC)
- **Timeframes**: Multiple intervals from 1-minute to 1-day

### 2. Data Fetcher (`data_fetcher.py`)
- **Purpose**: Cryptocurrency market data retrieval
- **API**: Binance REST API integration
- **Data Processing**: Converts raw API responses to structured pandas DataFrames
- **Error Handling**: Implements timeout and error handling for API requests
- **Data Types**: OHLCV (Open, High, Low, Close, Volume) with timestamp conversion

### 3. Technical Indicators (`technical_indicators.py`)
- **Purpose**: Financial indicator calculations
- **Indicators Supported**:
  - Simple Moving Average (SMA)
  - Exponential Moving Average (EMA)
  - Relative Strength Index (RSI)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
- **Configuration**: Flexible parameter configuration for each indicator

### 4. Chart Renderer (`chart_renderer.py`)
- **Purpose**: Interactive chart visualization
- **Library**: Plotly for dynamic, responsive charts
- **Chart Types**: Candlestick charts with technical overlays
- **Subplots**: Support for multiple indicator panels (RSI, MACD)
- **Styling**: Custom color scheme optimized for financial data visualization

## Data Flow

1. **User Input**: User selects cryptocurrency and timeframe via Streamlit sidebar
2. **Data Retrieval**: `CryptoDataFetcher` requests market data from Binance API
3. **Data Processing**: Raw JSON converted to pandas DataFrame with proper data types
4. **Indicator Calculation**: `TechnicalIndicators` computes selected technical indicators
5. **Visualization**: `ChartRenderer` creates interactive Plotly charts
6. **Display**: Streamlit renders the final dashboard with charts and controls

## External Dependencies

### Core Libraries
- **Streamlit**: Web application framework for rapid prototyping
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computations for indicator calculations
- **Plotly**: Interactive charting and visualization
- **Requests**: HTTP client for API communication

### External APIs
- **Binance API**: Real-time cryptocurrency market data
  - Endpoint: `https://api.binance.com/api/v3`
  - Rate Limits: Handled through request timeouts
  - No authentication required for public market data

## Deployment Strategy

### Local Development
- Run via `streamlit run app.py`
- Requires Python 3.7+ environment
- Dependencies managed through requirements file

### Production Considerations
- **Caching**: Streamlit resource caching for API responses
- **Error Handling**: Graceful degradation for API failures
- **Performance**: Optimized data fetching with configurable limits
- **Scalability**: Stateless design allows for easy horizontal scaling

### Environment Configuration
- No environment variables required for basic operation
- API endpoints configurable in `CryptoDataFetcher` class
- Chart styling and colors centralized in `ChartRenderer`

## Changelog

- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.