import { Alert, Box, Typography } from '@ergolabs/ui-kit';
import { AlertProps } from 'antd/lib/alert';
import { BaseType } from 'antd/lib/typography/Base';
import React from 'react';

import { Ratio } from '../../../../common/models/Ratio';

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

const alertType = (num: number | bigint): AlertProps['type'] => {
  if (num > 0) {
    return 'success';
  }
  if (num < 0) {
    return 'error';
  }
  return undefined;
};

export const Difference: React.FC<DifferenceProps> = ({ ratioX, ratioY }) => {
  const diff = ratioY.minus(ratioX);
  const isPositive = diff.isPositive();
  const isNotZero = diff.amount !== 0n;

  const arrow = isNotZero ? (isPositive ? '↑' : '↓') : '';
  const diffValue = diff.toAbsoluteString();
  const _alertType = alertType(diff.amount);
  const _textType = textType(diff.amount);

  const content = (
    <Typography.Body
      size="small"
      type={_textType === 'secondary' ? undefined : _textType}
      secondary={_textType === 'secondary'}
    >{`${arrow}${isNotZero ? diffValue : '-'}`}</Typography.Body>
  );

  if (!_alertType) {
    return (
      <Box borderRadius="s" padding={[0, 2]} glass secondary>
        {content}
      </Box>
    );
  }

  return (
    <Alert
      borderRadius="s"
      type={alertType(diff.amount)}
      style={{ padding: '0px 8px' }}
      message={content}
    />
  );
};
