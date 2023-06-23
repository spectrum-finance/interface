import { Box, Button, Dropdown, Menu } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

import { BadgeCustom } from '../../BadgeCustom/BadgeCustom.tsx';
import { DotsIcon } from '../Icons/DotsIcon';

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
  isBadgeShown?: boolean;
}

const OptionsButton: FC<OptionsButtonProps> = ({
  children,
  type,
  size,
  width,
  placement,
  isBadgeShown,
}) => {
  return (
    <BadgeCustom isShow={isBadgeShown}>
      <Dropdown
        overlay={
          <Menu style={{ width: width ? width : 160, padding: 0 }}>
            <Box secondary padding={2} borderRadius="l">
              {children}
            </Box>
          </Menu>
        }
        trigger={['click']}
        placement={placement}
      >
        <Button
          type={type ? type : 'default'}
          size={size ? size : 'middle'}
          icon={<DotsIcon />}
          onClick={(event) => event.stopPropagation()}
        />
      </Dropdown>
    </BadgeCustom>
  );
};

export { OptionsButton };
