import React, { useCallback } from 'react';
import { Select } from '@geist-ui/react';
import { OverflowAddress } from '../Settings/OverflowAddress';

interface SelectAddressProps {
  addresses: string[];
  handleSelectAddress?: (value: string | string[]) => void;
}

export const SelectAddress = ({
  addresses,
  handleSelectAddress,
}: SelectAddressProps): JSX.Element => {
  return (
    <Select
      initialValue={addresses[0]}
      onChange={handleSelectAddress}
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
