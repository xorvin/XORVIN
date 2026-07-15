import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

interface Props {
  children?: ReactNode;
  /** Optional label for which section crashed — helps with error context */
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

/**
 * Global ErrorBoundary with:
 * - Error ID for support reference
 * - Production-safe error display (no stack traces in prod)
 * - Retry and home navigation
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId ?? 'UNKNOWN';
    
    // Log to console always
    console.error(`[ErrorBoundary][${errorId}]`, error, errorInfo);

    // In production: send to logging service if available
    if (import.meta.env.PROD) {
      // Example: window.Sentry?.captureException(error, { extra: { errorInfo, errorId } });
      // Add your preferred error tracking SDK here
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorId: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;
      const section = this.props.section;

      return (
        <div className="min-h-screen bg-xorvin-dark flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h1 className="heading-sm text-white mb-3">
              {section ? `${section} crashed` : 'Something went wrong'}
            </h1>
            <p className="text-white/60 mb-2 font-inter leading-relaxed">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            
            {this.state.errorId && (
              <p className="text-xs text-white/30 mb-6 font-mono">
                Reference: <span className="text-white/50">{this.state.errorId}</span>
              </p>
            )}

            {/* Dev-only: show error message */}
            {isDev && this.state.error && (
              <details className="bg-black/40 p-4 rounded-xl text-left mb-6 overflow-auto max-h-40 text-xs font-mono text-red-400 cursor-pointer">
                <summary className="text-red-300 mb-2 cursor-pointer">Error details (dev only)</summary>
                <pre className="whitespace-pre-wrap break-all">{this.state.error.toString()}</pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={this.handleReset} rightIcon={<RefreshCcw className="w-4 h-4" />}>
                Try Again
              </Button>
              <button
                onClick={this.handleGoHome}
                className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
