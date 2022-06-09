import { t } from '@lingui/macro';
import React, { ReactNode } from 'react';

import { OperationType } from '../../common/TxHistory/types';
import { Filter } from '../../TableView/common/Filter';
import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../TableView/filters/MultiselectFilter/MultiselectFilter';

const typesFilterItems: MultiselectFilterItem<OperationType>[] = [
  { value: 'swap', caption: t`Swap` },
  { value: 'deposit', caption: t`Deposit` },
];
export const typeFilter = ({
  value,
  onChange,
}: Filter<Set<OperationType>>): ReactNode | ReactNode[] | string => (
  <MultiselectFilter
    items={typesFilterItems}
    value={value}
    onChange={onChange}
    close={() => {}}
  />
);
