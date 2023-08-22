import {
  makePoolSetupParams,
  minValueForSetup,
  PoolSetupParams,
} from '@ergolabs/ergo-dex-sdk';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
} from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Button, Divider, Flex, Modal, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

import { ERG_DECIMALS } from '../../../common/constants/erg';
import { useObservable } from '../../../common/hooks/useObservable';
import { Ratio } from '../../../common/models/Ratio';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { PageSection } from '../../../components/Page/PageSection/PageSection';
import { RatioBox } from '../../../components/RatioBox/RatioBox';
import { Section } from '../../../components/Section/Section';
import { useSettings } from '../../../gateway/settings/settings';
import { utxos$ } from '../../../network/ergo/api/utxos/utxos';
import { explorer } from '../../../services/explorer';
import { poolActions } from '../../../services/poolActions';
import { submitTx } from '../../../services/yoroi';
import { makeTarget } from '../../../utils/ammMath';
import { parseUserInputToFractions } from '../../../utils/math';
import { CreatePoolFormModel } from '../CreatePoolFormModel';

interface CreatePoolConfirmationModalProps {
  value: Required<CreatePoolFormModel>;
  onClose: (r: Promise<any>) => void;
}

const CreatePoolConfirmationModal: FC<CreatePoolConfirmationModalProps> = ({
  value,
  onClose,
}) => {
  //@ts-ignore
  const { minerFee, address, pk } = useSettings();
  const [utxos] = useObservable(utxos$);
  const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

  const getMainRatio = (ratio: Ratio, xAsset: AssetInfo) =>
    ratio.baseAsset.id === xAsset.id ? ratio : ratio.invertRatio();

  const getOppositeRatio = (ratio: Ratio, yAsset: AssetInfo) =>
    ratio.baseAsset.id === yAsset.id ? ratio : ratio.invertRatio();

  const createPoolOperation = async () => {
    const { y, x } = value;

    if (pk && address && utxos) {
      const inputX = new AssetAmount(x.asset, x.amount);
      const inputY = new AssetAmount(y.asset, y.amount);

      const target = makeTarget(
        [inputX, inputY],
        minValueForSetup(minerFeeNErgs, 0n),
      );

      const network = await explorer.getNetworkContext();

      const inputs = DefaultBoxSelector.select(utxos, target) as BoxSelection;

      const poolSetupParams = makePoolSetupParams(
        inputX,
        inputY,
        Number((value.fee / 100).toFixed(3)),
        0n,
      );
      const actions = poolActions(poolSetupParams as PoolSetupParams);

      if (poolSetupParams instanceof Array) {
        return;
      }

      onClose(
        actions
          .setup(poolSetupParams, {
            inputs,
            changeAddress: address,
            selfAddress: address,
            feeNErgs: minerFeeNErgs,
            network,
          })
          .then(([tx1, tx2]) => submitTx(tx1).then(() => submitTx(tx2))),
      );
    }
  };

  return (
    <>
      <Modal.Title>
        <Trans>Confirm pool creation</Trans>
      </Modal.Title>
      <Modal.Content width={436}>
        <Flex direction="col">
          <Flex.Item marginBottom={6}>
            <FormPairSection
              title={t`Initial liquidity`}
              xAmount={value.x}
              yAmount={value.y}
            >
              <Flex col>
                <Flex.Item marginTop={2} marginBottom={2}>
                  <Divider />
                </Flex.Item>
                <Flex.Item align="center" justify="space-between">
                  <Typography.Body strong size="large">
                    <Trans>Fee tier</Trans>
                  </Typography.Body>
                  <Typography.Body strong size="large">
                    {value.fee}%
                  </Typography.Body>
                </Flex.Item>
              </Flex>
            </FormPairSection>
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <Section title={t`Initial price`}>
              <Flex>
                <Flex.Item flex={1} marginRight={2}>
                  <RatioBox
                    mainAsset={value.xAsset}
                    oppositeAsset={value.yAsset}
                    ratio={
                      value.initialPrice
                        ? getMainRatio(value.initialPrice, value.xAsset)
                        : undefined
                    }
                  />
                </Flex.Item>
                <Flex.Item flex={1}>
                  <RatioBox
                    mainAsset={value.yAsset}
                    oppositeAsset={value.xAsset}
                    ratio={
                      value.initialPrice
                        ? getOppositeRatio(value.initialPrice, value.yAsset)
                        : undefined
                    }
                  />
                </Flex.Item>
              </Flex>
            </Section>
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <PageSection title={t`Fees`}>
              <Flex justify="space-between">
                <Flex.Item>
                  <Typography.Body strong size="large">
                    <Trans>Total fees</Trans>
                  </Typography.Body>
                  <InfoTooltip
                    placement="rightBottom"
                    content={
                      <Flex direction="col">
                        <Flex.Item>
                          <Flex>
                            <Flex.Item marginRight={1}>
                              <Trans>Network Fee:</Trans>
                            </Flex.Item>
                            <Flex.Item>{minerFee} ERG</Flex.Item>
                          </Flex>
                        </Flex.Item>
                      </Flex>
                    }
                  />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Body size="large" strong>
                    {minerFee} ERG
                  </Typography.Body>
                </Flex.Item>
              </Flex>
            </PageSection>
          </Flex.Item>
          <Flex.Item>
            <Button
              block
              type="primary"
              size="extra-large"
              onClick={() => createPoolOperation()}
            >
              <Trans>Create pool</Trans>
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { CreatePoolConfirmationModal };
