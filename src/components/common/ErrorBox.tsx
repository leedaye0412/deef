"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
};

export default function ErrorBox({
  title = "문제가 발생했어요",
  message = "잠시 후 다시 시도해 주세요.",
  onRetry,
  retryText = "다시 시도",
  className,
}: Props) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-3">
        <span>{message}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
            {retryText}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
