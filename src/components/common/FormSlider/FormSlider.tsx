import React from 'react';

import { Box, Flex, Slider, Typography } from '../../../ergodex-cdk';

const marks = {
  0: 'Min',
  25: '25%',
  50: '50%',
  75: '75%',
  100: 'Max',
};

interface FormSliderProps {
  percent: string;
  onChange: (p: number) => void;
}

const FormSlider: React.FC<FormSliderProps> = ({ percent, onChange }) => {
  return (
    <Box contrast padding={4}>
      <Flex direction="col">
        <Flex.Item>
          <Flex direction="col">
            <Flex.Item marginBottom={4}>
              <Flex align="center" justify="center">
                <Typography.Title level={1}>{percent}%</Typography.Title>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Slider
                tooltipVisible={false}
                marks={marks}
                defaultValue={Number(percent)}
                onChange={onChange}
              />
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export { FormSlider };
