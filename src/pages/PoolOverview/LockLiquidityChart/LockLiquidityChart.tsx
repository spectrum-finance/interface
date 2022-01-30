import './LockLiquidityChart.less';

import React, { FC } from 'react';
import { Bar, BarChart, Label, Tooltip, XAxis, YAxis } from 'recharts';

import { Progress, Typography } from '../../../ergodex-cdk';
import { PositionWithLocksAnalytic } from '../PositionWithLocks';
import { ChartContainer } from './ChartContainer/ChartContainer';

interface LockLiquidityChartProps {
  position: PositionWithLocksAnalytic;
}

export const LockLiquidityChart: FC<LockLiquidityChartProps> = ({
  position,
}) => (
  <>
    <ChartContainer
      header={<Progress percent={position.totalAmmPoolLockedPercent} />}
    >
      <BarChart
        width={400}
        height={190}
        data={position.locksAnalyticAccumulators}
        barCategoryGap={0}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF8C01" stopOpacity={1} />
            <stop offset="95%" stopColor="#FF5135" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Tooltip />
        <Bar dataKey="percent" fill="url(#colorUv)" />
        <YAxis
          axisLine={false}
          tickLine={false}
          dx={-10}
          dy={-5}
          width={50}
          unit="%"
        />
        <XAxis axisLine={false} tick={false}>
          <Label offset={0} position="insideBottomRight" value="Lock time" />
        </XAxis>
      </BarChart>
    </ChartContainer>
  </>
);
