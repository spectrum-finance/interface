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
} from '../../../ergodex-cdk';
import { TokenIcon } from '../../TokenIcon/TokenIcon';

type Network = { name: string; token: string; isDisabled: boolean };

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
      style={{ padding: '8px', width: '150px' }}
    >
      {networks.map(({ name, token, isDisabled }) => (
        <Menu.Item key={name} disabled={isDisabled}>
          <Flex>
            <TokenIcon name={!isDisabled ? token : `${token}-disabled`} />
            <span style={{ marginLeft: '8px' }}>{capitalize(name)}</span>
          </Flex>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={overlay}
      placement="bottomRight"
      trigger={['click']}
      disabled={disabled}
    >
      <Button
        className={cn(
          `network-dropdown__btn`,
          `network-dropdown__btn--${network.name}`,
        )}
        size="large"
        type="ghost"
      >
        <Flex justify="center" flexDirection="row" alignItems="center">
          <TokenIcon name={`${network.token}${disabled ? '-disabled' : ''}`} />
          <Typography.Body
            style={{
              color: 'var(--ergo-networkdropdown-hover-focus-color)',
              marginLeft: '8px',
            }}
          >
            {capitalize(network.name)}
          </Typography.Body>
          <DownOutlined
            style={{
              color: 'var(--ergo-networkdropdown-hover-focus-color)',
              marginLeft: '8px',
            }}
          />
        </Flex>
      </Button>
    </Dropdown>
  );
};
