import { FC, ReactNode, useEffect } from 'react';
import { BehaviorSubject, filter, first, tap } from 'rxjs';

import { visibleNetworks } from '../../../../gateway/common/network';
import { Network } from '../../../../network/common/Network';

export const isSelectDefaultNetworkVisible$ = new BehaviorSubject<boolean>(
  false,
);

const manuallySelectedNetworkUpdate$ = new BehaviorSubject<
  Network<any, any> | undefined
>(undefined);

export const manuallySelectedNetwork$ = manuallySelectedNetworkUpdate$.pipe(
  filter(Boolean),
  first(),
  tap(() => isSelectDefaultNetworkVisible$.next(false)),
);

export const toggleSelectDefaultNetwork = (show: boolean) =>
  isSelectDefaultNetworkVisible$.next(show);

export interface SelectDefaultNetworkProps {
  readonly children?: ReactNode | ReactNode[] | string;
}

export const SelectDefaultNetwork: FC<SelectDefaultNetworkProps> = ({
  children,
}) => {
  useEffect(() => {
    const ergoNetwork = visibleNetworks.find((n) => n.name === 'ergo');
    manuallySelectedNetworkUpdate$.next(ergoNetwork);
  }, []);

  return <>{children}</>;
};
