import React, { useEffect, useRef } from 'react';

interface StaticChartProps {
  className?: string;
}

const StaticChart: React.FC<StaticChartProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 模擬 K 線圖數據
    const generateMockData = () => {
      const data: Array<{
        time: number;
        open: number;
        high: number;
        low: number;
        close: number;
      }> = [];
      let price = 44000;
      const now = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const open = price + (Math.random() - 0.5) * 1000;
        const high = open + Math.random() * 500;
        const low = open - Math.random() * 500;
        const close = open + (Math.random() - 0.5) * 200;
        
        data.push({
          time: date.getTime() / 1000,
          open,
          high,
          low,
          close
        });
        
        price = close;
      }
      
      return data;
    };

    // 建立簡單的價格走勢圖
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const data = generateMockData();
    const prices = data.map(d => d.close);
    const labels = data.map((_, i) => `${i + 1}d`);

    // 繪製圖表
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // 設定樣式
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    
    // 計算縮放
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const range = maxPrice - minPrice;
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    
    // 繪製價格線
    ctx.beginPath();
    prices.forEach((price, index) => {
      const x = (index / (prices.length - 1)) * canvasWidth;
      const y = canvasHeight - ((price - minPrice) / range) * canvasHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // 填充區域
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.closePath();
    ctx.fill();
    
    // 繪製網格
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * canvasHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
    
    // 繪製價格標籤
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * canvasHeight;
      const price = maxPrice - (i / 4) * range;
      ctx.fillText(`$${price.toFixed(0)}`, canvasWidth - 10, y + 4);
    }
    
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📈 BTC/USDT 價格走勢
      </h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-auto border border-gray-200 rounded"
        />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded text-sm">
          <div className="text-green-600 font-medium">$44,123.45</div>
          <div className="text-green-500 text-xs">+2.34%</div>
        </div>
      </div>
    </div>
  );
};

export default StaticChart; 