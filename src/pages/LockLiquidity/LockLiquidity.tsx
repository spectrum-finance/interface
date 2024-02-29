import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { t } from '@lingui/macro';
import { Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { IsCardano } from '../../components/IsCardano/IsCardano.tsx';
import { IsErgo } from '../../components/IsErgo/IsErgo.tsx';
import { Page } from '../../components/Page/Page';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { useGuardV2 } from '../../hooks/useGuard';
import { CardanoLockLiquidity } from './cardano/CardanoLockLiquidity.tsx';
import { ErgoLockLiquidity } from './ergo/ErgoLockLiquidity.tsx';

const LockLiquidity = (): JSX.Element => {
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const navigate = useNavigate();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId));

  useGuardV2(
    () => !loading && !position?.availableLp?.isPositive(),
    () =>
      navigate(
        `../../../liquidity${position?.pool.id ? `/${position.pool.id}` : ''}`,
      ),
  );

  return (
    <Page maxWidth={480} title={t`Lock liquidity`} withBackButton>
      {position ? (
        <>
          <IsErgo>
            <ErgoLockLiquidity position={position} />
          </IsErgo>
          <IsCardano>
            <CardanoLockLiquidity position={position} />
          </IsCardano>
        </>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};

export { LockLiquidity };
