import { NextResponse } from "next/server";
import { ApiError } from "@shared/errors/ApiError";
import { toApiError } from "@shared/errors/toApiError";

type Handler<T> = (req: Request, ctx?: any) => Promise<T>;

export function withRoute<T>(handler: Handler<T>) {
  return async (req: Request, ctx?: any) => {
    try {
      const data = await handler(req, ctx);
      return NextResponse.json({ data });
    } catch (err) {
      const apiErr: ApiError = toApiError(err);
      // 서버 로그(이후 Sentry 연동 포인트)
      console.error("[API]", apiErr.code, apiErr.status, apiErr.message, apiErr.details);
      return NextResponse.json(apiErr.toJSON(), { status: apiErr.status });
    }
  };
}
