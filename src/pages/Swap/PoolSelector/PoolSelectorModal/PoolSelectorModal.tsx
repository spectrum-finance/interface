import { Control, List, Modal, ModalRef } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { fireAnalyticsEvent } from '@spectrumlabs/analytics';
import React, { FC, useEffect } from 'react';

// import { panalytics } from '../../../../common/analytics';
import { useSubject } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { getAmmPoolsByAssetPair } from '../../../../gateway/api/ammPools';
import { mapToAmmPoolAnalyticsProps } from '../../../../utils/analytics/mapper';
import { PoolItemView } from './PoolItemView/PoolItemView';

interface PoolSelectorModalProps extends ModalRef<boolean> {
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
    if (onChange) {
      onChange(pool);
      close();
      fireAnalyticsEvent('Swap Change Pool', mapToAmmPoolAnalyticsProps(pool));
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
