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
import React, { FC } from 'react';

import { ERG_DECIMALS } from '../../../../common/constants/erg';
import { useObservable } from '../../../../common/hooks/useObservable';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { PageSection } from '../../../../components/Page/PageSection/PageSection';
import { useSettings } from '../../../../context';
import {
  Button,
  Divider,
  Flex,
  Modal,
  Typography,
} from '../../../../ergodex-cdk';
import { utxos$ } from '../../../../network/ergo/common/utxos';
import { explorer } from '../../../../services/explorer';
import { poolActions } from '../../../../services/poolActions';
import { submitTx } from '../../../../services/yoroi';
import { makeTarget } from '../../../../utils/ammMath';
import { parseUserInputToFractions } from '../../../../utils/math';
import { CreatePoolFormModel } from '../CreatePoolFormModel';

interface CreatePoolConfirmationModalProps {
  value: Required<CreatePoolFormModel>;
  onClose: (r: Promise<any>) => void;
}

const CreatePoolConfirmationModal: FC<CreatePoolConfirmationModalProps> = ({
  value,
  onClose,
}) => {
  const [{ minerFee, address, pk }] = useSettings();
  const [utxos] = useObservable(utxos$);
  const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

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
        Number((value.fee / 10).toFixed(3)),
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
      <Modal.Title>Confirm pool creation</Modal.Title>
      <Modal.Content width={436}>
        <Flex direction="col">
          <Flex.Item marginBottom={6}>
            <FormPairSection
              title="Initial liquidity"
              xAmount={value.x}
              yAmount={value.y}
            >
              <Flex col>
                <Flex.Item marginTop={2} marginBottom={2}>
                  <Divider />
                </Flex.Item>
                <Flex.Item align="center" justify="space-between">
                  <Typography.Body strong>Fee tier</Typography.Body>
                  <Typography.Body strong>{value.fee}%</Typography.Body>
                </Flex.Item>
              </Flex>
            </FormPairSection>
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <PageSection title="Fees">
              <Flex justify="space-between">
                <Flex.Item>
                  <Typography.Text strong>Fees</Typography.Text>
                  <InfoTooltip
                    placement="rightBottom"
                    content={
                      <Flex direction="col">
                        <Flex.Item>
                          <Flex>
                            <Flex.Item marginRight={1}>Miner Fee:</Flex.Item>
                            <Flex.Item>{minerFee} ERG</Flex.Item>
                          </Flex>
                        </Flex.Item>
                      </Flex>
                    }
                  />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Text strong>{minerFee} ERG</Typography.Text>
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
              Create pool
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { CreatePoolConfirmationModal };
