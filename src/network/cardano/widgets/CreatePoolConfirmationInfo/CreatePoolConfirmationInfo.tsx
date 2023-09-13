import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';
import { first, map, switchMap, zip } from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { FeesView } from '../../../../components/FeesView/FeesView';
import { CreatePoolFormModel } from '../../../../pages/CreatePool/CreatePoolFormModel';
import { cardanoNetworkParams$ } from '../../api/common/cardanoNetwork';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { toCreatePoolTxCandidate } from '../../api/operations/createPool';
import { settings$ } from '../../settings/settings';

export interface CreatePoolConfirmationInfoProps {
  readonly value: Required<CreatePoolFormModel>;
}

export const CreatePoolConfirmationInfo: FC<CreatePoolConfirmationInfoProps> =
  ({ value }) => {
    const { x, y, fee } = value;

    const newX = x?.isAssetEquals(networkAsset) ? x : y;
    const newY = x?.isAssetEquals(networkAsset) ? y : x;
    const [createPoolTxData, isCreatePoolTxDataLoading] = useObservable(
      zip([cardanoNetworkParams$, settings$]).pipe(
        first(),
        switchMap(([networkParams, settings]) =>
          toCreatePoolTxCandidate({
            x: newX,
            y: newY,
            feePct: fee,
            networkParams,
            settings,
          }),
        ),
        map((data) => data[2]),
        map((createPoolTxInfo) => ({
          txFee: new Currency(createPoolTxInfo.txFee || 0n, networkAsset),
          refundableDeposit: new Currency(
            createPoolTxInfo.refundableDeposit,
            networkAsset,
          ),
          poolOutputMinRequiredAda: new Currency(
            createPoolTxInfo.poolOutputMinRequiredAda,
            networkAsset,
          ),
        })),
      ),
      [],
    );

    return (
      <Flex col>
        <FeesView
          feeItems={[{ caption: t`Network Fee`, fee: createPoolTxData?.txFee }]}
          executionFee={undefined}
          isLoading={isCreatePoolTxDataLoading}
          refundableDeposit={createPoolTxData?.refundableDeposit}
        />
      </Flex>
    );
  };
