import React from 'react';

interface Strategy {
  name: string;
  direction: string;
  entry: number;
  stop: number;
  target: number;
  rr: string;
  winRate: number;
  source?: string;
}

interface AnalysisSummaryProps {
  strategies?: Strategy[];
  isLoading?: boolean;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ strategies, isLoading }) => {
  return (
    <div className="max-w-5xl mx-auto bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 mt-8">
      <h2 className="text-lg font-bold text-white mb-4">🧠 策略建議總結</h2>
      {isLoading ? (
        <div className="text-white/60 text-sm">分析中...</div>
      ) : !strategies || strategies.length === 0 ? (
        <div className="text-white/60 text-sm">目前無有效分析結果</div>
      ) : (
        <div className="space-y-6">
          {strategies.map((s, i) => (
            <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-white/80 text-base font-semibold">{s.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.direction === '多' ? 'bg-green-600' : 'bg-red-600'} text-white`}>{s.direction === '多' ? '看多' : '看空'}</span>
                <span className="text-xs text-white/60">勝率：{Math.round(s.winRate * 100)}%</span>
                {s.source && <span className="text-xs text-white/40">({s.source})</span>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-white/80 text-sm leading-relaxed">
                <div>建議進場價：<span className="font-mono">{s.entry}</span></div>
                <div>停損價：<span className="font-mono">{s.stop}</span></div>
                <div>目標價：<span className="font-mono">{s.target}</span></div>
                <div>損益比：<span className="font-mono">{s.rr}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisSummary; 