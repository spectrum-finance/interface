import React, { useState } from 'react';

import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { TokenIcon } from '../../components/TokenIcon/TokenIcon';
import { TokenIconPair } from '../../components/TokenIconPair/TokenIconPair';
import {
  Box,
  Button,
  Flex,
  SettingOutlined,
  Slider,
  Typography,
} from '../../ergodex-cdk';

const mocks = {
  tokenPair: { tokenA: 'ERG', tokenB: 'SigUSD' },
};

const sliderMarks = {
  0: 'Min',
  25: '25%',
  50: '50%',
  75: '75%',
  100: 'Max',
};

type RemovableAsset = {
  name: string;
  amount: number;
  earnedFees: number;
};

type RemovableAssetPair = {
  assetX: RemovableAsset;
  assetY: RemovableAsset;
};

interface TokenSpaceProps {
  title: string;
  // assetPair: RemovableAssetPair;
}

const RemovePageSpaceWrapper: React.FC<{ title: string }> = ({
  children,
  title,
}) => {
  return (
    <Flex flexDirection="col">
      <Flex.Item marginBottom={2}>
        <Typography.Title level={5}>{title}</Typography.Title>
      </Flex.Item>
      <Flex.Item>{children}</Flex.Item>
    </Flex>
  );
};

const TokenSpace: React.FC<TokenSpaceProps> = ({
  title,
  // assetPair,
}): JSX.Element => {
  return (
    <RemovePageSpaceWrapper title={title}>
      <Box contrast padding={4}>
        <Flex flexDirection="col">
          <Flex.Item marginBottom={2}>
            <Flex justify="space-between" alignItems="center">
              <Flex.Item>
                <Flex alignItems="center">
                  <Flex.Item marginRight={2}>
                    <TokenIcon name="ERG" />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Title level={5}>ERG</Typography.Title>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex>
                  <Typography.Title level={5}>0,00003 ERG</Typography.Title>
                </Flex>
              </Flex.Item>
            </Flex>
          </Flex.Item>
          <Flex.Item>
            <Flex justify="space-between">
              <Flex.Item>
                <Flex>
                  <Flex.Item marginRight={2}>
                    <TokenIcon name="ERG" />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Title level={5}>ERG</Typography.Title>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex>
                  <Typography.Title level={5}>0,00003 ERG</Typography.Title>
                </Flex>
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </Flex>
      </Box>
    </RemovePageSpaceWrapper>
  );
};

interface RemovePositionSliderProps {
  percentage: number;
  setPercentage: (p: number) => void;
}

const RemovePositionSlider: React.FC<RemovePositionSliderProps> = ({
  percentage,
  setPercentage,
}) => {
  return (
    <Box contrast padding={4}>
      <Flex flexDirection="col">
        <Flex.Item>
          <Flex flexDirection="col">
            <Flex.Item marginBottom={4}>
              <Flex alignItems="center" justify="center">
                <Typography.Title level={1}>{percentage}%</Typography.Title>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Slider
                tooltipVisible={false}
                marks={sliderMarks}
                defaultValue={percentage}
                onChange={setPercentage}
              />
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

const Remove = (): JSX.Element => {
  const DEFAULT_SLIDER_PERCENTAGE = 50;
  const [removePercent, setRemovePercent] = useState(DEFAULT_SLIDER_PERCENTAGE);

  return (
    <>
      <FormPageWrapper width={382} title="Remove liquidity" withBackButton>
        <Flex flexDirection="col">
          <Flex.Item marginBottom={2}>
            <Flex justify="space-between" alignItems="center">
              <Flex.Item>
                <Flex alignItems="center">
                  <Flex.Item display="flex" marginRight={2}>
                    <TokenIconPair tokenPair={mocks.tokenPair} />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Title level={4}>
                      {mocks.tokenPair.tokenA} / {mocks.tokenPair.tokenB}
                    </Typography.Title>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Button size="large" type="text" icon={<SettingOutlined />} />
              </Flex.Item>
            </Flex>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <RemovePageSpaceWrapper title="Amount">
              <RemovePositionSlider
                percentage={removePercent}
                setPercentage={setRemovePercent}
              />
            </RemovePageSpaceWrapper>
          </Flex.Item>

          <Flex.Item marginBottom={4}>
            <TokenSpace title="Pooled Assets" />
          </Flex.Item>

          <Flex.Item marginBottom={4}>
            <TokenSpace title="Earned Fees" />
          </Flex.Item>

          <Flex.Item>
            <SubmitButton>Remove</SubmitButton>
          </Flex.Item>
        </Flex>
      </FormPageWrapper>
    </>
  );
};

export { Remove };
