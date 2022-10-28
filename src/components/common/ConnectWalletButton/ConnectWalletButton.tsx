import {
  Button,
  ButtonProps,
  ConnectWalletButton as SpectrumConnectWalletButton,
  Modal,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import cn from 'classnames';
import React, { FC, ReactNode } from 'react';
import { isMobile } from 'react-device-detect';

import { panalytics } from '../../../common/analytics';
import { PAnalytics } from '../../../common/analytics/@types/types';
import { useObservable } from '../../../common/hooks/useObservable';
import { useAppLoadingState } from '../../../context';
import { isWalletSetuped$ } from '../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { useSettings } from '../../../network/ergo/settings/settings';
import { ChooseWalletModal } from './ChooseWalletModal/ChooseWalletModal';
import { ReadonlyWalletSettingsModal } from './ReadonlyWalletSettingsModal/ReadonlyWalletSettingsModal';

export interface ConnectWalletButtonProps {
  readonly size?: ButtonProps['size'];
  readonly className?: string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly analytics?: PAnalytics;
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  size,
  className,
  children,
  analytics,
}) => {
  const [selectedNetwork] = useSelectedNetwork();
  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const [{ ergopay }] = useSettings();

  const openChooseWalletModal = (): void => {
    // TODO: REWRITE
    if (selectedNetwork.name === 'ergo' && isMobile && ergopay) {
      Modal.open(({ close }) => <ReadonlyWalletSettingsModal close={close} />);
    } else {
      Modal.open(({ close }) => <ChooseWalletModal close={close} />);
    }

    if (analytics && analytics.location) {
      panalytics.openConnectWalletModal(analytics.location);
    }
  };

  return (
    <>
      <SpectrumConnectWalletButton
        size={size}
        onClick={openChooseWalletModal}
        className={cn(className, 'connect-wallet-btn')}
        isWalletConnected={isWalletConnected}
        caption={<Trans>Connect wallet</Trans>}
      >
        {children}
      </SpectrumConnectWalletButton>
    </>
  );
};
