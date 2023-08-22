import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Button, Flex, Modal } from '@ergolabs/ui-kit';
import { CANCEL_REQUEST } from '@ergolabs/ui-kit/dist/components/Modal/presets/Request';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import { Observable, tap } from 'rxjs';

import { Currency } from '../../common/models/Currency';
import { Ratio } from '../../common/models/Ratio';
import { TxId } from '../../common/types';
import { CreatePoolFormModel } from '../../pages/CreatePool/CreatePoolFormModel';
import { FormPairSection } from '../common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../Page/PageSection/PageSection';
import { RatioBox } from '../RatioBox/RatioBox';
import { Section } from '../Section/Section';

export interface BaseCreatePoolConfirmationModalProps {
  readonly value: Required<CreatePoolFormModel>;
  readonly onClose: (r: Observable<TxId>) => void;
  readonly Info: FC<{
    value: Required<CreatePoolFormModel>;
  }>;
  readonly createPool: (
    feePct: number,
    x: Currency,
    y: Currency,
  ) => Observable<TxId>;
}

const getMainRatio = (ratio: Ratio, xAsset: AssetInfo) =>
  ratio.baseAsset.id === xAsset.id ? ratio : ratio.invertRatio();

const getOppositeRatio = (ratio: Ratio, yAsset: AssetInfo) =>
  ratio.baseAsset.id === yAsset.id ? ratio : ratio.invertRatio();

export const BaseCreatePoolConfirmationModal: FC<BaseCreatePoolConfirmationModalProps> =
  ({ value, onClose, Info, createPool }) => {
    const createPoolOperation = async () => {
      const { y, x, fee } = value;

      if (x && y) {
        // fireOperationAnalyticsEvent('Deposit Modal Confirm', (ctx) =>
        //   mapToDepositAnalyticsProps(value, ctx),
        // );
        onClose(
          createPool(fee, x, y).pipe(
            tap(
              () => {
                // fireOperationAnalyticsEvent('Deposit Signed Success', (ctx) =>
                //   mapToDepositAnalyticsProps(value, ctx),
                // );
              },
              (err) => {
                if (err === CANCEL_REQUEST) {
                  // fireOperationAnalyticsEvent('Deposit Cancel Sign', (ctx) =>
                  //   mapToDepositAnalyticsProps(value, ctx),
                  // );
                  return;
                }

                // fireOperationAnalyticsEvent(
                //   'Deposit Modal Confirm Error',
                //   (ctx) => ({
                //     ...mapToDepositAnalyticsProps(value, ctx),
                //     error_string: JSON.stringify(err),
                //   }),
                // );
              },
            ),
          ),
        );
      }
    };

    return (
      <>
        <Modal.Title>
          <Trans>Confirm pool creation</Trans>
        </Modal.Title>
        <Modal.Content width={468}>
          <Flex direction="col">
            <Flex.Item marginBottom={6}>
              <FormPairSection
                title={t`Assets`}
                xAmount={value.x}
                yAmount={value.y}
              />
            </Flex.Item>
            <Flex.Item marginBottom={6}>
              <Section title={t`Current Ratio`} gap={2}>
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
                <Info value={value} />
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
