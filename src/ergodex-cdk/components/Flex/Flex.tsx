import './Flex.less';

import cn from 'classnames';
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import { FC } from 'react';

import { Gutter } from '../../utils/gutter';

export type FlexProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  direction?: 'row' | 'col';
  row?: boolean;
  col?: boolean;
  stretch?: boolean;
  inline?: boolean;
  justify?:
    | 'flex-start'
    | 'stretch'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  align?: 'flex-start' | 'stretch' | 'flex-end' | 'center';
};

// @ts-ignore because of Flex.Item
export const Flex: ForwardRefExoticComponent<
  PropsWithoutRef<FlexProps> & RefAttributes<HTMLDivElement>
> & { Item: FC<ItemsProps> } = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      justify,
      align,
      direction,
      className,
      col,
      row,
      stretch,
      inline,
      ...other
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn([
          className,
          'ergo-flex',
          `ergo-flex-direction--${
            (col && 'col') || (row && 'row') || direction
          }`,
          `ergo-flex-justify--${justify}`,
          `ergo-flex-align-items--${align}`,
          { 'ergo-flex-stretch': stretch },
          { 'ergo-flex-inline': inline },
        ])}
        {...other}
      >
        {children}
      </div>
    );
  },
);

Flex.displayName = 'Flex';

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
  alignSelf?: 'flex-start' | 'stretch' | 'flex-end' | 'center';
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
  margin?: Gutter;
  flex?: number;
  grow?: boolean;
} & FlexProps;

const Item: FC<ItemsProps> = ({
  alignSelf,
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
      `ergo-flex-align-self--${alignSelf}`,
      `ergo-flex-align-items--${align}`,
      { 'ergo-flex-item__grow': grow },
    ])}
    style={{
      order,
      display: display || (justify || direction || align ? 'flex' : 'initial'),
      flex,
      marginBottom: `calc(var(--ergo-base-gutter) * ${marginBottom})`,
      marginTop: `calc(var(--ergo-base-gutter) * ${marginTop})`,
      marginRight: `calc(var(--ergo-base-gutter) * ${marginRight})`,
      marginLeft: `calc(var(--ergo-base-gutter) * ${marginLeft})`,
      ...style,
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
