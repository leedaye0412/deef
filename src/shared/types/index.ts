export type ApiResponse<T> = {
  data: T;
};

export type ApiErrorBody = {
  code: ErrorCode;
  message: string;
  details?: unknown;
};

export enum ErrorCode {
  BAD_REQUEST = "BAD_REQUEST", // 클라이언트 요청 형식이 잘못되었거나 유효하지 않을 때 (400)
  UNAUTHORIZED = "UNAUTHORIZED", // 인증 정보가 없거나 잘못되어 권한이 없는 경우 (401)
  FORBIDDEN = "FORBIDDEN", // 인증은 되었으나 해당 리소스에 접근 권한이 없는 경우 (403)
  NOT_FOUND = "NOT_FOUND", // 요청한 리소스가 존재하지 않을 때 (404)
  CONFLICT = "CONFLICT", // 리소스 상태 충돌(중복 데이터, 버전 충돌 등)이 발생했을 때 (409)
  RATE_LIMITED = "RATE_LIMITED", // 요청 횟수가 제한을 초과했을 때 (429)
  INTERNAL = "INTERNAL", // 서버 내부에서 처리 중 알 수 없는 에러가 발생했을 때 (500)
  UPSTREAM = "UPSTREAM", // 외부 API(Supabase 등) 연동 과정에서 발생한 에러
  VALIDATION = "VALIDATION", // 스키마(Zod 등) 검증 실패로 인한 유효성 검사 에러
}
