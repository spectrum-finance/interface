import './Box.less';

import cn from 'classnames';
import React from 'react';

interface BoxProps extends React.PropsWithChildren<unknown> {
  borderRadius?: 's' | 'm' | 'l';
  isContrast?: boolean;
  className?: string;
  padding?: number | [number, number];
}

const Box = ({
  children,
  className,
  borderRadius,
  isContrast,
  padding,
}: BoxProps): JSX.Element => {
  const getPadding = (p: number | [number, number]) => {
    if (p instanceof Array) {
      return `calc(var(--ergo-base-gutter) / 2 * ${p[0]}) calc(var(--ergo-base-gutter) / 2 * ${p[1]})`;
    }
    return `calc(var(--ergo-base-gutter) / 2 * ${p})`;
  };
  return (
    <div
      className={cn(
        'ergodex-box',
        borderRadius && `ergodex-box--radius-${borderRadius}`,
        isContrast && `ergodex-box--contrast`,
        className,
      )}
      style={{
        padding: padding
          ? getPadding(padding)
          : `calc(var(--ergo-base-gutter) / 2)`,
      }}
    >
      {children}
    </div>
  );
};

export { Box };
