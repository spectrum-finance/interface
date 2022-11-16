import { Button, Flex, Modal, useDevice } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../common/hooks/useObservable';
import { SearchInput } from '../../../components/SearchInput/SearchInput';
import { ammPools$ } from '../../../gateway/api/ammPools';
import { CreateFarmModal } from './CreateFarmModal/CreateFarmModal';
import { FarmState } from './FarmStateFilter/FarmState';
import { FarmStateFilter } from './FarmStateFilter/FarmStateFilter';
import { FarmViewMode } from './FarmViewModeSwitch/FarmViewMode';
import { FarmViewModeSwitch } from './FarmViewModeSwitch/FarmViewModeSwitch';
import { MyFramsFilter } from './MyFramsFilter/MyFramsFilter';

const StyledSearchInput = styled(SearchInput)`
  width: 100%;
`;
const SearchInputContainer = styled(Flex.Item)`
  max-width: 320px;
`;

export const FarmTopPanel: FC = () => {
  const { valBySize, xl, lessThan } = useDevice();

  const openFarmModal = () => Modal.open(<CreateFarmModal />);

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
            <MyFramsFilter value={true} onChange={() => {}} />
          </Flex.Item>
        )}
        <Flex.Item flex={1} marginRight={4}>
          <FarmStateFilter value={FarmState.All} onChange={() => {}} />
        </Flex.Item>
        {xl && (
          <SearchInputContainer marginRight={2} flex={1}>
            <StyledSearchInput size="large" placeholder={t`Search`} />
          </SearchInputContainer>
        )}
        <Flex.Item>
          <Button size="large" type="primary" onClick={openFarmModal}>
            <Trans>Create farm</Trans>
          </Button>
        </Flex.Item>
      </Flex.Item>
      {lessThan('xl') && (
        <Flex.Item display="flex" align="center">
          <SearchInputContainer marginRight={4} flex={1}>
            <StyledSearchInput size="large" placeholder={t`Search`} />
          </SearchInputContainer>
          <MyFramsFilter value={true} onChange={() => {}} />
        </Flex.Item>
      )}
    </Flex>
  );
};
