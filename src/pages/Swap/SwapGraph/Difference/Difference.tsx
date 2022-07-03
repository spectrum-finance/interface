import { BaseType } from 'antd/lib/typography/Base';
import React from 'react';

import { Ratio } from '../../../../common/models/Ratio';
import { Typography } from '../../../../ergodex-cdk';

interface DifferenceProps {
  ratioX: Ratio;
  ratioY: Ratio;
  level?: 5 | 4 | 3 | 2 | 1;
}

const textType = (num: number | bigint): BaseType => {
  if (num > 0) {
    return 'success';
  }
  if (num < 0) {
    return 'danger';
  }
  return 'secondary';
};

export const Difference: React.FC<DifferenceProps> = ({
  ratioX,
  ratioY,
  level = 4,
}) => {
  const diff = ratioY.minus(ratioX);
  const isPositive = diff.isPositive();
  const isNotZero = diff.amount !== 0n;

  const arrow = isNotZero ? (isPositive ? '↑' : '↓') : '';
  const percent = Number(Math.abs(diff.valueOf() / ratioX.valueOf()) * 100);
  const diffValue = diff.toAbsoluteString();

  return (
    <Typography.Title level={level} type={textType(diff.amount)}>{`${arrow}${
      isNotZero ? diffValue : '-'
    } (${arrow}${percent.toFixed(percent !== 0 ? 2 : 0)}%)`}</Typography.Title>
  );
};
