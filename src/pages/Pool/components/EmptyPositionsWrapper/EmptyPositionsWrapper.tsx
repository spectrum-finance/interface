import React from 'react';

import { Flex, Typography } from '../../../../ergodex-cdk';
import { EmptyTemplateContainer } from '../../common/EmptyTemplateContainer/EmptyTemplateContainer';

interface EmptyPositionsListProps {
  children?: React.ReactChild | React.ReactChild[];
}

const EmptyPositionsWrapper: React.FC<EmptyPositionsListProps> = ({
  children,
}) => {
  return (
    <EmptyTemplateContainer>
      <Flex col align="center" justify="center">
        <Flex.Item marginBottom={2}>
          <Typography.Body>
            Your liquidity positions will appear here.
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>{children}</Flex.Item>
      </Flex>
    </EmptyTemplateContainer>
  );
};

export { EmptyPositionsWrapper };
