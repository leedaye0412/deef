'use client';

import { AlertCircle } from 'lucide-react';

import { Alert, AlertTitle, AlertDescription } from '@shared/components/ui/alert';
import { Button } from '@shared/components/ui/button';

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
};

export default function ErrorBox({
  title = '문제가 발생했어요',
  message = '잠시 후 다시 시도해 주세요.',
  onRetry,
  retryText = '다시 시도',
}: Props) {
  return (
    <Alert variant="destructive" className="bg-black text-white md:mx-50">
      <AlertCircle className="h-4 w-4" aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-3">
        <span className="text-white">{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0 text-white"
          >
            {retryText}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
