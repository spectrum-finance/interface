import { Trans } from '@lingui/macro';
import React, { FC, useEffect } from 'react';

import { getAmmPoolsByAssetPair } from '../../../../api/ammPools';
import { useSubject } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Control, DialogRef, List, Modal } from '../../../../ergodex-cdk';
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
      <Modal.Title>
        <Trans>Choose Pool</Trans>
      </Modal.Title>
      <Modal.Content width={480}>
        <List dataSource={availableAmmPools} gap={1} maxHeight={400}>
          {(pool) => (
            <PoolItemView
              pool={pool}
              active={pool.id === value.id}
              onClick={handlePoolItemClick}
            />
          )}
        </List>
      </Modal.Content>
    </>
  );
};
