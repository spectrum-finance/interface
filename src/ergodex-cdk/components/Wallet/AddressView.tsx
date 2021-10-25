import './Wallet.less';

import React from 'react';

import { Address } from './Address';
import { AddressListItem, AddressListTitle } from './AddressListItem';

interface AddressViewProps {
  addressList: string[];
}

export const AddressView: React.FC<AddressViewProps> = ({ addressList }) => {
  return (
    <div>
      <AddressListTitle />
      {addressList.map((item, index) => (
        <AddressListItem key={index + 1} address={item} />
      ))}
    </div>
  );
};
