import React from 'react';
import { Trans } from 'react-i18next';

import { Typography } from '../../ergodex-cdk';

const I18nTypographyBody: typeof Typography.Body = ({ children, ...other }) => (
  <Typography.Body {...other}>
    <Trans i18nKey={children as any} />
  </Typography.Body>
);

const I18nTypographyFootnote: typeof Typography.Footnote = ({
  children,
  ...other
}) => (
  <Typography.Footnote {...other}>
    <Trans i18nKey={children as any} />
  </Typography.Footnote>
);

const I18nTypographyTitle: typeof Typography.Title = ({
  children,
  ...other
}) => (
  <Typography.Title {...other}>
    <Trans i18nKey={children as any} />
  </Typography.Title>
);

const I18nTypographyParagraph: typeof Typography.Paragraph = ({
  children,
  ...other
}) => (
  <Typography.Paragraph {...other}>
    <Trans i18nKey={children as any} />
  </Typography.Paragraph>
);

export const I18n = {
  Body: I18nTypographyBody,
  Footnote: I18nTypographyFootnote,
  Title: I18nTypographyTitle,
  Paragraph: I18nTypographyParagraph,
};
