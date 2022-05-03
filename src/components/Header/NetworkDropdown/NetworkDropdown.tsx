import './NetworkDropdown.less';

import { Trans } from '@lingui/macro';
import cn from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';

import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Typography,
} from '../../../ergodex-cdk';
import {
  changeSelectedNetwork,
  networks,
  useSelectedNetwork,
} from '../../../gateway/common/network';
import { AssetIcon } from '../../AssetIcon/AssetIcon';

interface NetworkDropdownProps {
  onSetNetwork?: (val: string) => void;
  disabled?: boolean;
}

export const NetworkDropdown: React.FC<NetworkDropdownProps> = ({
  disabled,
}) => {
  const [selectedNetwork] = useSelectedNetwork();

  const overlay = (
    <Menu
      className="network-dropdown__menu"
      style={{ padding: '8px', minWidth: '170px' }}
    >
      <Typography.Body className="network-dropdown__menu-title" strong>
        <Trans>Select Network</Trans>
      </Typography.Body>
      {networks.map((network) => (
        <Menu.Item
          key={network.name}
          onClick={() => {
            changeSelectedNetwork(network);
          }}
        >
          <Flex
            className={
              selectedNetwork.name === network.name
                ? 'network-dropdown-item__active'
                : ''
            }
          >
            <AssetIcon asset={network.networkAsset} />
            <span style={{ marginLeft: '8px' }}>
              {capitalize(network.name)}
            </span>
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
          `network-dropdown__btn--${selectedNetwork.name}`,
        )}
        size="large"
        type="ghost"
      >
        <Flex justify="center" direction="row" align="center">
          <AssetIcon asset={selectedNetwork.networkAsset} />
          <Typography.Text
            className="network-dropdown__btn-text"
            style={{
              fontSize: '16px',
              color: 'var(--ergo-networkdropdown-hover-focus-color)',
              marginLeft: 'calc(var(--ergo-base-gutter) * 2)',
            }}
          >
            {capitalize(selectedNetwork.name)}
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
