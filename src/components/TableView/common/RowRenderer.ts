import { Gutter } from '@ergolabs/ui-kit';
import { FC, PropsWithChildren } from 'react';

export type RowRendererProps = PropsWithChildren<{
  padding?: Gutter;
  height: number;
  hoverable?: boolean;
}>;

export type RowRenderer = FC<RowRendererProps>;
