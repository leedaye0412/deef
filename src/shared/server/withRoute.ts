import { NextResponse } from "next/server";
import { ApiError } from "@shared/errors/ApiError";
import { toApiError } from "@shared/errors/toApiError";

// Next.js 15 App Router의 Route Handler 컨텍스트 타입
interface RouteContext {
  params: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

type Handler<T> = (req: Request, ctx: RouteContext) => Promise<T>;

export function withRoute<T>(handler: Handler<T>) {
  return async (req: Request, ctx: RouteContext) => {
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

// 컨텍스트가 필요 없는 핸들러를 위한 오버로드
type SimpleHandler<T> = (req: Request) => Promise<T>;

export function withSimpleRoute<T>(handler: SimpleHandler<T>) {
  return async (req: Request) => {
    try {
      const data = await handler(req);
      return NextResponse.json({ data });
    } catch (err) {
      const apiErr: ApiError = toApiError(err);
      console.error("[API]", apiErr.code, apiErr.status, apiErr.message, apiErr.details);
      return NextResponse.json(apiErr.toJSON(), { status: apiErr.status });
    }
  };
}
