import {
  Animation,
  Box,
  Button,
  Control,
  Flex,
  Modal,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

import { panalytics } from '../../../common/analytics';
import { useSubject } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { AssetPairTitle } from '../../../components/AssetPairTitle/AssetPairTitle';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { getAmmPoolsByAssetPair } from '../../../gateway/api/ammPools';
import { formatToUSD } from '../../../services/number';
import { PoolSelectorModal } from './PoolSelectorModal/PoolSelectorModal';

interface PoolSelectorProps extends Control<AmmPool> {
  readonly className?: string;
}

const _PoolSelector: FC<PoolSelectorProps> = ({
  className,
  value,
  onChange,
}) => {
  const [availableAmmPools, updateAvailableAmmPools] = useSubject(
    getAmmPoolsByAssetPair,
  );
  const { s, valBySize } = useDevice();

  useEffect(() => {
    if (value) {
      updateAvailableAmmPools(value.x.asset.id, value.y.asset.id);
    }
  }, [value?.id]);

  const openPoolSelectorModal = (pool: AmmPool) => {
    Modal.open(({ close }) => (
      <PoolSelectorModal value={pool} onChange={onChange} close={close} />
    ));
    panalytics.clickChangePoolSwap();
  };

  return (
    <>
      <Flex justify="center">
        <Box
          className={className}
          padding={value ? valBySize(3, 4) : 0}
          bordered={!!value}
        >
          <Animation.Expand expanded={!!value} opacityDelay duration={200}>
            {value && (
              <Flex col>
                <Flex.Item marginBottom={2} align="center">
                  <Flex align="center" width="100%">
                    <Flex.Item>
                      <Typography.Body secondary>
                        <Trans>Liquidity Pool</Trans>
                      </Typography.Body>
                    </Flex.Item>
                    <InfoTooltip
                      secondary
                      content={
                        <>
                          <Trans>
                            Your operation will be executed in this pool. <br />
                            You can also choose another pool for this pair
                          </Trans>
                        </>
                      }
                    />
                    {s && (
                      <Flex.Item
                        flex={1}
                        display="flex"
                        justify="flex-end"
                        marginLeft="auto"
                        marginTop={-1}
                        marginBottom={-1}
                      >
                        <Button
                          disabled={(availableAmmPools?.length || 0) < 2}
                          type="text"
                          color="primary"
                          onClick={() => openPoolSelectorModal(value)}
                        >
                          <Trans>Change</Trans>
                        </Button>
                      </Flex.Item>
                    )}
                  </Flex>
                </Flex.Item>
                <Flex.Item>
                  <Flex align="center">
                    <Flex.Item marginRight={2}>
                      <AssetPairTitle
                        size="small"
                        assetX={value.x.asset}
                        assetY={value.y.asset}
                        level="body"
                      />
                    </Flex.Item>
                    <Flex.Item marginRight={2}>
                      <DataTag secondary content={`${value.poolFee}%`} />
                    </Flex.Item>
                    <Flex.Item marginRight={1}>
                      <Typography.Footnote>TVL:</Typography.Footnote>
                    </Flex.Item>
                    <Flex.Item>
                      <DataTag
                        secondary
                        content={
                          value?.tvl
                            ? formatToUSD(value.tvl.currency, 'abbr')
                            : '–––'
                        }
                      />
                    </Flex.Item>
                    {!s && (
                      <Flex.Item
                        marginLeft={2}
                        flex={1}
                        display="flex"
                        justify="flex-end"
                      >
                        <Button
                          disabled={(availableAmmPools?.length || 0) < 2}
                          onClick={() => openPoolSelectorModal(value)}
                        >
                          <Trans>Change</Trans>
                        </Button>
                      </Flex.Item>
                    )}
                  </Flex>
                </Flex.Item>
              </Flex>
            )}
          </Animation.Expand>
        </Box>
      </Flex>
    </>
  );
};

export const PoolSelector = styled(_PoolSelector)`
  width: 100%;
`;
