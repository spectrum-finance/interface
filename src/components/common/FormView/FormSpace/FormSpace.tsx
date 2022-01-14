import React from 'react';

import { Box } from '../../../../ergodex-cdk';

interface FormSpaceProps {
  children: React.ReactChild | React.ReactChild[];
  noPadding?: boolean;
}

const FormSpace: React.FC<FormSpaceProps> = ({
  children,
  noPadding,
}): JSX.Element => {
  return (
    <Box contrast padding={noPadding ? 0 : 4}>
      {children}
    </Box>
  );
};

export { FormSpace };
