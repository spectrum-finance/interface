import { AmmPool, minValueForOrder, swapVars } from '@ergolabs/ergo-dex-sdk';
import { SwapExtremums } from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  publicKeyFromAddress,
} from '@ergolabs/ergo-sdk';
import React, { FC, useEffect, useState } from 'react';

import {
  TokenControlFormItem,
  TokenControlValue,
} from '../../../components/common/TokenControl/TokenControl';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ERG_DECIMALS, UI_FEE } from '../../../constants/erg';
import { defaultExFee } from '../../../constants/settings';
import { useSettings } from '../../../context';
import {
  Box,
  Button,
  Flex,
  Form,
  Modal,
  Typography,
} from '../../../ergodex-cdk';
import { useObservable } from '../../../hooks/useObservable';
import { explorer } from '../../../services/explorer';
import { nativeToken$, utxos$ } from '../../../services/new/core';
import { poolActions } from '../../../services/poolActions';
import { submitTx } from '../../../services/yoroi';
import { makeTarget } from '../../../utils/ammMath';
import {
  parseUserInputToFractions,
  renderFractions,
} from '../../../utils/math';
import { calculateTotalFee } from '../../../utils/transactions';
import {
  BaseInputParameters,
  getBaseInputParameters,
} from '../../../utils/walletMath';

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

  const [{ minerFee, address, slippage, nitro }] = useSettings();
  const [utxos] = useObservable(utxos$);
  const [nativeToken] = useObservable(nativeToken$);

  const [baseParams, setBaseParams] = useState<
    BaseInputParameters | undefined
  >();
  const [operationVars, setOperationVars] = useState<
    [number, SwapExtremums] | undefined
  >();
  const [totalFees, setTotalFees] = useState<
    { max: string; min: string } | undefined
  >();

  const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
  const exFeeNErg = parseUserInputToFractions(defaultExFee, ERG_DECIMALS);
  const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

  const poolId = value.pool?.id;
  const poolFeeNum = value.pool?.poolFeeNum;

  const inputAmount = value.from?.amount?.viewValue;
  const inputAsset = value.from?.asset;

  useEffect(() => {
    if (value.pool && inputAmount && inputAsset) {
      setBaseParams(
        getBaseInputParameters(value.pool, {
          inputAmount,
          inputAsset,
          slippage,
        }),
      );
    }
  }, [inputAmount, inputAsset, slippage, value.pool]);

  useEffect(() => {
    if (baseParams?.minOutput) {
      const vars = swapVars(exFeeNErg, nitro, baseParams.minOutput);
      setOperationVars(vars);
      if (vars) {
        const minExFeeToRender = +renderFractions(
          vars[1].minExFee,
          ERG_DECIMALS,
        );
        const maxExFeeToRender = +renderFractions(
          vars[1].maxExFee,
          ERG_DECIMALS,
        );

        setTotalFees({
          min: calculateTotalFee(
            [minExFeeToRender, minerFee, UI_FEE],
            ERG_DECIMALS,
          ),
          max: calculateTotalFee(
            [maxExFeeToRender, minerFee, UI_FEE],
            ERG_DECIMALS,
          ),
        });
      }
    }
  }, [baseParams, exFeeNErg, nitro, minerFee]);

  // const { baseInput, baseInputAmount, minOutput } = getBaseInputParameters(
  //   value.pool,
  //   {
  //     inputAmount,
  //     inputAsset,
  //     slippage,
  //   },
  // );

  // const exFeePerToken = vars[0];
  // const { maxExFee, minOutput } = vars[1];

  const swapOperation = async () => {
    if (
      poolFeeNum &&
      baseParams &&
      utxos &&
      address &&
      poolId &&
      operationVars &&
      value.pool &&
      value.from?.amount?.viewValue &&
      value.from?.asset &&
      value.to?.asset?.id
    ) {
      const pk = publicKeyFromAddress(address)!;
      const actions = poolActions(value.pool);
      const quoteAsset = value.to?.asset?.id;

      const minNErgs = minValueForOrder(
        minerFeeNErgs,
        uiFeeNErg,
        operationVars[1].maxExFee,
      );

      const target = makeTarget(
        [new AssetAmount(inputAsset!, baseParams.baseInputAmount)],
        minNErgs,
      );

      const inputs = DefaultBoxSelector.select(utxos, target) as BoxSelection;

      const network = await explorer.getNetworkContext();

      onClose(
        actions
          .swap(
            {
              pk,
              poolId,
              baseInput: baseParams.baseInput,
              minQuoteOutput: operationVars[1].minOutput.amount,
              exFeePerToken: operationVars[0],
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
          )
          .then((tx) => submitTx(tx)),
      );
    }
  };

  return (
    <>
      <Modal.Title>Confirm swap</Modal.Title>
      <Modal.Content width={496}>
        <Form form={form} initialValues={value}>
          <Flex direction="col">
            <Flex.Item marginBottom={1}>
              <TokenControlFormItem
                readonly
                bordered
                noBottomInfo
                name="from"
                label="From"
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <TokenControlFormItem
                readonly
                bordered
                noBottomInfo
                name="to"
                label="To"
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Box contrast padding={4}>
                <Flex direction="col">
                  <Flex.Item marginBottom={2}>
                    <Flex direction="row">
                      <Flex.Item flex={1}>
                        <Typography.Text>Slippage tolerance:</Typography.Text>
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Text>{slippage}%</Typography.Text>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                  <Flex.Item marginBottom={2}>
                    <Flex direction="row">
                      <Flex.Item flex={1}>
                        <Typography.Text>Nitro:</Typography.Text>
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Text>{nitro}</Typography.Text>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                  <Flex.Item marginBottom={2}>
                    <Flex direction="row">
                      <Flex.Item flex={1}>
                        <Typography.Text>Estimated output:</Typography.Text>
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Text>
                          {operationVars &&
                            `${renderFractions(
                              operationVars[1].minOutput.amount,
                              operationVars[1].minOutput.asset.decimals,
                            )} - ${renderFractions(
                              operationVars[1].maxOutput.amount,
                              operationVars[1].maxOutput.asset.decimals,
                            )} ${operationVars[1].maxOutput.asset.name}`}
                        </Typography.Text>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                  <Flex.Item marginBottom={2}>
                    <Flex direction="row">
                      <Flex.Item flex={1}>
                        <Typography.Text>
                          Total Fees
                          <InfoTooltip
                            placement="right"
                            content={
                              <Flex direction="col" style={{ width: '250px' }}>
                                <Flex.Item>
                                  <Flex justify="space-between">
                                    <Flex.Item>Miner Fee:</Flex.Item>
                                    <Flex.Item>
                                      {minerFee} {nativeToken?.name}
                                    </Flex.Item>
                                  </Flex>
                                </Flex.Item>
                                <Flex.Item>
                                  <Flex justify="space-between">
                                    <Flex.Item>UI Fee:</Flex.Item>
                                    <Flex.Item>
                                      {UI_FEE} {nativeToken?.name}
                                    </Flex.Item>
                                  </Flex>
                                </Flex.Item>
                                <Flex.Item>
                                  <Flex justify="space-between">
                                    <Flex.Item>Execution Fee:</Flex.Item>
                                    <Flex.Item>
                                      {operationVars &&
                                        `${renderFractions(
                                          operationVars[1].minExFee,
                                          ERG_DECIMALS,
                                        )} - ${renderFractions(
                                          operationVars[1].maxExFee,
                                          ERG_DECIMALS,
                                        )}`}{' '}
                                      {nativeToken?.name}
                                    </Flex.Item>
                                  </Flex>
                                </Flex.Item>
                              </Flex>
                            }
                          />
                          :
                        </Typography.Text>
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Text>
                          {totalFees && `${totalFees.min} - ${totalFees.max}`}
                        </Typography.Text>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                </Flex>
              </Box>
            </Flex.Item>
            <Flex.Item>
              <Button
                size="extra-large"
                type="primary"
                block
                onClick={swapOperation}
              >
                Confirm swap
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};
