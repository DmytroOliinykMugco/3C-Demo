import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-white rounded-lg shadow-lg px-4 py-3 min-w-[300px] animate-in slide-in-from-top",
        "border border-gray-200"
      )}
    >
      {type === 'success' && (
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
      )}
      <span className="text-sm font-medium text-gray-900">{message}</span>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
