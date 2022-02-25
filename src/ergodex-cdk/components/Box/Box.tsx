import './Box.less';

import cn from 'classnames';
import React from 'react';

import { getGutter, Gutter } from '../../utils/gutter';

interface BoxProps extends React.PropsWithChildren<unknown> {
  borderRadius?: 'xs' | 's' | 'm' | 'l' | 'xl';
  contrast?: boolean;
  control?: boolean;
  transparent?: boolean;
  inline?: boolean;
  className?: string;
  padding?: Gutter;
  maxHeight?: number;
  overflow?: boolean;
  bordered?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  width?: number;
  tag?: boolean;
  height?: string | number;
}

const Box = ({
  children,
  className,
  borderRadius,
  contrast,
  control,
  padding,
  transparent,
  inline,
  onClick,
  maxHeight,
  overflow,
  width,
  tag,
  height,
  bordered,
}: BoxProps): JSX.Element => {
  return (
    <div
      className={cn(
        'ergodex-box',
        borderRadius && `ergodex-box--radius-${borderRadius}`,
        contrast && `ergodex-box--contrast`,
        (bordered === undefined || bordered) && `ergodex-box--bordered`,
        transparent && `ergodex-box--transparent`,
        control && 'ergodex-box--control',
        inline && `ergodex-box--inline`,
        tag && `ergodex-box--tag`,
        className,
      )}
      style={{
        padding:
          padding != null
            ? getGutter(padding)
            : `calc(var(--ergo-base-gutter))`,
        maxHeight: `${maxHeight}px`,
        overflow: overflow ? 'auto' : 'none',
        width: width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { Box };
