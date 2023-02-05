import { Box } from '@ergolabs/ui-kit';
import React from 'react';

interface FormSpaceProps {
  children: React.ReactChild | React.ReactChild[];
  noPadding?: boolean;
  glass?: boolean;
}

const FormSpace: React.FC<FormSpaceProps> = ({
  children,
  noPadding,
  glass,
}): JSX.Element => {
  return (
    <Box glass={glass} secondary padding={noPadding ? 0 : 4} borderRadius="l">
      {children}
    </Box>
  );
};

export { FormSpace };
