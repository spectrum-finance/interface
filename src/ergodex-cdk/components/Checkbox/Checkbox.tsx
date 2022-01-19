import './Checkbox.less';

import { Checkbox as BaseCheckbox, CheckboxProps } from 'antd';
import React from 'react';

import { Typography } from '../Typography/Typography';

const Checkbox: React.FC<
  { children?: React.ReactChild | React.ReactChild[] } & CheckboxProps
> = ({ children, ...rest }) => {
  return (
    <BaseCheckbox {...rest}>
      <Typography.Body>{children}</Typography.Body>
    </BaseCheckbox>
  );
};

export { Checkbox };
