import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Currency } from '../../../../../../common/models/Currency';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';
import { ConvenientAssetView } from '../../../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../../../components/InfoTooltip/InfoTooltip';

export interface FarmTagColumnProps {
  readonly x: Currency;
  readonly y: Currency;
}

export const FarmTagColumn: FC<FarmTagColumnProps> = ({ x, y }) => (
  <Flex>
    <DataTag
      size="large"
      content={
        <Flex gap={1} align="center">
          {[x, y].every((value) => value.isPositive()) ? (
            <>
              <ConvenientAssetView value={[x, y]} />
              <InfoTooltip
                width={194}
                size="small"
                placement="top"
                icon="exclamation"
                content={
                  <>
                    {x.asset.ticker}: {x.toString()}
                    <br />
                    {y.asset.ticker}: {y.toString()}
                  </>
                }
              />
            </>
          ) : (
            <>$---</>
          )}
        </Flex>
      }
    />
  </Flex>
);
