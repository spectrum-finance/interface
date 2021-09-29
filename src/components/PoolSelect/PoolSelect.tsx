import React, { useEffect, useState, useCallback } from 'react';
import { comparator } from 'ramda';
import RCSelect from 'rc-select';
import { Card, Grid, Input, Text } from '@geist-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import levenshtein from 'fast-levenshtein';

import './PoolSelect.scss';
import './rc-select.scss';
import { AnyObject } from 'final-form';
import { evaluate } from 'mathjs';

const getPoolAssetsRepr = (pool: AmmPool | undefined) => {
  if (!pool) return '';
  const { x, y, poolFeeNum } = pool;
  return `Pool: ${x.asset.name} ↔ ${y.asset.name}, Fee ${evaluate(
    `(1 - ${poolFeeNum} / 1000) * 100`,
  ).toFixed(2)}%`;
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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (value !== undefined && searchText === '' && !isInitialized) {
      setSearchText(getPoolAssetsRepr(value));
      setIsInitialized(true);
    }
  }, [value, searchText, isInitialized]);

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
          onBlur={() => {
            if (value !== undefined && searchText === '') {
              setSearchText(getPoolAssetsRepr(value));
            }
          }}
          iconRight={
            <FontAwesomeIcon
              icon={isDropdownOpen ? faChevronUp : faChevronDown}
              size="xs"
            />
          }
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
                    <Text span>
                      {x.asset.name} ↔ {y.asset.name}
                    </Text>
                  </Grid>
                  <Grid xs={8}>
                    <Text span type="secondary">
                      Fee:{' '}
                      {evaluate(`(1 - ${poolFeeNum} / 1000) * 100`).toFixed(2)}%
                    </Text>
                  </Grid>
                </Grid.Container>
              </RCSelect.Option>
            );
          })}
    </RCSelect>
  );
};
