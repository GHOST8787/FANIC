import React from 'react';

interface ErrorAlertProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onClose?: () => void;
  show?: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  type = 'error',
  onClose,
  show = true
}) => {
  if (!show) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300';
      case 'info':
        return 'bg-blue-500/10 border-blue-400/30 text-blue-300';
      default:
        return 'bg-red-500/10 border-red-400/30 text-red-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${getAlertStyles()} border rounded-xl p-4 shadow-xl backdrop-blur-md animate-slide-in`}>
      <div className="flex items-start gap-3">
        <div className="text-lg">{getIcon()}</div>
        <div className="flex-1">
          <div className="font-medium mb-1">
            {type === 'error' ? '載入失敗' : type === 'warning' ? '警告' : '提示'}
          </div>
          <div className="text-sm opacity-90">{message}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert; 