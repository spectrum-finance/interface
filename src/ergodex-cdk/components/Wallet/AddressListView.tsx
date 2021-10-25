import './AddressListView.less';

import React from 'react';

import { AddressListItem, AddressListTitle } from './AddressListItem';

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
    <div>
      <AddressListTitle />
      {addressList.map((item, index) => (
        <AddressListItem
          key={index + 1}
          address={item}
          active={item === activeAddress}
          updateActiveAddr={updateActiveAddr}
        />
      ))}
    </div>
  );
};
