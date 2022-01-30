import './Progress.less';

import { Progress as BaseProgress } from 'antd';
import React from 'react';
import { FC } from 'react';

import { renderPercent } from '../../utils/percent';
import { Typography } from '../Typography/Typography';

interface ProgressProps {
  readonly percent: number;
}

export const Progress: FC<ProgressProps> = ({ percent }) => (
  <div className="ant-progress-container">
    <BaseProgress percent={percent} showInfo={false} strokeWidth={40} />
    <Typography.Text className="progress-text">
      {renderPercent(percent)}
    </Typography.Text>
  </div>
);
