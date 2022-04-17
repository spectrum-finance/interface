import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import {
  mkAmmActions,
  mkAmmOutputs,
  mkTxMath,
  OrderRequestKind,
} from '@ergolabs/cardano-dex-sdk';
import { FeePerToken } from '@ergolabs/cardano-dex-sdk/build/main/amm/domain/models';
import { PoolId } from '@ergolabs/cardano-dex-sdk/build/main/amm/domain/types';
import { OrderAddrsV1Testnet } from '@ergolabs/cardano-dex-sdk/build/main/amm/scripts';
import { Addr } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/address';
import { AssetClass } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { PubKeyHash } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/publicKey';
import { FullTxIn } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/txIn';
import { TxOut } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { Lovelace } from '@ergolabs/cardano-dex-sdk/build/main/cardano/types';
import { AssetAmount } from '@ergolabs/cardano-dex-sdk/build/main/domain/assetAmount';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { swapVars } from '@ergolabs/ergo-dex-sdk';
import { SwapExtremums } from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import { t, Trans } from '@lingui/macro';
import React, { FC, useEffect, useState } from 'react';

import { ERG_DECIMALS, UI_FEE } from '../../../common/constants/erg';
import { useObservable } from '../../../common/hooks/useObservable';
import { TokenControlFormItem } from '../../../components/common/TokenControl/TokenControl';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { useSettings } from '../../../context';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Flex,
  Form,
  Modal,
  Typography,
  useForm,
} from '../../../ergodex-cdk';
import { cardanoNetworkParams$ } from '../../../network/cardano/api/common/cardanoNetwork';
import { submitTx } from '../../../network/cardano/api/operations/submitTx';
import { utxos$ } from '../../../network/cardano/api/utxos/utxos';
import { useMinExFee } from '../../../services/new/core';
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
  const [isChecked, setIsChecked] = useState<boolean | undefined>(
    value.pool.verified,
  );
  const form = useForm<SwapFormModel>(value);

  const [{ minerFee, address, slippage, nitro, pk }] = useSettings();
  const [utxos] = useObservable(utxos$);
  const minExFee = useMinExFee();
  const [networkParams] = useObservable(cardanoNetworkParams$);

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
        getBaseInputParameters(value.pool, {
          inputAmount: value.fromAmount,
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
      value.toAsset?.id &&
      networkParams
    ) {
      const txMath = mkTxMath(networkParams.pparams, RustModule.CardanoWasm);

      const ammOutputs = mkAmmOutputs(
        OrderAddrsV1Testnet,
        txMath,
        RustModule.CardanoWasm,
      );
      const ammActions = mkAmmActions(ammOutputs, address);

      const quoteAsset =
        value.fromAmount?.asset.id === value.pool.x.asset.id
          ? value.pool['pool'].y.asset
          : value.pool['pool'].x.asset;

      const baseInput =
        value.fromAmount?.asset.id === value.pool.x.asset.id
          ? value.pool['pool'].x.withAmount(value.fromAmount.amount)
          : value.pool['pool'].y.withAmount(value.fromAmount.amount);

      const txCandidate = ammActions.createOrder(
        {
          kind: OrderRequestKind.Swap,
          poolId: value.pool['pool'].id as AssetClass,
          rewardPkh: pk!,
          poolFeeNum: value.pool.poolFeeNum,
          baseInput: baseInput as any,
          quoteAsset: quoteAsset as any,
          minQuoteOutput: value.toAmount.amount,
          uiFee: 0n,
          exFeePerToken: {
            numerator: 1n,
            denominator: 1n,
          },
        },
        {
          changeAddr: address,
          collateralInputs: [],
          inputs: utxos.map((u) => ({ txOut: u })),
        },
      );
      console.log(txCandidate);

      submitTx(txCandidate);
    }
  };

  return (
    <>
      <Modal.Title>
        <Trans>Confirm swap</Trans>
      </Modal.Title>
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
                        <Typography.Text>
                          <Trans>Slippage tolerance:</Trans>
                        </Typography.Text>
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Text>{slippage}%</Typography.Text>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                  <Flex.Item marginBottom={2}>
                    <Flex direction="row">
                      <Flex.Item flex={1}>
                        <Typography.Text>
                          <Trans>Nitro:</Trans>
                        </Typography.Text>
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Text>{nitro}</Typography.Text>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                  <Flex.Item marginBottom={2}>
                    <Flex direction="row">
                      <Flex.Item flex={1}>
                        <Typography.Text>
                          <Trans>Estimated output:</Trans>
                        </Typography.Text>
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
                          <Trans>Total Fees</Trans>
                          <InfoTooltip
                            placement="right"
                            content={
                              <Flex direction="col">
                                <Flex.Item>
                                  <Flex>
                                    <Flex.Item marginRight={1}>
                                      <Trans>Miner Fee:</Trans>
                                    </Flex.Item>
                                    <Flex.Item>{minerFee} ERG</Flex.Item>
                                  </Flex>
                                </Flex.Item>
                                {!!UI_FEE && (
                                  <Flex.Item>
                                    <Flex>
                                      <Flex.Item marginRight={1}>
                                        <Trans>UI Fee:</Trans>
                                      </Flex.Item>
                                      <Flex.Item>{UI_FEE} ERG</Flex.Item>
                                    </Flex>
                                  </Flex.Item>
                                )}
                                <Flex.Item>
                                  <Flex>
                                    <Flex.Item marginRight={1}>
                                      <Trans>Execution Fee:</Trans>
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
                          {totalFees && `${totalFees.min} - ${totalFees.max}`}{' '}
                          ERG
                        </Typography.Text>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                </Flex>
              </Box>
            </Flex.Item>
            {!value.pool.verified && (
              <>
                <Flex.Item marginBottom={4}>
                  <Alert
                    type="error"
                    message={t`This pair has not been verified by the ErgoDEX team`}
                    description={t`This operation may include fake or scam assets. Only confirm if you have done your own research.`}
                  />
                </Flex.Item>
                <Flex.Item marginBottom={4}>
                  <Checkbox onChange={() => setIsChecked((p) => !p)}>
                    <Trans>I understand the risks</Trans>
                  </Checkbox>
                </Flex.Item>
              </>
            )}
            <Flex.Item>
              <Button
                size="extra-large"
                type="primary"
                htmlType="submit"
                disabled={!isChecked}
                block
              >
                <Trans>Confirm Swap</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};
