import './AddressListView.less';

import React from 'react';

import { AddressListItem, AddressListTitle } from './AddressListItem';

interface AddressListViewProps {
  addressList: string[];
}

export const AddressListView: React.FC<AddressListViewProps> = ({
  addressList,
}) => {
  return (
    <div>
      <AddressListTitle />
      {addressList.map((item, index) => (
        <AddressListItem key={index + 1} address={item} />
      ))}
    </div>
  );
};
