// Error Tracking Setup for Production
// Captures and logs errors with context for debugging

import { logger } from './logger';

interface ErrorContext {
  message: string;
  timestamp: string;
  source?: string;
  stack?: string;
  userId?: string;
  extra?: Record<string, unknown>;
}

class ErrorTracker {
  private errors: ErrorContext[] = [];
  private maxErrors = 100;

  /**
   * Track an error with optional context
   */
  track(error: Error | string, context?: Partial<ErrorContext>) {
    const errorContext: ErrorContext = {
      message: error instanceof Error ? error.message : error,
      timestamp: new Date().toISOString(),
      source: context?.source,
      stack: error instanceof Error ? error.stack : undefined,
      userId: context?.userId,
      extra: context?.extra,
    };

    // Store error in memory (limited)
    this.errors.push(errorContext);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error (always in production, filtered in dev via logger)
    logger.error(`[ErrorTracker] ${errorContext.message}`, {
      source: errorContext.source,
      timestamp: errorContext.timestamp,
    });

    // In production, you could send to external service here
    // e.g., Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService?.(errorContext);
    }
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit = 10): ErrorContext[] {
    return this.errors.slice(-limit);
  }

  /**
   * Clear stored errors
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Optional: Override this to send to external service
   */
  protected sendToExternalService?: (context: ErrorContext) => void;
}

// Global error tracker instance
export const errorTracker = new ErrorTracker();

/**
 * Setup global error handlers for production
 * Call this once at app initialization
 */
export function setupErrorTracking() {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    errorTracker.track(event.reason, {
      source: 'unhandledrejection',
    });
  });

  // Global errors
  window.addEventListener('error', (event) => {
    errorTracker.track(event.message, {
      source: event.filename || 'global',
      stack: event.error?.stack,
    });
  });

  // Console error capture in production
  if (process.env.NODE_ENV === 'production') {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      errorTracker.track(args[0], {
        source: 'console',
        extra: { args: args.slice(1) },
      });
      originalConsoleError.apply(console, args);
    };
  }

  logger.log('[ErrorTracking] Setup complete');
}

export default errorTracker;
