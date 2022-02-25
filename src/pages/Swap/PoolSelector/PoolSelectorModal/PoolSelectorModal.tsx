import React, { FC, useEffect } from 'react';

import { getAmmPoolsByAssetPair } from '../../../../api/ammPools';
import { useSubject } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import {
  Control,
  DialogRef,
  Flex,
  Input,
  List,
  Modal,
} from '../../../../ergodex-cdk';
import { PoolItemView } from './PoolItemView/PoolItemView';

interface PoolSelectorModalProps extends DialogRef<boolean> {
  readonly value: AmmPool;
  readonly onChange?: Control<AmmPool>['onChange'];
}

export const PoolSelectorModal: FC<PoolSelectorModalProps> = ({
  value,
  onChange,
  close,
}) => {
  const [availableAmmPools, updateAvailableAmmPools] = useSubject(
    getAmmPoolsByAssetPair,
  );

  useEffect(() => {
    updateAvailableAmmPools(value.x.asset.id, value.y.asset.id);
  }, [value.id]);

  const handlePoolItemClick = (pool: AmmPool): void => {
    if (onChange && pool.id !== value.id) {
      onChange(pool);
      close();
    }
  };

  return (
    <>
      <Modal.Title>Choose Pool</Modal.Title>
      <Modal.Content width={480}>
        <Flex col>
          <Flex.Item marginBottom={3}>
            <Input placeholder="Search" size="large" />
          </Flex.Item>
          <List dataSource={availableAmmPools} gap={1} transparent>
            {(pool) => (
              <PoolItemView
                pool={pool}
                active={pool.id === value.id}
                onClick={handlePoolItemClick}
              />
            )}
          </List>
        </Flex>
      </Modal.Content>
    </>
  );
};
