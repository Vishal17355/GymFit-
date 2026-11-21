import React, { Component, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';

class RouteErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <section role="alert" className="max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <h1 className="text-xl font-bold">This page could not be loaded</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">A connection issue or app update may have interrupted loading. Reload the page to try again.</p>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500">Reload page</button>
              <Link to="/" className="text-cyan-600 dark:text-cyan-400">Return home</Link>
            </div>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

export function RouteLoadingBoundary({ children }) {
  const { pathname } = useLocation();
  return (
    <RouteErrorBoundary key={pathname}>
      <Suspense fallback={
        <main role="status" aria-live="polite" className="min-h-screen flex items-center justify-center gap-3 p-6 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
          <span aria-hidden="true" className="h-5 w-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          Loading page…
        </main>
      }>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
}
