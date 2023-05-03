import { createContext, FC, ReactNode, useContext } from 'react';
import { BehaviorSubject } from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';

export interface ErrorBoundaryProps {
  readonly children?: ReactNode | ReactNode[] | string;
}

interface ErrorEvent {
  readonly id?: string;
  readonly message?: string;
  readonly timestamp?: number;
}

export interface ErrorEventContextType {
  readonly errorEvent?: ErrorEvent;
}

export const ErrorEventContext = createContext<ErrorEventContextType>({});

const errorEvent$ = new BehaviorSubject<undefined | ErrorEvent>(undefined);
export const setErrorEvent = (errorEvent: ErrorEvent) => {
  errorEvent$.next(errorEvent);
};

export const useErrorEvent = () => useContext(ErrorEventContext);

export const ErrorEventProvider: FC<ErrorBoundaryProps> = ({ children }) => {
  const [errorEvent] = useObservable(errorEvent$, [], undefined);

  return (
    <ErrorEventContext.Provider value={{ errorEvent }}>
      {children}
    </ErrorEventContext.Provider>
  );
};
