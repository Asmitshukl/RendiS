import * as Sentry from "@sentry/nextjs";
export const dynamic = "force-dynamic";

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

/**
 * API route handler that triggers a controlled backend error for Sentry monitoring tests.
 *
 * Logs an informational message and then throws a `SentryExampleAPIError` to exercise Sentry's error capture from the backend.
 */
export function GET() {
  Sentry.logger.info("Sentry example API called");
  throw new SentryExampleAPIError(
    "This error is raised on the backend called by the example page.",
  );
}
