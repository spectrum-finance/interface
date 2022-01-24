import Icon from '@ant-design/icons';
import { Menu } from 'antd';
import React, { FC, ReactNode } from 'react';

import { ReactComponent as DotsVertical } from '../../../assets/icons/icon-dots-vertical.svg';
import { Box, Button, Dropdown } from '../../../ergodex-cdk';

const DotsIconVertical = () => <Icon component={DotsVertical} />;

type Placement =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

interface OptionsButtonProps {
  children: ReactNode;
  type?: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
  size?: 'small' | 'middle' | 'large' | 'extra-large';
  placement?: Placement;
  width?: number;
}

const OptionsButton: FC<OptionsButtonProps> = ({
  children,
  type,
  size,
  width,
  placement,
}) => {
  return (
    <Dropdown
      overlay={
        <Menu style={{ width: width ? width : 160, padding: 0 }}>
          <Box padding={2}>{children}</Box>
        </Menu>
      }
      trigger={['click']}
      placement={placement}
    >
      <Button
        type={type ? type : 'default'}
        size={size ? size : 'middle'}
        onClick={(event) => event.stopPropagation()}
        icon={<DotsIconVertical />}
      />
    </Dropdown>
  );
};

export { OptionsButton };
