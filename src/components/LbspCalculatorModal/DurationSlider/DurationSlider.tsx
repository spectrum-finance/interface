import { Control, Flex, Input, Slider, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export const MIN_EPOCHS_COUNT = 1;

export const MAX_EPOCHS_COUNT = 36;

export const DurationSlider: FC<Control<number>> = ({ value, onChange }) => {
  const handleChange = (number: number) => {
    if (!onChange) {
      return;
    }

    if (!number) {
      onChange(MIN_EPOCHS_COUNT);
      return;
    }
    if (number > MAX_EPOCHS_COUNT) {
      onChange(MAX_EPOCHS_COUNT);
      return;
    }
    onChange(number);
  };

  return (
    <Flex row align="center">
      <Flex.Item marginRight={3}>
        <Input
          size="large"
          type="number"
          min={MIN_EPOCHS_COUNT}
          max={MAX_EPOCHS_COUNT}
          value={value}
          onChange={(event) => handleChange(event.target.valueAsNumber)}
          suffix={
            <Typography.Body>
              <Trans>Epochs</Trans>
            </Typography.Body>
          }
        />
      </Flex.Item>
      <Flex.Item flex={1}>
        <Slider
          max={MAX_EPOCHS_COUNT}
          min={MIN_EPOCHS_COUNT}
          tooltipVisible={false}
          style={{ margin: 0 }}
          value={value}
          onChange={handleChange}
        />
      </Flex.Item>
    </Flex>
  );
};
