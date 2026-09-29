import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Catches JavaScript errors in child component tree, logs error information,
 * and displays an accessible, branded fallback UI instead of crashing the application.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-center font-display">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 shadow-inner">
              <AlertTriangle className="w-7 h-7" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-farmText mb-2">
              Something went wrong
            </h2>

            <p className="text-xs text-farmMuted mb-6 leading-relaxed">
              We encountered an issue loading this section. Please try refreshing or return to the marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-farmGreen-600 hover:bg-farmGreen-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                Try Again
              </button>

              <a
                href="/"
                className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 bg-white text-farmText text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
              >
                <Home className="w-3.5 h-3.5" aria-hidden="true" />
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
