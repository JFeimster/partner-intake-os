export type ApiErrorCode =
  | "BAD_REQUEST"
  | "CONFIG_ERROR"
  | "FORBIDDEN"
  | "INVALID_JSON"
  | "METHOD_NOT_ALLOWED"
  | "MISSING_AUTH"
  | "NOT_FOUND"
  | "SIGNATURE_INVALID"
  | "SIGNATURE_MISSING"
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR";

export type ApiErrorPayload = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
    fields?: string[];
    request_id: string;
  };
};

export class ApiError extends Error {
  statusCode: number;
  code: ApiErrorCode;
  details?: unknown;
  fields?: string[];

  constructor(statusCode: number, code: ApiErrorCode, message: string, options: { details?: unknown; fields?: string[] } = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = options.details;
    this.fields = options.fields;
  }
}

export function toApiErrorPayload(error: ApiError, requestId: string): ApiErrorPayload {
  return {
    ok: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
      fields: error.fields,
      request_id: requestId
    }
  };
}

export function normalizeUnknownError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  return new ApiError(
    500,
    "BAD_REQUEST",
    "The request could not be completed. Check the request shape and try again."
  );
}
