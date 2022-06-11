import { t } from '@lingui/macro';
import React, { ReactNode } from 'react';

import { Operation } from '../../../common/models/Operation';
import { OperationType } from '../../common/TxHistory/types';
import {
  Filter,
  FilterMatch,
  FilterRenderer,
} from '../../TableView/common/FilterDescription';
import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../TableView/filters/MultiselectFilter/MultiselectFilter';

const typesFilterItems: MultiselectFilterItem<OperationType>[] = [
  { value: 'swap', caption: t`Swap` },
  { value: 'deposit', caption: t`Deposit` },
];
const typeFilterRender: FilterRenderer<Operation['type']> = ({
  value,
  onChange,
}): ReactNode | ReactNode[] | string => (
  <MultiselectFilter
    items={typesFilterItems}
    value={value}
    onChange={onChange}
    close={() => {}}
  />
);

const typeFilterMatch: FilterMatch<Operation, Operation['type']> = (
  filters,
  op,
) => {
  if (!filters) {
    return true;
  }
  return filters.has(op.type);
};

export const typeFilter: Filter<Operation, Operation['type']> = {
  render: typeFilterRender,
  match: typeFilterMatch,
};
