import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const typeClasses = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-info text-white',
    warning: 'bg-warning text-dark',
  };

  return (
    <div
      className={`toast show position-fixed top-0 end-0 m-3 ${typeClasses[type]}`}
      role="alert"
      style={{ zIndex: 9999, minWidth: '300px' }}
    >
      <div className="toast-header bg-transparent border-0 text-white">
        <strong className="me-auto">
          {type === 'success' && '✓ Success'}
          {type === 'error' && '✕ Error'}
          {type === 'info' && 'ℹ Info'}
          {type === 'warning' && '⚠ Warning'}
        </strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
};

export default Toast;

