import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { AssetLock } from '../../../../common/models/AssetLock';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { Button, Flex, Modal, Typography } from '../../../../ergodex-cdk';

interface WithdrawalLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  lock: AssetLock;
}

const WithdrawalLiquidityConfirmationModal: FC<WithdrawalLiquidityConfirmationModalProps> =
  ({ onClose, lock }): JSX.Element => {
    const withdrawalOperation = () => {
      return console.log('helo >>');
    };

    return (
      <>
        <Modal.Title>Confirm withdrawal</Modal.Title>
        <Modal.Content width={480}>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <FormPairSection
                title="Assets to lock"
                xAmount={lock.x}
                yAmount={lock.y}
              >
                <Flex.Item marginBottom={2} />
                <Flex.Item>
                  <Flex justify="space-between" align="center">
                    <Flex.Item>
                      <Flex align="center">
                        <Flex.Item>
                          <Typography.Body strong>Unlock date</Typography.Body>
                        </Flex.Item>
                      </Flex>
                    </Flex.Item>
                    <Flex.Item>
                      <Flex>
                        <Typography.Body strong>
                          {lock.unlockDate.toLocaleString(DateTime.DATE_FULL)}
                        </Typography.Body>{' '}
                        <Typography.Body secondary>
                          (Unlock block: {lock.deadline})
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
              Confirm Withdrawal
            </Button>
          </Flex>
        </Modal.Content>
      </>
    );
  };

export { WithdrawalLiquidityConfirmationModal };
