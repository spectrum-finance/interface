import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { platformStats$ } from '../../../../../gateway/api/platformStats';
import { formatToAda, formatToUSD } from '../../../../../services/number';
import { IsCardano } from '../../../../IsCardano/IsCardano';
import { IsErgo } from '../../../../IsErgo/IsErgo';
import { AnalyticsSkeletonLoader } from './AnalyticsSkeletonLoader/AnalyticsSkeletonLoader.tsx';
import { AnalyticTag } from './AnalyticTag/AnalyticTag';

interface AnalyticsProps {
  className?: string;
}

const _Analytics: FC<AnalyticsProps> = ({ className }) => {
  const [currentStats] = useObservable(platformStats$, []);

  return (
    <Box height={40} borderRadius="l" className={className} glass>
      <Flex align="center" stretch>
        <Flex.Item marginRight={2}>
          <AnalyticTag>
            <Typography.Body style={{ whiteSpace: 'nowrap' }}>
              TVL:{' '}
              {currentStats?.tvl !== undefined ? (
                <>
                  <IsErgo>
                    {formatToUSD(currentStats.tvl.toAmount(), 'abbr')}
                  </IsErgo>
                  <IsCardano>
                    {formatToAda(currentStats.tvl.toAmount(), 'abbr')}
                  </IsCardano>
                </>
              ) : (
                <AnalyticsSkeletonLoader />
              )}
            </Typography.Body>
          </AnalyticTag>
        </Flex.Item>
        <AnalyticTag>
          <Typography.Body style={{ whiteSpace: 'nowrap' }}>
            Volume 24H:{' '}
            {currentStats?.volume !== undefined ? (
              <>
                <IsErgo>
                  {formatToUSD(currentStats.volume.toAmount(), 'abbr')}
                </IsErgo>
                <IsCardano>
                  {formatToAda(currentStats.volume.toAmount(), 'abbr')}
                </IsCardano>
              </>
            ) : (
              <AnalyticsSkeletonLoader />
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
