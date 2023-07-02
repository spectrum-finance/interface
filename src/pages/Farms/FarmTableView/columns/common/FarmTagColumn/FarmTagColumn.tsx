import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { Currency } from '../../../../../../common/models/Currency';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';
import { ConvenientAssetView } from '../../../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../../../components/InfoTooltip/InfoTooltip';
import { SensitiveContent } from '../../../../../../components/SensitiveContent/SensitiveContent.tsx';

export interface FarmTagColumnProps {
  readonly x: Currency;
  readonly y: Currency;
  readonly sensitive?: boolean;
}

export const FarmTagColumn: FC<FarmTagColumnProps> = ({ x, y, sensitive }) => (
  <Flex>
    <DataTag
      size="large"
      content={
        <Flex gap={1} align="center">
          {[x, y].every((value) => value.isPositive()) ? (
            <>
              <ConvenientAssetView
                sensitive={sensitive}
                value={[x, y]}
                isShort
              />
              <InfoTooltip
                width={194}
                size="small"
                placement="top"
                icon="exclamation"
                content={
                  <>
                    {x.asset.ticker}:{' '}
                    <SensitiveContent>{x.toString()}</SensitiveContent>
                    <br />
                    {y.asset.ticker}:{' '}
                    <SensitiveContent>{y.toString()}</SensitiveContent>
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
