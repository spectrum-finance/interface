import './Wallet.less';

import React from 'react';

import { Address } from './Address';
import { AddressListItem, AddressListTitle } from './AddressListItem';

export const AddressView: React.FC = () => {
  return (
    <div>
      <AddressListTitle />
      <AddressListItem />
    </div>
  );
};
