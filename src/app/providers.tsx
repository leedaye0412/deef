"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // 4xx는 재시도 금지, 네트워크/5xx만 2회 재시도
          const status = error?.status ?? 0;
          if (status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
