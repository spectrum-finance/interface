import { Box, BoxProps, Flex } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

export interface TitledBoxProps extends BoxProps {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly titleGap?: number;
  readonly subtitle?: ReactNode | ReactNode[] | string;
  readonly subtitleGap?: number;
}

export const TitledBox: FC<TitledBoxProps> = ({
  titleGap,
  title,
  subtitleGap,
  subtitle,
  width,
  ...rest
}) => {
  return (
    <Flex col width={width}>
      {title && <Flex.Item marginBottom={titleGap}>{title}</Flex.Item>}
      {subtitle && <Flex.Item marginBottom={subtitleGap}>{subtitle}</Flex.Item>}
      <Box width={width} {...rest} />
    </Flex>
  );
};
