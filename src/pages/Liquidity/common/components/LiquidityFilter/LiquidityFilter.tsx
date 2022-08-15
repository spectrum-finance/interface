import {
  Button,
  FilterOutlined,
  FilterTwoTone,
  Popover,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../../../../components/TableView/filters/MultiselectFilter/MultiselectFilter';

export enum PoolsOrPositionsFilterValue {
  SHOW_DUPLICATES,
}

export interface LiquidityFilterProps {
  readonly value: Set<PoolsOrPositionsFilterValue> | undefined;
  readonly className?: string;
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

const _LiquidityFilter: FC<LiquidityFilterProps> = ({
  value,
  onChange,
  className,
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
    <Button
      className={className}
      icon={value?.size ? <FilterTwoTone /> : <FilterOutlined />}
      size="large"
    />
  </Popover>
);

export const LiquidityFilter = styled(_LiquidityFilter)`
  &:hover {
    border-color: var(--spectrum-primary-color) !important;
  }

  ${(props) =>
    !!props.value?.size &&
    css`
      svg path:first-child {
        fill: var(--spectrum-icon-second-tone-color);
      }

      svg path:last-child {
        fill: var(--spectrum-primary-color);
      }
    `}
`;
