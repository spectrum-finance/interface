import { t } from '@lingui/macro';
import React, { ReactNode } from 'react';

import { Operation, OperationStatus } from '../../../common/models/Operation';
import { Filter } from '../../TableView/common/Filter';
import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../TableView/filters/MultiselectFilter/MultiselectFilter';

const statusesFilterItems: MultiselectFilterItem<OperationStatus>[] = [
  { value: OperationStatus.Executed, caption: t`Executed` },
  { value: OperationStatus.Pending, caption: t`Pending` },
  { value: OperationStatus.Locked, caption: t`Locked` },
];
export const statusFilter = ({
  value,
  onChange,
}: Filter<Set<OperationStatus>>): ReactNode | ReactNode[] | string => (
  <MultiselectFilter
    items={statusesFilterItems}
    value={value}
    onChange={onChange}
    close={() => {}}
  />
);

export const statusFilterMatch = (
  filters: Set<OperationStatus> | undefined,
  op: Operation,
): boolean => {
  if (!filters) {
    return true;
  }
  return filters.has(op.status);
};
