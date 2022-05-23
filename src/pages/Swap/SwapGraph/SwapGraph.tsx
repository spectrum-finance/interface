import { t } from '@lingui/macro';
import { DateTime, Duration, DurationLike } from 'luxon';
import React, { useCallback, useState } from 'react';
import { useMemo } from 'react';
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';

import { useObservable } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { getPoolChartData } from '../../../common/streams/poolChart';
import { TokenIconPair } from '../../../components/AssetIconPair/TokenIconPair';
import { Truncate } from '../../../components/Truncate/Truncate';
import { Button, Flex, Tabs, Typography } from '../../../ergodex-cdk';
import { useActiveData } from './useActiveData';
import { Period, usePeriodSettings } from './usePeriodSettings';

const getTicksArray = (
  tick: DurationLike,
  durationOffset: DurationLike,
  preLastFromNow: (d: DateTime) => DateTime,
): DateTime[] => {
  const now = DateTime.now();
  const tickMillis = Duration.fromDurationLike(tick).toMillis();
  const preLast = preLastFromNow(now);

  now.minus(tick);
  return Array(
    Math.floor(now.diff(now.minus(durationOffset)).toMillis() / tickMillis),
  )
    .fill(undefined)
    .map((_, i) =>
      preLast.minus({
        millisecond: tickMillis * i,
      }),
    )
    .reverse();
};

interface SwapGraphProps {
  pool: AmmPool;
}

export const SwapGraph: React.FC<SwapGraphProps> = ({ pool }) => {
  const [defaultActivePeriod, setDefaultActivePeriod] = useState<Period>('D');
  const [isInverted, setInverted] = useState(false);
  const { durationOffset, timeFormat, tick, preLastFromNow, resolution } =
    usePeriodSettings(defaultActivePeriod);

  const ticks = useMemo(
    () => getTicksArray(tick, durationOffset, preLastFromNow),
    [defaultActivePeriod],
  );

  const getData = () =>
    getPoolChartData(pool, {
      from: DateTime.now().minus(durationOffset).valueOf(),
      resolution,
    });

  const [rawData] = useObservable(getData, [pool.id, defaultActivePeriod], []);

  const data = useMemo(() => {
    if (rawData.length < 1) {
      return [];
    }

    let j = -1;
    const res = ticks
      .filter((lts) => lts.valueOf() > rawData[0].ts)
      .map((lts: DateTime) => {
        while (rawData[j + 1]?.ts < lts.valueOf()) {
          j++;
        }
        return rawData[j === -1 ? 0 : j].clone({ timestamp: lts.valueOf() });
      });
    res.push(rawData[rawData.length - 1]);
    return res;
  }, [rawData]);

  const [activeData, setActiveData] = useActiveData(data);

  const formatXAxis = useCallback(
    (ts: number) => DateTime.fromMillis(ts).toLocaleString(timeFormat),
    [defaultActivePeriod],
  );

  return (
    <Flex col style={{ position: 'relative' }}>
      <Flex.Item marginTop={4} marginLeft={6} marginRight={4}>
        <Flex align="center">
          <TokenIconPair
            size="small"
            assetX={pool?.x.asset}
            assetY={pool?.y.asset}
          />
          <Flex.Item marginRight={1} marginLeft={1}>
            <Typography.Title level={4}>
              <Truncate>{pool?.x.asset.name}</Truncate> /{' '}
              <Truncate>{pool?.y.asset.name}</Truncate>
            </Typography.Title>
          </Flex.Item>
          <Flex.Item marginRight={2}>
            <Button size="small" onClick={() => setInverted(!isInverted)}>
              {t`Switch ratio`}
            </Button>
          </Flex.Item>

          <Flex.Item style={{ marginLeft: 'auto' }}>
            <Tabs
              defaultActiveKey={defaultActivePeriod}
              onChange={(key) => setDefaultActivePeriod(key)}
            >
              <Tabs.TabPane tab="D" key="D" />
              <Tabs.TabPane tab="W" key="W" />
              <Tabs.TabPane tab="M" key="M" />
              <Tabs.TabPane tab="Y" key="Y" />
            </Tabs>
          </Flex.Item>
        </Flex>
      </Flex.Item>
      {activeData && (
        <>
          <Flex align="flex-end">
            <Flex.Item marginLeft={6} marginRight={2}>
              <Typography.Title level={2}>
                {activeData.getRatio(isInverted).toString()}
              </Typography.Title>
            </Flex.Item>
            <Flex.Item marginBottom={0.5}>
              <Typography.Title level={4}>
                <Truncate>
                  {activeData.getRatio(isInverted).baseAsset.name}
                </Truncate>
                {' / '}
                <Truncate>
                  {activeData.getRatio(isInverted).quoteAsset.name}
                </Truncate>
              </Typography.Title>
            </Flex.Item>
          </Flex>
          <Typography.Text style={{ marginLeft: '24px' }} type="secondary">
            {activeData.date.toLocaleString(DateTime.DATETIME_MED)}
          </Typography.Text>
        </>
      )}
      <Flex.Item marginLeft={6}>
        <AreaChart
          width={624}
          height={320}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          reverseStackOrder
          onMouseMove={(state: any) => {
            setActiveData(state?.activePayload?.[0]?.payload);
          }}
          syncMethod="index"
          onMouseLeave={() => setActiveData(null)}
        >
          <YAxis
            dataKey={isInverted ? 'invertedPrice' : 'price'}
            type="number"
            domain={['auto', 'auto']}
            hide
          />
          <XAxis dataKey="ts" scale="time" tickFormatter={formatXAxis} />
          <defs>
            <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
              <stop
                stopColor="var(--ergo-primary-color-hover)"
                stopOpacity="0.5"
              />
              <stop
                offset="1"
                stopColor="var(--ergo-primary-color-hover)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <Tooltip wrapperStyle={{ display: 'none' }} formatter={() => null} />
          <Area
            dataKey={isInverted ? 'invertedPrice' : 'price'}
            stroke="var(--ergo-primary-color-hover)"
            fill="url(#gradientColor)"
          />
        </AreaChart>
      </Flex.Item>
    </Flex>
  );
};
