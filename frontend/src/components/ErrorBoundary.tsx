"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full bg-card border-2 border-rose-500/20 rounded-3xl p-8 text-center shadow-2xl shadow-rose-500/5 space-y-6">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-rose-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
                            <p className="text-muted-foreground">The InsightBRD+ engine encountered an unexpected error. Don't worry, your data is safe.</p>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center justify-center space-x-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                <span>Reload Application</span>
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center justify-center space-x-2 w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all"
                            >
                                <Home className="w-4 h-4" />
                                <span>Return to Dashboard</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.children;
    }
}

export default ErrorBoundary;
