import {
  CalculatorOutlined,
  Flex,
  Form,
  Modal,
  useForm,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { ElementLocation } from '@spectrumlabs/analytics';
import { FC } from 'react';

import { AddLiquidityForm } from '../AddLiquidityForm/AddLiquidityForm';
import { AddLiquidityFormModel } from '../AddLiquidityForm/AddLiquidityFormModel';
import { Section } from '../Section/Section';
import {
  DurationSlider,
  MAX_EPOCHS_COUNT,
} from './DurationSlider/DurationSlider';
import { RewardsBox } from './RewardsBox/RewardsBox';

interface LbspCalculatorModalProps {
  close: () => void;
}

export interface AddLiquidityFormModelWithDuration
  extends AddLiquidityFormModel {
  readonly duration: number;
}

export const LbspCalculatorModal: FC<LbspCalculatorModalProps> = ({
  close,
}) => {
  const form = useForm<AddLiquidityFormModelWithDuration>({
    xAsset: undefined,
    yAsset: undefined,
    x: undefined,
    y: undefined,
    pool: undefined,
    duration: MAX_EPOCHS_COUNT,
  });

  return (
    <>
      <Modal.Title>
        <Flex align="center">
          <Flex.Item marginRight={1}>
            <CalculatorOutlined />
          </Flex.Item>
          <Trans>LBSP Calculator</Trans>
        </Flex>
      </Modal.Title>
      <Modal.Content width={480}>
        <AddLiquidityForm
          form={form}
          withoutConfirmation={true}
          traceFormLocation={ElementLocation.depositForm}
          onSubmitSuccess={close}
        >
          <Flex col>
            <Flex.Item marginTop={6}>
              <Form.Listener>
                {({ value: { pool, y, x } }) =>
                  pool &&
                  y &&
                  x && (
                    <Section title={<Trans>Duration</Trans>} gap={1}>
                      <Form.Item name="duration">
                        {({ value, onChange }) => (
                          <DurationSlider value={value} onChange={onChange} />
                        )}
                      </Form.Item>
                    </Section>
                  )
                }
              </Form.Listener>
            </Flex.Item>
            <Form.Listener>
              {({ value }) => (
                <>
                  {value?.pool && value.y && value.x && (
                    <Flex.Item marginTop={6}>
                      <Section title={<Trans>Rewards</Trans>}>
                        <RewardsBox
                          y={value.y}
                          x={value.x}
                          ammPool={value.pool}
                          duration={value.duration}
                        />
                      </Section>
                    </Flex.Item>
                  )}
                </>
              )}
            </Form.Listener>
          </Flex>
        </AddLiquidityForm>
      </Modal.Content>
    </>
  );
};
