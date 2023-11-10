import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Flex, Form, useForm } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { ElementLocation } from '@spectrumlabs/analytics';
import { FC } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { isDeprecatedPool } from '../../common/utils/isDeprecatedPool';
import { AddLiquidityForm } from '../../components/AddLiquidityForm/AddLiquidityForm';
import { AddLiquidityFormModel } from '../../components/AddLiquidityForm/AddLiquidityFormModel';
import { Page } from '../../components/Page/Page';
import { useSelectedNetwork } from '../../gateway/common/network.ts';
import { useGuardV2 } from '../../hooks/useGuard';
import { isSubject, subjectToId } from '../../utils/subjectToId.ts';
import { PoolRatio } from '../PoolOverview/PoolRatio/PoolRatio';

export const AddLiquidity: FC = () => {
  const { poolId } = useParams<{ poolId?: PoolId }>();
  const [selectedNetwork] = useSelectedNetwork();
  const normalizedPoolId =
    poolId && selectedNetwork.name === 'cardano' && isSubject(poolId)
      ? subjectToId(poolId)
      : poolId;
  const navigate = useNavigate();
  const form = useForm<AddLiquidityFormModel>({
    xAsset: undefined,
    yAsset: undefined,
    x: undefined,
    y: undefined,
    pool: undefined,
  });

  useGuardV2(
    () => !!poolId && isDeprecatedPool(poolId),
    () => navigate('../..'),
  );
  useGuardV2(
    () => !!poolId && isSubject(poolId) && selectedNetwork.name === 'cardano',
    () =>
      navigate(`../../${subjectToId(poolId as any)}/add`, { replace: true }),
  );

  return (
    <Page
      title={<Trans>Add Liquidity</Trans>}
      maxWidth={510}
      withBackButton
      backTo="../../../liquidity"
      padding={4}
    >
      <AddLiquidityForm
        initialPoolId={normalizedPoolId}
        form={form}
        traceFormLocation={ElementLocation.depositForm}
      >
        <Flex.Item marginTop={2}>
          <Form.Listener>
            {({ value }) =>
              value.pool && (
                <Flex.Item justify="center">
                  <Flex.Item flex={1} marginRight={2}>
                    <PoolRatio ammPool={value.pool} ratioOf="x" />
                  </Flex.Item>
                  <Flex.Item flex={1}>
                    <PoolRatio ammPool={value.pool} ratioOf="y" />
                  </Flex.Item>
                </Flex.Item>
              )
            }
          </Form.Listener>
        </Flex.Item>
      </AddLiquidityForm>
    </Page>
  );
};
