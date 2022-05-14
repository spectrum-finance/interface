import { swapVars } from '@ergolabs/ergo-dex-sdk';
import { SwapExtremums } from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import { t, Trans } from '@lingui/macro';
import React, { FC, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { TxId } from '../../../common/types';
import { TokenControlFormItem } from '../../../components/common/TokenControl/TokenControl';
import { Truncate } from '../../../components/Truncate/Truncate';
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
import { swap } from '../../../gateway/api/operations/swap';
import { useSettings } from '../../../gateway/settings/settings';
import { swapConfirmationInfo$ } from '../../../gateway/widgets/swapConfirmationInfo';
import { useMinExFee } from '../../../services/new/core';
import { renderFractions } from '../../../utils/math';
import {
  BaseInputParameters,
  getBaseInputParameters,
} from '../../../utils/walletMath';
import { SwapFormModel } from '../SwapFormModel';

export interface SwapConfirmationModalProps {
  value: Required<SwapFormModel>;
  onClose: (p: Observable<TxId>) => void;
}

export const SwapConfirmationModal: FC<SwapConfirmationModalProps> = ({
  value,
  onClose,
}) => {
  const [isChecked, setIsChecked] = useState<boolean | undefined>(
    value.pool.verified,
  );
  const [SwapFees] = useObservable(swapConfirmationInfo$);
  const form = useForm<SwapFormModel>(value);

  //@ts-ignore
  const { minerFee, slippage, nitro } = useSettings();
  const minExFee = useMinExFee();

  const [baseParams, setBaseParams] = useState<
    BaseInputParameters | undefined
  >();
  const [operationVars, setOperationVars] = useState<
    [number, SwapExtremums] | undefined
  >();

  const exFeeNErg = minExFee.amount;

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
    }
  }, [baseParams, exFeeNErg, nitro, minerFee]);

  const swapOperation = async () => {
    if (value.pool && value.fromAmount && value.toAmount) {
      onClose(swap(value.pool, value.fromAmount, value.toAmount));
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
                          {operationVars && (
                            <>
                              {`${renderFractions(
                                operationVars[1].minOutput.amount,
                                operationVars[1].minOutput.asset.decimals,
                              )} - ${renderFractions(
                                operationVars[1].maxOutput.amount,
                                operationVars[1].maxOutput.asset.decimals,
                              )} `}
                              <Truncate>
                                {operationVars[1].maxOutput.asset.name}
                              </Truncate>
                            </>
                          )}
                        </Typography.Text>
                      </Flex.Item>
                    </Flex>
                  </Flex.Item>
                  <Flex.Item marginBottom={2}>
                    {SwapFees && <SwapFees />}
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
