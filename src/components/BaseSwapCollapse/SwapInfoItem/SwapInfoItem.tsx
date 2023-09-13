import { Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

import { InfoTooltip } from '../../InfoTooltip/InfoTooltip.tsx';

export interface SwapInfoItemProps {
  title: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  secondary?: boolean;
  hint?: boolean;
}

export const SwapInfoItem: FC<SwapInfoItemProps> = ({
  value,
  title,
  tooltip,
  secondary,
  hint,
}) => {
  const { valBySize } = useDevice();
  return (
    <Flex align="center" justify="space-between">
      <Flex.Item>
        <Typography.Body
          size={valBySize('small', 'base')}
          secondary={secondary}
          hint={hint}
        >
          {value}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item>
        {tooltip ? (
          <InfoTooltip
            width={300}
            content={tooltip}
            color={secondary || hint ? 'secondary' : undefined}
            size="small"
          >
            <Typography.Body
              size={valBySize('small', 'base')}
              secondary={secondary}
              hint={hint}
            >
              {title}
            </Typography.Body>
          </InfoTooltip>
        ) : (
          <Typography.Body
            size={valBySize('small', 'base')}
            secondary={secondary}
            hint={hint}
          >
            {title}
          </Typography.Body>
        )}
      </Flex.Item>
    </Flex>
  );
};
