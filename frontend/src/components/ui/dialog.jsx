import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 animate-in fade-in zoom-in-95">
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 pb-4">
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export const DialogTitle = ({ children, className }) => {
  return (
    <h2 className={cn("text-xl font-semibold text-gray-900", className)}>
      {children}
    </h2>
  );
};

export const DialogContent = ({ children, className }) => {
  return (
    <div className={cn("px-6 pb-4", className)}>
      {children}
    </div>
  );
};

export const DialogFooter = ({ children, className }) => {
  return (
    <div className={cn("flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg", className)}>
      {children}
    </div>
  );
};
