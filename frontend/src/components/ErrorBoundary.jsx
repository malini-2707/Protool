import React from 'react';

/**
 * React Error Boundary Component
 * Catches JavaScript errors in component trees
 * Prevents entire app from crashing
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="bg-red-100 border border border-red-400 text-red-700 px-4 py-6 rounded-lg max-w-md">
              <h2 className="text-lg font-bold text-red-900 mb-2">Something went wrong</h2>
              <p className="text-red-700 mb-4">
                An error occurred while loading this page.
              </p>
              <details className="text-left text-sm text-red-600">
                <summary className="cursor-pointer font-medium">Error details</summary>
                <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-auto">
                  {this.state.error && this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-auto">
                    {JSON.stringify(this.state.errorInfo, null, 2)}
                  </pre>
                )}
                <p className="mt-4 text-center font-medium text-red-800">Something went wrong. Please try again.</p>
              </details>
            </div>
          </div>
        </div>
      );
    }

    // Render children if there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;
