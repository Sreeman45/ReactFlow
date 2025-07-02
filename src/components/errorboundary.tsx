import  { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
    // You can log this to an error reporting service if needed
  }

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-600 font-semibold">
          Something went wrong: {error?.message}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
