import './LockLiquidityChart.less';

import React, { FC } from 'react';
import { Bar, BarChart, Label, Tooltip, XAxis, YAxis } from 'recharts';

import { Progress, Typography } from '../../../ergodex-cdk';
import { AmmPoolConfidenceAnalytic } from '../LocksAnalytic';
import { ChartContainer } from './ChartContainer/ChartContainer';

interface LockLiquidityChartProps {
  poolConfidenceAnalytic: AmmPoolConfidenceAnalytic;
}

export const LockLiquidityChart: FC<LockLiquidityChartProps> = ({
  poolConfidenceAnalytic,
}) => {
  const tickFormatter = (value: number) => value.toFixed(2);

  return (
    <>
      <ChartContainer
        header={<Progress percent={poolConfidenceAnalytic.lockedPercent} />}
      >
        <Typography.Body>{''}</Typography.Body>
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
          <Bar
            onMouseEnter={(res) => console.log(res, 'enter')}
            onMouseLeave={(res) => console.log(res, 'leave')}
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
            <Label offset={0} position="insideBottomRight" value="Lock time" />
          </XAxis>
        </BarChart>
      </ChartContainer>
    </>
  );
};
