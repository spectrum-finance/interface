import { Link } from '@geist-ui/react';
import React from 'react';

import { FEEDBACK_FORM_URL } from '../../constants/env';

interface FeedbackLinkProps {
  className?: string;
}

export const FeedbackLink: React.FC<FeedbackLinkProps> = ({ className }) => {
  return (
    <Link
      className={className}
      href={FEEDBACK_FORM_URL}
      target="_blank"
      block
      icon
    >
      Leave Feedback
    </Link>
  );
};
