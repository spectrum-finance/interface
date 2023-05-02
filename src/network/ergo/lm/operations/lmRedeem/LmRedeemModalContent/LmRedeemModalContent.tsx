import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useState } from 'react';
import { Observable, tap } from 'rxjs';

import { TxId } from '../../../../../../common/types';
import { fireOperationAnalyticsEvent } from '../../../../../../gateway/analytics/fireOperationAnalyticsEvent.ts';
import { FarmWithdrawalStakeItem } from '../../../../../../pages/Farms/FarmActionModals/FarmWithdrawalModal/StakeItem/FarmWithdrawalStakeItem';
import { mapToUnstakeAnalyticsProps } from '../../../../../../utils/analytics/mapper.ts';
import { ErgoFarm } from '../../../models/ErgoFarm';
import { Stake } from '../../../models/Stake';
import { walletLmRedeem } from '../walletLmRedeem';

const isStakeEquals = (stakeA: Stake, stakeB: Stake) =>
  stakeA.rawStake.bundleKeyAsset.asset.id ===
  stakeB.rawStake.bundleKeyAsset.asset.id;

export interface LmRedeemModalContentProps {
  readonly farm: ErgoFarm;
  readonly onClose: (p: Observable<TxId>, stake: Stake) => void;
}

export const LmRedeemModalContent: FC<LmRedeemModalContentProps> = ({
  farm,
  onClose,
}) => {
  const [selectedStake, setSelectedStake] = useState<Stake | undefined>();

  const handleStakeSelect = (stake: Stake) => {
    setSelectedStake(stake);
  };

  const redeemOperation = async () => {
    if (selectedStake) {
      fireOperationAnalyticsEvent('Farm Unstake Confirm Modal', (ctx) =>
        mapToUnstakeAnalyticsProps(selectedStake, farm, ctx),
      );
      onClose(
        walletLmRedeem(farm, selectedStake).pipe(
          tap(
            () => {
              fireOperationAnalyticsEvent('Farm Unstake Sign Success', (ctx) =>
                mapToUnstakeAnalyticsProps(selectedStake, farm, ctx),
              );
            },
            (err) => {
              if (err.code === 2) {
                fireOperationAnalyticsEvent('Farm Unstake Cancel Sign', (ctx) =>
                  mapToUnstakeAnalyticsProps(selectedStake, farm, ctx),
                );
              } else {
                fireOperationAnalyticsEvent(
                  'Farm Unstake Confirm Modal Error',
                  (ctx) => ({
                    error_string: JSON.stringify(err),
                    ...mapToUnstakeAnalyticsProps(selectedStake, farm, ctx),
                  }),
                );
              }
            },
          ),
        ),
        selectedStake,
      );
    }
  };

  return (
    <Flex col>
      <Flex.Item display="flex" justify="space-between" marginBottom={2}>
        <Typography.Body strong>
          <Trans>My deposits</Trans>
        </Typography.Body>
      </Flex.Item>
      {farm.stakes.map((stake, index) => (
        <Flex.Item
          marginBottom={index === farm.stakes.length - 1 ? 6 : 2}
          key={stake.rawStake.bundleKeyAsset.asset.id}
        >
          <FarmWithdrawalStakeItem
            active={selectedStake && isStakeEquals(selectedStake, stake)}
            onClick={() => handleStakeSelect(stake)}
            lmPool={farm}
            stake={stake}
          />
        </Flex.Item>
      ))}
      <Button
        type="primary"
        size="extra-large"
        disabled={!selectedStake}
        onClick={redeemOperation}
      >
        {!!selectedStake ? t`Unstake` : t`Select deposits`}
      </Button>
    </Flex>
  );
};
