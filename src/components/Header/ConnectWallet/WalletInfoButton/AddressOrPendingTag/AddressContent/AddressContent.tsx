import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { Address } from '../../../../../../common/types';
import { selectedWallet$ } from '../../../../../../gateway/api/wallets';
import { getShortAddress } from '../../../../../../utils/string/addres';
import { TagTypography } from '../TagTypography/TagTypography';

export interface AddressContentProps {
  readonly address?: Address;
  readonly className?: string;
}

export const AddressContent: FC<AddressContentProps> = ({ address }) => {
  const addressToRender = address ? getShortAddress(address) : '';
  const [selectedWallet] = useObservable(selectedWallet$);

  return (
    <Flex align="center">
      <Flex.Item align="center" marginRight={1}>
        {selectedWallet?.previewIcon}
      </Flex.Item>
      <TagTypography>{addressToRender}</TagTypography>
    </Flex>
  );
};
