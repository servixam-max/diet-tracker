// Error Tracking Setup for Production
// Lightweight error tracking without external dependencies

interface ErrorContext {
  userId?: string;
  component?: string;
  action?: string;
  extra?: Record<string, unknown>;
}

interface TrackedError {
  error: Error;
  context?: ErrorContext;
  timestamp: number;
}

class ErrorTracker {
  private errors: TrackedError[] = [];
  private maxErrors = 50;

  /**
   * Track an error with optional context
   */
  track(error: Error | string, context?: ErrorContext) {
    const trackedError: TrackedError = {
      error: error instanceof Error ? error : new Error(error),
      context,
      timestamp: Date.now(),
    };

    // Store error in memory (limited)
    this.errors.push(trackedError);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Always log in development
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorTracker]", trackedError.error, context);
    }

    // In production, send to external service
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(trackedError);
    }
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit = 10): TrackedError[] {
    return this.errors.slice(-limit);
  }

  /**
   * Clear stored errors
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Send to external service (override in production)
   */
  private sendToExternalService(error: TrackedError) {
    // TODO: Integrate with Sentry, LogRocket, or custom endpoint
    // Example: fetch('/api/log-error', { method: 'POST', body: JSON.stringify(error) })
    console.error("[Production Error]", error.error, error.context);
  }
}

// Global error tracker instance
export const errorTracker = new ErrorTracker();

/**
 * Setup global error handlers for production
 */
export function setupErrorTracking() {
  if (typeof window === "undefined") return;

  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
    errorTracker.track(event.reason, {
      action: "unhandledrejection",
    });
  });

  // Global errors
  window.addEventListener("error", (event) => {
    errorTracker.track(event.error || new Error(event.message), {
      action: "global_error",
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  // Capture console.error in production
  if (process.env.NODE_ENV === "production") {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] instanceof Error) {
        errorTracker.track(args[0], { action: "console_error" });
      }
      originalConsoleError.apply(console, args);
    };
  }

  console.log("[ErrorTracking] Setup complete");
}

export default errorTracker;
