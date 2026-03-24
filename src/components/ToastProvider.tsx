"use client";

import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          className: '',
          duration: 3000,
          style: {
            background: 'rgba(10, 10, 15, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          // Success toast style
          success: {
            style: {
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            },
            icon: '✅',
          },
          // Error toast style
          error: {
            style: {
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            },
            icon: '❌',
          },
          // Loading toast style
          loading: {
            style: {
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            },
            icon: '⏳',
          },
        }}
      />
      {children}
    </>
  );
}

// Toast helper functions
export const showToast = {
  success: (message: string, duration?: number) => {
    return toast.success(message, { duration: duration || 3000 });
  },
  error: (message: string, duration?: number) => {
    return toast.error(message, { duration: duration || 3000 });
  },
  loading: (message: string, duration?: number) => {
    return toast.loading(message, { duration: duration || 3000 });
  },
  info: (message: string, duration?: number) => {
    return toast(message, { duration: duration || 3000 });
  },
  promise: (
    promise: Promise<any>,
    msgs: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, msgs);
  },
};

// Auto-dismiss toasts after navigation
export function useAutoDismissToasts() {
  useEffect(() => {
    // Clear all toasts when navigating
    return () => {
      toast.dismiss();
    };
  }, []);
}
