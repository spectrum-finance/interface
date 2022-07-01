import { Animation, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import first from 'lodash/first';
import last from 'lodash/last';
import React, { FC, useMemo, useState } from 'react';
import { Area, AreaChart, YAxis } from 'recharts';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { PoolChartData } from '../../../../../../common/models/PoolChartData';
import { makeId } from '../../../../../../common/utils/makeId';
import { useAggregatedByDateData } from '../../../../../Swap/SwapGraph/useAggregatedByDateData';
import { usePeriodSettings } from '../../../../../Swap/SwapGraph/usePeriodSettings';
import { useTicks } from '../../../../../Swap/SwapGraph/useTicks';
import { DefaultAreaDef } from './areaDefs/DefaultAreaDef/DefaultAreaDef';
import { FallAreaDef } from './areaDefs/FallAreaDef/FallAreaDef';
import { RiseAreaDef } from './areaDefs/RiseAreaDef/RiseAreaDef';

export interface RatioColumnProps {
  readonly ammPool: AmmPool;
}

enum AreaTrend {
  RISE,
  FALL,
  DEFAULT,
}

const getAreaTrend = (data: PoolChartData[]): AreaTrend => {
  const firstPrice = first(data) as PoolChartData;
  const currentPrice = last(data) as PoolChartData;

  if (firstPrice.price.valueOf() > currentPrice.price.valueOf()) {
    return AreaTrend.FALL;
  } else if (currentPrice.price.valueOf() > firstPrice.price.valueOf()) {
    return AreaTrend.RISE;
  }
  return AreaTrend.DEFAULT;
};

export const RatioColumn: FC<RatioColumnProps> = ({ ammPool }) => {
  const id = useMemo(() => makeId(6), []);
  const [[stroke, fill], setAreaStyles] = useState<[string, string]>(['', '']);

  const { durationOffset, tick } = usePeriodSettings('TINY_D');
  const ticks = useTicks(tick, durationOffset, []);

  const data = useAggregatedByDateData(ammPool.dayRatioTrend, ticks);
  const dataKey = (data: PoolChartData) => data.getRatio().valueOf();
  const isDataEmpty = data.length < 2;
  const areaTrend = isDataEmpty ? undefined : getAreaTrend(data);

  return (
    <>
      {!isDataEmpty ? (
        <Animation.FadeIn delay={100}>
          <AreaChart
            width={92}
            syncMethod="index"
            height={48}
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              {areaTrend === AreaTrend.FALL && (
                <FallAreaDef id={id} onAreaStylesChange={setAreaStyles} />
              )}
              {areaTrend === AreaTrend.RISE && (
                <RiseAreaDef id={id} onAreaStylesChange={setAreaStyles} />
              )}
              {areaTrend === AreaTrend.DEFAULT && (
                <DefaultAreaDef id={id} onAreaStylesChange={setAreaStyles} />
              )}
            </defs>
            <YAxis
              dataKey={dataKey}
              type="number"
              domain={['auto', 'auto']}
              hide
            />
            <Area
              isAnimationActive={false}
              dataKey={dataKey}
              stroke={stroke}
              fill={fill}
            />
          </AreaChart>
        </Animation.FadeIn>
      ) : (
        <Typography.Footnote align="center">
          <Trans>Not enough data</Trans>
        </Typography.Footnote>
      )}
    </>
  );
};
