import './AddLiquidity.less';

import cn from 'classnames';
import React, { useState } from 'react';

import { PoolSelect } from '../../../components/common/PoolSelect/PoolSelect';
import { TokenControl } from '../../../components/common/TokenControl/TokenControl';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import {
  Button,
  Flex,
  LinkOutlined,
  Skeleton,
  Tooltip,
  Typography,
} from '../../../ergodex-cdk';
import { usePosition } from '../../../hooks/usePosition';

const mocks = {
  poolId: '1d5afc59838920bb5ef2a8f9d63825a55b1d48e269d7cecee335d637c3ff5f3f',
};

const AddLiquidity = (): JSX.Element => {
  const [isStickRatio, setIsStickRatio] = useState(false);
  const positions = usePosition(mocks.poolId);

  return (
    <FormPageWrapper
      title="Add liquidity"
      width={480}
      withBackButton
      backTo="/pool"
    >
      {positions ? (
        <Flex flexDirection="col">
          <Flex.Item marginBottom={4}>
            <Typography.Body strong>Select Pair</Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body strong>Select Pool</Typography.Body>
            <PoolSelect positions={[positions]} />
          </Flex.Item>
          <Flex.Item>
            <Typography.Body strong>Liquidity</Typography.Body>
            <Flex flexDirection="col">
              <Flex.Item marginBottom={1}>
                <TokenControl getTokenBalance={() => Promise.resolve()} />
              </Flex.Item>
              <Flex.Item className="stick-button">
                <Tooltip
                  title={`${
                    isStickRatio ? 'Unstick' : 'Stick to'
                  } current ratio`}
                >
                  <Button
                    className={cn(
                      'stick-button__btn',
                      isStickRatio ? 'stick-button__btn--stick' : '',
                    )}
                    icon={<LinkOutlined />}
                    onClick={() => setIsStickRatio((val) => !val)}
                    size="large"
                  />
                </Tooltip>
              </Flex.Item>
              <Flex.Item>
                <TokenControl getTokenBalance={() => Promise.resolve()} />
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </Flex>
      ) : (
        <Skeleton active />
      )}
    </FormPageWrapper>
  );
};
export { AddLiquidity };
