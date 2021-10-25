import './AddressListItem.less';

import React from 'react';

import { Button } from '../Button/Button';
import { Address } from './Address';

export const AddressListTitle: React.FC = () => {
  return (
    <div className="address_list_title_wrapper">
      <span>Address</span>
      <div className="balance_title_wrapper">
        <span>Balance</span>
      </div>
    </div>
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
    <div className="address_list_item_wrapper">
      <Address address={address} />
      <div className="balance_wrapper">
        <span className="token_balance">100.03 ERG</span>
        <span className="usd_balance">$1033.20</span>
      </div>
      <div className="choose_btn_wrapper">
        <Button
          type="primary"
          disabled={active}
          onClick={() => {
            updateActiveAddr(address);
          }}
        >
          {active ? 'Active' : 'Choose'}
        </Button>
      </div>
    </div>
  );
};
