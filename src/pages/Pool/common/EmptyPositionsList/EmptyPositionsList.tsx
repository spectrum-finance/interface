import React from 'react';

import { Flex, Typography } from '../../../../ergodex-cdk';
import { PositionListEmptyTemplate } from '../EmptyTemplateContainer/PositionListEmptyTemplate';

interface EmptyPositionsListProps {
  children?: React.ReactChild | React.ReactChild[];
}

const EmptyPositionsList: React.FC<EmptyPositionsListProps> = ({
  children,
}) => {
  return (
    <PositionListEmptyTemplate>
      <Flex col align="center" justify="center">
        <Flex.Item marginBottom={2}>
          <Typography.Body>
            Your liquidity positions will appear here.
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>{children}</Flex.Item>
      </Flex>
    </PositionListEmptyTemplate>
  );
};

export { EmptyPositionsList };
