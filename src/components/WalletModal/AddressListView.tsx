import './AddressListView.less';

import React, { useEffect, useState } from 'react';

import { ERG_DECIMALS } from '../../constants/erg';
import { Box, Col, Row, Typography } from '../../ergodex-cdk';
import { Button } from '../../ergodex-cdk/components/Button/Button';
import { getBalance } from '../../services/yoroi';
import { renderFractions } from '../../utils/math';
import { AddressView } from './AddressView';

export const AddressListTitle: React.FC = () => {
  return (
    <Box transparent padding={[3, 2]}>
      <Row>
        <Col span={10}>
          <Typography.Text strong>Address</Typography.Text>
        </Col>
        <Col span={7}>
          <Typography.Text strong style={{ float: 'right' }}>
            Balance
          </Typography.Text>
        </Col>
      </Row>
    </Box>
  );
};

interface AddressListItemProps {
  address: string;
  active: boolean;
  updateActiveAddr: (address: string) => void;
}

export const AddressListItem: React.FC<AddressListItemProps> = ({
  address,
  active,
  updateActiveAddr,
}) => {
  const [addressBalance, setAddressBalance] = useState<any>({});

  useEffect(() => {
    getBalance(address).then(setAddressBalance);
  }, [address]);

  return (
    <Box padding={[3, 2]} className="address__list-item_wrapper" transparent>
      <Row align="middle">
        <Col span={10}>
          <AddressView address={address} />
        </Col>
        <Col span={7}>
          <Row justify="end">
            <Typography.Text strong>{`${parseFloat(
              renderFractions(
                addressBalance['nanoErgs'] ? addressBalance['nanoErgs'] : 0,
                ERG_DECIMALS,
              ),
            ).toFixed(2)} ERG`}</Typography.Text>
          </Row>
          <Row justify="end">
            <Typography.Text style={{ fontSize: '10px' }}>
              $1033.20
            </Typography.Text>
          </Row>
        </Col>
        <Col span={7}>
          <Row justify="end">
            <Button
              type="primary"
              disabled={active}
              onClick={() => {
                updateActiveAddr(address);
              }}
            >
              {active ? 'Active' : 'Choose'}
            </Button>
          </Row>
        </Col>
      </Row>
    </Box>
  );
};
interface AddressListViewProps {
  addressList: string[];
  activeAddress: string;
  updateActiveAddr: (address: string) => void;
}

export const AddressListView: React.FC<AddressListViewProps> = ({
  addressList,
  activeAddress,
  updateActiveAddr,
}) => {
  return (
    <Row>
      <Col span={24}>
        <AddressListTitle />
      </Col>
      {addressList.map((item, index) => (
        <Col span={24} key={index + 1}>
          <AddressListItem
            address={item}
            active={item === activeAddress}
            updateActiveAddr={updateActiveAddr}
          />
        </Col>
      ))}
    </Row>
  );
};
