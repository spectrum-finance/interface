import React, { FC, useMemo } from 'react';
import { of } from 'rxjs';

import { convertToConvenientNetworkAsset } from '../../api/convertToConvenientNetworkAsset';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { LoadingOutlined } from '../../ergodex-cdk';
import { useSelectedNetwork } from '../../gateway/common/network';

export interface ConvenientAssetViewProps {
  readonly value: Currency | Currency[] | undefined;
  readonly prefix?: string;
  readonly defaultValue?: string;
}

export const ConvenientAssetView: FC<ConvenientAssetViewProps> = ({
  value,
  prefix,
  defaultValue,
}) => {
  const [selectedNetwork] = useSelectedNetwork();

  const convenientAssetValue$ = useMemo(
    () => (value ? convertToConvenientNetworkAsset(value) : of(undefined)),
    value instanceof Array ? [value] : [value?.amount, value?.asset?.id],
  );

  const [usdValue, isLoadingUsdValue] = useObservable(
    convenientAssetValue$,
    value instanceof Array ? [value] : [value?.amount, value?.asset?.id],
  );

  return (
    <>
      {isLoadingUsdValue ? (
        <LoadingOutlined />
      ) : value && usdValue?.toString() !== '0' ? (
        `${prefix || '~'}${usdValue?.toCurrencyString()}`
      ) : selectedNetwork.convenientAssetDefaultPreview ? (
        `${prefix || '~'}${selectedNetwork.convenientAssetDefaultPreview}`
      ) : (
        '-'
      )}
    </>
  );
};
