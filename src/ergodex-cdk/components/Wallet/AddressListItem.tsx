import './AddressListItem.less';

import React from 'react';

import { Button } from '../Button/Button';
import { Address } from './Address';

export const AddressListItem: React.FC = () => {
  return (
    <div className="address_list_item_wrapper">
      <Address />
      <div className="balance_wrapper">
        <span>100.03 ERG</span>
        <span>$1033.20</span>
      </div>
      <div>
        <Button type="primary">Choose</Button>
      </div>
    </div>
  );
};
