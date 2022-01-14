import React from 'react';

import { Box, Flex, Slider, Typography } from '../../../ergodex-cdk';

const marks = {
  0: 'Min',
  25: '25%',
  50: '50%',
  75: '75%',
  100: 'Max',
};

interface RemovePositionSliderProps {
  value: number;
  onChange: (p: number) => void;
}

const RemovePositionSlider: React.FC<RemovePositionSliderProps> = ({
  value,
  onChange,
}) => {
  return (
    <Box contrast padding={4}>
      <Flex direction="col">
        <Flex.Item>
          <Flex direction="col">
            <Flex.Item marginBottom={4}>
              <Flex align="center" justify="center">
                <Typography.Title level={1}>{value}%</Typography.Title>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Slider
                tooltipVisible={false}
                marks={marks}
                defaultValue={value}
                onChange={onChange}
              />
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export { RemovePositionSlider };
