import { Box, BoxProps, Flex } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

export interface TitledBoxProps extends BoxProps {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly titleGap?: number;
  readonly subtitle?: ReactNode | ReactNode[] | string;
  readonly subtitleGap?: number;
  readonly isRowTitle?: boolean;
}

export const TitledBox: FC<TitledBoxProps> = ({
  titleGap,
  title,
  subtitleGap,
  subtitle,
  width,
  isRowTitle,
  ...rest
}) => {
  return (
    <Flex col width={width}>
      <Flex col={!isRowTitle} justify="space-between">
        {title && <Flex.Item marginBottom={titleGap}>{title}</Flex.Item>}
        {subtitle && (
          <Flex.Item marginBottom={subtitleGap}>{subtitle}</Flex.Item>
        )}
      </Flex>

      <Box width={width} {...rest} />
    </Flex>
  );
};
