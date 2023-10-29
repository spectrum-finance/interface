import { Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, ReactNode } from 'react';
import { BehaviorSubject, filter, first, tap } from 'rxjs';

import { visibleNetworks } from '../../../../gateway/common/network';
import { Network } from '../../../../network/common/Network';
import { useObservable } from '../../../hooks/useObservable';
import { SelectDefaultNetworkItem } from './SelectDefaultNetworkItem/SelectDefaultNetworkItem';

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
  const { valBySize } = useDevice();
  const [isSelectDefaultNetworkVisible] = useObservable(
    isSelectDefaultNetworkVisible$,
    [],
    false,
  );
  const onNetworkClick = (network: Network<any, any>) => {
    manuallySelectedNetworkUpdate$.next(network);
  };

  if (isSelectDefaultNetworkVisible) {
    return (
      <Flex width="100%" stretch justify="center" style={{ padding: '1rem' }}>
        <Flex.Item
          display="flex"
          marginTop={valBySize(10, 38)}
          /* width={750} */
          align="center"
          width="100%"
          maxWidth={700}
          col
        >
          <Typography.Title level={2}>
            <Trans>Select Network</Trans>
          </Typography.Title>
          <Flex.Item marginTop={valBySize(5, 10)} display="flex" width="100%">
            {visibleNetworks.map((network, index) => (
              <Flex.Item
                marginRight={
                  index !== visibleNetworks.length - 1 ? valBySize(5, 10) : 0
                }
                onClick={() => onNetworkClick(network)}
                key={network.label}
                flex={1}
              >
                <SelectDefaultNetworkItem network={network} />
              </Flex.Item>
            ))}
          </Flex.Item>
        </Flex.Item>
      </Flex>
    );
  }

  return <>{children}</>;
};
