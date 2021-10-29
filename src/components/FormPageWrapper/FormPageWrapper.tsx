import React from 'react';

import { Box, Flex } from '../../ergodex-cdk';

interface FormPageWrapperProps {
  width: number;
}

const FormPageWrapper: React.FC<FormPageWrapperProps> = ({
  children,
  width,
}) => {
  return (
    <Flex justify="center" alignItems="center">
      <Flex.Item style={{ width: width }}>
        <Box formWrapper padding={[6, 4]} borderRadius="m">
          {children}
        </Box>
      </Flex.Item>
    </Flex>
  );
};

export { FormPageWrapper };
