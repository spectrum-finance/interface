import { Box } from '@ergolabs/ui-kit';
import * as React from 'react';

interface FormSpaceProps {
  children: React.ReactChild | React.ReactChild[];
  noPadding?: boolean;
  noBorder?: boolean;
  glass?: boolean;
  height?: number;
}

const FormSpace: React.FC<FormSpaceProps> = ({
  children,
  noPadding,
  noBorder,
  glass,
  height,
}): JSX.Element => {
  return (
    <Box
      secondary
      glass={glass}
      padding={noPadding ? 0 : 4}
      borderRadius="l"
      height={height}
      bordered={!noBorder}
    >
      {children}
    </Box>
  );
};

export { FormSpace };
