import './Flex.less';

import cn from 'classnames';
import React from 'react';
import { FC } from 'react';

type ItemsProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  display?: 'flex';
  order?: number;
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
  flex?: number;
  grow?: boolean;
};

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
  ...other
}) => (
  <div
    className={grow ? 'ergo-flex-item__grow' : ''}
    style={{
      ...(style || {}),
      order,
      display: display && display,
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
  marginBottom: 0,
  marginRight: 0,
  marginLeft: 0,
  marginTop: 0,
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
  flexDirection: 'row',
  justify: 'stretch',
  alignItems: 'stretch',
};
Flex.Item = Item;
