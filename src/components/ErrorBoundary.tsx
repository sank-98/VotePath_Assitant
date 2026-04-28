import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * PRODUCTION-GRADE ERROR BOUNDARY
 * 
 * Captures UI-level crashes within specific sections of the app, 
 * preventing the entire application from failing.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  /**
   * Updates state so the next render will show the fallback UI.
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Logs error information to the console or telemetry service.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error (Boundary):', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div 
          role="alert" 
          aria-live="assertive"
          className="p-8 border-4 border-slate-900 bg-white rounded-3xl shadow-bento text-center space-y-4"
        >
          <h2 className="text-2xl font-black uppercase tracking-tighter">Something went wrong</h2>
          <p className="text-slate-600 font-bold">We encountered an issue rendering this section. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
