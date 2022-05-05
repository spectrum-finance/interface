import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { Observable } from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable';
import { TxId } from '../../../../common/types';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../../../../components/Page/PageSection/PageSection';
import { Section } from '../../../../components/Section/Section';
import { Alert, Button, Checkbox, Flex, Modal } from '../../../../ergodex-cdk';
import { deposit } from '../../../../gateway/api/operations/deposit';
import { depositFees$ } from '../../../../gateway/widgets/depositFees';
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
  const [DepositFees] = useObservable(depositFees$);
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
              {DepositFees ? <DepositFees /> : ''}
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
