"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

/**
 * Reports the provided error to Sentry and renders a generic Next.js error page.
 *
 * The component captures the `error` for reporting and returns an HTML document
 * containing Next.js's default error UI.
 *
 * @param error - The Error to report; may include an optional `digest` property.
 * @returns The error UI as an HTML document containing `NextError` with `statusCode` 0
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
