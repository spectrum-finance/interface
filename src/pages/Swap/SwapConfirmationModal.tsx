import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { Typography } from 'antd';
import React, { FC } from 'react';

import {
  TokenControlFormItem,
  TokenControlValue,
} from '../../components/common/TokenControl/TokenControl';
import { Box, Flex, Form, Modal } from '../../ergodex-cdk';

interface SwapFormModel {
  readonly from?: TokenControlValue;
  readonly to?: TokenControlValue;
  readonly pool?: AmmPool;
}

export interface SwapConfirmationModalProps {
  values: SwapFormModel;
}

export const SwapConfirmationModal: FC<SwapConfirmationModalProps> = ({
  values,
}) => {
  const [form] = Form.useForm();

  return (
    <Box>
      <Form form={form} initialValues={values}>
        <Flex flexDirection="col">
          <Flex.Item marginBottom={1}>
            <TokenControlFormItem
              readonly
              bordered
              noBottomInfo
              name="from"
              label="From"
            />
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <TokenControlFormItem
              readonly
              bordered
              noBottomInfo
              name="to"
              label="To"
            />
          </Flex.Item>
          <Box contrast padding={4}>
            <Flex flexDirection="col">
              <Flex.Item marginBottom={2}>
                <Flex flexDirection="row">
                  <Flex.Item flex={1}>
                    <Typography.Text>Minimum received</Typography.Text>
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Text>0.044 WETH</Typography.Text>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <Flex flexDirection="row">
                  <Flex.Item flex={1}>
                    <Typography.Text>Minimum received</Typography.Text>
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Text>0.044 WETH</Typography.Text>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <Flex flexDirection="row">
                  <Flex.Item flex={1}>
                    <Typography.Text>Minimum received</Typography.Text>
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Text>0.044 WETH</Typography.Text>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <Flex flexDirection="row">
                  <Flex.Item flex={1}>
                    <Typography.Text>Minimum received</Typography.Text>
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Text>0.044 WETH</Typography.Text>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
            </Flex>
          </Box>
        </Flex>
      </Form>
    </Box>
  );
};

export const openSwapConfirmationModal = (values: SwapFormModel) =>
  Modal.open(<SwapConfirmationModal values={values} />, {
    title: 'Confirm swap',
    width: 424,
  });
