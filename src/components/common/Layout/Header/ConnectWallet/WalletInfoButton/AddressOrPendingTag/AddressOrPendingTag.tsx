import React from 'react';
import { FC } from 'react';

import { uint } from '../../../../../../../common/types';
import { DataTag } from '../../../../../DataTag/DataTag';
import { AddressContent } from './AddressContent/AddressContent';
import { PendingContent } from './PendingContent/PendingContent';

export interface AddressOrPendingTagProps {
  readonly address?: string;
  readonly className?: string;
  readonly pendingCount?: uint;
}

export const AddressOrPendingTag: FC<AddressOrPendingTagProps> = ({
  address,
  pendingCount,
}) => {
  return (
    <DataTag
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
