import { getGutter, Gutter } from '@ergolabs/ui-kit';
import { FC, PropsWithChildren } from 'react';

export interface TableViewDetailsProps {
  readonly height: number;
  readonly padding?: Gutter;
}

export const TableViewDetails: FC<PropsWithChildren<TableViewDetailsProps>> = ({
  height,
  padding,
  children,
}) => (
  <div style={{ height, padding: padding ? getGutter(padding) : 'initial' }}>
    {children}
  </div>
);
