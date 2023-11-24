import { ButtonProps, Modal } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { isWalletSetuped$ } from '../../../gateway/api/wallets';
import { ChooseWalletModal } from './ChooseWalletModal/ChooseWalletModal';
import styles from './ConnectWalletButton.module.less';
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
  width,
  children,
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
      {isWalletConnected && children}
      {!isWalletConnected && (
        <button className={styles.btnConnect} onClick={openChooseWalletModal}>
          Connect Wallet
        </button>
      )}
    </VesprConnectButton>
  );
};
