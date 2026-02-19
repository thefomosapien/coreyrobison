'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#F6F3EE', color: '#1A1814' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ color: '#6B6560', marginBottom: '1.5rem' }}>An unexpected error occurred.</p>
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.25rem',
                background: '#C8553D',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
