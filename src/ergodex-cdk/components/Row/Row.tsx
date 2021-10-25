import { Row as BaseRow, RowProps as BaseRowProps } from 'antd';
import React from 'react';
import { FC } from 'react';

interface RowProps extends BaseRowProps {
  readonly gutter?: number;
  readonly bottomGutter?: number;
  readonly topGutter?: number;
}

export const Row: FC<RowProps> = ({
  gutter,
  bottomGutter,
  topGutter,
  children,
  ...other
}) => (
  <BaseRow
    {...other}
    style={{
      marginBottom: `calc(var(--ergo-base-gutter) * ${
        bottomGutter || gutter || 0
      })`,
      marginTop: `calc(var(--ergo-base-gutter) * ${topGutter || gutter || 0})`,
    }}
  >
    {children}
  </BaseRow>
);
