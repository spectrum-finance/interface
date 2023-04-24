import { Button, MessageOutlined } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

export interface LeaveFeedbackProps {
  readonly className?: string;
}

const FEEDBACK_URL = 'https://forms.gle/wenR2wKP2ngPf86w8';

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
  color: var(--spectrum-body-bg) !important;

  svg {
    font-size: 14px;
    width: 14px;
    height: 14px;
  }
`;
