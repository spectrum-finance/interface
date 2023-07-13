import {
  ButtonProps,
  ConnectWalletButton as SpectrumConnectWalletButton,
  Modal,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { fireAnalyticsEvent, TraceProps } from '@spectrumlabs/analytics';
import cn from 'classnames';
import { FC, ReactNode } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { isWalletSetuped$ } from '../../../gateway/api/wallets';
import { ChooseWalletModal } from './ChooseWalletModal/ChooseWalletModal';
import { VesprConnectButton } from './VesprConnectButton/VesprConnectButton';

export interface ConnectWalletButtonProps {
  readonly size?: ButtonProps['size'];
  readonly width?: ButtonProps['width'];
  readonly className?: string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly trace: TraceProps;
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  size,
  className,
  children,
  trace,
  width,
}) => {
  const [isWalletConnected] = useObservable(isWalletSetuped$);

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
    fireAnalyticsEvent('Click Connect Wallet Button', trace);
  };

  return (
    <VesprConnectButton
      size={size}
      className={cn(className, 'connect-wallet-btn')}
      isWalletConnected={isWalletConnected}
      width={width}
      trace={trace}
    >
      <SpectrumConnectWalletButton
        size={size}
        onClick={openChooseWalletModal}
        className={cn(className, 'connect-wallet-btn')}
        isWalletConnected={isWalletConnected}
        caption={<Trans>Connect wallet</Trans>}
        width={width}
      >
        {children}
      </SpectrumConnectWalletButton>
    </VesprConnectButton>
  );
};
