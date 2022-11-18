import { Typography } from '@ergolabs/ui-kit';
import { Progress as BaseProgress } from 'antd';
import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';

export const renderPercent = (pct: number): string => {
  if (pct > 0.01) {
    return `${pct.toFixed(2)}%`;
  }
  return '< 0.01%';
};

interface ProgressProps {
  readonly percent: number;
  readonly height?: number;
  readonly width?: number | string;
  readonly className?: string;
}

const _Progress: FC<ProgressProps> = ({
  percent,
  className,
  height = 40,
  width = '100%',
}) => (
  <div className={className}>
    <BaseProgress percent={percent} showInfo={false} strokeWidth={height} />
    <Typography.Text className="progress-text">
      {renderPercent(percent)}
    </Typography.Text>
  </div>
);

export const LineProgress = styled(_Progress)`
  position: relative;
  width: ${(props) => props.width};
  background: var(--spectrum-progress-standart-background-bg);
  border-radius: var(--spectrum-border-radius);

  .ant-progress-bg {
    background: linear-gradient(90deg, #7167c5 0%, #49418b 100%);
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
