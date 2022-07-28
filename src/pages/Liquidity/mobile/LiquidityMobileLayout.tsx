import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { SearchInput } from '../../../components/SearchInput/SearchInput';
import { LiquidityFilter } from '../common/components/LiquidityFilter/LiquidityFilter';
import { LiquidityLayoutProps } from '../common/types/LiquidityLayoutProps';
import { LiquidityStateSelect } from './components/LiquidityStateSelect/LiquidityStateSelect';
import { PoolsOverview } from './components/PoolsOverview/PoolsOverview';

export const LiquidityMobileLayout: FC<LiquidityLayoutProps> = ({
  activeState,
  setActiveState,
  ammPools,
  isAmmPoolsLoading,
  filters,
  setFilters,
  term,
  handleSearchTerm,
}) => (
  <Flex col>
    <Flex.Item marginBottom={2} width="100%">
      <LiquidityStateSelect value={activeState} />
    </Flex.Item>
    <Flex.Item display="flex" marginBottom={4}>
      <Flex.Item flex={1} marginRight={2}>
        <SearchInput
          size="large"
          value={term}
          onChange={handleSearchTerm}
          placeholder={t`Type token name or pool id`}
        />
      </Flex.Item>
      <LiquidityFilter value={filters} onChange={setFilters} />
    </Flex.Item>
    <PoolsOverview ammPools={ammPools} isAmmPoolsLoading={isAmmPoolsLoading} />
  </Flex>
);
