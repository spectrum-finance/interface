import './ConnectWalletButton.less';

import { LoadingOutlined } from '@ant-design/icons';
import cn from 'classnames';
import React, { FC, ReactNode } from 'react';

import { useAppLoadingState, useWallet } from '../../../context';
import { Button, ButtonProps, Modal } from '../../../ergodex-cdk';
import { useObservable } from '../../../hooks/useObservable';
import {
  isWalletConnected$,
  isWalletLoading$,
} from '../../../services/new/core';
import { ChooseWalletModal } from './ChooseWalletModal/ChooseWalletModal';

export interface ConnectWalletButtonProps {
  readonly size?: ButtonProps['size'];
  readonly className?: string;
  readonly children?: ReactNode | ReactNode[] | string;
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  size,
  className,
  children,
}) => {
  const { isWalletConnected } = useWallet();

  // TODO: Update with rx [EDEX-487]
  // const [isWalletLoading] = useObservable(isWalletLoading$);
  // const [isWalletConnected] = useObservable(isWalletConnected$);

  const [{ isKYAAccepted }] = useAppLoadingState();

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
  };

  return (
    <>
      {isKYAAccepted ? (
        !isWalletConnected ? (
          <Button
            size={size}
            onClick={openChooseWalletModal}
            className={cn(className, 'connect-wallet-btn')}
          >
            Connect wallet
          </Button>
        ) : (
          children
        )
      ) : (
        <Button
          disabled
          size={size}
          className={cn(className, 'connect-wallet-btn')}
        >
          KYA is not accepted
        </Button>
      )}
    </>
  );
};
