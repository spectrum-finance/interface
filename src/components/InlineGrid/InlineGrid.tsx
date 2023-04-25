import { Flex } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

export interface InlineGridItemProps {
  readonly title: ReactNode | ReactNode[] | string;
  readonly value: ReactNode | ReactNode[] | string;
}

const InlineGridItem: FC<InlineGridItemProps> = ({ title, value }) => (
  <Flex align="center">
    <Flex.Item flex={1}>{title}</Flex.Item>
    <Flex.Item>{value}</Flex.Item>
  </Flex>
);

export interface InlineGridProps {
  readonly gap?: number;
  readonly children?: ReactNode | ReactNode[] | string;
}

export const InlineGrid: FC<InlineGridProps> & {
  Item: FC<InlineGridItemProps>;
} = ({ gap, children }) => {
  return (
    <Flex col gap={gap}>
      {children}
    </Flex>
  );
};

InlineGrid.Item = InlineGridItem;
