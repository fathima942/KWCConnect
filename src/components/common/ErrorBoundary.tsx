import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorView } from './ErrorView';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * A standard Error Boundary component.
 * Note: Error Boundaries currently must be Class Components in React.
 * This is the only exception to the "Functional Components Only" rule.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorView />;
    }

    return this.props.children;
  }
}
