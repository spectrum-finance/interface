import { Flex, useDevice } from '@ergolabs/ui-kit';
import { forwardRef } from 'react';
import styled from 'styled-components';

import { device } from '../../../../common/constants/size';
import { useObservable } from '../../../../common/hooks/useObservable';
import { selectedWalletState$ } from '../../../../gateway/api/wallets';
import { WalletState } from '../../../../network/common/Wallet';
import { Navigation } from '../Header/Navigation/Navigation';
import { OperationsHistory } from '../OperationsHistory/OperationsHistory';

export const BottomContainer = styled.div<{ ref: any }>`
  z-index: 2;
  position: fixed;
  bottom: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  right: 0;
  left: 0;
  background: var(--spectrum-box-bg-secondary-glass);
  backdrop-filter: var(--spectrum-box-bg-filter);
  border-top: 1px var(--spectrum-box-border-color) solid;

  ${device.m} {
    left: auto;
    right: 50%;
    transform: translate(50%, 0);
    background: none;
    border-top: 0;
  }
`;
// eslint-disable-next-line react/display-name
export const FooterNavigation = forwardRef<HTMLDivElement>((_, ref) => {
  const { s, m } = useDevice();
  const [walletState] = useObservable(selectedWalletState$);

  if (!(s || m)) {
    return null;
  }

  return (
    <BottomContainer ref={ref}>
      {s && (
        <Flex>
          <Flex.Item marginLeft={4} marginRight={4} flex={1}>
            <Navigation textCenter />
          </Flex.Item>
          {walletState === WalletState.CONNECTED && (
            <Flex.Item marginRight={4}>
              <OperationsHistory />
            </Flex.Item>
          )}
        </Flex>
      )}
      {m && <Navigation />}
    </BottomContainer>
  );
});
