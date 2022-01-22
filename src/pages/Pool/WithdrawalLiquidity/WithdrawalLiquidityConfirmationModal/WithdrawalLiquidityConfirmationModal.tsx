import { DateTime } from 'luxon';
import React, { FC, useState } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { useSettings } from '../../../../context';
import { Button, Flex, Modal, Typography } from '../../../../ergodex-cdk';
import { useNetworkAsset, utxos$ } from '../../../../services/new/core';

interface WithdrawalLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  pool: AmmPool;
  xAsset: Currency;
  yAsset: Currency;
  lpAsset: Currency;
  timelock: DateTime;
  percent: number;
}

const WithdrawalLiquidityConfirmationModal: FC<WithdrawalLiquidityConfirmationModalProps> =
  ({
    onClose,
    pool,
    xAsset,
    yAsset,
    lpAsset,
    timelock,
    percent,
  }): JSX.Element => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const networkAsset = useNetworkAsset();

    const now = DateTime.now().toMillis();

    const [utxos] = useObservable(utxos$);
    const [{ minerFee, address, pk }] = useSettings();

    const withdrawalOperation = () => {
      return console.log('helo >>');
    };

    return (
      <>
        <Modal.Title>Confirm withdrawal</Modal.Title>
        <Modal.Content>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <FormPairSection
                title="Assets to lock"
                xAmount={xAsset}
                yAmount={yAsset}
              >
                <Flex.Item marginBottom={2}>
                  <Flex justify="space-between" align="center">
                    <Flex.Item>
                      <Flex align="center">
                        <Flex.Item>
                          <Typography.Body strong>Hello</Typography.Body>
                        </Flex.Item>
                      </Flex>
                    </Flex.Item>
                    <Flex.Item>
                      <Flex>
                        <Typography.Body strong>test</Typography.Body>
                      </Flex>
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
                <Flex.Item>
                  <Flex justify="space-between" align="center">
                    <Flex.Item>
                      <Flex align="center">
                        <Flex.Item>
                          <Typography.Body strong>Hello</Typography.Body>
                        </Flex.Item>
                      </Flex>
                    </Flex.Item>
                    <Flex.Item>
                      <Flex>
                        <Typography.Body strong>test</Typography.Body>
                      </Flex>
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
              </FormPairSection>
            </Flex.Item>
            <Button
              block
              size="large"
              disabled={!isChecked}
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
