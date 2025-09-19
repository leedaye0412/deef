import { ErrorCode } from "@/shared/types";

export const statusToCode = (status: number): ErrorCode => {
  if (status === 400) return ErrorCode.BAD_REQUEST;
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 403) return ErrorCode.FORBIDDEN;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status === 409) return ErrorCode.CONFLICT;
  if (status === 429) return ErrorCode.RATE_LIMITED;
  if (status >= 500) return ErrorCode.INTERNAL;
  return ErrorCode.INTERNAL;
};
