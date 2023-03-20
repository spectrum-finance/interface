import { Box, Flex, Radio, Typography } from '@ergolabs/ui-kit';
import React, { useEffect, useState } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Address } from '../../../common/types';
import { addresses$ } from '../../../gateway/api/addresses';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { setSettings, useSettings } from '../../../gateway/settings/settings';
import { getBalance } from '../../../services/yoroi';
import { getShortAddress } from '../../../utils/string/addres';
import { CopyButton } from '../../common/CopyButton/CopyButton';
import { ExploreButton } from '../../common/ExploreButton/ExploreButton';
import { ConvenientAssetView } from '../../ConvenientAssetView/ConvenientAssetView';
import { List } from '../../List/List';

interface AddressViewProps {
  address: Address;
}

const AddressView: React.FC<AddressViewProps> = ({ address }) => {
  return (
    <Flex align="center" style={{ width: '100%' }}>
      <Flex.Item marginRight={2}>
        <Typography.Body size="large" strong>
          {getShortAddress(address)}
        </Typography.Body>
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
      padding={[0, 6]}
      secondary
      height={64}
      borderRadius="l"
      onClick={() => onClick(address)}
    >
      <Flex align="center" stretch>
        <Flex.Item flex={1} marginRight={2}>
          <AddressView address={address} />
        </Flex.Item>
        <Flex.Item display="flex" col align="flex-end" marginRight={4}>
          <Typography.Body strong size="small">
            {addressBalance.toCurrencyString(2, 2)}
          </Typography.Body>
          <Typography.Body size="extra-small">
            <ConvenientAssetView value={addressBalance} />
          </Typography.Body>
        </Flex.Item>
        <Radio checked={active} />
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
      <List
        items={addresses || []}
        itemKey={(item) => item}
        height={268}
        itemHeight={64}
        gap={1}
      >
        {({ item }) => (
          <AddressListItem
            key={item}
            address={item}
            onClick={setAddress}
            active={item === settings.address}
          />
        )}
      </List>
    </Flex>
  );
};
