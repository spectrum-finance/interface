import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { DateTime } from 'luxon';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';

import { Currency } from '../../../common/models/Currency';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSection } from '../../../components/common/FormView/FormSection/FormSection';
import { FormSlider } from '../../../components/common/FormView/FormSlider/FormSlider';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
import { TokenIconPair } from '../../../components/TokenIconPair/TokenIconPair';
import {
  DatePicker,
  Flex,
  LockOutlined,
  Typography,
} from '../../../ergodex-cdk';
import { useForm } from '../../../ergodex-cdk/components/Form/NewForm';
import { RemoveFormSpaceWrapper } from '../../Remove/RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';
import { LockLiquidityConfirmationModal } from './LockLiquidityConfirmationModal/LockLiquidityConfirmationModal';
import { LockLiquidityDatePicker } from './LockLiquidityDatePicker/LockLiquidityDatePicker';
import { LockLiquidityModel } from './LockLiquidityModel';

const LockLiquidity = () => {
  const DEFAULT_SLIDER_PERCENTAGE = '100';
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [percent, setPercent] = useState(DEFAULT_SLIDER_PERCENTAGE);

  const form = useForm<LockLiquidityModel>({
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
    locktime: undefined,
    pool: undefined,
  });

  const handleChangePercent = useCallback((p) => {
    setPercent(p);
  }, []);

  const handleChangeDate = (date: DateTime | null, dateString: string) => {
    console.log('date >>', date?.toMillis());
    form.patchValue({ locktime: date?.toMillis() });
  };

  const handleLockLiquidity = () => {
    // openConfirmationModal(
    //   (next) => <LockLiquidityConfirmationModal />,
    //   Operation.LOCK_LIQUIDITY,
    //   xAmount,
    //   yAmount,
    // );
  };

  return (
    <FormPageWrapper width={480} title="Lock liquidity" withBackButton>
      <Flex direction="col">
        <Flex.Item marginBottom={2}>
          <Flex justify="space-between" align="center">
            <Flex.Item>
              <Flex align="center">
                <Flex.Item display="flex" marginRight={2}>
                  <TokenIconPair
                    tokenPair={{
                      tokenA: 'ERG',
                      tokenB: 'SigUSD',
                    }}
                  />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Title level={4}>
                    {'ERG'} / {'SigUSD'}
                  </Typography.Title>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </Flex.Item>

        <Flex.Item marginBottom={4}>
          <RemoveFormSpaceWrapper title="Amount of LP tokens">
            <FormSlider percent={percent} onChange={handleChangePercent} />
          </RemoveFormSpaceWrapper>
        </Flex.Item>

        <Flex.Item marginBottom={4}>
          <FormPairSection
            title="Assets to lock"
            xAmount={
              new Currency('122', {
                id: '00',
                name: 'ERG',
                decimals: 9,
                description: 'erg',
              })
            }
            yAmount={
              new Currency('123', {
                id: '00',
                name: 'ERG',
                decimals: 9,
                description: 'erg',
              })
            }
          />
        </Flex.Item>

        <Flex.Item marginBottom={4}>
          <FormSection title="Unlock date">
            <LockLiquidityDatePicker onChange={handleChangeDate} />
          </FormSection>
        </Flex.Item>

        <Flex.Item>
          <SubmitButton onClick={handleLockLiquidity} icon={<LockOutlined />}>
            Lock
          </SubmitButton>
        </Flex.Item>
      </Flex>
    </FormPageWrapper>
  );
};

export { LockLiquidity };
