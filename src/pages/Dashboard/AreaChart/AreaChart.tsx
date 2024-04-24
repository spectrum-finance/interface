import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

import { LeftTextWithRightSunText } from '../LeftTextWithRightSunText/LeftTextWithRightSunText';
import styles from './AreaChart.module.less';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

const createGradient = (ctx, area) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, 'rgba(38, 138, 255, 0.10)'); // End color
  gradient.addColorStop(1, '#268AFF'); // Start color
  return gradient;
};

const data = {
  labels: [
    '09/22',
    '09/23',
    '09/24',
    '09/25',
    '09/26',
    '09/27',
    '09/28',
    '09/29',
    '09/30',
  ],
  datasets: [
    {
      fill: true,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return null;
        }
        return createGradient(ctx, chartArea);
      },
      borderColor: '#268AFF',
      tension: 0.1, // Uncommented for smooth curves
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      position: 'right' as const, // Position the y-axis on the right side
      ticks: {
        padding: 15, // Adjust padding for x-axis labels
        color: 'rgba(255, 255, 255, 0.6)', // Color for y-axis labels
      },
      grid: {
        display: false, // Hide the grid lines for y-axis
      },
    },
    x: {
      ticks: {
        padding: 15, // Adjust padding for x-axis labels
        color: 'rgba(255, 255, 255, 0.6)', // Color for x-axis labels
        maxTicksLimit: 8,
      },
      grid: {
        display: false, // Hide the grid lines for x-axis
      },
    },
  },
  plugins: {
    legend: {
      display: false, // Hide legend by default
    },
  },
  elements: {
    line: {
      borderColor: 'transparent', // Uncommented to remove stroke for area chart effect
    },
    point: {
      backgroundColor: 'rgba(93, 104, 104, 0.5)', // Adjusted for area chart fill
      radius: 2,
    },
  },
};

const AreaChartContainer = styled.div<{ chartHeight?: string }>`
  height: ${(props) => props.chartHeight ?? '100%'};
  position: relative;
  width: 100%;
  margin: 0 auto;
`;

type AreaChartProps = {
  topLeftAndRightComponent?: {
    left: { title: string };
    right: { title: string; subTitle: string };
  };
  topLeftComponentData?: {
    title: string;
    subTitle: string;
    performanceSummary: ReactNode;
  };
  chartProps?: { width?: string | number; height?: string | number };
  horizontalLabels: string[];
  verticalData: {
    label: string;
    data: number[];
  };
};

export const AreaChart = ({
  topLeftComponentData,
  topLeftAndRightComponent,
  chartProps,
  horizontalLabels,
  verticalData,
}: AreaChartProps) => {
  return (
    <div>
      {topLeftAndRightComponent && (
        <LeftTextWithRightSunText
          left={{ title: topLeftAndRightComponent.left.title }}
          right={{
            title: topLeftAndRightComponent.right.title,
            subTitle: topLeftAndRightComponent.right.subTitle,
          }}
        />
      )}

      {/* Chart left component Data */}
      {!!topLeftComponentData && (
        <div className={styles.chartData}>
          <div className={styles.title}>{topLeftComponentData.title}</div>
          <div className={styles.description}>
            {topLeftComponentData.subTitle}
          </div>
          <div className={styles.thisWeekData}>
            {topLeftComponentData?.performanceSummary}
          </div>
        </div>
      )}

      <AreaChartContainer
        chartHeight={chartProps?.height as string}
        className={styles.volumeChartContainer}
      >
        <Line
          {...chartProps}
          data={{
            ...data,
            labels: horizontalLabels,
            datasets: [{ ...data.datasets[0], ...verticalData }],
          }}
          options={options}
        />
      </AreaChartContainer>
    </div>
  );
};
