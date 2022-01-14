import './ConnectWalletButton.less';

import cn from 'classnames';
import React, { FC, ReactNode } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { useAppLoadingState } from '../../../context';
import { Button, ButtonProps, Modal } from '../../../ergodex-cdk';
import { isWalletSetuped$ } from '../../../services/new/core';
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
  // const { isWalletConnected } = useWallet();

  // TODO: Update with rx [EDEX-487]
  // const [isWalletLoading] = useObservable(isWalletLoading$);
  const [isWalletConnected] = useObservable(isWalletSetuped$);

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
