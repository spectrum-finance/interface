import React from 'react';

import { Box } from '../../../../ergodex-cdk';

const FormSpace: React.FC<{ children: React.ReactChild | React.ReactChild[] }> =
  ({ children }): JSX.Element => {
    return (
      <Box contrast padding={4}>
        {children}
      </Box>
    );
  };

export { FormSpace };
