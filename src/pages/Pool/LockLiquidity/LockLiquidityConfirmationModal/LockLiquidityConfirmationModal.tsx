import { DateTime } from 'luxon';
import React, { useState } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { FormFeesSection } from '../../../../components/common/FormView/FormFeesSection/FormFeesSection';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { ERG_DECIMALS, UI_FEE } from '../../../../constants/erg';
import { useSettings } from '../../../../context';
import { Button, Checkbox, Flex, Modal } from '../../../../ergodex-cdk';
import { useUTXOs } from '../../../../hooks/useUTXOs';
import { useMinExFee, useMinTotalFees } from '../../../../services/new/core';
import { parseUserInputToFractions } from '../../../../utils/math';
import { getLockingPeriodString } from '../utils';

interface LockLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  xAsset: Currency;
  yAsset: Currency;
  lpAsset: Currency;
  timelock: DateTime;
  percent: number;
}

const LockLiquidityConfirmationModal: React.FC<LockLiquidityConfirmationModalProps> =
  ({ onClose, xAsset, yAsset, lpAsset, timelock, percent }) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const UTXOs = useUTXOs();
    const [{ minerFee, address, pk }] = useSettings();
    const minExFee = useMinExFee();
    const totalFees = useMinTotalFees();

    const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
    const exFeeNErg = minExFee.amount;
    const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

    const handleCheck = () => setIsChecked((prev) => !prev);

    const lockOperation = () => {
      onClose(Promise.resolve().then(() => console.log('Yeeeep')));
    };

    return (
      <>
        <Modal.Title>Confirm Lock Liquidity</Modal.Title>
        <Modal.Content width={436}>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <FormPairSection
                title="Assets to lock"
                xAmount={xAsset}
                yAmount={yAsset}
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <FormFeesSection
                minerFee={minerFee}
                minExFee={minExFee}
                totalFees={totalFees}
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex>
                <Checkbox onChange={handleCheck}>
                  I understand that I&apos;m locking <b>{lpAsset.toString()}</b>{' '}
                  tokens, which is <b>{percent}%</b> of my{' '}
                  <b>{`${xAsset.asset.name}/${yAsset.asset.name}`}</b> liquidity
                  position, for a period of{' '}
                  <b>{getLockingPeriodString(timelock)}</b> (until{' '}
                  {timelock.toLocaleString(DateTime.DATE_FULL)}) without the
                  ability to withdraw mine before the end of this period.
                </Checkbox>
              </Flex>
            </Flex.Item>
          </Flex>
          <Button
            block
            size="large"
            disabled={!isChecked}
            type="primary"
            onClick={lockOperation}
          >
            Lock Liquidity
          </Button>
        </Modal.Content>
      </>
    );
  };

export { LockLiquidityConfirmationModal };
