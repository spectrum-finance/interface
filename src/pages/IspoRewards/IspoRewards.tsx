import {
  Alert,
  Box,
  Button,
  CopyOutlined,
  Empty,
  Flex,
  Form,
  Input,
  message,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { AssetIcon } from '../../components/AssetIcon/AssetIcon.tsx';
import { Page } from '../../components/Page/Page.tsx';
import {
  IspoRewardsData,
  requestIspoRewards,
} from '../../network/cardano/api/rewards/rewards.ts';

const REWARDS_ADDRESS =
  'addr1vx3vcluw7qtulynhzsy4prfdmnjth8w52ejg2qeclsz7argu26gcf';

interface IspoForm {
  address?: string;
}

interface IspoRewardsViewProps {
  data: IspoRewardsData;
}

const IspoRewardsView: FC<IspoRewardsViewProps> = ({ data }) => {
  return (
    <Box borderRadius="l" bordered padding={3}>
      <Flex col>
        <Flex.Item marginBottom={2} justify="space-between">
          <Typography.Title level={5}>
            <Trans>Available</Trans>
          </Typography.Title>
          <Flex align="center">
            <Flex.Item marginRight={1}>
              <AssetIcon asset={data.available.asset} />
            </Flex.Item>

            <Typography.Body size="large" strong>
              {data.available.toString()} {data.available.asset.ticker}
            </Typography.Body>
          </Flex>
        </Flex.Item>

        <Flex.Item justify="space-between">
          <Typography.Title level={5}>
            <Trans>Claimed</Trans>
          </Typography.Title>
          <Flex align="center">
            <Flex.Item marginRight={1}>
              <AssetIcon asset={data.received.asset} />
            </Flex.Item>

            <Typography.Body size="large" strong>
              {data.received.toString()} {data.received.asset.ticker}
            </Typography.Body>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

const ClaimIspoRewards: FC<{ data: IspoRewardsData }> = ({ data }) => {
  return (
    <Box borderRadius="l" bordered padding={3}>
      <Flex col>
        {data.available.amount > 0n ? (
          <>
            <Flex.Item marginBottom={2}>
              <Typography.Body strong>
                <Trans>
                  Complete the claiming process by sending 5 ADA in ONE
                  transaction to the address below:
                </Trans>
              </Typography.Body>
            </Flex.Item>
            <Flex.Item marginBottom={2}>
              <CopyToClipboard
                text={REWARDS_ADDRESS}
                onCopy={() => message.success(t`Address copied!`)}
              >
                <Typography.Link onClick={(e) => e.stopPropagation()}>
                  <CopyOutlined style={{ marginRight: '4px' }} />
                  {REWARDS_ADDRESS}
                </Typography.Link>
              </CopyToClipboard>
            </Flex.Item>
            <Flex.Item marginBottom={2}>
              <Alert
                type="warning"
                showIcon
                message={t`Only send ADA from the wallet that owns the provided stake or payment address. Otherwise your request won't be processed. If you accidentally made something wrong, contact support`}
              />
            </Flex.Item>
            <Flex.Item>
              <Alert
                type="info"
                showIcon
                message={t`All ADA will be returned to you except ~0.4 ADA which will be spent on the network fee.`}
              />
            </Flex.Item>
          </>
        ) : (
          <Flex.Item>
            <Alert
              type="info"
              showIcon
              message={t`No available rewards for now. Come back next epoch!`}
            />
          </Flex.Item>
        )}
      </Flex>
    </Box>
  );
};

const renderRewards = (data?: IspoRewardsData) => {
  if (!data) {
    return <></>;
  }

  if (data.received.amount <= 0n && data.available.amount <= 0n) {
    return (
      <Flex col align="center">
        <Empty />
        <Typography.Body strong>
          <Trans>No rewards found</Trans>
        </Typography.Body>
      </Flex>
    );
  }

  return (
    <>
      <Flex.Item marginBottom={2}>
        <IspoRewardsView data={data} />
      </Flex.Item>
      <Flex.Item>
        <ClaimIspoRewards data={data} />
      </Flex.Item>
    </>
  );
};

export const IspoRewards = () => {
  const [data, setData] = useState<IspoRewardsData | undefined>(undefined);
  const form = useForm<IspoForm>({
    address: undefined,
  });

  return (
    <Page backTo="../../../rewards" width={600} title="Claim ISPO rewards">
      <Flex col>
        <Flex.Item marginBottom={data ? 2 : 0}>
          <Form
            form={form}
            onSubmit={({ value: { address } }) => {
              if (address) {
                requestIspoRewards(address).then((data) => {
                  setData(data);
                });
              }
            }}
          >
            <Form.Listener<IspoForm>>
              {({ value }) => {
                return (
                  <Input
                    size="middle"
                    placeholder={t`Enter your stake or payment address`}
                    value={value.address}
                    onChange={({ target }) => {
                      form.patchValue({ address: target.value });
                    }}
                  />
                );
              }}
            </Form.Listener>
            <Button
              style={{ marginTop: '8px' }}
              htmlType="submit"
              type="primary"
            >
              Check My Reward
            </Button>
          </Form>
        </Flex.Item>

        {renderRewards(data)}
      </Flex>
    </Page>
  );
};
