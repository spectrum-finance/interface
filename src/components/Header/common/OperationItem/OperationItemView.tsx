import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { TableListItemView } from '../../../TableListItemView/TableListItemView';
import { Assets } from './Assets/Assets';
import { DateTime } from './DateTime/DateTime';
import { StatusTag } from './StatusTag/StatusTag';
import { TypeTag } from './TypeTag/TypeTag';

export interface OperationItemProps {
  readonly operation: AmmDexOperation;
  readonly className?: string;
}

export const OperationItemView: FC<OperationItemProps> = ({ className }) => (
  <TableListItemView className={className} padding={[2, 4]} height={104}>
    <TableListItemView.Column title={t`Asset`} flex={1} marginRight={10}>
      <Assets />
    </TableListItemView.Column>
    <TableListItemView.Column title={t`Date`} width={120} marginRight={8}>
      <DateTime />
    </TableListItemView.Column>
    <TableListItemView.Column title={t`Type`} width={120} marginRight={8}>
      <TypeTag type="swap" />
    </TableListItemView.Column>
    <TableListItemView.Column title={t`Status`} width={120}>
      <StatusTag status="executed" />
    </TableListItemView.Column>
  </TableListItemView>
);
