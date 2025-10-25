"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "./utils";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...newToast, id }]);

    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const getTypeStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "max-w-sm w-full border rounded-lg p-4 shadow-lg",
        getTypeStyles(toast.type)
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {toast.title && (
            <div className="font-medium text-sm">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm mt-1">{toast.description}</div>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Простые функции для удобства использования
export const toast = {
  success: (title: string, description?: string) => {
    // Эта функция будет работать только внутри компонентов с ToastProvider
    console.log("Toast success:", title, description);
  },
  error: (title: string, description?: string) => {
    console.log("Toast error:", title, description);
  },
  info: (title: string, description?: string) => {
    console.log("Toast info:", title, description);
  },
};
