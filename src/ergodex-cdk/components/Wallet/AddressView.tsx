import './Wallet.less';

import React from 'react';

import { Address } from './Address';
import { AddressListItem } from './AddressListItem';

export const AddressView: React.FC = () => {
  return (
    <div>
      <AddressListItem />
    </div>
  );
};
