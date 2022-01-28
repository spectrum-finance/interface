import { minValueForOrder, swapVars } from '@ergolabs/ergo-dex-sdk';
import { SwapExtremums } from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  publicKeyFromAddress,
} from '@ergolabs/ergo-sdk';
import React, { FC, useEffect, useState } from 'react';

import { ERG_DECIMALS, UI_FEE } from '../../../common/constants/erg';
import { useObservable } from '../../../common/hooks/useObservable';
import { TokenControlFormItem } from '../../../components/common/TokenControl/TokenControl';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { useSettings } from '../../../context';
import { Box, Button, Flex, Modal, Typography } from '../../../ergodex-cdk';
import { Form, useForm } from '../../../ergodex-cdk/components/Form/NewForm';
import { explorer } from '../../../services/explorer';
import { useMinExFee, utxos$ } from '../../../services/new/core';
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
import { SwapFormModel } from '../SwapFormModel';

export interface SwapConfirmationModalProps {
  value: Required<SwapFormModel>;
  onClose: (p: Promise<any>) => void;
}

export const SwapConfirmationModal: FC<SwapConfirmationModalProps> = ({
  value,
  onClose,
}) => {
  const form = useForm<SwapFormModel>(value);

  const [{ minerFee, address, slippage, nitro }] = useSettings();
  const [utxos] = useObservable(utxos$);
  // const totalFees = useTotalFees();
  const minExFee = useMinExFee();

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
  const exFeeNErg = minExFee.amount;
  const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

  const poolId = value.pool?.id;
  const poolFeeNum = value.pool?.poolFeeNum;

  useEffect(() => {
    if (value.pool && value.fromAsset && value.fromAmount) {
      setBaseParams(
        getBaseInputParameters(value.pool['pool'], {
          inputAmount: value.fromAmount.toString({ suffix: false }),
          inputAsset: value.fromAsset,
          slippage,
        }),
      );
    }
  }, [value.fromAmount, value.fromAsset, slippage, value.pool]);

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

  const swapOperation = async () => {
    if (
      poolFeeNum &&
      baseParams &&
      utxos &&
      address &&
      poolId &&
      operationVars &&
      value.pool &&
      value.fromAmount &&
      value.fromAsset &&
      value.toAsset?.id
    ) {
      const pk = publicKeyFromAddress(address)!;
      const actions = poolActions(value.pool['pool']);
      const quoteAsset = value.toAsset?.id;

      const minNErgs = minValueForOrder(
        minerFeeNErgs,
        uiFeeNErg,
        operationVars[1].maxExFee,
      );

      const target = makeTarget(
        [new AssetAmount(value.fromAsset!, baseParams.baseInputAmount)],
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
        <Form form={form} onSubmit={swapOperation}>
          <Flex direction="col">
            <Flex.Item marginBottom={1}>
              <TokenControlFormItem
                readonly
                bordered
                noBottomInfo
                amountName="fromAmount"
                tokenName="fromAsset"
                label="From"
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <TokenControlFormItem
                readonly
                bordered
                noBottomInfo
                amountName="toAmount"
                tokenName="toAsset"
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
                              <Flex direction="col">
                                <Flex.Item>
                                  <Flex>
                                    <Flex.Item marginRight={1}>
                                      Miner Fee:
                                    </Flex.Item>
                                    <Flex.Item>{minerFee} ERG</Flex.Item>
                                  </Flex>
                                </Flex.Item>
                                {!!UI_FEE && (
                                  <Flex.Item>
                                    <Flex>
                                      <Flex.Item marginRight={1}>
                                        UI Fee:
                                      </Flex.Item>
                                      <Flex.Item>{UI_FEE} ERG</Flex.Item>
                                    </Flex>
                                  </Flex.Item>
                                )}
                                <Flex.Item>
                                  <Flex>
                                    <Flex.Item marginRight={1}>
                                      Execution Fee:
                                    </Flex.Item>
                                    <Flex.Item>
                                      {operationVars &&
                                        `${renderFractions(
                                          operationVars[1].minExFee,
                                          ERG_DECIMALS,
                                        )} - ${renderFractions(
                                          operationVars[1].maxExFee,
                                          ERG_DECIMALS,
                                        )}`}{' '}
                                      ERG
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
              <Button size="extra-large" type="primary" htmlType="submit" block>
                Confirm Swap
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};
