import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';
import { InfoTooltip } from '../../../../../../components/InfoTooltip/InfoTooltip';
import { formatToUSD } from '../../../../../../services/number';
import { renderFractions } from '../../../../../../utils/math';

interface LiquidityPositionsItemAnalyticsProps {
  pool: AmmPool;
}

const LiquidityPositionsItemAnalytics: React.FC<LiquidityPositionsItemAnalyticsProps> =
  ({ pool }) => {
    return (
      <Flex justify="space-between">
        <Flex.Item>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>TVL</Typography.Footnote>
            </Flex.Item>
            <DataTag
              size="large"
              content={
                pool.tvl
                  ? formatToUSD(
                      renderFractions(
                        pool.tvl.value,
                        pool.tvl.units.currency.decimals,
                      ),
                      'abbr',
                    )
                  : '–'
              }
            />
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Volume 24H</Typography.Footnote>
            </Flex.Item>
            <DataTag
              size="large"
              content={
                pool.volume
                  ? formatToUSD(
                      renderFractions(
                        pool.volume.value,
                        pool.volume.units.currency.decimals,
                      ),
                      'abbr',
                    )
                  : '–'
              }
            />
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <Typography.Footnote>APR </Typography.Footnote>
                </Flex.Item>
                <Flex.Item>
                  <InfoTooltip
                    size="small"
                    width={300}
                    placement="top"
                    content={
                      <>
                        <Trans>
                          Annual Percentage Rate. Average estimation of how much
                          you may potentially earn providing liquidity to this
                          pool.
                        </Trans>
                        <br />
                        <Typography.Link
                          target="_blank"
                          href="https://docs.ergodex.io/docs/protocol-overview/analytics#apr"
                        >
                          <Trans>Read more</Trans>
                        </Typography.Link>
                      </>
                    }
                  />
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <DataTag
              size="large"
              content={
                pool?.yearlyFeesPercent ? `${pool.yearlyFeesPercent}%` : `–`
              }
            />
          </Flex>
        </Flex.Item>
      </Flex>
    );
  };

export { LiquidityPositionsItemAnalytics };
