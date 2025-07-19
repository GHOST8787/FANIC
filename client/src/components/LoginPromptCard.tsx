import React from 'react';

interface LoginPromptCardProps {
  title: string;
  description: string;
  icon: string;
  onLogin: () => void;
}

const LoginPromptCard: React.FC<LoginPromptCardProps> = ({
  title,
  description,
  icon,
  onLogin
}) => {
  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 drop-shadow-xl">
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-white/90 mb-2">{title}</h3>
        <p className="text-sm text-white/60 mb-6 leading-relaxed">{description}</p>
        
        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/10">
          <div className="text-white/80 font-medium mb-2">請登入以啟用分析功能</div>
          <div className="text-white/60 text-sm">登入後可查看完整分析內容</div>
        </div>
        
        <button
          onClick={onLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          立即登入
        </button>
      </div>
    </div>
  );
};

export default LoginPromptCard; 