import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { first } from 'rxjs';

import { TxId } from '../../../../common/types';
import { FarmWithdrawalStakeItem } from '../../../../pages/Farms/FarmActionModals/FarmWithdrawalModal/StakeItem/FarmWithdrawalStakeItem';
import { ErgoFarm } from '../../lm/models/ErgoFarm';
import { Stake } from '../../lm/models/Stake';
import { ergoPayLmRedeem } from '../../lm/operations/lmRedeem/egopayLmRedeem';

const isStakeEquals = (stakeA: Stake, stakeB: Stake) =>
  stakeA.rawStake.bundleKeyAsset.asset.id ===
  stakeB.rawStake.bundleKeyAsset.asset.id;

export interface LmDepositOpenWalletProps {
  readonly farm: ErgoFarm;
  readonly onTxRegister: (p: TxId) => void;
}

export const LmRedeemOpenWallet: FC<LmDepositOpenWalletProps> = ({
  farm,
  onTxRegister,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStake, setSelectedStake] = useState<Stake | undefined>();

  const handleStakeSelect = (stake: Stake) => {
    setSelectedStake(stake);
  };

  const redeemOperation = async () => {
    if (selectedStake) {
      setLoading(true);
      ergoPayLmRedeem(farm, selectedStake)
        .pipe(first())
        .subscribe({
          next: (txId) => {
            setLoading(false);
            onTxRegister(txId);
          },
          error: () => setLoading(false),
        });
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
        loading={loading}
        type="primary"
        size="extra-large"
        disabled={!selectedStake}
        onClick={redeemOperation}
      >
        {!!selectedStake
          ? isMobile
            ? t`Open Wallet`
            : t`Proceed`
          : t`Select deposits`}
      </Button>
    </Flex>
  );
};
