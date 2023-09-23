import {
  Button,
  Flex,
  PlusOutlined,
  SwapOutlined,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../../common/models/AmmPool';
import { isDeprecatedPool } from '../../../../../../common/utils/isDeprecatedPool';
import { redeem } from '../../../../../../gateway/api/operations/redeem';
import { getPositionByAmmPoolId } from '../../../../../../gateway/api/positions';

export interface ActionsColumnProps {
  readonly ammPool: AmmPool;
}

export const ActionsColumn: FC<ActionsColumnProps> = ({ ammPool }) => {
  const navigate = useNavigate();
  const [position] = useObservable(getPositionByAmmPoolId(ammPool.id), []);
  const { s, moreThan } = useDevice();

  if (isDeprecatedPool(ammPool.id)) {
    return (
      <Button
        disabled={position?.empty}
        icon={s && <SwapOutlined />}
        type="primary"
        style={{
          background: 'var(--spectrum-warning-color)',
          borderColor: 'var(--spectrum-warning-color)',
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (!position) {
            return;
          }
          redeem(
            position.pool,
            {
              lpAmount: position.availableLp,
              xAmount: position.availableX,
              yAmount: position.availableY,
              percent: 100,
            },
            true,
          ).subscribe();
        }}
      >
        {moreThan('l') && <Trans>Remove liquidity</Trans>}
      </Button>
    );
  }

  return (
    <Flex>
      <Flex.Item marginRight={2}>
        <Button
          icon={s && <PlusOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            navigate(
              `/swap?base=${ammPool.x.asset.id}&quote=${ammPool.y.asset.id}&initialPoolId=${ammPool.id}`,
            );
          }}
        >
          {moreThan('l') && <Trans>Swap</Trans>}
        </Button>
      </Flex.Item>
      <Flex.Item>
        <Button
          icon={s && <PlusOutlined />}
          type="primary"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`${ammPool.id}/add`);
          }}
        >
          {moreThan('l') && <Trans>Add Liquidity</Trans>}
        </Button>
      </Flex.Item>
    </Flex>
  );
};
