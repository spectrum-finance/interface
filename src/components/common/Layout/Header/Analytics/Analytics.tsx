import { Box, Flex, LoadingOutlined, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { platformStats$ } from '../../../../../gateway/api/platformStats';
import { formatToUSD } from '../../../../../services/number';
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
                <>{formatToUSD(currentStats.tvl.toAmount(), 'abbr')}</>
              ) : (
                <LoadingOutlined />
              )}
            </Typography.Body>
          </AnalyticTag>
        </Flex.Item>
        <AnalyticTag>
          <Typography.Body style={{ whiteSpace: 'nowrap' }}>
            Volume 24H:{' '}
            {currentStats?.volume !== undefined ? (
              formatToUSD(currentStats.volume.toAmount(), 'abbr')
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
