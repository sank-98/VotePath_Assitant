// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center bg-red-50 border-4 border-red-200 rounded-2xl m-4">
          <h2 className="text-2xl font-black text-red-900 uppercase tracking-tight mb-2 italic">Something went wrong</h2>
          <p className="text-red-700 font-bold mb-4">The application encountered an unexpected error.</p>
          <button
            className="px-6 py-2 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl border-2 border-red-700 shadow-bento-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
          {this.state.error && (
            <pre className="mt-8 p-4 bg-white border-2 border-red-100 rounded-lg text-left text-xs text-red-400 overflow-auto max-h-40">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
