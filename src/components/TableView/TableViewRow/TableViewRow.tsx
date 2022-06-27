import { Flex, getGutter, Gutter } from '@ergolabs/ui-kit';
import React, { CSSProperties, FC, PropsWithChildren } from 'react';

interface ColumnProps {
  readonly width?: CSSProperties['width'];
  readonly maxWidth?: CSSProperties['maxWidth'];
  readonly minWidth?: CSSProperties['minWidth'];
}

const Column: FC<PropsWithChildren<ColumnProps>> = ({
  width,
  minWidth,
  maxWidth,
  children,
}) => {
  return (
    <Flex.Item
      width={width}
      maxWidth={maxWidth}
      minWidth={minWidth}
      style={{ flexGrow: width ? 'initial' : 1 }}
    >
      {children}
    </Flex.Item>
  );
};

interface RowProps {
  readonly height: number;
  readonly padding?: Gutter;
}

const Row: FC<PropsWithChildren<RowProps>> = ({
  children,
  height,
  padding,
}) => (
  <Flex
    align="center"
    justify="flex-start"
    width="100%"
    style={{ height, padding: padding ? getGutter(padding) : 'initial' }}
  >
    {children}
  </Flex>
);

export const TableViewRow: typeof Row & { Column: typeof Column } = Row as any;
TableViewRow.Column = Column;
