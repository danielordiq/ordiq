// apps/web/src/components/ErrorBoundary.tsx
"use client";
import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError)
      return (
        <p className="text-red-600 py-4">
          Sorry, we couldn’t load the dashboard.
        </p>
      );
    return this.props.children;
  }
}
