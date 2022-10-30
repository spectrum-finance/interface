import { Box, Flex, LoadingOutlined, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { aggregatedAnalyticsData24H$ } from '../../../../../services/new/analytics';
import { formatToUSD } from '../../../../../services/number';
import { renderFractions } from '../../../../../utils/math';
import { AnalyticTag } from './AnalyticTag/AnalyticTag';

interface AnalyticsProps {
  className?: string;
}

const _Analytics: FC<AnalyticsProps> = ({ className }) => {
  const [currentStats] = useObservable(aggregatedAnalyticsData24H$, [], {});

  return (
    <Box height={40} borderRadius="l" className={className}>
      <Flex align="center" stretch>
        <Flex.Item marginRight={2}>
          <AnalyticTag>
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
          </AnalyticTag>
        </Flex.Item>
        <AnalyticTag>
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
        </AnalyticTag>
      </Flex>
    </Box>
  );
};

export const Analytics = styled(_Analytics)`
  @media (max-width: 1090px) {
    display: none;
  }
`;
