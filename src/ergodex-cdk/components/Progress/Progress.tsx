import './Progress.less';

import { Progress as BaseProgress } from 'antd';
import React from 'react';
import { FC } from 'react';

import { Typography } from '../Typography/Typography';
interface ProgressProps {
  readonly percent: number;
}

export const Progress: FC<ProgressProps> = ({ percent }) => (
  <div className="ant-progress-container">
    <BaseProgress percent={percent} showInfo={false} strokeWidth={40} />
    <Typography.Text className="progress-text">{percent}%</Typography.Text>
  </div>
);
