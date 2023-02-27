import {
  ButtonProps,
  ConnectWalletButton as SpectrumConnectWalletButton,
  Modal,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import cn from 'classnames';
import React, { FC, ReactNode } from 'react';

// import { panalytics } from '../../../common/analytics';
// import { PAnalytics } from '../../../common/analytics/src/types';
import { useObservable } from '../../../common/hooks/useObservable';
import { isWalletSetuped$ } from '../../../gateway/api/wallets';
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
  const [isWalletConnected] = useObservable(isWalletSetuped$);

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);

    // if (analytics && analytics.location) {
    //   panalytics.openConnectWalletModal(analytics.location);
    // }
  };

  return (
    <SpectrumConnectWalletButton
      size={size}
      onClick={openChooseWalletModal}
      className={cn(className, 'connect-wallet-btn')}
      isWalletConnected={isWalletConnected}
      caption={<Trans>Connect wallet</Trans>}
    >
      {children}
    </SpectrumConnectWalletButton>
  );
};
