import { Box } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

interface AnalyticTag {
  className?: string;
  children?: ReactNode | ReactNode[] | string;
}

export const AnalyticTag: FC<AnalyticTag> = ({ className, children }) => (
  <Box
    padding={[1, 2]}
    borderRadius="m"
    className={className}
    secondary
    bordered={false}
  >
    {children}
  </Box>
);
