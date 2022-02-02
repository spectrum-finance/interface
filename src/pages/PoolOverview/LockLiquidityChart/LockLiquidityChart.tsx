import './LockLiquidityChart.less';

import React, { FC, useState } from 'react';
import { Bar, BarChart, Label, Tooltip, XAxis, YAxis } from 'recharts';

import { Flex, Progress } from '../../../ergodex-cdk';
import { AmmPoolConfidenceAnalytic, LocksGroup } from '../LocksAnalytic';
import { AnalyticOverview } from './AnalyticOverview/AnalyticOverview';
import { ChartContainer } from './ChartContainer/ChartContainer';

interface LockLiquidityChartProps {
  poolConfidenceAnalytic: AmmPoolConfidenceAnalytic;
}

export const LockLiquidityChart: FC<LockLiquidityChartProps> = ({
  poolConfidenceAnalytic,
}) => {
  const [selectedLocksGroup, setSelectedLocksGroup] = useState<
    LocksGroup | undefined
  >();

  const tickFormatter = (value: number) => value.toFixed(2);

  return (
    <>
      <ChartContainer
        header={<Progress percent={poolConfidenceAnalytic.lockedPercent} />}
      >
        <Flex col>
          <Flex.Item marginBottom={6}>
            <AnalyticOverview
              data={selectedLocksGroup || poolConfidenceAnalytic}
            />
          </Flex.Item>
          <BarChart
            width={400}
            height={190}
            data={poolConfidenceAnalytic.locksGroups}
            barCategoryGap={0}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF8C01" stopOpacity={1} />
                <stop offset="95%" stopColor="#FF5135" stopOpacity={1} />
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
                value="Lock time"
              />
            </XAxis>
          </BarChart>
        </Flex>
      </ChartContainer>
    </>
  );
};
