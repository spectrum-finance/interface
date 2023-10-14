import './NetworkDropdown.less';
import '../../../../../assets/styles/styles.less';

import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { fireAnalyticsEvent, user } from '@spectrumlabs/analytics';
import capitalize from 'lodash/capitalize';
import * as React from 'react';

import {
  changeSelectedNetwork,
  useSelectedNetwork,
  visibleNetworks,
} from '../../../../../gateway/common/network';
import { AssetIcon } from '../../../../AssetIcon/AssetIcon';

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
      {visibleNetworks.map((network) => (
        <Menu.Item
          key={network.name}
          onClick={() => {
            fireAnalyticsEvent('Select Network', {
              network: network.name,
            });
            user.set('network_active', network.name);
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
              {capitalize(network.label)}
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
      <Button className="network-dropdown-selected" size="large">
        <Flex justify="center" direction="row" align="center">
          <AssetIcon asset={selectedNetwork.networkAsset} />
          <DownOutlined
            style={{
              marginLeft: 'calc(var(--spectrum-base-gutter) * 2)',
              color: 'var(--spectrum-text-white)',
            }}
          />
        </Flex>
      </Button>
    </Dropdown>
  );
};
