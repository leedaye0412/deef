import { ApiError } from "@shared/errors/ApiError";
import { ErrorCode } from "@shared/types";

const DEFAULT_TIMEOUT = 10_000;

function withTimeout(signal?: AbortSignal | null, ms = DEFAULT_TIMEOUT) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);

  if (signal) {
    signal.addEventListener("abort", () => ctrl.abort());
  }

  return { signal: ctrl.signal, clear: () => clearTimeout(id) };
}

export async function http<T>(
  url: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const { timeoutMs, ...rest } = init ?? {};
  const { signal, clear } = withTimeout(rest.signal, timeoutMs);

  try {
    const res = await fetch(url, {
      ...rest,
      signal,
      headers: { "Content-Type": "application/json", ...(rest.headers || {}) },
    });
    const text = await res.text(); // body를 한 번만 파싱하기 위해
    const json = text ? JSON.parse(text) : {};

    if (!res.ok) {
      const message = json?.message || res.statusText || "Request failed";
      throw new ApiError(
        message,
        (json?.code as ErrorCode) ?? ErrorCode.UPSTREAM,
        res.status,
        json?.details
      );
    }
    return json as T; // { data: ... } 형태 기대
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout", ErrorCode.UPSTREAM, 504);
    }
    throw error;
  } finally {
    clear();
  }
}
