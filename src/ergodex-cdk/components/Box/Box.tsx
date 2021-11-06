import './Box.less';

import cn from 'classnames';
import React from 'react';

type PaddingTwoNumbers = [number, number];
type PaddingFourNumbers = [number, number, number, number];
type Padding = number | PaddingTwoNumbers | PaddingFourNumbers;

interface BoxProps extends React.PropsWithChildren<unknown> {
  borderRadius?: 's' | 'm' | 'l';
  contrast?: boolean;
  gray?: boolean;
  transparent?: boolean;
  inline?: boolean;
  formWrapper?: boolean;
  className?: string;
  padding?: Padding;
  maxHeight?: number;
  overflow?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const calcGutter = (n: number): string =>
  `calc(var(--ergo-base-gutter) * ${n})`;

const Box = ({
  children,
  className,
  borderRadius,
  contrast,
  gray,
  padding,
  transparent,
  inline,
  onClick,
  formWrapper,
  maxHeight,
  overflow,
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
        gray && `ergodex-box--gray`,
        transparent && `ergodex-box--transparent`,
        inline && `ergodex-box--inline`,
        formWrapper && `ergodex-box--form-wrapper`,
        className,
      )}
      style={{
        padding:
          padding != null
            ? getPadding(padding)
            : `calc(var(--ergo-base-gutter))`,
        maxHeight: `${maxHeight}px`,
        overflow: overflow ? 'auto' : 'none',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { Box };
