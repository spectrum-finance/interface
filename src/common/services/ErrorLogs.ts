import { Severity } from '@sentry/react';
import { saveAs } from 'file-saver';

const errorLogs: { meta: any; error: any }[] = [];

interface OperationError {
  readonly level: Severity;
  readonly error: Error;
}

export const toSentryOperationError = (
  error: Error | string,
): OperationError => ({
  level: Severity.Critical,
  error: typeof error === 'string' ? new Error(error as string) : error,
});

export const addErrorLog =
  (meta: any) =>
  (error: Error): void => {
    errorLogs.push({ meta, error: error?.message || error });
  };

export const downloadErrorLog = () => {
  saveAs(
    new Blob([JSON.stringify(errorLogs, null, 2)], {
      type: 'text/plain;charset=utf-8',
    }),
    'logs.txt',
  );
};
