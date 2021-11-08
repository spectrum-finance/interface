import { AmmPool, minValueForOrder, swapVars } from '@ergolabs/ergo-dex-sdk';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
} from '@ergolabs/ergo-sdk';
import React, { FC } from 'react';

import {
  TokenControlFormItem,
  TokenControlValue,
} from '../../components/common/TokenControl/TokenControl';
import { ERG_DECIMALS, UI_FEE } from '../../constants/erg';
import { defaultExFee } from '../../constants/settings';
import { useSettings } from '../../context';
import { Box, Button, Flex, Form, Typography } from '../../ergodex-cdk';
import { useObservable } from '../../hooks/useObservable';
import { explorer } from '../../services/explorer';
import { utxos$ } from '../../services/new/core';
import { poolActions } from '../../services/poolActions';
import { submitTx } from '../../services/yoroi';
import { makeTarget } from '../../utils/ammMath';
import { parseUserInputToFractions } from '../../utils/math';
import { getBaseInputParameters } from '../../utils/walletMath';

interface SwapFormModel {
  readonly from?: TokenControlValue;
  readonly to?: TokenControlValue;
  readonly pool?: AmmPool;
}

export interface SwapConfirmationModalProps {
  value: SwapFormModel;
  onClose: (p: Promise<any>) => void;
}

export const SwapConfirmationModal: FC<SwapConfirmationModalProps> = ({
  value,
  onClose,
}) => {
  const [form] = Form.useForm();

  const [{ minerFee, address, pk, slippage, nitro }] = useSettings();
  const [utxos] = useObservable(utxos$);

  const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
  const exFeeNErg = parseUserInputToFractions(defaultExFee, ERG_DECIMALS);
  const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

  const swapOperation = async () => {
    if (
      pk &&
      utxos &&
      address &&
      value.pool &&
      value.from?.amount?.viewValue &&
      value.from?.asset &&
      value.to?.asset?.id
    ) {
      const poolId = value.pool.id;
      const poolFeeNum = value.pool.poolFeeNum;
      const quoteAsset = value.to?.asset?.id;

      const inputAmount = value.from?.amount?.viewValue;
      const inputAsset = value.from?.asset;

      const network = await explorer.getNetworkContext();

      const { baseInput, baseInputAmount, minOutput } = getBaseInputParameters(
        value.pool,
        {
          inputAmount,
          inputAsset,
          slippage,
        },
      );

      const vars = swapVars(exFeeNErg, nitro, minOutput);

      if (vars) {
        const exFeePerToken = vars[0];
        const { maxExFee, minOutput } = vars[1];

        const minNErgs = minValueForOrder(minerFeeNErgs, uiFeeNErg, maxExFee);

        const target = makeTarget(
          [new AssetAmount(inputAsset, baseInputAmount)],
          minNErgs,
        );

        const inputs = DefaultBoxSelector.select(utxos, target) as BoxSelection;

        const { swap } = poolActions(value.pool);

        swap(
          {
            pk,
            poolId,
            baseInput,
            minQuoteOutput: minOutput.amount,
            exFeePerToken,
            uiFee: uiFeeNErg,
            quoteAsset,
            poolFeeNum,
          },
          {
            inputs,
            changeAddress: address,
            selfAddress: address,
            feeNErgs: minerFeeNErgs,
            network,
          },
        ).then(async (tx) => {
          await submitTx(tx);
        });
      }
    }
  };

  return (
    <Box>
      <Form form={form} initialValues={value}>
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
          <Flex.Item>
            <Button size="large" type="primary" block onClick={swapOperation}>
              Confirm swap
            </Button>
          </Flex.Item>
        </Flex>
      </Form>
    </Box>
  );
};
