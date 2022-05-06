import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Button, MessageOutlined } from '../../../ergodex-cdk';

export interface LeaveFeedbackProps {
  readonly className?: string;
}

const FEEDBACK_URL =
  'https://docs.google.com/forms/d/1ZxfN9kVC2h8WoSPrlUVYr-68RSCI-BFaHtIOyUflXp8/edit?usp=sharing';

const _LeaveFeedback: FC<LeaveFeedbackProps> = ({ className }) => (
  <Button
    type="primary"
    size="small"
    className={className}
    href={FEEDBACK_URL}
    target="_blank"
    icon={<MessageOutlined style={{ marginRight: 4 }} />}
  >
    <Trans>Leave feedback</Trans>
  </Button>
);

export const LeaveFeedback = styled(_LeaveFeedback)`
  color: var(--ergo-body-bg) !important;

  svg {
    font-size: 14px;
    width: 14px;
    height: 14px;
  }
`;
