'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <h1 className="font-serif text-3xl mb-4">Something went wrong</h1>
        <p className="text-ink-light mb-6">An unexpected error occurred.</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
