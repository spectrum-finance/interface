import { Gutter } from '@ergolabs/ui-kit';
import { FC, PropsWithChildren } from 'react';

export type RowRendererProps = PropsWithChildren<{
  padding?: Gutter;
  height: number;
}>;

export type RowRenderer = FC<RowRendererProps>;
