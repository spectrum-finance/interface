import './ConnectWalletButton.less';

import { LoadingOutlined } from '@ant-design/icons';
import cn from 'classnames';
import React, { FC } from 'react';

import { useWallet } from '../../../context';
import { Button, ButtonProps, Modal } from '../../../ergodex-cdk';
import { ChooseWalletModal } from './ChooseWalletModal/ChooseWalletModal';

export interface ConnectWalletButtonProps {
  size?: ButtonProps['size'];
  className?: string;
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  size,
  className,
}) => {
  const { isWalletLoading } = useWallet();

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />, {
      width: 372,
      title: 'Select a wallet',
    });
  };

  return (
    <Button
      size={size}
      onClick={openChooseWalletModal}
      className={cn(className, 'connect-wallet-btn')}
    >
      {isWalletLoading ? 'Connect to a wallet' : <LoadingOutlined />}
    </Button>
  );
};
