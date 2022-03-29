import { mkLockActions } from '@ergolabs/ergo-dex-sdk';
import { WithdrawalParams } from '@ergolabs/ergo-dex-sdk/build/main/security/models';
import { RustModule } from '@ergolabs/ergo-sdk';
import { MinTransactionContext } from '@ergolabs/ergo-sdk/build/main/wallet/entities/transactionContext';
import { t, Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { ERG_DECIMALS } from '../../../../common/constants/erg';
import { AssetLock } from '../../../../common/models/AssetLock';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { useSettings } from '../../../../context';
import { Button, Flex, Modal, Typography } from '../../../../ergodex-cdk';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { explorer } from '../../../../services/explorer';
import { lockParser } from '../../../../services/locker/parser';
import { submitTx } from '../../../../services/yoroi';
import yoroiProver from '../../../../services/yoroi/prover';
import { parseUserInputToFractions } from '../../../../utils/math';

interface WithdrawalLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  lock: AssetLock;
}

const WithdrawalLiquidityConfirmationModal: FC<WithdrawalLiquidityConfirmationModalProps> =
  ({ onClose, lock }): JSX.Element => {
    const [{ minerFee, address, pk }] = useSettings();

    const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

    const withdrawalOperation = async () => {
      const network = await explorer.getNetworkContext();

      const RModule = await RustModule.load();

      const actions = mkLockActions(
        explorer,
        lockParser,
        yoroiProver,
        mainnetTxAssembler,
        RModule,
      );

      if (address && pk) {
        const params: WithdrawalParams = {
          boxId: lock.boxId,
          address: address,
        };

        const ctx: MinTransactionContext = {
          feeNErgs: minerFeeNErgs,
          network,
        };

        onClose(actions.withdrawTokens(params, ctx).then((tx) => submitTx(tx)));
      }
    };

    return (
      <>
        <Modal.Title>
          <Trans>Confirm withdrawal</Trans>
        </Modal.Title>
        <Modal.Content width={480}>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <FormPairSection
                title={t`Assets to lock`}
                xAmount={lock.x}
                yAmount={lock.y}
              >
                <Flex.Item marginBottom={2} />
                <Flex.Item>
                  <Flex justify="space-between" align="center">
                    <Flex.Item>
                      <Flex align="center">
                        <Flex.Item>
                          <Typography.Body strong>
                            <Trans>Unlock date</Trans>
                          </Typography.Body>
                        </Flex.Item>
                      </Flex>
                    </Flex.Item>
                    <Flex.Item>
                      <Flex>
                        <Typography.Body strong>
                          {lock.unlockDate.toLocaleString(DateTime.DATE_FULL)}
                        </Typography.Body>{' '}
                        <Typography.Body secondary>
                          <Trans>(Unlock block: {lock.deadline})</Trans>
                        </Typography.Body>
                      </Flex>
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
              </FormPairSection>
            </Flex.Item>
            <Button
              block
              size="large"
              type="primary"
              onClick={withdrawalOperation}
            >
              <Trans>Confirm Withdrawal</Trans>
            </Button>
          </Flex>
        </Modal.Content>
      </>
    );
  };

export { WithdrawalLiquidityConfirmationModal };
