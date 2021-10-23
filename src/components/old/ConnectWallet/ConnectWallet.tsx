import React, { ReactElement, useCallback, useContext, useState } from 'react';

// import { ERG_DECIMALS } from '../../constants/erg';
// import { WalletContext } from '../../context';
// import { walletCookies } from '../../utils/cookies';
// import { renderFractions } from '../../utils/math';
//
// export const ConnectWallet = ({
//   className,
// }: {
//   className?: string;
// }): ReactElement => {
//   const { isWalletConnected, setIsWalletConnected, ergBalance } =
//     useContext(WalletContext);
//
//   const [isLoading, setIsLoading] = useState(false);
//
//   const onClick = useCallback(() => {
//     if (window.ergo_request_read_access) {
//       setIsLoading(true);
//       window
//         .ergo_request_read_access()
//         .then(setIsWalletConnected)
//         .then(() => walletCookies.setConnected())
//         .finally(() => setIsLoading(false));
//       return;
//     }
//
//     toast.warn(
//       "Yoroi Nightly and/or Yoroi-dApp-Connector Nightly aren't installed",
//     );
//   }, [setIsWalletConnected]);
//
//   const renderedBalance =
//     isWalletConnected && ergBalance
//       ? renderFractions(Number(ergBalance), ERG_DECIMALS)
//       : undefined;
//
//   return (
//     <Button
//       type="success"
//       ghost
//       onClick={onClick}
//       className={className}
//       loading={isLoading}
//     >
//       {renderedBalance ? `${renderedBalance} ERG` : 'Connect Yoroi Wallet'}
//     </Button>
//   );
// };
