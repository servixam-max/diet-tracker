"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          className="min-h-screen flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md w-full">
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">
                ¡Ups! Algo salió mal
              </h1>
              <p className="text-zinc-400">
                Ha ocurrido un error inesperado. No te preocupes, estamos trabajando en ello.
              </p>
            </motion.div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <motion.div
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 overflow-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm font-mono text-red-400 mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-xs text-zinc-500 overflow-x-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </motion.div>
            )}

            <div className="space-y-3">
              <motion.button
                onClick={this.handleRetry}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <RefreshCw className="w-5 h-5" />
                Intentar de nuevo
              </motion.button>

              <Link href="/dashboard" className="block">
                <motion.button
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Home className="w-5 h-5" />
                  Volver al inicio
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Hook for async error handling
export function useErrorHandler() {
  return {
    handleError: (error: Error, context?: string) => {
      console.error(`[Error${context ? ` - ${context}` : ""}]`, error);
      // TODO: Send to error tracking service
    },
  };
}
