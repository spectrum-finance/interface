import { Flex, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { SetSearchParamsFn } from '../../../common/hooks/useSearchParams';
import { SearchInput } from '../../../components/SearchInput/SearchInput';
import { FarmTabs } from '../types/FarmTabs';
import { FarmState } from './FarmStateFilter/FarmState';
import { FarmStateFilter } from './FarmStateFilter/FarmStateFilter';
import { MyFarmsFilter } from './MyFarmsFilter/MyFarmsFilter';

const StyledSearchInput = styled(SearchInput)`
  width: 100%;
`;
const SearchInputContainer = styled(Flex.Item)`
  max-width: 320px;
`;

export const FarmTopPanel: FC<{
  setSearchParams: SetSearchParamsFn<{
    activeStatus?: FarmState;
    activeTab?: FarmTabs;
    searchString?: string;
  }>;
  activeStatus?: FarmState;
  activeTab?: FarmTabs;
  searchString?: string;
}> = ({ activeStatus, activeTab, setSearchParams, searchString }) => {
  const { valBySize, xl, lessThan } = useDevice();

  return (
    <Flex col={valBySize(true, true, true, false)}>
      <Flex.Item
        marginBottom={valBySize(4, 4, 4, 0)}
        display="flex"
        align="center"
        width="100%"
      >
        {xl && (
          <Flex.Item marginRight={6}>
            <MyFarmsFilter value={activeTab} onChange={setSearchParams} />
          </Flex.Item>
        )}
        <Flex.Item flex={1} marginRight={4}>
          <FarmStateFilter
            value={activeStatus || FarmState.All}
            onChange={(newStatus) =>
              setSearchParams({ activeStatus: newStatus })
            }
          />
        </Flex.Item>
        {xl && (
          <SearchInputContainer marginRight={2} flex={1}>
            <StyledSearchInput
              size="large"
              value={searchString}
              onChange={(e) =>
                setSearchParams({ searchString: e.target.value })
              }
              placeholder={t`Type token name or farm id`}
            />
          </SearchInputContainer>
        )}
        {/* <Flex.Item>
          <Button size="large" type="primary" onClick={openFarmModal}>
            <Trans>Create farm</Trans>
          </Button>
        </Flex.Item> */}
      </Flex.Item>
      {lessThan('xl') && (
        <Flex.Item display="flex" align="center">
          <SearchInputContainer marginRight={4} flex={1}>
            <StyledSearchInput
              size="large"
              placeholder={t`Type token name or farm id`}
              value={searchString}
              onChange={(e) =>
                setSearchParams({ searchString: e.target.value })
              }
            />
          </SearchInputContainer>
          <MyFarmsFilter value={activeTab} onChange={setSearchParams} />
        </Flex.Item>
      )}
    </Flex>
  );
};
