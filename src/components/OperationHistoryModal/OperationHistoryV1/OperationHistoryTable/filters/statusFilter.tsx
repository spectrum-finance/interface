import { t } from '@lingui/macro';
import React from 'react';

import {
  Operation,
  OperationStatus,
} from '../../../../../common/models/Operation';
import {
  Filter,
  FilterMatch,
  FilterRenderer,
} from '../../../../TableView/common/FilterDescription';
import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../../../TableView/filters/MultiselectFilter/MultiselectFilter';

const statusesFilterItems: MultiselectFilterItem<OperationStatus>[] = [
  { value: OperationStatus.Executed, caption: t`Executed` },
  { value: OperationStatus.Pending, caption: t`Pending` },
  { value: OperationStatus.Locked, caption: t`Locked` },
];
const statusFilterRender: FilterRenderer<OperationStatus> = ({
  value,
  onChange,
}) => (
  <MultiselectFilter
    items={statusesFilterItems}
    value={value}
    onChange={onChange}
  />
);

const statusFilterMatch: FilterMatch<Operation, OperationStatus> = (
  filters,
  op,
) => {
  if (!filters) {
    return true;
  }
  return filters.has(op.status);
};

export const statusFilter: Filter<Operation, OperationStatus> = {
  render: statusFilterRender,
  match: statusFilterMatch,
};
