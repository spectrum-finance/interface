import {
  ArrowLeftOutlined,
  Box,
  Divider,
  Flex,
  Form,
  Modal,
  Slider,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../common/models/AssetInfo';
import { LmPool } from '../../../common/models/LmPool';
import { AssetIconPair } from '../../../components/AssetIconPair/AssetIconPair';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSlider } from '../../../components/common/FormView/FormSlider/FormSlider';
import { OperationForm } from '../../../components/OperationForm/OperationForm';
import { PageSection } from '../../../components/Page/PageSection/PageSection';
import { FarmHeaderAssets } from '../FarmGridView/FarmCardView/FarmCardView';

interface FarmStakeModalProps {
  pool: LmPool;
  onClose: (request?: any) => void;
}

interface FarmStakeHeaderProps {
  className?: string;
  assetX: AssetInfo;
  assetY: AssetInfo;
}

const _FarmStakeHeader: React.FC<FarmStakeHeaderProps> = ({
  className,
  assetX,
  assetY,
}) => {
  return (
    <Flex className={className} col gap={8}>
      Stake {assetX.ticker}/{assetY.ticker} liquidity
      <Flex justify="space-between">
        <Flex col align="flex-start">
          <WhiteText>
            <Trans>Total Staked</Trans>
          </WhiteText>
          <DataTag content="$---" />
        </Flex>
        <Flex col align="flex-end">
          <WhiteText>
            <Trans>APR</Trans>
          </WhiteText>
          <DataTag content="30%" />
        </Flex>
        <FarmHeaderAssets>
          <AssetIconPair assetX={assetX} assetY={assetY} size="extraLarge" />
        </FarmHeaderAssets>
      </Flex>
    </Flex>
  );
};

export const FarmStakeHeader = styled(_FarmStakeHeader)`
  position: relative;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background: linear-gradient(180deg, #764ca3 0%, #677de7 100%) !important;
  padding: 24px;
  margin: -16px -16px 32px;
  height: 164px;
  color: var(--spectrum-text-white);
`;

const WhiteText = styled(Typography.Text)`
  color: var(--spectrum-text-white) !important;
`;

export const Caption = styled(Typography.Body)`
  font-size: 16px !important;
  line-height: 24px !important;
`;

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: 'Max',
};

export const FarmStakeModal: React.FC<FarmStakeModalProps> = ({ pool }) => {
  const form = useForm<any>({
    percent: 50,
  });
  return (
    <>
      <Modal.Title>
        <FarmStakeHeader assetX={pool.assetX} assetY={pool.assetY} />
      </Modal.Title>
      <Modal.Content maxWidth={480} width="100%">
        <OperationForm
          analytics={{ location: 'create-farm' }}
          form={form}
          onSubmit={() => console.log('confirm')}
          actionCaption={t`Withdraw`}
        >
          <PageSection title={t`Amount`} noPadding>
            <Flex gap={4} col>
              <Form.Item name="percent">
                {({ value, onChange }) => (
                  <FormSlider value={value} onChange={onChange} />
                )}
              </Form.Item>
              <FormPairSection
                title={''}
                xAmount={pool.lq}
                yAmount={pool.vlq}
              />
            </Flex>
          </PageSection>
        </OperationForm>
      </Modal.Content>
    </>
  );
};
