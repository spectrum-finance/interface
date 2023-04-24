import { t } from '@lingui/macro';
import { ReactNode } from 'react';

import { Operation } from '../../../../../common/models/Operation';
import {
  Filter,
  FilterMatch,
  FilterRenderer,
} from '../../../../TableView/common/FilterDescription';
import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../../../TableView/filters/MultiselectFilter/MultiselectFilter';

const typesFilterItems: MultiselectFilterItem<'swap' | 'deposit' | 'redeem'>[] =
  [
    { value: 'swap', caption: t`Swap` },
    { value: 'deposit', caption: t`Deposit` },
    { value: 'redeem', caption: t`Redeem` },
  ];
const typeFilterRender: FilterRenderer<Operation['type']> = ({
  value,
  onChange,
}): ReactNode | ReactNode[] | string => (
  <MultiselectFilter
    items={typesFilterItems}
    value={value}
    onChange={onChange}
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
