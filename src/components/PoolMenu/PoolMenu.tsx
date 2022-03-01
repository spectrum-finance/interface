import React from 'react';

import { Button, DownOutlined, Dropdown, Menu } from '../../ergodex-cdk';
import { MenuItem } from './MenuItem';

interface PoolMenuProps {
  value?: string | '';
  fromToken?: string | null;
  toToken?: string | null;
  percent?: number | null;
  disable?: boolean | false;
  className?: string;
}

const PoolMenu: React.FC<PoolMenuProps> = ({
  // fromToken,
  // toToken,
  percent,
  disable,
  className,
}) => {
  const menu = (
    <Menu>
      <Menu.Item className="liquidity__pool-menu-list">
        <MenuItem
          fromToken={undefined}
          toTokenName={undefined}
          percentage={percent}
        />
      </Menu.Item>
      <Menu.Item className="liquidity__pool-menu-list">
        <MenuItem
          fromToken={undefined}
          toTokenName={undefined}
          percentage={percent}
        />
      </Menu.Item>
      <Menu.Item className="liquidity__pool-menu-list">
        <MenuItem
          fromToken={undefined}
          toTokenName={undefined}
          percentage={percent}
        />
      </Menu.Item>
      <Menu.Item className="liquidity__pool-menu-list">
        <MenuItem
          fromToken={undefined}
          toTokenName={undefined}
          percentage={percent}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      className={'liquidity-pool-menu' + className}
      disabled={disable}
    >
      <Button className="liquidity__pool-select">
        Select pools <DownOutlined className="liquidity__pool-select-icon" />
      </Button>
    </Dropdown>
  );
};
export { PoolMenu };
