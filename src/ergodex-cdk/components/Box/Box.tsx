import './Box.less';

import cn from 'classnames';
import React from 'react';

interface BoxProps extends React.PropsWithChildren<unknown> {
  borderRadius?: 's' | 'm' | 'l';
  isContrast?: boolean;
}

const Box = ({ children, borderRadius, isContrast }: BoxProps): JSX.Element => {
  return (
    <div
      className={cn(
        'ergodex-box',
        borderRadius && `ergodex-box--radius-${borderRadius}`,
        isContrast && `ergodex-box--contrast`,
      )}
    >
      {children}
    </div>
  );
};

export { Box };
