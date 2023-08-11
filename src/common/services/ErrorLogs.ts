import { saveAs } from 'file-saver';

const errorLogs: { meta: any; error: any }[] = [];

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
