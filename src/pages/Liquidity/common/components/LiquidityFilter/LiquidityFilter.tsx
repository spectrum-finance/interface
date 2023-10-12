import {
  Box,
  Button,
  Checkbox,
  FilterOutlined,
  FilterTwoTone,
  Flex,
  Popover,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled, { css } from 'styled-components';

import { IsCardano } from '../../../../../components/IsCardano/IsCardano';
import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../../../../components/TableView/filters/MultiselectFilter/MultiselectFilter';
import { showUnverifiedPools$ } from '../../../../../network/cardano/api/ammPools/ammPools';

export enum PoolsOrPositionsFilterValue {
  SHOW_DUPLICATES,
  SHOW_UNVERIFIED_POOLS,
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
}) => {
  const handleChange = (checked: boolean) => {
    if (!onChange) {
      return;
    }
    const newValue: Set<any> | undefined = value
      ? new Set<any>(Array.from(value))
      : new Set<any>();

    if (checked) {
      newValue!.add(PoolsOrPositionsFilterValue.SHOW_UNVERIFIED_POOLS);
      showUnverifiedPools$.next(true);
    } else {
      newValue!.delete(PoolsOrPositionsFilterValue.SHOW_UNVERIFIED_POOLS);
      showUnverifiedPools$.next(false);
    }
    onChange(newValue.size ? newValue : undefined);
  };

  return (
    <Popover
      content={
        <Box padding={[4, 3]} transparent bordered={false}>
          <MultiselectFilter
            padding={[0, 0]}
            value={value}
            onChange={onChange}
            items={PoolsOrPositionsFilter}
          />
          <IsCardano>
            <Flex.Item marginTop={2} display="block">
              <Checkbox
                checked={value?.has(
                  PoolsOrPositionsFilterValue.SHOW_UNVERIFIED_POOLS,
                )}
                onChange={(e) => handleChange(e.target.checked)}
              >
                <Trans>Show unverified pools</Trans>
              </Checkbox>
            </Flex.Item>
          </IsCardano>
        </Box>
      }
      trigger="click"
      placement="bottomLeft"
    >
      <Button
        className={className}
        icon={value?.size ? <FilterTwoTone /> : <FilterOutlined />}
        size="large"
      />
    </Popover>
  );
};

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
