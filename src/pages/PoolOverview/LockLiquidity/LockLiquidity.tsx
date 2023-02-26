import './LockLiquidity.less';

import {
  Box,
  Empty,
  Flex,
  Progress,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import {
  Bar,
  BarChart,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import {
  AmmPoolConfidenceAnalytic,
  LocksGroup,
} from '../AmmPoolConfidenceAnalytic';
import { AnalyticOverview } from './AnalyticOverview/AnalyticOverview';

const MIN_RELEVANT_LOCKS_PCT = 1;

export interface LockLiquidityProps {
  readonly poolConfidenceAnalytic: AmmPoolConfidenceAnalytic;
}

export const LockLiquidity: FC<LockLiquidityProps> = ({
  poolConfidenceAnalytic,
}) => {
  const { valBySize } = useDevice();
  const [selectedLocksGroup, setSelectedLocksGroup] = useState<
    LocksGroup | undefined
  >();

  const tickFormatter = (value: number) => value.toFixed(2);
  const notEnoughData =
    poolConfidenceAnalytic.lockedPercent < MIN_RELEVANT_LOCKS_PCT;

  return (
    <Box
      glass
      borderRadius="l"
      padding={4}
      height={valBySize(undefined, 277, 291)}
    >
      {notEnoughData ? (
        <Flex stretch align="center" justify="center">
          <Empty>
            <Typography.Body size="large" secondary>
              <Trans>Not enough data</Trans>
            </Typography.Body>
          </Empty>
        </Flex>
      ) : (
        <Flex col>
          <Flex.Item marginBottom={2}>
            <InfoTooltip content={<>1</>} secondary>
              <Typography.Body strong>
                <Trans>Locked liquidity</Trans>
              </Typography.Body>
            </InfoTooltip>
          </Flex.Item>
          <Flex.Item marginBottom={1}>
            <Progress
              strokeWidth={24}
              percent={poolConfidenceAnalytic.lockedPercent}
            />
          </Flex.Item>
          <Flex.Item marginBottom={2} display="flex">
            <AnalyticOverview
              data={selectedLocksGroup || poolConfidenceAnalytic}
            />
          </Flex.Item>
          <div style={{ width: '100%', position: 'relative', height: 160 }}>
            <div
              style={{ width: '100%', position: 'absolute', height: '100%' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={poolConfidenceAnalytic.locksGroups}
                  barCategoryGap={0}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ABA5FC" stopOpacity={1} />
                      <stop offset="95%" stopColor="#6B64CD" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <Tooltip wrapperClassName="hidden-tooltip" />
                  <Bar
                    onMouseEnter={(e) => setSelectedLocksGroup(e.payload)}
                    onMouseLeave={() => setSelectedLocksGroup(undefined)}
                    dataKey="lockedPercent"
                    fill="url(#colorUv)"
                  />
                  <YAxis
                    tickFormatter={tickFormatter}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                    dy={-5}
                    width={50}
                    unit="%"
                  />
                  <XAxis axisLine={false} tick={false}>
                    <Label
                      offset={0}
                      position="insideBottomRight"
                      value={t`Lock time`}
                    />
                  </XAxis>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Flex>
      )}
    </Box>
  );
};
