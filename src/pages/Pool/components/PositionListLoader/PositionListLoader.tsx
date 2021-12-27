import React from 'react';

import { Flex } from '../../../../ergodex-cdk';
import { PositionListItemLoader } from '../PositionListItemLoader/PositionListItemLoader';

const PositionListLoader = (): JSX.Element => {
  return (
    <Flex justify="center" direction="col">
      <Flex.Item marginBottom={2}>
        <PositionListItemLoader />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <PositionListItemLoader />
      </Flex.Item>
      <Flex.Item>
        <PositionListItemLoader />
      </Flex.Item>
    </Flex>
  );
};

export { PositionListLoader };
