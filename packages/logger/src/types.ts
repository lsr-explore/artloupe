export interface LoggerConfig {
  level?: string;
  name?: string;
  pretty?: boolean;
  redact?: string[];
  serializers?: Record<string, (value: unknown) => unknown>;
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  correlationId?: string;
  [key: string]: unknown;
}

export interface ClientLogPayload {
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context?: LogContext;
  timestamp?: string;
}

export interface ServerLogResponse {
  success: boolean;
  message: string;
  timestamp: string;
}
