import { BaseType } from 'antd/lib/typography/Base';
import React from 'react';

import { Ratio } from '../../../../common/models/Ratio';
import { Typography } from '../../../../ergodex-cdk';

interface DifferenceProps {
  ratioX: Ratio;
  ratioY: Ratio;
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

export const Difference: React.FC<DifferenceProps> = ({ ratioX, ratioY }) => {
  const diff = ratioY.minus(ratioX);
  const isPositive = diff.isPositive();

  const arrow = isPositive ? '↑' : '↓';
  const percent = Number(
    Math.abs(diff.valueOf() / ratioX.valueOf()) * 100,
  ).toFixed(2);
  const diffValue = diff.toAbsoluteString();

  return (
    <Typography.Title level={4} type={textType(diff.amount)}>{`${arrow}${
      diff.amount !== 0n ? diffValue : '-'
    } (${arrow}${percent}%)`}</Typography.Title>
  );
};
