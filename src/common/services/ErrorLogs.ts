import { Severity } from '@sentry/react';
import * as Sentry from '@sentry/react';
import { TxCandidate } from '@spectrumlabs/cardano-dex-sdk';

interface OperationError {
  readonly level: Severity;
  readonly error: Error;
}

const jsonReplacer = (_, value) =>
  typeof value === 'bigint' ? value.toString() : value;

export const captureOperationError = (
  error: Error | string,
  network: 'cardano' | 'ergo',
  operation: string,
  candidate?: TxCandidate,
  context?: object,
): void => {
  const message = typeof error === 'string' ? error : error.message;

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
