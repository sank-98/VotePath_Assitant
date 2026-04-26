import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-red-50 border-4 border-slate-900 rounded-xl">
          <div className="p-4 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="text-red-600" size={48} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Something went wrong</h2>
          <p className="text-slate-600 font-bold mb-8 max-w-md mx-auto">
            The application encountered an unexpected error. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-bento-sm hover:shadow-none translate-y-[-2px] hover:translate-y-0"
          >
            <RefreshCcw size={18} /> Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
