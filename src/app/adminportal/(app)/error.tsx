"use client";

/** Error boundary for portal pages: shows a clear failure state (distinct from empty data). */
export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="error-page" role="alert">
      <div className="error-code"><i className="bi bi-exclamation-triangle" aria-hidden="true" /></div>
      <h1>This page could not be loaded</h1>
      <p className="page-sub">
        The portal could not load the data for this page (for example, the database was unreachable). Nothing was changed.
        {error.digest && <> Reference: <span className="mono">{error.digest}</span></>}
      </p>
      <p className="mt-4"><button type="button" className="btn btn-primary" onClick={() => reset()}><i className="bi bi-arrow-clockwise" aria-hidden="true" /> Try again</button></p>
    </div>
  );
}
