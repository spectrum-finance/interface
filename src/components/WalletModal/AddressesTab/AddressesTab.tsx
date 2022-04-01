import './AddressTab.less';

import { Address, publicKeyFromAddress } from '@ergolabs/ergo-sdk';
import { t } from '@lingui/macro';
import React, { useCallback, useEffect, useState } from 'react';

import { addresses$ } from '../../../api/addresses';
import { ERG_DECIMALS } from '../../../common/constants/erg';
import { useObservable } from '../../../common/hooks/useObservable';
import { useSettings } from '../../../context';
import { Box, Button, Flex, List, Typography } from '../../../ergodex-cdk';
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
        pk: publicKeyFromAddress(addr),
      });
    },
    [settings, setSettings],
  );

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
  const [{ address }] = useSettings();

  return (
    <Flex col>
      <List dataSource={addresses} height={250}>
        {(a) => <AddressListItem key={a} address={a} active={a === address} />}
      </List>
    </Flex>
  );
};
