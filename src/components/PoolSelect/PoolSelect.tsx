import React, { useEffect, useState, useCallback } from 'react';
import { comparator } from 'ramda';
import RCSelect from 'rc-select';
import { Card, Grid, Input, Text } from '@geist-ui/react';
import { AmmPool } from 'ergo-dex-sdk';
import levenshtein from 'fast-levenshtein';

import './PoolSelect.scss';
import './rc-select.scss';
import { AnyObject } from 'final-form';

const getPoolAssetsRepr = (pool: AmmPool | undefined) => {
  if (!pool) return '';
  const { x, y } = pool;
  return `${x.asset.name}, ${y.asset.name}`;
};

const renderDropdown = (menu: React.ReactNode) => (
  <Card width="300px">
    <Card.Content className="PoolSelect__dropdown">{menu}</Card.Content>
  </Card>
);

interface Props {
  pools: AmmPool[];
  value?: AmmPool;
  onChangeValue(p: AmmPool): void;
  inputProps?: AnyObject;
}

export const PoolSelect: React.FC<Props> = ({
  pools,
  value,
  onChangeValue,
  inputProps = {},
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (value !== undefined && searchText === '') {
      setSearchText(getPoolAssetsRepr(value));
    }
  }, [value]);

  const poolsFilterSort = useCallback(
    (poolA, poolB) => {
      const preparedValue = searchText.toUpperCase().trim();
      const byLevenstein = comparator(
        (a: AmmPool, b: AmmPool) =>
          levenshtein.get(getPoolAssetsRepr(a), preparedValue) <
          levenshtein.get(getPoolAssetsRepr(b), preparedValue),
      );
      const byOccurance = comparator((a: AmmPool, b: AmmPool) => {
        const indexA = getPoolAssetsRepr(a).indexOf(preparedValue);
        const indexB = getPoolAssetsRepr(b).indexOf(preparedValue);
        if (indexA === -1 || indexB === -1) {
          return indexA > indexB;
        }
        return indexA < indexB;
      });
      const sortFn = preparedValue.length > 2 ? byLevenstein : byOccurance;
      return sortFn(poolA, poolB);
    },
    [searchText],
  );

  const handleDropdownVisibleChange = useCallback(
    (isOpen) => {
      setIsDropdownOpen(isOpen);
    },
    [setIsDropdownOpen],
  );

  return (
    <RCSelect
      showSearch
      onSearch={setSearchText}
      filterSort={poolsFilterSort}
      tokenSeparators={[' ', ',', '/']}
      menuItemSelectedIcon={null}
      allowClear={false}
      getRawInputElement={() => (
        <Input
          width="100%"
          {...inputProps}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      )}
      open={isDropdownOpen}
      dropdownRender={renderDropdown}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      value={value?.id}
      onSelect={(_, { pool }) => {
        onChangeValue(pool);
        setSearchText(getPoolAssetsRepr(pool));
      }}
    >
      {!isDropdownOpen
        ? null
        : pools.sort(poolsFilterSort).map((p) => {
            const { id, x, y, poolFeeNum } = p;
            return (
              <RCSelect.Option
                key={id}
                value={id}
                label={getPoolAssetsRepr(p)}
                pool={p}
              >
                <Grid.Container className="PoolSelect__item">
                  <Grid xs={16}>
                    <Text span b>
                      {x.asset.name}, {y.asset.name}
                    </Text>
                  </Grid>
                  <Grid xs={8}>
                    <Text span type="secondary">
                      Fee: {poolFeeNum}
                    </Text>
                  </Grid>
                </Grid.Container>
              </RCSelect.Option>
            );
          })}
    </RCSelect>
  );
};
