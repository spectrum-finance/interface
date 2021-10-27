import './AddressListView.less';

import React from 'react';

import { Space, Typography } from '../../ergodex-cdk';
import { Button } from '../../ergodex-cdk/components/Button/Button';
import { Address } from './Address';

export const AddressListTitle: React.FC = () => {
  return (
    <Space className="address_list_title_wrapper">
      <Typography.Text strong>Address</Typography.Text>
      <Typography.Text strong style={{ float: 'right' }}>
        Balance
      </Typography.Text>
    </Space>
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
  return (
    <Space className="address_list_item_wrapper">
      <Address address={address} />
      <Space
        direction="vertical"
        align="end"
        size={0}
        style={{ float: 'right' }}
      >
        <Typography.Text strong>100.03 ERG</Typography.Text>
        <Typography.Text style={{ fontSize: '10px' }}>$1033.20</Typography.Text>
      </Space>
      <Space direction="vertical" align="end" style={{ float: 'right' }}>
        <Button
          type="primary"
          disabled={active}
          onClick={() => {
            updateActiveAddr(address);
          }}
        >
          {active ? 'Active' : 'Choose'}
        </Button>
      </Space>
    </Space>
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
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <AddressListTitle />
      {addressList.map((item, index) => (
        <AddressListItem
          key={index + 1}
          address={item}
          active={item === activeAddress}
          updateActiveAddr={updateActiveAddr}
        />
      ))}
    </Space>
  );
};
