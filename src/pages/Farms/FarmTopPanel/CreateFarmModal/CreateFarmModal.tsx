import {
  Box,
  Flex,
  Form,
  FormGroup,
  Modal,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { ElementLocation } from '@spectrumlabs/analytics';
import React, { FC } from 'react';
import { map } from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable';
import { LabeledContent } from '../../../../components/LabeledContent/LabeledContent';
import { OperationForm } from '../../../../components/OperationForm/OperationForm';
import { OverlayBox } from '../../../../components/OverlayBox/OverlayBox';
import { displayedAmmPools$ } from '../../../../gateway/api/ammPools';
import { assetBalance$ } from '../../../../gateway/api/assetBalance';
import { networkContext$ } from '../../../../gateway/api/networkContext';
import { CreateFarmFormModel } from './CreateFarmFormModel';
import { FarmDistributionIntervalInput } from './FarmDistributionIntervalInput/FarmDistributionIntervalInput';
import { FarmPeriodSelector } from './FarmPeriodSelector/FarmPeriodSelector';
import { FarmPoolSelector } from './FarmPoolSelector/FarmPoolSelector';
import { validators } from './validators/validators';

const balanceAssets$ = assetBalance$.pipe(
  map((balance) => balance.values().map((balance) => balance.asset)),
);

export const CreateFarmModal: FC = () => {
  const form = useForm<CreateFarmFormModel>({
    pool: undefined,
    period: undefined,
    distributionInterval: undefined,
    budgetAmount: undefined,
    budgetAsset: undefined,
  });
  const [networkContext] = useObservable(networkContext$);
  const [ammPools, ammPoolsLoading] = useObservable(displayedAmmPools$, [], []);
  const [formValue] = useObservable(form.valueChangesWithSilent$, [], {});

  const resetForm = () =>
    form.patchValue(
      {
        pool: undefined,
        budgetAmount: undefined,
        budgetAsset: undefined,
        distributionInterval: undefined,
        period: undefined,
      },
      { emitEvent: 'silent' },
    );

  const createFarmAction = (form: FormGroup<CreateFarmFormModel>) => {
    console.log(form.value);
  };

  return (
    <>
      {networkContext && (
        <>
          <Modal.Title>
            <Trans>Create farm</Trans>
          </Modal.Title>
          {/*<Modal.Content maxWidth={510} width="100%">*/}
          {/*  <OperationForm*/}
          {/*    analytics={{ location: 'create-farm' }}*/}
          {/*    form={form}*/}
          {/*    onSubmit={createFarmAction}*/}
          {/*    validators={validators}*/}
          {/*    actionCaption={t`Create farm`}*/}
          {/*  >*/}
          {/*    <Flex col>*/}
          {/*      <Flex.Item marginBottom={4}>*/}
          {/*        <Form.Item name="pool">*/}
          {/*          {({ value, onChange }) => (*/}
          {/*            <FarmPoolSelector*/}
          {/*              value={value}*/}
          {/*              onChange={onChange}*/}
          {/*              ammPools={ammPools}*/}
          {/*              ammPoolsLoading={ammPoolsLoading}*/}
          {/*            />*/}
          {/*          )}*/}
          {/*        </Form.Item>*/}
          {/*      </Flex.Item>*/}
          {/*      <Flex.Item marginBottom={4}>*/}
          {/*        <Form.Item name="period">*/}
          {/*          {({ value, onChange }) => (*/}
          {/*            <OverlayBox overlayed={!formValue.pool}>*/}
          {/*              <FarmPeriodSelector*/}
          {/*                networkHeight={networkContext.height}*/}
          {/*                value={value}*/}
          {/*                onChange={onChange}*/}
          {/*              />*/}
          {/*            </OverlayBox>*/}
          {/*          )}*/}
          {/*        </Form.Item>*/}
          {/*      </Flex.Item>*/}
          {/*      <Flex.Item marginBottom={4}>*/}
          {/*        <Form.Item name="distributionInterval">*/}
          {/*          {({ value, onChange }) => (*/}
          {/*            <OverlayBox*/}
          {/*              overlayed={*/}
          {/*                !formValue.period ||*/}
          {/*                !formValue.period[0] ||*/}
          {/*                !formValue.period[1]*/}
          {/*              }*/}
          {/*            >*/}
          {/*              <FarmDistributionIntervalInput*/}
          {/*                onChange={onChange}*/}
          {/*                value={value}*/}
          {/*              />*/}
          {/*            </OverlayBox>*/}
          {/*          )}*/}
          {/*        </Form.Item>*/}
          {/*      </Flex.Item>*/}
          {/*      <Flex.Item marginBottom={4}>*/}
          {/*        <OverlayBox*/}
          {/*          overlayed={*/}
          {/*            !formValue.period ||*/}
          {/*            !formValue.period[0] ||*/}
          {/*            !formValue.period[1] ||*/}
          {/*            !formValue.distributionInterval*/}
          {/*          }*/}
          {/*        >*/}
          {/*          <LabeledContent*/}
          {/*            label={t`Budget`}*/}
          {/*            tooltipContent={t`The total amount of tokens that you would like to distribute among users.`}*/}
          {/*          >*/}
          {/*            <AssetControlFormItem*/}
          {/*              bordered*/}
          {/*              assets$={balanceAssets$}*/}
          {/*              amountName="budgetAmount"*/}
          {/*              tokenName="budgetAsset"*/}
          {/*              maxButton*/}
          {/*            />*/}
          {/*          </LabeledContent>*/}
          {/*        </OverlayBox>*/}
          {/*      </Flex.Item>*/}
          {/*      <Box padding={4} secondary borderRadius="l">*/}
          {/*        <Flex gap={4} col>*/}
          {/*          <Flex justify="space-between">*/}
          {/*            <Typography.Body>*/}
          {/*              <Trans>Estimated APR:</Trans>*/}
          {/*            </Typography.Body>*/}
          {/*            <Typography.Body>30%</Typography.Body>*/}
          {/*          </Flex>*/}
          {/*          <Flex justify="space-between">*/}
          {/*            <Typography.Body>*/}
          {/*              <Trans>Distribution per block:</Trans>*/}
          {/*            </Typography.Body>*/}
          {/*            <Typography.Body>123,456 ERG</Typography.Body>*/}
          {/*          </Flex>*/}
          {/*        </Flex>*/}
          {/*      </Box>*/}
          {/*    </Flex>*/}
          {/*  </OperationForm>*/}
          {/*</Modal.Content>*/}
        </>
      )}
    </>
  );
};
