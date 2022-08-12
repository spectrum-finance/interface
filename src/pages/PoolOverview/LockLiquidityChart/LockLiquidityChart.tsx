import './LockLiquidityChart.less';

import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { Bar, BarChart, Label, Tooltip, XAxis, YAxis } from 'recharts';

import {
  AmmPoolConfidenceAnalytic,
  LocksGroup,
} from '../AmmPoolConfidenceAnalytic';
import { AnalyticOverview } from './AnalyticOverview/AnalyticOverview';
import { ChartContainer } from './ChartContainer/ChartContainer';
import { ProgressHeader } from './ProgressHeader/ProgressHeader';

interface LockLiquidityChartProps {
  poolConfidenceAnalytic: AmmPoolConfidenceAnalytic;
  collapsed?: boolean;
}

export const LockLiquidityChart: FC<LockLiquidityChartProps> = ({
  poolConfidenceAnalytic,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedLocksGroup, setSelectedLocksGroup] = useState<
    LocksGroup | undefined
  >();

  const tickFormatter = (value: number) => value.toFixed(2);

  const handleChange = () => setCollapsed((prev) => !prev);

  return (
    <>
      <ChartContainer
        onChange={handleChange}
        header={
          <ProgressHeader
            collapsed={collapsed}
            poolConfidenceAnalytic={poolConfidenceAnalytic}
          />
        }
      >
        <Flex col>
          <Flex.Item marginBottom={6}>
            <AnalyticOverview
              data={selectedLocksGroup || poolConfidenceAnalytic}
            />
          </Flex.Item>
          <BarChart
            width={520}
            height={190}
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
        </Flex>
      </ChartContainer>
    </>
  );
};
