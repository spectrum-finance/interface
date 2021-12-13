import './PoolSelect.less';

import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { maxBy } from 'lodash';
import React, { useEffect } from 'react';

import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Typography,
} from '../../../ergodex-cdk';
import { TokenIconPair } from '../../TokenIconPair/TokenIconPair';
import { FeeTag } from '../FeeTag/FeeTag';

interface PoolOptionProps {
  position: AmmPool;
}

const PoolOption: React.FC<PoolOptionProps> = ({ position }) => {
  return (
    <Flex justify="space-between" align="center">
      <Flex.Item>
        <Flex>
          <Flex.Item marginRight={2}>
            <Flex>
              <TokenIconPair
                tokenPair={{
                  tokenA: position.x.asset.name,
                  tokenB: position.y.asset.name,
                }}
              />
            </Flex>
          </Flex.Item>
          <Flex.Item>
            <Typography.Title
              level={5}
            >{`${position.x.asset.name}/${position.y.asset.name}`}</Typography.Title>
          </Flex.Item>
        </Flex>
      </Flex.Item>
      <Flex.Item>
        <FeeTag fee={position.feeNum} contrast />
      </Flex.Item>
    </Flex>
  );
};

interface PoolSelectProps {
  positions?: AmmPool[];
  value?: AmmPool;
  onChange?: (pool: AmmPool) => void;
}

const PoolSelect: React.FC<PoolSelectProps> = ({
  positions,
  value,
  onChange,
}) => {
  const handleChange = (position: AmmPool) => {
    if (onChange) {
      onChange(position);
    }
  };

  useEffect(() => {
    if (positions && positions.length > 0) {
      const positionWithHighestLiquidity = maxBy(positions, (p) => p.lp.amount);

      if (positionWithHighestLiquidity) {
        handleChange(positionWithHighestLiquidity);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  return (
    <>
      {positions?.length ? (
        <Dropdown
          overlay={
            <Menu>
              {positions.map((position, index) => {
                return (
                  <Menu.Item key={index} onClick={() => handleChange(position)}>
                    <PoolOption position={position} />
                  </Menu.Item>
                );
              })}
            </Menu>
          }
          trigger={['click']}
        >
          <Button size="large" block style={{ padding: '0 12px' }} disabled>
            <Flex justify="space-between">
              <Flex.Item marginRight={2} grow>
                {value && <PoolOption position={value} />}
              </Flex.Item>
              <Flex.Item>
                <Flex align="center" style={{ height: '100%' }}>
                  <DownOutlined />
                </Flex>
              </Flex.Item>
            </Flex>
          </Button>
        </Dropdown>
      ) : (
        <Button size="large" block disabled>
          Select pair
        </Button>
      )}
    </>
  );
};
export { PoolSelect };
