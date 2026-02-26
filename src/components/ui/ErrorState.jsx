import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-t2g-mist">
        <AlertCircle className="h-8 w-8 text-t2g-navy/60" />
      </div>
      <div className="space-y-2">
        <h3 className="font-heading text-xl font-semibold text-t2g-navy">{title}</h3>
        <p className="max-w-md font-body text-sm text-t2g-slate/80">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
