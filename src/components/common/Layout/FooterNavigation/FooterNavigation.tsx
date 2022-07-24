import { Flex, useDevice } from '@ergolabs/ui-kit';
import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { device } from '../../../../common/constants/size';
import { useObservable } from '../../../../common/hooks/useObservable';
import { selectedWalletState$ } from '../../../../gateway/api/wallets';
import { operationsHistory$ } from '../../../../gateway/widgets/operationsHistory';
import { WalletState } from '../../../../network/common/Wallet';
import { GetTestTokensButton } from '../../../Header/GetTestTokensButton/GetTestTokensButton';
import { Navigation } from '../../../Header/Navigation/Navigation';
import { IsCardano } from '../../../IsCardano/IsCardano';

export const BottomContainer = styled.div<{ ref: any }>`
  z-index: 2;
  position: fixed;
  bottom: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  right: 0;
  left: 0;
  background: var(--ergo-box-bg-control);
  border-top: 1px var(--ergo-box-border-color) solid;

  ${device.m} {
    left: auto;
    right: 50%;
    transform: translate(50%, 0);
    background: none;
    border-top: 0;
  }
`;
// eslint-disable-next-line react/display-name
export const FooterNavigation = forwardRef<HTMLDivElement>((props, ref) => {
  const { s, m } = useDevice();
  const [walletState] = useObservable(selectedWalletState$);
  const [OperationsHistory] = useObservable(operationsHistory$);

  if (!(s || m)) {
    return null;
  }

  return (
    <BottomContainer ref={ref}>
      {s && (
        <Flex col>
          <IsCardano>
            <GetTestTokensButton
              style={{
                display: 'block',
                margin: '0 1rem 1rem',
              }}
            />
          </IsCardano>
          <Flex>
            <Flex.Item marginLeft={4} marginRight={4} flex={1}>
              <Navigation textCenter />
            </Flex.Item>
            {walletState === WalletState.CONNECTED && OperationsHistory && (
              <Flex.Item marginRight={4}>
                <OperationsHistory />
              </Flex.Item>
            )}
          </Flex>
        </Flex>
      )}
      {m && <Navigation />}
    </BottomContainer>
  );
});
