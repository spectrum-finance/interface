import './NetworkDropdown.less';

import cn from 'classnames';
import capitalize from 'lodash/capitalize';
import React, { useState } from 'react';

import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Typography,
} from '../../ergodex-cdk';
import { TokenIcon } from '../TokenIcon/TokenIcon';

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
          `network-dropdown__btn`,
          `network-dropdown__btn--${network.name}`,
        )}
        size="large"
        type="ghost"
      >
        <Flex justify="center" flexDirection="row">
          <Flex.Item marginRight={1}>
            <TokenIcon
              name={`${network.token}${disabled ? '-disabled' : ''}`}
            />
          </Flex.Item>
          <Flex.Item marginRight={1}>
            <Typography.Text
              style={{ color: 'var(--ergo-networkdropdown-hover-focus-color)' }}
            >
              {capitalize(network.name)}
            </Typography.Text>
          </Flex.Item>
          <Flex.Item>
            <DownOutlined
              style={{ color: 'var(--ergo-networkdropdown-hover-focus-color)' }}
            />
          </Flex.Item>
        </Flex>
      </Button>
    </Dropdown>
  );
};
