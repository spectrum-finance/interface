import React, { FC, ReactNode, useEffect, useState } from 'react';

import { Error } from './Error';
import { Progress } from './Progress';
import { Success } from './Success';

export interface RequestProps {
  readonly request: Promise<any>;
  readonly progressContent: ReactNode | ReactNode[] | string;
  readonly errorContent: ReactNode | ReactNode[] | string;
  readonly successContent: ReactNode | ReactNode[] | string;
}

enum RequestState {
  PROGRESS,
  ERROR,
  SUCCESS,
}

export const Request: FC<RequestProps> = ({
  request,
  progressContent,
  errorContent,
  successContent,
}) => {
  const [requestState, setRequestState] = useState<RequestState>(
    RequestState.PROGRESS,
  );

  useEffect(() => {
    request
      .then(() => setRequestState(RequestState.SUCCESS))
      .catch(() => setRequestState(RequestState.ERROR));
  }, [request]);

  return (
    <>
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
