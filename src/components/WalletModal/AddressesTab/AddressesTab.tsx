import React, { useCallback, useEffect, useState } from 'react';

import { ERG_DECIMALS } from '../../../constants/erg';
import { Address, useSettings } from '../../../context';
import { Box, Button, Flex, Typography } from '../../../ergodex-cdk';
import { getBalance } from '../../../services/yoroi';
import { renderFractions } from '../../../utils/math';
import { getShortAddress } from '../../../utils/string/addres';
import { CopyButton } from '../../common/CopyButton/CopyButton';
import { ExploreButton } from '../../common/ExploreButton/ExploreButton';

interface AddressListItemProps {
  address: string;
  active: boolean;
}

interface AddressViewProps {
  address: Address;
}

const AddressView: React.FC<AddressViewProps> = ({ address }) => {
  return (
    <Flex alignItems="center">
      <Flex.Item marginRight={1}>
        <Typography.Text strong>{getShortAddress(address)}</Typography.Text>
      </Flex.Item>
      <Flex.Item marginRight={1}>
        <CopyButton text={address} />
      </Flex.Item>
      <Flex.Item>
        <ExploreButton to={address} />
      </Flex.Item>
    </Flex>
  );
};

const AddressListItem: React.FC<AddressListItemProps> = ({
  address,
  active,
}) => {
  const [addressBalance, setAddressBalance] = useState<any>({});

  useEffect(() => {
    getBalance(address).then(setAddressBalance);
  }, [address]);

  const [settings, setSettings] = useSettings();

  const handleSetAddress = useCallback(
    (addr) => {
      setSettings({
        ...settings,
        address: addr,
      });
    },
    [settings, setSettings],
  );

  return (
    <Box padding={[2, 0]} transparent>
      <Flex alignItems="center">
        <Flex.Item style={{ width: '45%' }}>
          <AddressView address={address} />
        </Flex.Item>
        <Flex.Item>
          <Typography.Text strong>{`${parseFloat(
            renderFractions(
              addressBalance['nErgs'] ? addressBalance['nErgs'] : 0,
              ERG_DECIMALS,
            ),
          ).toFixed(2)} ERG`}</Typography.Text>
        </Flex.Item>
        <Flex.Item grow>
          <Flex justify="flex-end">
            <Button
              type="primary"
              disabled={active}
              onClick={() => handleSetAddress(address)}
            >
              {active ? 'Active' : 'Choose'}
            </Button>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

interface AddressListViewProps {
  addressList: string[];
  activeAddress: string;
}

export const AddressesTab: React.FC<AddressListViewProps> = ({
  addressList,
  activeAddress,
}) => {
  return (
    <Box transparent>
      <Flex flexDirection="col">
        <Flex.Item>
          <Box transparent padding={[0, 0, 2, 0]}>
            <Flex>
              <Flex.Item style={{ width: '45%' }}>
                <Typography.Text strong>Address</Typography.Text>
              </Flex.Item>
              <Flex.Item>
                <Typography.Text strong>Balance</Typography.Text>
              </Flex.Item>
            </Flex>
          </Box>
        </Flex.Item>
        <Flex.Item>
          <Box transparent maxHeight={250} overflow>
            {addressList.map((item, index) => (
              <AddressListItem
                key={index}
                address={item}
                active={item === activeAddress}
              />
            ))}
          </Box>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
