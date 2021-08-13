import React, { ReactElement, useCallback, useContext } from 'react';
import { Button } from '@geist-ui/react';
import { WalletContext } from '../../context';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { renderFractions } from '../../utils/math';
import { ERG_DECIMALS } from '../../constants/erg';

export const ConnectWallet = ({
  className,
}: {
  className?: string;
}): ReactElement => {
  const { isWalletConnected, setIsWalletConnected, ergBalance } =
    useContext(WalletContext);

  const onClick = useCallback(() => {
    if (window.ergo_request_read_access) {
      window
        .ergo_request_read_access()
        .then(setIsWalletConnected)
        .then(() => Cookies.set('wallet-connected', 'true', { expires: 1 }));
      return;
    }

    toast.warn(
      "Yoroi Nightly and/or Yoroi-dApp-Connector Nightly aren't installed",
    );
  }, [setIsWalletConnected]);

  const renderedBalance =
    isWalletConnected && ergBalance
      ? renderFractions(Number(ergBalance), ERG_DECIMALS)
      : undefined;

  return (
    <Button type="success" ghost onClick={onClick} className={className}>
      {renderedBalance ? `${renderedBalance} ERG` : 'Connect Yoroi Wallet'}
    </Button>
  );
};
