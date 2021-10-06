import './NetworkDropdown.less';

import cn from 'classnames';
import capitalize from 'lodash/capitalize';
import React, { useState } from 'react';

import { Button, DownOutlined, Dropdown, Menu, TokenIcon } from '../index';

type Network = { name: string; token: string };

interface NetworkDropdownProps {
  networks: Array<Network>;
  onSetNetwork?: (val: string) => void;
  disabled?: boolean;
}

export const NetworkDropdown: React.FC<NetworkDropdownProps> = ({
  networks,
  onSetNetwork,
  disabled,
}) => {
  const [network, setNetwork] = useState<Network>(networks[0]);

  const overlay = (
    <Menu
      onClick={({ key }) => {
        setNetwork(networks.find((n) => n.name === key) || networks[0]);
        if (onSetNetwork) {
          onSetNetwork(key);
        }
      }}
    >
      {networks.map((network) => (
        <Menu.Item key={network.name} icon={<TokenIcon name={network.token} />}>
          {capitalize(network.name)}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={overlay} trigger={['click']} disabled={disabled}>
      <Button
        className={cn(
          `NetworkDropdown__container`,
          `NetworkDropdown__container--${network.name}`,
        )}
        size="large"
      >
        <TokenIcon
          className="NetworkDropdown__token-icon"
          name={`${network.token}${disabled ? '-disabled' : ''}`}
        />
        <span>{capitalize(network.name)}</span>
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};
