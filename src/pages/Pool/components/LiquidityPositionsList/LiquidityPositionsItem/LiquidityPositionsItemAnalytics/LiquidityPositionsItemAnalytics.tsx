import React from 'react';

import { AmmPoolAnalytics } from '../../../../../../common/streams/poolAnalytic';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';
import { InfoTooltip } from '../../../../../../components/InfoTooltip/InfoTooltip';
import { Flex, Typography } from '../../../../../../ergodex-cdk';
import { formatToUSD } from '../../../../../../services/number';
import { renderFractions } from '../../../../../../utils/math';

interface LiquidityPositionsItemAnalyticsProps {
  data?: AmmPoolAnalytics;
  loading: boolean;
}

const LiquidityPositionsItemAnalytics: React.FC<LiquidityPositionsItemAnalyticsProps> =
  ({ data, loading }) => {
    return (
      <Flex justify="space-between">
        <Flex.Item>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>TVL</Typography.Footnote>
            </Flex.Item>
            <DataTag
              loading={loading}
              size="large"
              content={
                data
                  ? formatToUSD(
                      renderFractions(
                        data?.tvl.value,
                        data?.tvl.units.currency.decimals,
                      ),
                      'abbr',
                    )
                  : '-'
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
              loading={loading}
              size="large"
              content={
                data
                  ? formatToUSD(
                      renderFractions(
                        data?.volume.value,
                        data?.volume.units.currency.decimals,
                      ),
                      'abbr',
                    )
                  : '-'
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
                        Annual Percentage Rate. Average estimation of how much
                        you may potentially earn providing liquidity to this
                        pool.
                        <br />
                        <Typography.Link
                          target="_blank"
                          href="https://docs.ergodex.io/docs/protocol-overview/analytics#apr"
                        >
                          Read more
                        </Typography.Link>
                      </>
                    }
                  />
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <DataTag
              loading={loading}
              size="large"
              content={data ? `${data.yearlyFeesPercent}%` : `-`}
            />
          </Flex>
        </Flex.Item>
      </Flex>
    );
  };

export { LiquidityPositionsItemAnalytics };
