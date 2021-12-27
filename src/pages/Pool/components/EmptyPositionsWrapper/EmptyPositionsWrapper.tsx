import React from 'react';

import { ReactComponent as Empty } from '../../../../assets/icons/empty.svg';
import { Flex, Typography } from '../../../../ergodex-cdk';

interface EmptyPositionsListProps {
  children?: React.ReactChild | React.ReactChild[];
}

const EmptyPositionsWrapper: React.FC<EmptyPositionsListProps> = ({
  children,
}) => {
  return (
    <Flex col align="center" justify="center">
      <Flex.Item marginBottom={1}>
        <Empty />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Body>
          Your liquidity positions will appear here.
        </Typography.Body>
      </Flex.Item>
      <Flex.Item>{children}</Flex.Item>
    </Flex>
  );
};

export { EmptyPositionsWrapper };
