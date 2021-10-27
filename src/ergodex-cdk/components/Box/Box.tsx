import './Box.less';

import cn from 'classnames';
import React from 'react';

type PaddingTwoNumbers = [number, number];
type PaddingFourNumbers = [number, number, number, number];
type Padding = number | PaddingTwoNumbers | PaddingFourNumbers;

interface BoxProps extends React.PropsWithChildren<unknown> {
  borderRadius?: 's' | 'm' | 'l';
  contrast?: boolean;
  transparent?: boolean;
  inline?: boolean;
  className?: string;
  padding?: Padding;
}

const calcGutter = (n: number): string =>
  `calc(var(--ergo-base-gutter) * ${n})`;

const Box = ({
  children,
  className,
  borderRadius,
  contrast,
  padding,
  transparent,
  inline,
}: BoxProps): JSX.Element => {
  const getPadding = (p: Padding) => {
    if (p instanceof Array && p.length === 2) {
      return `${calcGutter(p[0])} ${calcGutter(p[1])}`;
    }
    if (p instanceof Array && p.length === 4) {
      return `${calcGutter(p[0])} ${calcGutter(p[1])} ${calcGutter(
        p[2],
      )} ${calcGutter(p[3])}`;
    }
    return `calc(var(--ergo-base-gutter) * ${p})`;
  };
  return (
    <div
      className={cn(
        'ergodex-box',
        borderRadius && `ergodex-box--radius-${borderRadius}`,
        contrast && `ergodex-box--contrast`,
        transparent && `ergodex-box--transparent`,
        inline && `ergodex-box--inline`,
        className,
      )}
      style={{
        padding: padding
          ? getPadding(padding)
          : `calc(var(--ergo-base-gutter))`,
      }}
    >
      {children}
    </div>
  );
};

export { Box };
