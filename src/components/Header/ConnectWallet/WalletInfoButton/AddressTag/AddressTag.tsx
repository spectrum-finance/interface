import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';

import { selectedWallet$ } from '../../../../../api/wallets';
import { useObservable } from '../../../../../common/hooks/useObservable';
import { Flex, Typography } from '../../../../../ergodex-cdk';
import { getShortAddress } from '../../../../../utils/string/addres';
import { DataTag } from '../../../../common/DataTag/DataTag';

export interface AddressTag {
  readonly address?: string;
  readonly className?: string;
}

const _AddressTag: FC<AddressTag> = ({ address, className }) => {
  const addressToRender = address ? getShortAddress(address) : '';
  const [selectedWallet] = useObservable(selectedWallet$);

  return (
    <DataTag
      secondary
      className={className}
      content={
        <Flex align="center">
          <Flex.Item align="center" marginRight={1}>
            {selectedWallet?.previewIcon}
          </Flex.Item>
          <Typography.Body
            secondary
            style={{ whiteSpace: 'nowrap', fontSize: '16px' }}
          >
            {addressToRender}
          </Typography.Body>
        </Flex>
      }
    />
  );
};

export const AddressTag = styled(_AddressTag)``;
