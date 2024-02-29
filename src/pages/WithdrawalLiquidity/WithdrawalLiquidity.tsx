import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Skeleton } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { IsCardano } from '../../components/IsCardano/IsCardano.tsx';
import { IsErgo } from '../../components/IsErgo/IsErgo.tsx';
import { Page } from '../../components/Page/Page';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { useGuardV2 } from '../../hooks/useGuard';
import { CardanoWithdrawalLiquidity } from './cardano/CardanoWithdrawalLiquidity.tsx';
import { ErgoWithdrawalLiquidity } from './ergo/ErgoWithdrawalLiquidity.tsx';

export const WithdrawalLiquidity = (): JSX.Element => {
  const navigate = useNavigate();
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId));

  useGuardV2(
    () => !loading && !position?.lockedLp?.isPositive(),
    () =>
      navigate(
        `../../../liquidity${position?.pool.id ? `/${position.pool.id}` : ''}`,
      ),
  );

  return (
    <Page width={760} title={t`Withdrawal`} withBackButton>
      {position ? (
        <>
          <IsErgo>
            <ErgoWithdrawalLiquidity position={position} />
          </IsErgo>
          <IsCardano>
            <CardanoWithdrawalLiquidity position={position} />
          </IsCardano>
        </>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};
