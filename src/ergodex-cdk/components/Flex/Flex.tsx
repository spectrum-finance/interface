import './Flex.less';

import cn from 'classnames';
import React from 'react';
import { FC } from 'react';

import { Gutter } from '../../utils/gutter';

export type FlexProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  direction?: 'row' | 'col';
  row?: boolean;
  col?: boolean;
  justify?:
    | 'flex-start'
    | 'stretch'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  align?: 'flex-start' | 'stretch' | 'flex-end' | 'center';
};

export const Flex: FC<FlexProps> & { Item: FC<ItemsProps> } = ({
  children,
  justify,
  align,
  direction,
  className,
  col,
  row,
  ...other
}) => (
  <div
    className={cn([
      className,
      'ergo-flex',
      `ergo-flex-direction--${(col && 'col') || (row && 'row') || direction}`,
      `ergo-flex-justify--${justify}`,
      `ergo-flex-align-items--${align}`,
    ])}
    {...other}
  >
    {children}
  </div>
);

Flex.defaultProps = {
  direction: 'row',
  justify: 'stretch',
  align: 'stretch',
};

type ItemsProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  display?: 'flex' | 'block' | 'none';
  order?: number;
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
  margin?: Gutter;
  flex?: number;
  grow?: boolean;
} & FlexProps;

const Item: FC<ItemsProps> = ({
  children,
  display,
  style,
  order,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
  flex,
  grow,
  justify,
  direction,
  align,
  col,
  row,
  className,
  ...other
}) => (
  <div
    className={cn([
      className,
      'ergo-flex',
      `ergo-flex-direction--${(col && 'col') || (row && 'row') || direction}`,
      `ergo-flex-justify--${justify}`,
      `ergo-flex-align-items--${align}`,
      { 'ergo-flex-item__grow': grow },
    ])}
    style={{
      ...(style || {}),
      order,
      display: display || (justify || direction || align ? 'flex' : 'initial'),
      flex,
      marginBottom: `calc(var(--ergo-base-gutter) * ${marginBottom})`,
      marginTop: `calc(var(--ergo-base-gutter) * ${marginTop})`,
      marginRight: `calc(var(--ergo-base-gutter) * ${marginRight})`,
      marginLeft: `calc(var(--ergo-base-gutter) * ${marginLeft})`,
    }}
    {...other}
  >
    {children}
  </div>
);
Item.defaultProps = {
  order: undefined,
  flex: undefined,
  row: true,
  marginBottom: 0,
  marginRight: 0,
  marginLeft: 0,
  marginTop: 0,
};

Flex.Item = Item;
