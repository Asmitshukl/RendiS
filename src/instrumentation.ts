import * as Sentry from "@sentry/nextjs";

/**
 * Ensures the appropriate Sentry configuration module is loaded for the current NEXT_RUNTIME.
 *
 * Conditionally imports the server configuration when `NEXT_RUNTIME` is `"nodejs"` and the edge
 * configuration when `NEXT_RUNTIME` is `"edge"`.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
