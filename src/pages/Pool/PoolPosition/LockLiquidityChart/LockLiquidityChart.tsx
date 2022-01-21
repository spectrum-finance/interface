import './LockLiquidityChart.less';

import React, { FC } from 'react';
import { Bar, BarChart, Label, Tooltip, XAxis, YAxis } from 'recharts';

import { FormSection } from '../../../../components/common/FormView/FormSection/FormSection';

const data = [
  {
    name: 'Page A',
    uv: 40,
    pv: 24,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 30,
    pv: 13,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 20,
    pv: 98,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 27,
    pv: 39,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 18,
    pv: 48,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 23,
    pv: 38,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 34,
    pv: 43,
    amt: 2100,
  },
];

export const LockLiquidityChart: FC = () => (
  <FormSection title="LP Fees">
    <BarChart width={400} height={190} data={data} barCategoryGap={0}>
      <Tooltip />
      <Bar dataKey="uv" fill="#177DDC" />
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
  </FormSection>
);
