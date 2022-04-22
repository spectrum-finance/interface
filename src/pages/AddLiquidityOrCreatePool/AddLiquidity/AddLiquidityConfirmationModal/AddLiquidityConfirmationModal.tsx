import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { Observable } from 'rxjs';

import { UI_FEE } from '../../../../common/constants/erg';
import { TxId } from '../../../../common/types';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { PageSection } from '../../../../components/Page/PageSection/PageSection';
import { Section } from '../../../../components/Section/Section';
import { useSettings } from '../../../../context';
import {
  Alert,
  Button,
  Checkbox,
  Flex,
  Modal,
  Typography,
} from '../../../../ergodex-cdk';
import { deposit } from '../../../../gateway/api/operations/deposit';
import { useMinExFee, useMinTotalFees } from '../../../../services/new/core';
import { PoolRatio } from '../../../PoolOverview/PoolRatio/PoolRatio';
import { AddLiquidityFormModel } from '../AddLiquidityFormModel';

interface AddLiquidityConfirmationModalProps {
  value: Required<AddLiquidityFormModel>;
  onClose: (r: Observable<TxId>) => void;
}

const AddLiquidityConfirmationModal: FC<AddLiquidityConfirmationModalProps> = ({
  value,
  onClose,
}) => {
  const [isChecked, setIsChecked] = useState<boolean | undefined>(
    value.pool.verified,
  );
  const [{ minerFee }] = useSettings();
  const totalFees = useMinTotalFees();
  const minExFee = useMinExFee();
  const addLiquidityOperation = async () => {
    const { pool, y, x } = value;

    if (pool && x && y) {
      onClose(deposit(pool, x, y));
    }
  };

  return (
    <>
      <Modal.Title>
        <Trans>Confirm Add Liquidity</Trans>
      </Modal.Title>
      <Modal.Content width={468}>
        <Flex direction="col">
          <Flex.Item marginBottom={6}>
            <FormPairSection
              title={t`Assets`}
              xAmount={value.x}
              yAmount={value.y}
            />
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <Section title={t`Initial price`}>
              <Flex>
                <Flex.Item flex={1} marginRight={2}>
                  <PoolRatio ammPool={value.pool} ratioOf="x" />
                </Flex.Item>
                <Flex.Item flex={1}>
                  <PoolRatio ammPool={value.pool} ratioOf="y" />
                </Flex.Item>
              </Flex>
            </Section>
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <PageSection title={t`Fees`}>
              <Flex justify="space-between">
                <Flex.Item>
                  <Typography.Text strong>
                    <Trans>Fees</Trans>
                  </Typography.Text>
                  <InfoTooltip
                    placement="rightBottom"
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
                        <Flex.Item>
                          <Flex>
                            <Flex.Item marginRight={1}>
                              <Trans>Execution Fee:</Trans>
                            </Flex.Item>
                            <Flex.Item>{minExFee.toCurrencyString()}</Flex.Item>
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
                      </Flex>
                    }
                  />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Text strong>
                    {totalFees.toCurrencyString()}
                  </Typography.Text>
                </Flex.Item>
              </Flex>
            </PageSection>
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
              block
              type="primary"
              size="extra-large"
              disabled={!isChecked}
              onClick={() => addLiquidityOperation()}
            >
              <Trans>Add Liquidity</Trans>
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { AddLiquidityConfirmationModal };
