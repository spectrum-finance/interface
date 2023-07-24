import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { Currency } from '../../../../../../../common/models/Currency';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';
import { IsCardano } from '../../../../../../../components/IsCardano/IsCardano';
import { IsErgo } from '../../../../../../../components/IsErgo/IsErgo';
import { formatToAda, formatToUSD } from '../../../../../../../services/number';

export interface TvlOrVolume24Column {
  readonly usd?: Currency;
}

export const TvlOrVolume24Column: FC<TvlOrVolume24Column> = ({ usd }) => (
  <Flex>
    <DataTag
      content={
        usd ? (
          <>
            <IsErgo>{formatToUSD(usd.toAmount(), 'abbr')}</IsErgo>
            <IsCardano>{formatToAda(usd.toAmount(), 'abbr')}</IsCardano>
          </>
        ) : (
          '—'
        )
      }
    />
  </Flex>
);
