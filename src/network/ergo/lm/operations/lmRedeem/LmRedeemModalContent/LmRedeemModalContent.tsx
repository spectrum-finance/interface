import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { Observable } from 'rxjs';

import { TxId } from '../../../../../../common/types';
import { FarmWithdrawalStakeItem } from '../../../../../../pages/Farms/FarmActionModals/FarmWithdrawalModal/StakeItem/FarmWithdrawalStakeItem';
import { ErgoFarm } from '../../../models/ErgoFarm';
import { Stake } from '../../../models/Stake';
import { walletLmRedeem } from '../walletLmRedeem';

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

export interface LmRedeemModalContentProps {
  readonly farm: ErgoFarm;
  readonly onClose: (p: Observable<TxId[]>) => void;
}

export const LmRedeemModalContent: FC<LmRedeemModalContentProps> = ({
  farm,
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
    setSelectedStakes(farm.stakes);
  };

  const redeemOperation = async () => {
    if (selectedStakes.length) {
      onClose(walletLmRedeem(farm, selectedStakes));
    }
  };

  return (
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
      {farm.stakes.map((stake, index) => (
        <Flex.Item
          marginBottom={index === farm.stakes.length - 1 ? 6 : 2}
          key={stake.rawStake.bundleKeyAsset.asset.id}
        >
          <FarmWithdrawalStakeItem
            active={selectedStakes.some(isStakeExists(stake))}
            onClick={() => handleStakeSelect(stake)}
            lmPool={farm}
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
        {!!selectedStakes.length ? t`Withdraw` : t`Select deposits`}
      </Button>
    </Flex>
  );
};
