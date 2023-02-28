import { useDevice } from '@ergolabs/ui-kit';
import React, { FC, useEffect } from 'react';
import { of } from 'rxjs';

// import { panalytics } from '../../../../../common/analytics';
import { useObservable } from '../../../../../common/hooks/useObservable';
import { getErgopayAddresses } from '../../../api/ergopay/getErgopayAddresses';
import { getErgopayRequestId } from '../../../api/ergopay/getErgopayRequestId';
import {
  ErgopayWallet,
  setErgopayAddress,
} from '../../../api/wallet/ergopay/ergopay';
import { connectWallet } from '../../../api/wallet/wallet';
import { patchSettings } from '../../../settings/settings';
import {
  createErgoPayDeepLink,
  createSelectAddressesRequestLink,
} from '../common/ergopayLinks';
import { ErgoPayTabPaneContentDesktop } from './ErgoPayTabPaneContentDesktop';
import { ErgoPayTabPaneContentMobile } from './ErgoPayTabPaneContentMobile';

interface Props {
  close: (result?: boolean | undefined) => void;
}

export const ErgoPayTabPaneContent: FC<Props> = ({ close }) => {
  const { s } = useDevice();

  const [requestId, loadingRequestId] = useObservable(getErgopayRequestId, []);
  const [addresses, loadingAddresses = true] = useObservable(
    requestId ? getErgopayAddresses(requestId) : of(null),
    [requestId],
  );

  useEffect(() => {
    if (loadingAddresses === false && addresses?.[0]) {
      setErgopayAddress(addresses[0]);
      patchSettings({ ergopay: true });
      connectWallet(ErgopayWallet).subscribe(() => {
        // panalytics.connectWallet(ErgopayWallet.name);
      });
      close();
    }
  }, [loadingAddresses]);

  const handleClick = () => {
    if (requestId) {
      window.location.replace(
        createErgoPayDeepLink(createSelectAddressesRequestLink(requestId)),
      );
    }
  };

  return s ? (
    <ErgoPayTabPaneContentMobile
      handleClick={handleClick}
      loadingRequestId={loadingRequestId}
    />
  ) : (
    <ErgoPayTabPaneContentDesktop
      handleClick={handleClick}
      loadingRequestId={loadingRequestId}
      requestId={requestId}
    />
  );
};
