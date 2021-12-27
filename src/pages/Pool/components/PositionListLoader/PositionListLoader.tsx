import React from 'react';

import { Flex } from '../../../../ergodex-cdk';
import { PositionListItemLoader } from '../PositionListItemLoader/PositionListItemLoader';

const PositionListLoader = (): JSX.Element => {
  const LOADER_POSITIONS_NUMBER = 3;
  return (
    <Flex justify="center" direction="col">
      {new Array(LOADER_POSITIONS_NUMBER).fill(null).map((_, index) => (
        <Flex.Item key={index} marginBottom={2}>
          <PositionListItemLoader />
        </Flex.Item>
      ))}
    </Flex>
  );
};

export { PositionListLoader };
