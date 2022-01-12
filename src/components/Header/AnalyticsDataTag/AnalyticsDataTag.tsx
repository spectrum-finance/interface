import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { aggregatedAnalyticsData24H$ } from '../../../services/new/analytics';
import { formatToUSD } from '../../../services/number';
import { renderFractions } from '../../../utils/math';

export const AnalyticsDataTag = (): JSX.Element => {
  const [currentStats] = useObservable(aggregatedAnalyticsData24H$, [], {});

  return (
    <Box height="40px" borderRadius="m">
      <Flex align="center" style={{ height: '100%' }}>
        <Flex.Item display="flex" marginRight={2}>
          <Box padding={[1, 2]} borderRadius="s" tag>
            <Typography.Body style={{ whiteSpace: 'nowrap' }}>
              TVL:{' '}
              {currentStats?.tvl ? (
                <>
                  {formatToUSD(
                    renderFractions(
                      currentStats?.tvl.value,
                      currentStats?.tvl.units.currency.decimals,
                    ),
                    'abbr',
                  )}
                </>
              ) : (
                <LoadingOutlined />
              )}
            </Typography.Body>
          </Box>
        </Flex.Item>
        <Flex.Item display="flex">
          <Box padding={[1, 2]} borderRadius="s" tag>
            <Typography.Body style={{ whiteSpace: 'nowrap' }}>
              Volume 24H:{' '}
              {currentStats?.volume ? (
                formatToUSD(
                  renderFractions(
                    currentStats?.volume.value,
                    currentStats.volume.units.currency.decimals,
                  ),
                  'abbr',
                )
              ) : (
                <LoadingOutlined />
              )}
            </Typography.Body>
          </Box>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
