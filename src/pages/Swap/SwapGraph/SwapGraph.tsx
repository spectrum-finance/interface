import { t } from '@lingui/macro';
import { DateTime, DurationLike } from 'luxon';
import React, { useCallback, useEffect, useState } from 'react';
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';

import { useObservable } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { PoolChartData } from '../../../common/models/PoolChartData';
import { getPoolChartData } from '../../../common/streams/poolChart';
import { TokenIconPair } from '../../../components/AssetIconPair/TokenIconPair';
import { Truncate } from '../../../components/Truncate/Truncate';
import { Button, Flex, Tabs, Typography } from '../../../ergodex-cdk';

interface SwapGraphProps {
  pool: AmmPool;
}

type Period = 'D' | 'W' | 'M' | 'Y' | string;

const getDurationFromPeriod = (period: Period): DurationLike => {
  switch (period) {
    case 'D':
    default:
      return { day: 1 };
    case 'W':
      return { week: 1 };
    case 'M':
      return { month: 1 };
    case 'Y':
      return { year: 1 };
  }
};

const getFormatXAxis = (period: Period): Intl.DateTimeFormatOptions => {
  switch (period) {
    case 'D':
      return DateTime.TIME_SIMPLE;
    default:
    case 'W':
    case 'M':
    case 'Y':
      return {
        month: 'long',
        day: 'numeric',
      };
  }
};

export const SwapGraph: React.FC<SwapGraphProps> = ({ pool }) => {
  const [defaultActivePeriod, setDefaultActivePeriod] = useState<Period>('D');
  const [isInverted, setInverted] = useState(false);
  const getData = () =>
    getPoolChartData(pool, {
      from: DateTime.now()
        .minus(getDurationFromPeriod(defaultActivePeriod))
        .valueOf(),
    });
  const [data] = useObservable(getData, [pool.id, defaultActivePeriod], []);

  const [activeData, setActiveData] = useState<PoolChartData>(
    data[data.length - 1],
  );
  useEffect(() => {
    setActiveData(data[data.length - 1]);
  }, [data]);

  const onPeriodChange = (key: string) => {
    setDefaultActivePeriod(key);
  };

  const formatXAxis = useCallback(
    (ts: number) =>
      DateTime.fromMillis(ts).toLocaleString(
        getFormatXAxis(defaultActivePeriod),
      ),
    [defaultActivePeriod],
  );

  return (
    <Flex col style={{ position: 'relative' }}>
      <Flex.Item>
        <Flex
          align="center"
          style={{ marginTop: '16px', marginLeft: '24px', marginRight: '16px' }}
        >
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
              onChange={onPeriodChange}
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
          onMouseMove={(state: any) => {
            const active = state?.activePayload?.[0]?.payload;
            setActiveData(active || data[data.length - 1]);
          }}
          onMouseLeave={() => setActiveData(data[data.length - 1])}
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
