import './ConnectWalletButton.less';

import {
  ButtonProps,
  ConnectWalletButton as SpectrumConnectWalletButton,
  Modal,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
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
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  size,
  className,
  children,
  width,
}) => {
  const [isWalletConnected] = useObservable(isWalletSetuped$);

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
  };

  return (
    <VesprConnectButton
      size={size}
      className={className}
      isWalletConnected={isWalletConnected}
      width={width}
    >
      <SpectrumConnectWalletButton
        size={size}
        onClick={openChooseWalletModal}
        className={`${className} btn-connect-wallet`}
        isWalletConnected={isWalletConnected}
        caption={<Trans>Connect wallet</Trans>}
        width={width}
      >
        {children}
      </SpectrumConnectWalletButton>
    </VesprConnectButton>
  );
};
