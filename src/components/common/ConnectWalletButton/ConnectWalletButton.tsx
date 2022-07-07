import './ConnectWalletButton.less';

import { Button, ButtonProps, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import cn from 'classnames';
import React, { FC, ReactNode } from 'react';

import { panalytics } from '../../../common/analytics';
import { AnalyticsConnectWalletLocation } from '../../../common/analytics/@types/wallet';
import { useObservable } from '../../../common/hooks/useObservable';
import { useAppLoadingState } from '../../../context';
import { isWalletSetuped$ } from '../../../gateway/api/wallets';
import { ChooseWalletModal } from './ChooseWalletModal/ChooseWalletModal';

export interface ConnectWalletButtonProps {
  readonly size?: ButtonProps['size'];
  readonly className?: string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly analytics?: {
    connectWalletLocation?: AnalyticsConnectWalletLocation;
  };
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  size,
  className,
  children,
  analytics,
}) => {
  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const [{ isKYAAccepted }] = useAppLoadingState();

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
    if (analytics && analytics.connectWalletLocation) {
      panalytics.openConnectWalletModal(analytics.connectWalletLocation);
    }
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
            <Trans>Connect wallet</Trans>
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
          <Trans>KYA is not accepted</Trans>
        </Button>
      )}
    </>
  );
};
