import { Button, Flex, Modal } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { Observable, tap } from 'rxjs';

import { panalytics } from '../../common/analytics';
import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { PoolRatio } from '../../pages/PoolOverview/PoolRatio/PoolRatio';
import { FormPairSection } from '../common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../Page/PageSection/PageSection';
import { Section } from '../Section/Section';

export interface BaseAddLiquidityConfirmationModal {
  value: Required<AddLiquidityFormModel>;
  onClose: (r: Observable<TxId>) => void;
  readonly Info: FC<{ value: Required<AddLiquidityFormModel> }>;
  readonly deposit: (
    pool: AmmPool,
    x: Currency,
    y: Currency,
  ) => Observable<TxId>;
}

export const BaseAddLiquidityConfirmationModal: FC<BaseAddLiquidityConfirmationModal> =
  ({ value, onClose, Info, deposit }) => {
    const addLiquidityOperation = async () => {
      const { pool, y, x } = value;

      if (pool && x && y) {
        panalytics.confirmDeposit(value);
        onClose(
          deposit(
            pool,
            x.asset.id === pool.x.asset.id ? x : y,
            y.asset.id === pool.y.asset.id ? y : x,
          ).pipe(
            tap(
              (txId) => panalytics.signedDeposit(value, txId),
              (err) => panalytics.signedErrorDeposit(value, err),
            ),
          ),
        );
      }
    };

    return (
      <>
        <Modal.Title>
          <Trans>Confirm Add Liquidity</Trans>
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
              <Section title={t`Initial price`}>
                <Flex>
                  <Flex.Item flex={1} marginRight={2}>
                    <PoolRatio ammPool={value.pool} ratioOf="x" />
                  </Flex.Item>
                  <Flex.Item flex={1}>
                    <PoolRatio ammPool={value.pool} ratioOf="y" />
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
                onClick={() => addLiquidityOperation()}
              >
                <Trans>Add Liquidity</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </Modal.Content>
      </>
    );
  };
