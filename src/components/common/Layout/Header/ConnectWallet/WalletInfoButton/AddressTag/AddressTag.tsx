import { Flex, Typography } from '@ergolabs/ui-kit';
import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../../../common/hooks/useObservable';
import { selectedWallet$ } from '../../../../../../../gateway/api/wallets';
import { getShortAddress } from '../../../../../../../utils/string/addres';
import { DataTag } from '../../../../../DataTag/DataTag';

export interface AddressTagProps {
  readonly address?: string;
  readonly className?: string;
}

const _AddressTag: FC<AddressTagProps> = ({ address, className }) => {
  const addressToRender = address ? getShortAddress(address) : '';
  const [selectedWallet] = useObservable(selectedWallet$);

  return (
    <DataTag
      secondary
      content={
        <Flex align="center">
          <Flex.Item align="center" marginRight={1}>
            {selectedWallet?.previewIcon}
          </Flex.Item>
          <Typography.Body
            className={className}
            style={{ whiteSpace: 'nowrap', fontSize: '16px' }}
          >
            {addressToRender}
          </Typography.Body>
        </Flex>
      }
    />
  );
};

export const AddressTag = styled(_AddressTag)`
  color: var(--ergo-connect-wallet-address-tag-color) !important;
`;
