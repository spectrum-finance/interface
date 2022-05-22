import { Trans } from '@lingui/macro';
import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

import { useSubject } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { TokenIconPair } from '../../../components/AssetIconPair/TokenIconPair';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { Truncate } from '../../../components/Truncate/Truncate';
import { VerificationMark } from '../../../components/VerificationMark/VerificationMark';
import {
  Animation,
  Box,
  Button,
  Control,
  Flex,
  Modal,
  Typography,
} from '../../../ergodex-cdk';
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

  useEffect(() => {
    if (value) {
      updateAvailableAmmPools(value.x.asset.id, value.y.asset.id);
    }
  }, [value?.id]);

  const openPoolSelectorModal = (pool: AmmPool) =>
    Modal.open(({ close }) => (
      <PoolSelectorModal value={pool} onChange={onChange} close={close} />
    ));

  return (
    <>
      <Flex justify="center">
        <Box className={className} padding={value ? 4 : 0}>
          <Animation.Expand expanded={!!value} opacityDelay duration={200}>
            {value && (
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <TokenIconPair
                    size="small"
                    assetX={value.x.asset}
                    assetY={value.y.asset}
                  />
                </Flex.Item>
                <Flex.Item marginRight={2}>
                  <Typography.Body strong>
                    <Truncate>{value.x.asset.name}</Truncate>/
                    <Truncate>{value.y.asset.name}</Truncate>
                  </Typography.Body>
                </Flex.Item>
                {value.verified && (
                  <Flex.Item marginRight={2} align="center">
                    <VerificationMark />
                  </Flex.Item>
                )}
                <Flex.Item marginRight={1}>
                  <Typography.Footnote>Fee:</Typography.Footnote>
                </Flex.Item>
                <Flex.Item marginRight={2}>
                  <DataTag secondary content={`${value.poolFee}%`} />
                </Flex.Item>
                <Flex.Item marginRight={1}>
                  <Typography.Footnote>TVL:</Typography.Footnote>
                </Flex.Item>
                <Flex.Item marginRight={2}>
                  <DataTag
                    secondary
                    content={
                      value?.tvl
                        ? formatToUSD(value.tvl.currency, 'abbr')
                        : '–––'
                    }
                  />
                </Flex.Item>
                <Flex.Item flex={1} display="flex" justify="flex-end">
                  <Button
                    disabled={(availableAmmPools?.length || 0) < 2}
                    onClick={() => openPoolSelectorModal(value)}
                  >
                    <Trans>Change</Trans>
                  </Button>
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
