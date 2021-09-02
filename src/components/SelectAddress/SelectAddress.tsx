import React from 'react';
import { Select } from '@geist-ui/react';
import { OverflowAddress } from '../Settings/OverflowAddress';

interface SelectAddressProps {
  addresses: string[];
  selectedAddress?: string;
  onSelectAddress: (value: string | string[]) => void;
}

export const SelectAddress = ({
  addresses,
  selectedAddress,
  onSelectAddress,
}: SelectAddressProps): JSX.Element => {
  return (
    <Select
      initialValue={selectedAddress || addresses[0]}
      onChange={onSelectAddress}
      width="100%"
    >
      {addresses.map((address: string) => (
        <Select.Option key={address} value={address}>
          <OverflowAddress address={address} />
        </Select.Option>
      ))}
    </Select>
  );
};
