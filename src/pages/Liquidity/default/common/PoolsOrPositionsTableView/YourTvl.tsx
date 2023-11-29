import { LoadingOutlined } from '@ergolabs/ui-kit';
import { FC, useMemo } from 'react';
import { of } from 'rxjs';

import { convertToConvenientNetworkAsset } from '../../../../../api/convertToConvenientNetworkAsset';
import { useObservable } from '../../../../../common/hooks/useObservable';
import { Currency } from '../../../../../common/models/Currency';
import { useSelectedNetwork } from '../../../../../gateway/common/network';
import { Network } from '../../../../../network/common/Network';
import { formatToAda } from '../../../../../services/number';
import styles from './TokenDetail.module.less';

export interface YourTvlProps {
  readonly value: Currency | Currency[] | undefined;
}

const SMALLEST_VALUE = 0.01;
const ZERO_VALUE = '0.00';

export const getConvenientValue = (
  network: Network<any, any>,
  convenientValue?: Currency,
  value?: Currency | Currency[],
): string => {
  if (!convenientValue || !value || value.toString() === '0') {
    return network.name !== 'ergo' ? `${ZERO_VALUE} ₳` : `$${ZERO_VALUE}`;
  } else if (Number(convenientValue.toString()) < SMALLEST_VALUE) {
    return network.name !== 'ergo'
      ? `<${SMALLEST_VALUE} ₳`
      : `<$${SMALLEST_VALUE}`;
  }
  return formatToAda(convenientValue, 'abbr');
};

export const YourTvl: FC<YourTvlProps> = ({ value }) => {
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
      ) : (
        <p className={styles.value}>
          {getConvenientValue(selectedNetwork, convenientValue, value)}
        </p>
      )}
    </>
  );
};
