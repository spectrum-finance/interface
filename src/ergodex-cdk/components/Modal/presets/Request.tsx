import React, { FC, ReactNode, useEffect, useState } from 'react';

import { Error } from './Error';
import { Progress } from './Progress';
import { Success } from './Success';

export interface RequestProps {
  readonly actionContent: (
    next: (request: Promise<any>) => void,
  ) => ReactNode | ReactNode[] | string;
  readonly progressContent: ReactNode | ReactNode[] | string;
  readonly errorContent: ReactNode | ReactNode[] | string;
  readonly successContent: ReactNode | ReactNode[] | string;
}

enum RequestState {
  ACTION,
  PROGRESS,
  ERROR,
  SUCCESS,
}

export const Request: FC<RequestProps> = ({
  progressContent,
  errorContent,
  successContent,
  actionContent,
}) => {
  const [requestState, setRequestState] = useState<RequestState>(
    RequestState.ACTION,
  );

  const handleRequest = (request: Promise<any>) => {
    setRequestState(RequestState.PROGRESS);
    request
      .then(() => setRequestState(RequestState.SUCCESS))
      .catch(() => setRequestState(RequestState.ERROR));
  };

  return (
    <>
      {requestState === RequestState.ACTION && actionContent(handleRequest)}
      {requestState === RequestState.PROGRESS && (
        <Progress content={progressContent} />
      )}
      {requestState === RequestState.ERROR && <Error content={errorContent} />}
      {requestState === RequestState.SUCCESS && (
        <Success content={successContent} />
      )}
    </>
  );
};
