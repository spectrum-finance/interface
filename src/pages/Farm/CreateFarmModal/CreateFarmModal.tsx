import {
  Box,
  DatePicker,
  Flex,
  Form,
  FormGroup,
  Input,
  Modal,
  Select,
  SwapRightOutlined,
  Tabs,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { map, Observable, tap } from 'rxjs';
import styled from 'styled-components';

import { panalytics } from '../../../common/analytics';
import { AmmPool } from '../../../common/models/AmmPool';
import { TxId } from '../../../common/types';
import { AssetControlFormItem } from '../../../components/common/TokenControl/AssetControl';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { OperationForm } from '../../../components/OperationForm/OperationForm';
import { assetBalance$ } from '../../../gateway/api/assetBalance';
import { PoolSelector } from '../../AddLiquidityOrCreatePool/AddLiquidity/PoolSelector/PoolSelector';
import { ConfirmFarmCreateModal } from './ConfirmFarmCreateModal';
import { CreateFarmModel } from './CreateFarmModel';
import { validators } from './validators/validators';

const CreateFarmTabs = styled(Tabs)`
  .ant-tabs-extra-content {
    margin-right: auto;
    flex: auto;
    order: -1;
    align-self: flex-end;
  }

  .ant-tabs-nav {
    margin-bottom: 8px !important;
  }

  .ant-tabs-nav-wrap {
    flex: none !important;
  }
`;

const balanceAssets$ = assetBalance$.pipe(
  map((balance) => balance.values().map((balance) => balance.asset)),
);

export const CreateFarmModal: React.FC<{ onClose: any; pools: AmmPool[] }> = ({
  onClose,
  pools,
}) => {
  const form = useForm<CreateFarmModel>({
    pool: undefined,
    period: undefined,
    distributionInterval: undefined,
    budgetAmount: undefined,
    budgetAsset: undefined,
  });
  const [periodType, setPeriodType] = useState<'block' | 'date'>('date');

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

  const createFarmAction = (form: FormGroup<CreateFarmModel>) => {
    openConfirmationModal(
      (next) => {
        return (
          <ConfirmFarmCreateModal
            form={form}
            onClose={(request: Observable<TxId>) =>
              next(
                request.pipe(
                  tap((tx) => {
                    resetForm();
                    return tx;
                  }),
                ),
              )
            }
          />
        );
      },
      Operation.CREATE_FARM,
      {},
    );
    // panalytics.submitDeposit(value);
  };

  return (
    <>
      <Modal.Title>
        <Trans>Create farm</Trans>
      </Modal.Title>
      <Modal.Content maxWidth={510} width="100%">
        <OperationForm
          analytics={{ location: 'create-farm' }}
          form={form}
          onSubmit={createFarmAction}
          validators={validators}
          actionCaption={t`Create farm`}
        >
          <Flex col gap={4}>
            <Flex col gap={2}>
              <Flex.Item display="flex" align="flex-end">
                <Typography.Body>
                  <Trans>Liquidity pool </Trans>{' '}
                </Typography.Body>
                <InfoTooltip
                  secondary
                  width={200}
                  content={
                    <Trans>
                      The liquidity tokens of this pool will participate in the
                      farming program.
                    </Trans>
                  }
                />
              </Flex.Item>
              <Form.Item name="pool">
                {({ value, onChange }) => (
                  <PoolSelector
                    ammPools={pools}
                    value={value}
                    onChange={onChange}
                  />
                )}
              </Form.Item>
            </Flex>
            <CreateFarmTabs
              defaultActiveKey={periodType}
              onChange={(key) => setPeriodType(key as any)}
              tabBarExtraContent={<Typography.Body>Period</Typography.Body>}
            >
              <Tabs.TabPane tab={t`Block`} key="block">
                <Box padding={2} control>
                  <Flex gap={2} align="center">
                    <Input placeholder={t`Start block`} />
                    <SwapRightOutlined
                      style={{
                        color: 'var(--spectrum-primary-text)',
                        fontSize: 24,
                      }}
                    />
                    <Input placeholder={t`End block`} />
                  </Flex>
                </Box>
              </Tabs.TabPane>
              <Tabs.TabPane tab={t`Date`} key="date">
                <Box padding={2} control>
                  <Form.Item name="period">
                    {({ value, onChange }) => (
                      <DatePicker.RangePicker
                        value={value}
                        onChange={(value) => onChange(value)}
                        className="w-full"
                      />
                    )}
                  </Form.Item>
                </Box>
              </Tabs.TabPane>
            </CreateFarmTabs>

            <Flex gap={2} col>
              <Typography.Body>
                <Trans>Distribute tokens each</Trans>
              </Typography.Body>
              <Box padding={2} control>
                <Form.Item name="distributionInterval">
                  {({ value, onChange }) => (
                    <NumberFormat
                      value={value}
                      type="tel"
                      allowNegative={false}
                      decimalScale={0}
                      thousandSeparator=" "
                      decimalSeparator="."
                      onValueChange={({ value }, { source }) => {
                        if (source === 'event') {
                          onChange(value);
                        }
                      }}
                      size="large"
                      placeholder="0.0"
                      customInput={Input}
                      addonAfter={
                        <Select defaultValue="block" className="select-after">
                          <Select.Option value="block">
                            <Trans>Block</Trans>
                          </Select.Option>
                          <Select.Option value="hour">
                            <Trans>Hour</Trans>
                          </Select.Option>
                          <Select.Option value="day">
                            <Trans>Day</Trans>
                          </Select.Option>
                          <Select.Option value="week">
                            <Trans>Week</Trans>
                          </Select.Option>
                          <Select.Option value="month">
                            <Trans>Month</Trans>
                          </Select.Option>
                        </Select>
                      }
                    />
                  )}
                </Form.Item>
              </Box>
            </Flex>
            <Flex col gap={2}>
              <Flex.Item display="flex" align="flex-end">
                <Typography.Body>
                  <Trans>Budget</Trans>{' '}
                </Typography.Body>
                <InfoTooltip
                  secondary
                  width={200}
                  content={
                    <Trans>
                      The total amount of tokens that you would like to
                      distribute among users.
                    </Trans>
                  }
                />
              </Flex.Item>
              <AssetControlFormItem
                bordered
                assets$={balanceAssets$}
                amountName="budgetAmount"
                tokenName="budgetAsset"
                maxButton
                // analytics={{
                //   operation: 'swap',
                //   location: 'swap',
                //   tokenAssignment: 'to',
                // }}
              />
              <Box padding={4} control>
                <Flex gap={4} col>
                  <Flex justify="space-between">
                    <Typography.Body>
                      <Trans>Estimated APR:</Trans>
                    </Typography.Body>
                    <Typography.Body>30%</Typography.Body>
                  </Flex>
                  <Flex justify="space-between">
                    <Typography.Body>
                      <Trans>Distribution per block:</Trans>
                    </Typography.Body>
                    <Typography.Body>123,456 ERG</Typography.Body>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </OperationForm>
      </Modal.Content>
    </>
  );
};
