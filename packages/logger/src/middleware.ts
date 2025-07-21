import type { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";

// Helper function to convert Headers to object
function headersToObject(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  (headers as any).forEach((value: string, key: string) => {
    result[key] = value;
  });
  return result;
}

// Next.js specific middleware for API routes
export const withLogging = (
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: {
    logRequest?: boolean;
    logResponse?: boolean;
    logErrors?: boolean;
  },
) => {
  const {
    logRequest = true,
    logResponse = true,
    logErrors = true,
  } = options || {};

  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    const requestLogger = logger.withContext({ requestId });

    try {
      if (logRequest) {
        requestLogger.info(
          {
            method: request.method,
            url: request.url,
            headers: headersToObject(request.headers),
          },
          "API Request started",
        );
      }

      const response = await handler(request);

      if (logResponse) {
        const duration = Date.now() - startTime;
        requestLogger.info(
          {
            statusCode: response.status,
            duration: `${duration}ms`,
            headers: headersToObject(response.headers),
          },
          "API Request completed",
        );
      }

      return response;
    } catch (error) {
      if (logErrors) {
        const duration = Date.now() - startTime;
        requestLogger.error(
          {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`,
          },
          "API Request failed",
        );
      }
      throw error;
    }
  };
};

// Utility function to log client-side events
export const logClientEvent = async (
  endpoint: string,
  payload: {
    level: "info" | "warn" | "error" | "debug";
    message: string;
    context?: Record<string, unknown>;
  },
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to log client event:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
