import { Flex, getGutter, Gutter } from '@ergolabs/ui-kit';
import { CSSProperties, FC, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import { normalizeMeasure } from '../../List/utils/normalizeMeasure';

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
  readonly className?: string;
}

const Row: FC<PropsWithChildren<RowProps>> = ({ children, className }) => (
  <Flex align="center" justify="flex-start" width="100%" className={className}>
    {children}
  </Flex>
);

export const TableViewRow: typeof Row & { Column: typeof Column } = styled(Row)`
  height: ${(props) => normalizeMeasure(props.height)};
  ${(props) =>
    props.padding &&
    css`
      padding: ${getGutter(props.padding)};
    `};
` as any;
TableViewRow.Column = Column;
