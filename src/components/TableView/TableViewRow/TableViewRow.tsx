import { Flex } from '@ergolabs/ui-kit';
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
      style={{ flexGrow: 1 }}
    >
      {children}
    </Flex.Item>
  );
};

const _Row: FC<PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <Flex stretch align="center" justify="flex-start" width="100%">
    {children}
  </Flex>
);

export const TableViewRow: typeof _Row & { Column: typeof Column } =
  _Row as any;
TableViewRow.Column = Column;
