import './Flex.less';

import cn from 'classnames';
import React from 'react';
import { FC } from 'react';

type ItemsProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  order?: number;
  bottomGutter?: number;
  topGutter?: number;
  leftGutter?: number;
  rightGutter?: number;
  flex?: number;
};

const Item: FC<ItemsProps> = ({
  children,
  style,
  order,
  bottomGutter,
  topGutter,
  leftGutter,
  rightGutter,
  flex,
}) => (
  <div
    style={{
      ...(style || {}),
      order,
      flex,
      marginBottom: `calc(var(--ergo-base-gutter) * ${bottomGutter})`,
      marginTop: `calc(var(--ergo-base-gutter) * ${topGutter})`,
      marginRight: `calc(var(--ergo-base-gutter) * ${rightGutter})`,
      marginLeft: `calc(var(--ergo-base-gutter) * ${leftGutter})`,
    }}
  >
    {children}
  </div>
);
Item.defaultProps = {
  order: undefined,
  flex: undefined,
  bottomGutter: 0,
  rightGutter: 0,
  leftGutter: 0,
  topGutter: 0,
};

export type FlexProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  flexDirection?: 'row' | 'col';
  justify?:
    | 'flex-start'
    | 'stretch'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  alignItems?: 'flex-start' | 'stretch' | 'flex-end' | 'center';
};

export const Flex: FC<FlexProps> & { Item: FC<ItemsProps> } = ({
  children,
  justify,
  alignItems,
  flexDirection,
  className,
  ...other
}) => (
  <div
    className={cn([
      className,
      'ergo-flex',
      `ergo-flex-direction--${flexDirection}`,
      `ergo-flex-justify--${justify}`,
      `ergo-flex-align-items--${alignItems}`,
    ])}
    {...other}
  >
    {children}
  </div>
);

Flex.defaultProps = {
  flexDirection: 'col',
  justify: 'stretch',
  alignItems: 'stretch',
};
Flex.Item = Item;
