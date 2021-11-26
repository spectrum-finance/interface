import './Typography.less';

import { Typography as BaseTypography } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import cn from 'classnames';
import React, { FC } from 'react';

type Align = 'left' | 'right' | 'center';

interface Extensions {
  Body: FC<{ align?: Align } & TextProps>;
  Footnote: FC<{ align?: Align; small?: boolean } & TextProps>;
}

const Typography: typeof BaseTypography & Extensions = BaseTypography as any;
// eslint-disable-next-line react/display-name
Typography.Body = ({
  children,
  align,
  ...other
}: TextProps & { align?: Align; small?: boolean }) => (
  <Typography.Text
    className={`ant-typography-align--${align || 'initial'}`}
    {...other}
  >
    {children}
  </Typography.Text>
);
// eslint-disable-next-line react/display-name
Typography.Footnote = ({
  children,
  className,
  small,
  align,
  ...other
}: TextProps & { align?: Align; small?: boolean }) => (
  <Typography.Text
    className={cn(
      'ant-typography-footnote',
      `ant-typography-align--${align || 'initial'}`,
      { 'ant-typography-footnote--small': small },
      className,
    )}
    {...other}
  >
    {children}
  </Typography.Text>
);

export { Typography };
