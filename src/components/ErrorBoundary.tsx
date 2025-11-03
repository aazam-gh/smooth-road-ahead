import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("Discover ErrorBoundary caught: ", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto p-6">
          <h2 className="text-lg font-semibold mb-2">Something went wrong.</h2>
          <p className="text-sm text-muted-foreground">Please refresh the page. If the issue persists, let us know.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
