import { Slider } from 'antd';
import React from 'react';

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

const S = (): JSX.Element => {
  return <Slider marks={marks} defaultValue={50} autoFocus />;
};

export { S as Slider };
