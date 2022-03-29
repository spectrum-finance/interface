import './NetworkDropdown.less';

import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Trans } from '@lingui/macro';
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

type Network = { name: string; token: AssetInfo; isDisabled: boolean };

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
      className="network-dropdown__menu"
      onClick={({ key }) => {
        setNetwork(networks.find((n) => n.name === key) || networks[0]);
        if (onSetNetwork) {
          onSetNetwork(key);
        }
      }}
      style={{ padding: '8px', width: '170px' }}
    >
      <Typography.Body className="network-dropdown__menu-title" strong>
        <Trans>Select Network</Trans>
      </Typography.Body>
      {networks.map(({ name, token, isDisabled }) => (
        <Menu.Item key={name} disabled={isDisabled}>
          <Flex
            className={
              network.name === name ? 'network-dropdown-item__active' : ''
            }
          >
            <TokenIcon asset={token} />
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
        <Flex justify="center" direction="row" align="center">
          <TokenIcon asset={network.token} />
          <Typography.Text
            className="network-dropdown__btn-text"
            style={{
              fontSize: '16px',
              color: 'var(--ergo-networkdropdown-hover-focus-color)',
              marginLeft: 'calc(var(--ergo-base-gutter) * 2)',
            }}
          >
            {capitalize(network.name)}
          </Typography.Text>
          <DownOutlined
            style={{
              color: 'var(--ergo-networkdropdown-hover-focus-color)',
              marginLeft: 'calc(var(--ergo-base-gutter) * 2)',
            }}
          />
        </Flex>
      </Button>
    </Dropdown>
  );
};
