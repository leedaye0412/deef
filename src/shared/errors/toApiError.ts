import { ApiError } from "./ApiError";
import { statusToCode } from "./map";
import { ErrorCode } from "@shared/types";

// 타입 가드 함수들
function hasStatus(obj: unknown): obj is { status: unknown } {
  return typeof obj === "object" && obj !== null && "status" in obj;
}

function isNumericStatus(status: unknown): status is number {
  return typeof status === "number" || (typeof status === "string" && !isNaN(Number(status)));
}

// Response 객체인지 확인하는 타입 가드
function isResponseLike(obj: unknown): obj is Response {
  return obj instanceof Response;
}

export const toApiError = (e: unknown): ApiError => {
  if (e instanceof ApiError) return e;

  // Response 객체를 던진 경우
  if (isResponseLike(e)) {
    return new ApiError("Upstream request failed", statusToCode(e.status), e.status, e);
  }

  // status 속성을 가진 객체를 던진 경우
  if (hasStatus(e) && isNumericStatus(e.status)) {
    const status = typeof e.status === "string" ? Number(e.status) : e.status;
    const safeStatus = isNaN(status) ? 500 : status;

    return new ApiError("Upstream request failed", statusToCode(safeStatus), safeStatus, e);
  }

  // Error 객체인 경우
  if (e instanceof Error) {
    return new ApiError(e.message || "Unexpected error", ErrorCode.INTERNAL, 500, e);
  }

  // 기본 케이스
  return new ApiError("Unexpected error", ErrorCode.INTERNAL, 500, e);
};
