import './PriceHistory.less';

import {
  Box,
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
import { FC, useCallback, useMemo, useState } from 'react';
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
import { PoolChartData } from '../../../common/models/PoolChartData';
import { Position } from '../../../common/models/Position';
import { DateTimeView } from '../../../components/common/DateTimeView/DateTimeView';
import { Truncate } from '../../../components/Truncate/Truncate';
import { getPoolChartData } from '../../../gateway/api/getPoolChartData';
import { useAggregatedByDateData } from '../../Swap/SwapGraph/useAggregatedByDateData';
import {
  Period,
  usePeriodSettings,
} from '../../Swap/SwapGraph/usePeriodSettings';
import { useTicks } from '../../Swap/SwapGraph/useTicks';
import { Difference } from './Difference/Difference';

const SmallTabs = styled(Tabs)`
  &.ant-tabs-small > .ant-tabs-nav .ant-tabs-tab {
    padding: 0 calc(var(--spectrum-base-gutter) * 2);
  }

  &.ant-tabs.ant-tabs-small .ant-tabs-nav-list {
    height: 1.5rem;
  }

  .ant-tabs-ink-bar {
    padding: var(--spectrum-base-gutter) calc(3 * var(--spectrum-base-gutter));
  }
`;

const ChartWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export interface PriceHistoryProps {
  readonly position: Position;
}

export const PriceHistory: FC<PriceHistoryProps> = ({ position: { pool } }) => {
  const [defaultActivePeriod, setDefaultActivePeriod] = useState<Period>('D');
  const { s, valBySize } = useDevice();
  const [isInverted, setIsInverted] = useState(false);
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

  return (
    <Box
      glass
      borderRadius="l"
      padding={[4, 4, 0, 4]}
      height={valBySize(undefined, 277, 291)}
    >
      <Flex col stretch>
        <Flex.Item marginBottom={2} display="flex" justify="space-between">
          <Flex.Item marginRight={1}>
            <Typography.Body strong>
              <Trans>Price chart</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item display="flex">
            <Flex.Item>
              <Button
                type="text"
                onClick={() => setIsInverted((prev) => !prev)}
                size="small"
                icon={<SwapOutlined />}
              />
            </Flex.Item>
            <Flex.Item>
              <SmallTabs
                defaultActiveKey={defaultActivePeriod}
                onChange={(key) => setDefaultActivePeriod(key)}
                size="small"
                centered
              >
                <Tabs.TabPane tab="D" key="D" />
                <Tabs.TabPane tab="W" key="W" />
                <Tabs.TabPane tab="M" key="M" />
                <Tabs.TabPane tab="Y" key="Y" />
              </SmallTabs>
            </Flex.Item>
          </Flex.Item>
        </Flex.Item>
        {isEmpty && !loading && (
          <Flex.Item flex={1} align="center" justify="center">
            <Empty>
              <Trans>Not enough data</Trans>
            </Empty>
          </Flex.Item>
        )}
        {!isEmpty && (
          <>
            {active && (
              <>
                <Flex.Item display="flex" align="center">
                  <Flex.Item marginRight={1}>
                    <Typography.Body size="small" strong>
                      <Truncate>
                        {active.getRatio(isInverted).quoteAsset.ticker}
                      </Truncate>
                      {' / '}
                      <Truncate>
                        {active.getRatio(isInverted).baseAsset.ticker}
                      </Truncate>
                    </Typography.Body>
                  </Flex.Item>
                  <Flex.Item marginRight={1}>
                    <Typography.Title level={5}>
                      {active.getRatio(isInverted).toString()}
                    </Typography.Title>
                  </Flex.Item>

                  <Flex.Item marginRight={1}>
                    {showDiff && (
                      <Difference
                        ratioX={differenceX.getRatio(isInverted)}
                        ratioY={differenceY.getRatio(isInverted)}
                      />
                    )}
                  </Flex.Item>
                </Flex.Item>
                <Flex.Item>
                  <Typography.Body secondary size="extra-small">
                    <DateTimeView
                      type="datetimeWithWeekday"
                      value={active.date}
                    />
                  </Typography.Body>
                </Flex.Item>
              </>
            )}
            <Flex.Item
              style={{
                position: 'relative',
                height: s ? 158 : 'unset',
                display: loading ? 'none' : 'flex',
              }}
              flex={s ? undefined : 1}
            >
              <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    className="pool-price-chart"
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
                      width={35}
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
                      <linearGradient
                        id="gradientColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
          </>
        )}
        {loading && (
          <Flex.Item flex={1} align="center" justify="center" col>
            <Spin indicator={<LoadingOutlined />} size="large" />
            <Typography.Body secondary size="large">
              <Trans>Loading</Trans>
            </Typography.Body>
          </Flex.Item>
        )}
      </Flex>
    </Box>
  );
};
