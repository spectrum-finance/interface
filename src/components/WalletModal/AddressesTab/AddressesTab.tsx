import './AddressTab.less';

import { t } from '@lingui/macro';
import React, { useEffect, useState } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Address } from '../../../common/types';
import { Box, Button, Flex, List, Typography } from '../../../ergodex-cdk';
import { addresses$ } from '../../../gateway/api/addresses';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { setSettings, useSettings } from '../../../gateway/settings/settings';
import { getBalance } from '../../../services/yoroi';
import { getShortAddress } from '../../../utils/string/addres';
import { CopyButton } from '../../common/CopyButton/CopyButton';
import { ExploreButton } from '../../common/ExploreButton/ExploreButton';

interface AddressViewProps {
  address: Address;
}

const AddressView: React.FC<AddressViewProps> = ({ address }) => {
  return (
    <Flex align="center">
      <Flex.Item marginRight={1}>
        <Typography.Text strong>{getShortAddress(address)}</Typography.Text>
      </Flex.Item>
      <Flex.Item marginRight={1} display="flex">
        <CopyButton text={address} />
      </Flex.Item>
      <Flex.Item display="flex">
        <ExploreButton to={address} />
      </Flex.Item>
    </Flex>
  );
};

interface AddressListItemProps {
  address: Address;
  active: boolean;
  onClick: (address: Address) => void;
}

const AddressListItem: React.FC<AddressListItemProps> = ({
  address,
  active,
  onClick,
}) => {
  const [selectedNetwork] = useSelectedNetwork();
  const [addressBalance, setAddressBalance] = useState<Currency>(
    new Currency(0n, selectedNetwork.networkAsset),
  );

  useEffect(() => {
    if (selectedNetwork.name !== 'cardano') {
      getBalance(address).then((balance) =>
        setAddressBalance(
          new Currency(balance?.nErgs || 0n, selectedNetwork.networkAsset),
        ),
      );
    }
  }, [selectedNetwork]);

  useEffect(() => {
    setAddressBalance(new Currency(0n, selectedNetwork.networkAsset));
  }, [address]);

  return (
    <Box
      padding={[4, 2]}
      transparent
      className="wallet-address-item"
      bordered={false}
    >
      <Flex align="center">
        <Flex.Item style={{ width: '45%' }}>
          <AddressView address={address} />
        </Flex.Item>
        <Flex.Item>
          <Typography.Text strong>
            {addressBalance.toCurrencyString(2)}
          </Typography.Text>
        </Flex.Item>
        <Flex.Item grow>
          <Flex justify="flex-end">
            <Button
              type="primary"
              disabled={active}
              onClick={() => onClick(address)}
            >
              {active ? t`Active` : t`Choose`}
            </Button>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export const AddressesTab: React.FC = () => {
  const [addresses] = useObservable(addresses$);
  const settings = useSettings();

  const setAddress = (address: Address) => {
    setSettings({ ...settings, address });
  };

  return (
    <Flex col>
      <List dataSource={addresses} height={250}>
        {(a) => (
          <AddressListItem
            key={a}
            address={a}
            onClick={setAddress}
            active={a === settings.address}
          />
        )}
      </List>
    </Flex>
  );
};
