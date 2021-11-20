import './Typography.less';

import { Typography as BaseTypography } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import cn from 'classnames';
import React from 'react';

interface Extensions {
  Body: typeof BaseTypography.Text;
  Footnote: typeof BaseTypography.Text;
}

const Typography: typeof BaseTypography & Extensions = BaseTypography as any;
Typography.Body = Typography.Text;
// eslint-disable-next-line react/display-name
Typography.Footnote = ({ children, className, ...other }: TextProps) => (
  <Typography.Text
    className={cn('ant-typography-footnote', className)}
    {...other}
  >
    {children}
  </Typography.Text>
);

export { Typography };
