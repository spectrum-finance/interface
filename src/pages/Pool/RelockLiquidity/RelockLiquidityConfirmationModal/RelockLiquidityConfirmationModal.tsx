import {
  millisToBlocks,
  mkLockActions,
  RelockParams,
} from '@ergolabs/ergo-dex-sdk';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  RustModule,
  TransactionContext,
} from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';
import React, { FC, useState } from 'react';

import { ERG_DECIMALS } from '../../../../common/constants/erg';
import { useObservable } from '../../../../common/hooks/useObservable';
import { AssetLock } from '../../../../common/models/AssetLock';
import { Currency } from '../../../../common/models/Currency';
import { FormFeesSection } from '../../../../components/common/FormView/FormFeesSection/FormFeesSection';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../../../../components/Page/PageSection/PageSection';
import { useSettings } from '../../../../context';
import {
  Button,
  Checkbox,
  Flex,
  Modal,
  Typography,
} from '../../../../ergodex-cdk';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { explorer } from '../../../../services/explorer';
import { lockParser } from '../../../../services/locker/parser';
import { useNetworkAsset, utxos$ } from '../../../../services/new/core';
import { formatToInt } from '../../../../services/number';
import { submitTx } from '../../../../services/yoroi';
import yoroiProver from '../../../../services/yoroi/prover';
import { makeTarget } from '../../../../utils/ammMath';
import { parseUserInputToFractions } from '../../../../utils/math';
import { getFeeForLockTarget } from '../../utils';

interface RelockLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  lockedPosition: AssetLock;
  relocktime: DateTime;
}

const RelockLiquidityConfirmationModal: FC<RelockLiquidityConfirmationModalProps> =
  ({ onClose, lockedPosition, relocktime }): JSX.Element => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const networkAsset = useNetworkAsset();

    const now = DateTime.now().toMillis();

    const [utxos] = useObservable(utxos$);
    const [{ minerFee, address, pk }] = useSettings();

    const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

    const handleCheck = () => setIsChecked((prev) => !prev);
    // TODO: add try catch
    const relockOperation = async () => {
      const lpAssetAmount = new AssetAmount(
        lockedPosition.lp.asset,
        lockedPosition.lp.amount,
      );

      const target = makeTarget(
        [lpAssetAmount],
        getFeeForLockTarget(minerFeeNErgs),
      );

      const inputs = DefaultBoxSelector.select(utxos!, target) as BoxSelection;

      const network = await explorer.getNetworkContext();

      const RModule = await RustModule.load();

      const actions = mkLockActions(
        explorer,
        lockParser,
        yoroiProver,
        mainnetTxAssembler,
        RModule,
      );

      const updateDeadline =
        network.height +
        millisToBlocks(BigInt(relocktime.toMillis() - now)) +
        1;

      if (address && pk) {
        const params: RelockParams = {
          boxId: lockedPosition.boxId,
          updateRedeemer: pk,
          updateDeadline,
        };

        const ctx: TransactionContext = {
          inputs,
          selfAddress: address,
          changeAddress: address,
          feeNErgs: minerFeeNErgs,
          network,
        };

        onClose(actions.relockTokens(params, ctx).then((tx) => submitTx(tx)));
      }
    };
    return (
      <>
        <Modal.Title>Confirm Relock</Modal.Title>
        <Modal.Content width={480}>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <FormPairSection
                title="Assets to relock"
                xAmount={lockedPosition.x}
                yAmount={lockedPosition.y}
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex align="center" justify="space-between">
                <Flex.Item grow marginRight={2}>
                  <PageSection title="Previous unlock date">
                    <Flex col justify="center">
                      <Flex.Item marginBottom={1}>
                        <Typography.Body strong>
                          {lockedPosition.unlockDate.toLocaleString(
                            DateTime.DATE_FULL,
                          )}
                        </Typography.Body>
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Body secondary>
                          Block: {formatToInt(lockedPosition.deadline)}
                        </Typography.Body>
                      </Flex.Item>
                    </Flex>
                  </PageSection>
                </Flex.Item>

                <Flex.Item grow>
                  <PageSection title="Updated unlock date">
                    <Flex col justify="center">
                      <Flex.Item marginBottom={1}>
                        <Typography.Body strong>
                          {relocktime.toLocaleString(DateTime.DATE_FULL)}
                        </Typography.Body>
                      </Flex.Item>
                      <Flex.Item>
                        <Typography.Body secondary>
                          Block:{' '}
                          {formatToInt(lockedPosition.getDeadline(relocktime))}
                        </Typography.Body>
                      </Flex.Item>
                    </Flex>
                  </PageSection>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <FormFeesSection
                minerFee={minerFee}
                totalFees={new Currency(minerFeeNErgs, networkAsset)}
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex>
                <Checkbox onChange={handleCheck}>
                  I understand that I’m relocking{' '}
                  <b>
                    {formatToInt(lockedPosition.lp.toString({ suffix: false }))}
                  </b>{' '}
                  LP-tokens of my{' '}
                  <b>{`${lockedPosition.x.asset.name}/${lockedPosition.y.asset.name}`}</b>{' '}
                  position until{' '}
                  <b>{relocktime.toLocaleString(DateTime.DATE_FULL)}</b> (or{' '}
                  <b>{formatToInt(lockedPosition.getDeadline(relocktime))}</b>{' '}
                  block) without the ability to withdraw before the end of this
                  period.
                </Checkbox>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Button
                block
                size="extra-large"
                disabled={!isChecked}
                type="primary"
                onClick={relockOperation}
              >
                Confirm Relock
              </Button>
            </Flex.Item>
          </Flex>
        </Modal.Content>
      </>
    );
  };

export { RelockLiquidityConfirmationModal };
