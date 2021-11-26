import React from 'react';

import { Flex, Skeleton } from '../../../ergodex-cdk';

const PositionsLoader = (): JSX.Element => {
  return (
    <Flex justify="center" direction="col">
      <Flex.Item marginBottom={2}>
        <Skeleton.Block
          style={{ height: '62px', borderRadius: '12px' }}
          size="large"
          active
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Skeleton.Block
          style={{ height: '62px', borderRadius: '12px' }}
          size="large"
          active
        />
      </Flex.Item>
      <Flex.Item>
        <Skeleton.Block
          style={{ height: '62px', borderRadius: '12px' }}
          size="large"
          active
        />
      </Flex.Item>
    </Flex>
  );
};

export { PositionsLoader };
