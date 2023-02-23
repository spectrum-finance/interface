import { Button, Flex, Modal, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { Observable } from 'rxjs';

import { TxId } from '../../../../common/types';
import { ErgoFarm } from '../../../../network/ergo/lm/models/ErgoFarm';
import { Stake } from '../../../../network/ergo/lm/models/Stake';
import { FarmActionModalHeader } from '../FarmActionModalHeader/FarmActionModalHeader';
import { FarmWithdrawalStakeItem } from './StakeItem/FarmWithdrawalStakeItem';

export interface FarmWithdrawalModalProps {
  readonly ergoLmPool: ErgoFarm;
  readonly onClose: (p: Observable<TxId>) => void;
  readonly redeem: (lmPool: ErgoFarm, stakes: Stake[]) => Observable<TxId>;
}

const isStakeExists =
  (stake: Stake) =>
  (stakeToCheck: Stake): boolean =>
    stakeToCheck.rawStake.bundleKeyAsset.asset.id ===
    stake.rawStake.bundleKeyAsset.asset.id;

const isStakeDifferent =
  (stake: Stake) =>
  (stakeToCheck: Stake): boolean =>
    stakeToCheck.rawStake.bundleKeyAsset.asset.id !==
    stake.rawStake.bundleKeyAsset.asset.id;

export const FarmWithdrawalModal: FC<FarmWithdrawalModalProps> = ({
  ergoLmPool,
  redeem,
  onClose,
}) => {
  const [selectedStakes, setSelectedStakes] = useState<Stake[]>([]);

  const handleStakeSelect = (stake: Stake) => {
    setSelectedStakes((prev) => {
      if (prev.some(isStakeExists(stake))) {
        return prev.filter(isStakeDifferent(stake));
      } else {
        return prev.concat(stake);
      }
    });
  };

  const selectAllStakes = () => {
    setSelectedStakes(ergoLmPool.stakes);
  };

  const redeemOperation = async () => {
    if (selectedStakes.length) {
      onClose(redeem(ergoLmPool, selectedStakes));
    }
  };

  return (
    <>
      <Modal.Title>
        <FarmActionModalHeader
          lmPool={ergoLmPool}
          assetY={ergoLmPool.ammPool.y.asset}
          assetX={ergoLmPool.ammPool.x.asset}
        />
      </Modal.Title>
      <Modal.Content maxWidth={480} width="100%">
        <Flex col>
          <Flex.Item display="flex" justify="space-between" marginBottom={2}>
            <Typography.Body strong>
              <Trans>My deposits</Trans>
            </Typography.Body>
            <Button
              htmlType="button"
              type="link"
              size="small"
              onClick={selectAllStakes}
            >
              <Trans>Select All</Trans>
            </Button>
          </Flex.Item>
          {ergoLmPool.stakes.map((stake, index) => (
            <Flex.Item
              marginBottom={index === ergoLmPool.stakes.length - 1 ? 6 : 2}
              key={stake.rawStake.bundleKeyAsset.asset.id}
            >
              <FarmWithdrawalStakeItem
                active={selectedStakes.some(isStakeExists(stake))}
                onClick={() => handleStakeSelect(stake)}
                lmPool={ergoLmPool}
                stake={stake}
              />
            </Flex.Item>
          ))}
          <Button
            type="primary"
            size="extra-large"
            disabled={!selectedStakes.length}
            onClick={redeemOperation}
          >
            {!!selectedStakes.length ? t`Unstake` : t`Select deposits`}
          </Button>
        </Flex>
      </Modal.Content>
    </>
  );
};
