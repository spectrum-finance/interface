import { FC } from 'react';
import styled from 'styled-components';

import { DataTag } from '../../../../../DataTag/DataTag';
import { AddressContent } from './AddressContent/AddressContent';
import { LoadingContent } from './LoadingContent/LoadingContent';

export interface AddressOrPendingTagProps {
  readonly address?: string;
  readonly className?: string;
  readonly loading?: boolean;
}

const _AddressOrPendingTag: FC<AddressOrPendingTagProps> = ({
  address,
  className,
  loading,
}) => {
  return (
    <DataTag
      className={className}
      secondary
      content={
        loading ? <LoadingContent /> : <AddressContent address={address} />
      }
    />
  );
};

export const AddressTag = styled(_AddressOrPendingTag)`
  border: 1px solid transparent;
  height: 2rem;
  padding-left: 8px !important;
  padding-right: 8px !important;

  &:hover {
    border: 1px solid var(--spectrum-default-border-color);
  }
`;
