import { blocksToDaysCount } from '@ergolabs/ergo-dex-sdk';
import {
  Box,
  Button,
  Col,
  Flex,
  Row,
  SIZE,
  SwapRightOutlined,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { blockToDateTime } from '../../../../common/utils/blocks';
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../../components/TableView/common/Expand';
import { ErgoFarm } from '../../../../network/ergo/lm/models/ErgoFarm';
import { FarmLineProgress } from '../../FarmLineProgress/FarmLineProgress';
import { FarmNextRewards } from '../../FarmNextRewards/FarmNextRewards';
import { FarmAction } from '../columns/FarmActionColumn/FarmAction/FarmAction';
import { DistributionCell } from './DistributionCell/DistributionCell';
import { TotalStakedCell } from './TotalStakedCell/TotalStakedCell';
import { YourStakeCell } from './YourStakeCell/YourStakeCell';

const FullWidthRow = styled(Row)`
  width: 100%;
`;

export interface FarmTableExpandComponentProps
  extends ExpandComponentProps<ErgoFarm> {
  readonly className?: string;
}

const _FarmTableExpandComponent: FC<FarmTableExpandComponentProps> = ({
  item,
  className,
}) => {
  const { lessThan } = useDevice();

  return (
    <div className={className}>
      {lessThan('m') && (
        <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <DistributionCell farm={item} />
        </div>
      )}
      {lessThan('l') && (
        <div>
          <TotalStakedCell farm={item} />
        </div>
      )}
      {lessThan('l') && (
        <div>
          <YourStakeCell farm={item} />
        </div>
      )}
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </div>
  );

  // return (
  // <Flex>
  //   <FullWidthRow>
  //     {lessThan('m') && (
  //       <Col span={24}>
  //         <Box
  //           width="100%"
  //           borderRadius="none"
  //           padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
  //           bordered={false}
  //           transparent
  //         >
  //           <Flex direction="col">
  //             <Typography.Body secondary>
  //               <Trans>Distributed</Trans>
  //             </Typography.Body>
  //             <Flex.Item marginTop={1} width="100%">
  //               <FarmLineProgress lmPool={lmPool} height={24} width="100%" />
  //             </Flex.Item>
  //           </Flex>
  //         </Box>
  //       </Col>
  //     )}
  //     {lessThan('xl') && (
  //       <>
  //         <Col span={12}>
  //           <Box
  //             width="100%"
  //             borderRadius="none"
  //             padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
  //             bordered={false}
  //             transparent
  //           >
  //             <Flex direction="col">
  //               <Typography.Body secondary>Total staked</Typography.Body>
  //               <Typography.Body>
  //                 <Flex gap={1} align="center">
  //                   <Flex gap={1} align="center">
  //                     <ConvenientAssetView value={lmPool.totalStakedShares} />
  //                     <InfoTooltip
  //                       width={194}
  //                       size="small"
  //                       placement="top"
  //                       icon="exclamation"
  //                       content={
  //                         <div>
  //                           <div>
  //                             {lmPool.totalStakedX.asset.ticker}:{' '}
  //                             {lmPool.totalStakedX.toString()}
  //                           </div>
  //                           <div>
  //                             {lmPool.totalStakedY.asset.ticker}:{' '}
  //                             {lmPool.totalStakedY.toString()}
  //                           </div>
  //                         </div>
  //                       }
  //                     />
  //                   </Flex>
  //                 </Flex>
  //               </Typography.Body>
  //             </Flex>
  //           </Box>
  //         </Col>
  //         <Col span={12}>
  //           <Box
  //             width="100%"
  //             borderRadius="none"
  //             padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
  //             bordered={false}
  //             transparent
  //           >
  //             <Flex direction="col">
  //               <Typography.Body secondary>
  //                 <Trans>Your Stake</Trans>
  //               </Typography.Body>
  //               <Typography.Body>
  //                 <div>
  //                   {lmPool.yourStakeShares.every((value) =>
  //                     value.isPositive(),
  //                   ) ? (
  //                     <ConvenientAssetView value={lmPool.yourStakeShares} />
  //                   ) : (
  //                     <>$---</>
  //                   )}
  //                 </div>
  //               </Typography.Body>
  //             </Flex>
  //           </Box>
  //         </Col>
  //       </>
  //     )}
  //     <Col span={12}>
  //       <Box
  //         width="100%"
  //         borderRadius="none"
  //         padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
  //         bordered={false}
  //         transparent
  //       >
  //         <Flex direction="col">
  //           <Typography.Body secondary>Live period</Typography.Body>
  //           <Typography.Body>
  //             {lmPool.startDateTime.toLocaleString()}{' '}
  //             <Typography.Body secondary>
  //               <SwapRightOutlined disabled={true} />
  //             </Typography.Body>{' '}
  //             {lmPool.endDateTime.toLocaleString()}
  //           </Typography.Body>
  //         </Flex>
  //       </Box>
  //     </Col>
  //     <Col span={12}>
  //       <Box
  //         width="100%"
  //         borderRadius="none"
  //         padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
  //         bordered={false}
  //         transparent
  //       >
  //         <FarmNextRewards lmPool={lmPool} />
  //       </Box>
  //     </Col>
  //     <Col span={12}>
  //       <Box
  //         width="100%"
  //         borderRadius="none"
  //         padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
  //         bordered={false}
  //         transparent
  //       >
  //         <Flex direction="col">
  //           <Typography.Body secondary>
  //             Distribution frequency
  //           </Typography.Body>
  //           <Typography.Body>
  //             {lmPool.distributionFrequencyInDays} days (
  //             {lmPool.distributionFrequencyInBlocks} blocks)
  //           </Typography.Body>
  //         </Flex>
  //       </Box>
  //     </Col>
  //     <Col span={12}>
  //       {/* <Box
  //         width="100%"
  //         borderRadius="none"
  //         padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
  //         bordered={false}
  //         transparent
  //       >
  //         <Flex direction="col">
  //           <Typography.Body secondary>Rewards</Typography.Body>
  //           <Typography.Body size="base">
  //             You will be able to lmStake starting from 2022-07-20
  //           </Typography.Body>
  //         </Flex>
  //       </Box> */}
  //     </Col>
  //
  //     {lessThan('m') && (
  //       <Col span={24}>
  //         <Box
  //           width="100%"
  //           borderRadius="none"
  //           padding={[4, 4]}
  //           bordered={false}
  //           transparent
  //         >
  //           <Flex.Item marginTop={1} width="100%">
  //             <FarmAction farm={lmPool} fullWidth />
  //           </Flex.Item>
  //         </Box>
  //       </Col>
  //     )}
  //   </FullWidthRow>
  // </Flex>
  // );
};

export const FarmTableExpandComponent = styled(_FarmTableExpandComponent)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 80px 80px 1fr 1fr;

  > * {
    border-bottom: 1px solid var(--spectrum-box-border-color-secondary);
    &:not(:nth-child(2n + 1)) {
      border-right: 1px solid var(--spectrum-box-border-color-secondary);
    }
  }

  @media (min-width: ${SIZE.m}px) {
    grid-template-rows: 1fr 1fr 1fr;

    > * {
      &:not(:nth-child(2n)) {
        border-right: 1px solid var(--spectrum-box-border-color-secondary);
      }
    }
  }

  @media (min-width: ${SIZE.xl}px) {
    grid-template-rows: 1fr 1fr;
  }

  height: 100%;
`;
