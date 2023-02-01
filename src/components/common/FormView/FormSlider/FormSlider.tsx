import { Flex, Slider, Typography } from '@ergolabs/ui-kit';
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
    <FormSpace glass>
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
    </FormSpace>
  );
};

export { FormSlider };
