import {
  ButtonProps,
  ConnectWalletButton as SpectrumConnectWalletButton,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { TraceProps } from '@spectrumlabs/analytics/lib/esm/types';
import cn from 'classnames';
import { FC, ReactNode, useEffect } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import {
  connectWallet,
  disconnectWallet,
  selectedWallet$,
} from '../../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { Vespr } from '../../../../network/cardano/api/wallet/vespr/vespr';

export interface VesprConnectButtonProps {
  readonly size?: ButtonProps['size'];
  readonly width?: ButtonProps['width'];
  readonly className?: string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly isWalletConnected?: boolean;
  readonly trace: TraceProps;
}

export const VesprConnectButton: FC<VesprConnectButtonProps> = ({
  children,
  className,
  width,
  size,
  isWalletConnected,
}) => {
  const [selectedNetwork] = useSelectedNetwork();
  const [selectedWallet] = useObservable(selectedWallet$);
  const vesprCompat = !!cardano.nami?.experimental?.vespr_compat;

  useEffect(() => {
    // TODO: REWRITE
    if (
      selectedNetwork.name !== 'ergo' &&
      vesprCompat &&
      selectedWallet &&
      selectedWallet?.name !== Vespr.name
    ) {
      disconnectWallet();
    }
  }, [selectedWallet]);

  const handleVesprConnect = () => {
    connectWallet(Vespr).subscribe();
  };

  if (selectedNetwork.name !== 'ergo' && vesprCompat) {
    return (
      <SpectrumConnectWalletButton
        size={size}
        className={cn(className, 'connect-wallet-btn')}
        isWalletConnected={isWalletConnected}
        onClick={handleVesprConnect}
        caption={<Trans>Connect Vespr</Trans>}
        width={width}
      >
        {children}
      </SpectrumConnectWalletButton>
    );
  }

  return <>{children}</>;
};
