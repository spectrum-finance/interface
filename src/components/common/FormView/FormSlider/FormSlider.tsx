import { Box, Flex, Slider, Typography } from '@ergolabs/ui-kit';
import React from 'react';

import { FormSpace } from '../FormSpace/FormSpace';

const marks = {
  1: 'Min',
  25: '25%',
  50: '50%',
  75: '75%',
  100: 'Max',
};

interface FormSliderProps {
  value: number;
  onChange: (p: number) => void;
}

const FormSlider: React.FC<FormSliderProps> = ({ value, onChange }) => {
  return (
    <FormSpace noBorder glass>
      <Flex col>
        <Flex.Item
          marginBottom={4}
          display="flex"
          align="center"
          justify="center"
        >
          <Box padding={[2, 3]} borderRadius="l">
            <Typography.Title level={1}>{value}%</Typography.Title>
          </Box>
        </Flex.Item>
        <Slider
          tooltipVisible={false}
          marks={marks}
          defaultValue={value}
          onChange={onChange}
        />
      </Flex>
    </FormSpace>
  );
};

export { FormSlider };
