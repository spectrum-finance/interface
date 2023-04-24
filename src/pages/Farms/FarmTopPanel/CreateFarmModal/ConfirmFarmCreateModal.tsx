import {
  ArrowLeftOutlined,
  Box,
  Divider,
  Flex,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { ElementLocation } from '@spectrumlabs/analytics';
import * as React from 'react';
import styled from 'styled-components';

import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { OperationForm } from '../../../../components/OperationForm/OperationForm';
import { Truncate } from '../../../../components/Truncate/Truncate';

interface ConfirmFarmCreateModal {
  form: any;
  onClose: (request?: any) => void;
}

export const Caption = styled(Typography.Body)`
  font-size: 16px !important;
  line-height: 24px !important;
`;

const StyledArrowLeftOutlined = styled(ArrowLeftOutlined)`
  cursor: pointer;
`;

export const ConfirmFarmCreateModal: React.FC<ConfirmFarmCreateModal> = ({
  form,
}) => {
  return (
    <>
      <Modal.Title>
        <Flex align="center">
          <Flex.Item marginRight={5}>
            <Typography.Title level={5}>
              <StyledArrowLeftOutlined onClick={() => console.log('close')} />
            </Typography.Title>
          </Flex.Item>
          <Trans>Confirm farm</Trans>
        </Flex>
      </Modal.Title>
      <Modal.Content maxWidth={480} width="100%">
        <OperationForm
          traceFormLocation={ElementLocation.farmsList}
          form={form}
          onSubmit={() => console.log('confirm')}
          actionCaption={t`Confirm farm creation`}
        >
          <Flex col gap={6}>
            <Flex col gap={2}>
              <Typography.Title level={5}>Liquidity pool</Typography.Title>
              <Box padding={[3, 4]}>
                <Flex col gap={2}>
                  <Flex row gap={1}>
                    <AssetIcon asset={form.value.pool.x.asset} />
                    <Flex.Item grow>
                      <Typography.Title level={5}>
                        <Truncate limit={10}>
                          {form.value.pool.x.asset.ticker}
                        </Truncate>
                      </Typography.Title>
                    </Flex.Item>
                    <Caption>{form.value.pool.x.asset.ticker}</Caption>
                  </Flex>
                  <Flex row gap={1}>
                    <AssetIcon asset={form.value.pool.y.asset} />
                    <Flex.Item grow>
                      <Typography.Title level={5}>
                        <Truncate limit={10}>
                          {form.value.pool.y.asset.ticker}
                        </Truncate>
                      </Typography.Title>
                    </Flex.Item>
                    <Caption>{form.value.pool.y.asset.ticker}</Caption>
                  </Flex>
                  <Divider />
                  <Flex row gap={1}>
                    <Flex.Item grow>
                      <Caption>
                        <Trans>Fee tier:</Trans>
                      </Caption>
                    </Flex.Item>
                    <Typography.Title level={5}>0.3%</Typography.Title>
                  </Flex>
                  <Flex row gap={1}>
                    <Flex.Item grow>
                      <Caption>
                        <Trans>TVL:</Trans>
                      </Caption>
                    </Flex.Item>
                    <Typography.Title level={5}>$3k</Typography.Title>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
            <Flex col gap={2}>
              <Typography.Title level={5}>
                <Trans>Period</Trans>
              </Typography.Title>
              <Box padding={[3, 4]}>
                <Flex col gap={2}>
                  <Flex row gap={1}>
                    <Flex.Item grow>
                      <Caption>
                        <Trans>Start:</Trans>
                      </Caption>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      143,345 block (~Jul 20, 22)
                    </Typography.Title>
                  </Flex>
                  <Flex row gap={1}>
                    <Flex.Item grow>
                      <Caption>
                        <Trans>End:</Trans>
                      </Caption>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      143,345 block (~Jul 20, 22)
                    </Typography.Title>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
            <Flex col gap={2}>
              <Typography.Title level={5}>
                <Trans>Budget</Trans>
              </Typography.Title>
              <Box padding={[3, 4]}>
                <Flex row gap={1}>
                  <AssetIcon asset={form.value.pool.x.asset} />
                  <Flex.Item grow>
                    <Typography.Title level={5}>
                      340k {form.value.pool.x.asset.ticker}
                    </Typography.Title>
                  </Flex.Item>
                  <Caption>{form.value.pool.x.asset.ticker}</Caption>
                </Flex>
              </Box>
            </Flex>
            <Flex col gap={2}>
              <Box padding={[3, 4]}>
                <Flex col gap={2}>
                  <Flex row gap={1}>
                    <Flex.Item grow>
                      <Typography.Title level={5}>
                        <Trans>Distribute tokens each:</Trans>
                      </Typography.Title>
                    </Flex.Item>
                    <Caption>100 block</Caption>
                  </Flex>
                  <Flex row gap={1}>
                    <Flex.Item grow>
                      <Typography.Title level={5}>
                        <Trans>Distribution per block:</Trans>
                      </Typography.Title>
                    </Flex.Item>
                    <Caption>156,345 Neta</Caption>
                  </Flex>
                  <Flex row gap={1}>
                    <Flex.Item grow>
                      <Typography.Title level={5}>
                        <Trans>Estimated APR:</Trans>
                      </Typography.Title>
                    </Flex.Item>
                    <Caption>100 block</Caption>
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
