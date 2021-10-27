import './Box.less';

import cn from 'classnames';
import React from 'react';

interface BoxProps extends React.PropsWithChildren<unknown> {
  borderRadius?: 's' | 'm' | 'l';
  isContrast?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Box = ({
  children,
  borderRadius,
  isContrast,
  className,
  onClick,
}: BoxProps): JSX.Element => (
  <div
    className={cn(
      'ergodex-box',
      borderRadius && `ergodex-box--radius-${borderRadius}`,
      isContrast && `ergodex-box--contrast`,
      className,
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

export { Box };
