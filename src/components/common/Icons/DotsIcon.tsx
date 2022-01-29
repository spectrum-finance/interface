import Icon from '@ant-design/icons';
import React, { FC } from 'react';

import { ReactComponent as Dots } from '../../../assets/icons/icon-dots.svg';

const DotsIcon: FC<{ rotate?: boolean }> = ({ rotate }): JSX.Element => (
  <Icon style={{ transform: rotate ? 'rotate(90deg)' : '' }} component={Dots} />
);

export { DotsIcon };
