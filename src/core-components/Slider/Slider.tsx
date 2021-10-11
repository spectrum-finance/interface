import './Slider.less';

import { Slider as AntSlider, SliderSingleProps } from 'antd';
import React from 'react';

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

const Slider: React.FC<SliderSingleProps> = (props): JSX.Element => {
  return <AntSlider marks={marks} defaultValue={50} {...props} />;
};

export { Slider };
