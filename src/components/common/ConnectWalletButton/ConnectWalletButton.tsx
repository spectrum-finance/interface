import {
  Button,
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
import { selectedNetwork$ } from '../../../gateway/common/network.ts';
import { ChooseWalletModal } from './ChooseWalletModal/ChooseWalletModal';
import { isVesprWallet } from './utils';

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
  const [network] = useObservable(selectedNetwork$);

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
    fireAnalyticsEvent('Click Connect Wallet Button', trace);
  };

  if (isVesprWallet() && network?.name.includes('cardano')) {
    return <Button>Hello</Button>;
  }

  return (
    <>
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
    </>
  );
};
