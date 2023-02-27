import { LoadingOutlined } from '@ergolabs/ui-kit';
import React, { FC, useMemo } from 'react';
import { of } from 'rxjs';

import { convertToConvenientNetworkAsset } from '../../api/convertToConvenientNetworkAsset';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { useSelectedNetwork } from '../../gateway/common/network';
import { formatToUSD } from '../../services/number';

export interface ConvenientAssetViewProps {
  readonly value: Currency | Currency[] | undefined;
  readonly prefix?: string;
  readonly hidePrefix?: boolean;
  readonly defaultValue?: string;
  readonly type?: 'abbr' | 'default';
}

export const ConvenientAssetView: FC<ConvenientAssetViewProps> = ({
  value,
  prefix,
  hidePrefix,
  type,
}) => {
  const [selectedNetwork] = useSelectedNetwork();

  const convenientAssetValue$ = useMemo(
    () => (value ? convertToConvenientNetworkAsset(value) : of(undefined)),
    value instanceof Array ? [value] : [value?.amount, value?.asset?.id],
  );

  const [convenientValue, isConvenientValueLoading] = useObservable(
    convenientAssetValue$,
    value instanceof Array ? [value] : [value?.amount, value?.asset?.id],
  );

  return (
    <>
      {isConvenientValueLoading ? (
        <LoadingOutlined />
      ) : value && convenientValue?.toString() !== '0' ? (
        `${hidePrefix ? '' : prefix || '~'}${
          convenientValue
            ? convenientValue.asset.ticker === 'ADA'
              ? convenientValue.toCurrencyString()
              : formatToUSD(convenientValue, type || 'abbr')
            : ''
        }`
      ) : selectedNetwork.convenientAssetDefaultPreview ? (
        `${selectedNetwork.convenientAssetDefaultPreview}`
      ) : (
        '-'
      )}
    </>
  );
};
