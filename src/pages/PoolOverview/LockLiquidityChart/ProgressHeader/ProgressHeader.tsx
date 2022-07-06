import {
  DownOutlined,
  Progress,
  Typography,
  UpOutlined,
} from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { AmmPoolConfidenceAnalytic } from '../../AmmPoolConfidenceAnalytic';

interface ProgressHeaderChevronProps {
  readonly className?: string;
  readonly collapsed?: boolean;
}

const _ProgressHeaderChevron: FC<ProgressHeaderChevronProps> = ({
  collapsed,
  className,
}) => (
  <Typography.Body>
    {collapsed ? (
      <UpOutlined className={className} />
    ) : (
      <DownOutlined className={className} />
    )}
  </Typography.Body>
);

const ProgressHeaderChevron = styled(_ProgressHeaderChevron)`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
`;

interface ProgressHeaderProps {
  readonly className?: string;
  readonly collapsed?: boolean;
  readonly poolConfidenceAnalytic: AmmPoolConfidenceAnalytic;
}

const _ProgressHeader: FC<ProgressHeaderProps> = ({
  className,
  collapsed,
  poolConfidenceAnalytic,
}) => (
  <div className={className}>
    <Progress percent={poolConfidenceAnalytic.lockedPercent} />
    <ProgressHeaderChevron collapsed={collapsed} />
  </div>
);

export const ProgressHeader = styled(_ProgressHeader)`
  position: relative;
  width: 100%;
`;
