import './Spin.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin as BaseSpin, SpinProps } from 'antd';
import React from 'react';

export const Spin: React.FC<SpinProps> = ({ indicator, ...other }) => (
  <BaseSpin indicator={indicator || <LoadingOutlined />} {...other} />
);
