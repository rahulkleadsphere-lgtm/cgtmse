import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in CGTMSE Assist:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-dark-bg p-6 text-center text-text-primary">
          <div className="mb-4 rounded-full bg-red-500/10 p-3 text-red-400">
            <AlertTriangle size={32} />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-white">Something went wrong</h1>
          <p className="mb-6 max-w-md text-sm text-text-secondary">
            An unexpected error occurred in the application. Your conversation history is preserved in local storage.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-lg bg-cgtmse-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cgtmse-700"
          >
            <RefreshCw size={16} />
            Reload CGTMSE Assist
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
