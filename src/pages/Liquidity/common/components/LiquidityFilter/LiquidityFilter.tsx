import { Button, FilterOutlined, Popover } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../../../../components/TableView/filters/MultiselectFilter/MultiselectFilter';

export enum PoolsOrPositionsFilterValue {
  SHOW_DUPLICATES,
}

export interface LiquidityFilterProps {
  readonly value: Set<PoolsOrPositionsFilterValue> | undefined;
  readonly onChange: (
    value: Set<PoolsOrPositionsFilterValue> | undefined,
  ) => void;
}

const PoolsOrPositionsFilter: MultiselectFilterItem<PoolsOrPositionsFilterValue>[] =
  [
    {
      value: PoolsOrPositionsFilterValue.SHOW_DUPLICATES,
      caption: <Trans>Show duplicates</Trans>,
    },
  ];

export const LiquidityFilter: FC<LiquidityFilterProps> = ({
  value,
  onChange,
}) => (
  <Popover
    content={
      <MultiselectFilter
        value={value}
        onChange={onChange}
        items={PoolsOrPositionsFilter}
      />
    }
    trigger="click"
    placement="bottom"
  >
    <Button icon={<FilterOutlined />} size="large" />
  </Popover>
);
