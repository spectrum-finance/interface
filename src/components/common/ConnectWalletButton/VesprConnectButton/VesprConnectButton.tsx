import { Button, ButtonProps, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { TraceProps } from '@spectrumlabs/analytics/lib/esm/types';
import { CSSProperties, FC, ReactNode, useEffect } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import {
  connectWallet,
  disconnectWallet,
  selectedWallet$,
} from '../../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { Vespr } from '../../../../network/cardano/api/wallet/vespr/vespr';
import { ReactComponent as VesprLogo } from './vespr-icon.svg';

export interface VesprConnectButtonProps {
  readonly size?: ButtonProps['size'];
  readonly width?: ButtonProps['width'];
  readonly className?: string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly isWalletConnected?: boolean;
  readonly trace: TraceProps;
}

const mapSizeToStyle = new Map<ButtonProps['size'], CSSProperties>([
  [
    'small',
    { fontSize: 16, marginLeft: 'calc(var(--spectrum-base-gutter) * 0.5)' },
  ],
  [
    'middle',
    { fontSize: 20, marginLeft: 'calc(var(--spectrum-base-gutter) * 0.5)' },
  ],
  [
    'large',
    {
      fontSize: 28,
      top: '-1px',
      position: 'relative',
    },
  ],
  [
    'extra-large',
    {
      fontSize: 38,
      position: 'relative',
      top: '-2px',
    },
  ],
]);

export const VesprConnectButton: FC<VesprConnectButtonProps> = ({
  children,
  className,
  width,
  size,
  isWalletConnected,
}) => {
  const [selectedNetwork] = useSelectedNetwork();
  const [selectedWallet] = useObservable(selectedWallet$);
  const vesprCompat = true;

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

  if (selectedNetwork.name === 'ergo' || !vesprCompat || isWalletConnected) {
    return <>{children}</>;
  }

  return (
    <Button
      size={size}
      className={className}
      onClick={handleVesprConnect}
      width={width}
    >
      <Flex justify="center" align="center" width="100%">
        <Trans>Connect</Trans>
        <VesprLogo style={size ? mapSizeToStyle.get(size) : undefined} />
      </Flex>
    </Button>
  );
};
