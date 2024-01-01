import { Severity } from '@sentry/react';
import * as Sentry from '@sentry/react';

interface OperationError {
  readonly level: Severity;
  readonly error: Error;
}

const jsonReplacer = (_, value) =>
  typeof value === 'bigint' ? value.toString() : value;

export const captureOperationError = (
  error: Error | string,
  network: 'ergo',
  operation: string,
  candidate?: any,
  context?: object,
): void => {
  const message = typeof error === 'string' ? error : error.message;
  console.log('error: ', message);
  console.log('network: ', network);
  console.log('operation: ', operation);
  console.log('candidate: ', candidate);
  console.log('context: ', context);
  Sentry.captureMessage(message, {
    level: Severity.Critical,
    extra: {
      candidate: candidate
        ? JSON.stringify(candidate, jsonReplacer, 2)
        : undefined,
      context: context ? JSON.stringify(context, jsonReplacer, 2) : undefined,
      network,
      operation,
    },
  });
};

export const toSentryOperationError = (
  error: Error | string,
): OperationError => ({
  level: Severity.Critical,
  error: typeof error === 'string' ? new Error(error as string) : error,
});
