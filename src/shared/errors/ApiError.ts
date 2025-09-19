import { ApiErrorBody, ErrorCode } from "@/shared/types";

export class ApiError extends Error {
  code: ErrorCode;
  status: number;
  details?: unknown;

  constructor(message: string, code: ErrorCode, status = 500, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON(): ApiErrorBody {
    return { code: this.code, message: this.message, details: this.details };
  }
}
