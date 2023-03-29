import {
  Button,
  Empty,
  Flex,
  LoadingOutlined,
  Spin,
  SwapOutlined,
  Tabs,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import sortedUniqBy from 'lodash/sortedUniqBy';
import { DateTime } from 'luxon';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';

import { useObservable } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { AssetInfo } from '../../../common/models/AssetInfo';
import { PoolChartData } from '../../../common/models/PoolChartData';
import { AssetPairTitle } from '../../../components/AssetPairTitle/AssetPairTitle';
import { DateTimeView } from '../../../components/common/DateTimeView/DateTimeView';
import { getPoolChartData } from '../../../gateway/api/getPoolChartData';
import { Difference } from './Difference/Difference';
import { useAggregatedByDateData } from './useAggregatedByDateData';
import { Period, usePeriodSettings } from './usePeriodSettings';
import { useTicks } from './useTicks';

interface SwapGraphProps {
  fromAsset?: AssetInfo;
  pool?: AmmPool;
  isReversed?: boolean;
  setReversed?: (inv: boolean) => void;
}

interface AbsoluteContainerProps {
  className?: string;
  children?: ReactNode;
}

const _AbsoluteContainer: React.FC<AbsoluteContainerProps> = ({
  className,
  children,
}) => (
  <Flex
    position="absolute"
    col
    justify="center"
    className={className}
    align="center"
  >
    {children}
  </Flex>
);

const AbsoluteContainer = styled(_AbsoluteContainer)`
  top: 60px;
  border-radius: 8px;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ChartWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

export const SwapGraph: React.FC<SwapGraphProps> = ({
  pool,
  isReversed = false,
  setReversed,
  fromAsset,
}) => {
  const [defaultActivePeriod, setDefaultActivePeriod] = useState<Period>('D');
  const { s, valBySize } = useDevice();
  const { durationOffset, timeFormat, tick, resolution } =
    usePeriodSettings(defaultActivePeriod);

  const ticks = useTicks(tick, durationOffset, [defaultActivePeriod]);
  const [rawData, loading] = useObservable(
    () =>
      getPoolChartData(pool, {
        from: DateTime.now().minus(durationOffset).valueOf(),
        resolution,
        to: DateTime.now().valueOf(),
      }),
    [pool?.id, defaultActivePeriod],
    [],
  );

  const order = fromAsset !== pool?.x?.asset;
  const isInverted = (order && !isReversed) || (!order && isReversed);
  const data = useAggregatedByDateData(rawData, ticks);
  // recharts couldn't animate when dataKey is changed
  const chartData = useMemo(() => [...data], [data, isInverted]);

  const [activeData, setActiveData] = useState<PoolChartData | null>();

  const isEmpty = data.length === 0;

  const formatXAxis = useCallback(
    (ts: number | string) => {
      if (typeof ts === 'string') {
        return ts;
      }
      return DateTime.fromMillis(ts).toLocaleString(timeFormat);
    },
    [defaultActivePeriod],
  );

  const dataKey = (data: PoolChartData) => data.getRatio(isInverted).valueOf();

  const active = activeData ?? data[data.length - 1];
  const differenceX = data[0];
  const differenceY = data[data.length - 1];
  const showDiff = !activeData;

  const displayedTicks = useMemo(
    () =>
      sortedUniqBy(
        ticks.filter((a) => a.valueOf() > data[0]?.ts),
        (a) => a.toLocaleString(timeFormat),
      ).map((a) => a.valueOf()),
    [data, ticks, timeFormat],
  );
  const tabs = (
    <Tabs
      defaultActiveKey={defaultActivePeriod}
      onChange={(key) => setDefaultActivePeriod(key)}
    >
      <Tabs.TabPane tab="D" key="D" />
      <Tabs.TabPane tab="W" key="W" />
      <Tabs.TabPane tab="M" key="M" />
      <Tabs.TabPane tab="Y" key="Y" />
    </Tabs>
  );

  return (
    <Flex col position="relative">
      <Flex.Item marginTop={4} marginLeft={valBySize(4, 6)} marginRight={4}>
        <Flex align="center">
          {pool && active && (
            <>
              <Flex.Item marginRight={1}>
                <AssetPairTitle
                  level={4}
                  assetX={active.getRatio(isInverted).quoteAsset}
                  assetY={active.getRatio(isInverted).baseAsset}
                />
              </Flex.Item>
              <Flex.Item marginRight={2}>
                <Button
                  type="text"
                  icon={<SwapOutlined />}
                  size="small"
                  onClick={() => setReversed?.(!isReversed)}
                />
              </Flex.Item>
            </>
          )}
          {!s && <Flex.Item marginLeft="auto">{tabs}</Flex.Item>}
        </Flex>
      </Flex.Item>
      {active && !isEmpty && (
        <Flex.Item
          marginTop={valBySize(2, 0)}
          position="absolute"
          style={{ top: 0, left: 0 }}
        >
          <Flex align="flex-end">
            <Flex.Item marginLeft={valBySize(4, 6)} marginRight={2}>
              <Typography.Title level={valBySize(4, 2)}>
                {active.getRatio(isInverted).toString()}
              </Typography.Title>
            </Flex.Item>
            <Flex.Item marginBottom={0.5}>
              {showDiff && (
                <Difference
                  level={valBySize(5, 4)}
                  ratioX={differenceX.getRatio(isInverted)}
                  ratioY={differenceY.getRatio(isInverted)}
                />
              )}
            </Flex.Item>
          </Flex>
          <Flex.Item
            marginLeft={valBySize(4, 6)}
            marginBottom={valBySize(1, 0)}
            marginTop={valBySize(1, 0)}
          >
            <Typography.Body
              style={{
                fontSize: valBySize('12px', '14px'),
              }}
              secondary
            >
              <DateTimeView type="datetimeWithWeekday" value={active.date} />
            </Typography.Body>
          </Flex.Item>
        </Flex.Item>
      )}
      {s && (
        <Flex.Item
          marginLeft={4}
          marginRight={4}
          marginBottom={2}
          marginTop={2}
        >
          {tabs}
        </Flex.Item>
      )}
      <Flex.Item
        marginTop={!active || isEmpty ? 14 : 0}
        marginLeft={4}
        marginRight={4}
        position="relative"
        style={{
          position: 'relative',
          height: valBySize(pool ? 320 : 440, pool ? 320 : 160),
        }}
      >
        <ChartWrapper>
          <ResponsiveContainer
            width="100%"
            height={valBySize(pool ? 320 : 440, pool ? 320 : 160)}
          >
            <AreaChart
              data={chartData}
              reverseStackOrder
              onMouseMove={(state: any) => {
                setActiveData(state?.activePayload?.[0]?.payload);
              }}
              syncMethod="index"
              onMouseLeave={() => setActiveData(null)}
              style={{
                visibility: isEmpty || loading ? 'hidden' : 'visible',
              }}
            >
              <YAxis
                dataKey={dataKey}
                type="number"
                domain={['auto', 'auto']}
              />
              <XAxis
                dataKey="ts"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                ticks={displayedTicks}
                tickFormatter={formatXAxis}
              />
              <defs>
                <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    stopColor="var(--spectrum-primary-color-hover)"
                    stopOpacity="0.5"
                  />
                  <stop
                    offset="1"
                    stopColor="var(--spectrum-primary-color-hover)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <Tooltip
                wrapperStyle={{ display: 'none' }}
                formatter={() => null}
              />
              <Area
                dataKey={dataKey}
                stroke="var(--spectrum-primary-color-hover)"
                fill="url(#gradientColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </Flex.Item>
      {isEmpty && !loading && (
        <AbsoluteContainer>
          <Empty>
            <Typography.Text>
              {pool ? (
                <Trans>Not enough data</Trans>
              ) : (
                <Trans>Select a token</Trans>
              )}
            </Typography.Text>
          </Empty>
        </AbsoluteContainer>
      )}
      {loading && (
        <AbsoluteContainer>
          <Spin indicator={<LoadingOutlined />} size="large" />
          <Typography.Body secondary size="large">
            <Trans>Loading</Trans>
          </Typography.Body>
        </AbsoluteContainer>
      )}
    </Flex>
  );
};
