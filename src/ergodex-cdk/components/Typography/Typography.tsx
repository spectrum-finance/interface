import './Typography.less';

import { Typography as BaseTypography } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import cn from 'classnames';
import React, { FC } from 'react';

interface Extensions {
  Body: typeof BaseTypography.Text;
  Footnote: FC<{ small?: boolean } & TextProps>;
}

const Typography: typeof BaseTypography & Extensions = BaseTypography as any;
Typography.Body = Typography.Text;
// eslint-disable-next-line react/display-name
Typography.Footnote = ({
  children,
  className,
  small,
  ...other
}: TextProps & { small?: boolean }) => (
  <Typography.Text
    className={cn(
      'ant-typography-footnote',
      { 'ant-typography-footnote--small': small },
      className,
    )}
    {...other}
  >
    {children}
  </Typography.Text>
);

export { Typography };
