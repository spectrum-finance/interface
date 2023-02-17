import { Box } from '@ergolabs/ui-kit';
import React from 'react';

interface FormSpaceProps {
  children: React.ReactChild | React.ReactChild[];
  noPadding?: boolean;
  noBorder?: boolean;
  glass?: boolean;
}

const FormSpace: React.FC<FormSpaceProps> = ({
  children,
  noPadding,
  noBorder,
  glass,
}): JSX.Element => {
  return (
    <Box
      secondary
      glass={glass}
      padding={noPadding ? 0 : 4}
      borderRadius="l"
      bordered={!noBorder}
    >
      {children}
    </Box>
  );
};

export { FormSpace };
