"use client";

// Catches errors thrown in the root layout itself. It replaces the whole
// document, so it must render its own <html>/<body> and can't rely on the
// app's CSS being present — hence inline styles.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
            <p style={{ color: "#666", marginTop: "0.5rem" }}>
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                marginTop: "1rem",
                borderRadius: "0.75rem",
                border: 0,
                background: "#000",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                fontWeight: 700,
                cursor: "pointer",
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
