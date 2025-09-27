import { ApiError } from "./ApiError";
import { statusToCode } from "./map";
import { ErrorCode } from "@shared/types";

export const toApiError = (e: unknown): ApiError => {
  if (e instanceof ApiError) return e;

  // fetch Response를 던진 경우 등
  if (e && typeof e === "object" && "status" in (e as any)) {
    const status = Number((e as any).status) || 500;
    return new ApiError("Upstream request failed", statusToCode(status), status, e);
  }

  // 기본
  return new ApiError("Unexpected error", ErrorCode.INTERNAL, 500, e);
};
