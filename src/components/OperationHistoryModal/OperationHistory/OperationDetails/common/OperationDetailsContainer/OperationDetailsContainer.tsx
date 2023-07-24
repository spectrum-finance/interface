import { Box, useDevice } from '@ergolabs/ui-kit';
import { Flex } from '@ergolabs/ui-kit/dist/components/Flex/Flex';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

export interface OperationDetailContainerProps {
  readonly leftSide: ReactNode | ReactNode[] | string;
  readonly rightSide: ReactNode | ReactNode[] | string;
}

interface HisrotyDividerProps {
  direction: 'vertical' | 'horizontal';
}

const HistoryDivider = styled.div<HisrotyDividerProps>`
  border-left: ${(props) =>
    props.direction === 'horizontal'
      ? '1px solid var(--spectrum-box-border-color)'
      : 'none'};
  border-top: ${(props) =>
    props.direction === 'vertical'
      ? '1px solid var(--spectrum-box-border-color)'
      : 'none'};
  width: 100%;
  height: 100%;
`;

export const OperationDetailsContainer: FC<OperationDetailContainerProps> = ({
  leftSide,
  rightSide,
}) => {
  const { s } = useDevice();
  return (
    <Box bordered={false} height="100%" padding={4} accent glass>
      <Flex col={s} stretch width="100%">
        <Flex.Item flex={s ? 0 : 1}>{leftSide}</Flex.Item>
        <Flex.Item
          marginRight={s ? 0 : 4}
          marginLeft={s ? 0 : 4}
          marginTop={s ? 4 : 0}
          marginBottom={s ? 4 : 0}
        >
          <HistoryDivider direction={s ? 'vertical' : 'horizontal'} />
        </Flex.Item>
        <Flex.Item flex={s ? 0 : 1}>{rightSide}</Flex.Item>
      </Flex>
    </Box>
  );
};
