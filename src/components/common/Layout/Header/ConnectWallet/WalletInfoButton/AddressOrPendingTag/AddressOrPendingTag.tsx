import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';

import { uint } from '../../../../../../../common/types';
import { DataTag } from '../../../../../DataTag/DataTag';
import { AddressContent } from './AddressContent/AddressContent';
import { PendingContent } from './PendingContent/PendingContent';

export interface AddressOrPendingTagProps {
  readonly address?: string;
  readonly className?: string;
  readonly pendingCount?: uint;
}

const _AddressOrPendingTag: FC<AddressOrPendingTagProps> = ({
  address,
  pendingCount,
  className,
}) => {
  return (
    <DataTag
      className={className}
      secondary
      content={
        pendingCount ? (
          <PendingContent pendingCount={pendingCount} />
        ) : (
          <AddressContent address={address} />
        )
      }
    />
  );
};

export const AddressOrPendingTag = styled(_AddressOrPendingTag)`
  border: 1px solid transparent;

  &:hover {
    border: 1px solid var(--spectrum-default-border-color);
  }
`;
