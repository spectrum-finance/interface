import './GuideLink.less';

import { Box, Button, Col, Row, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

interface GuideLinkProps {
  title: string;
  subtitle: string;
  href: string;
}

const GuideBanner: React.FC<GuideLinkProps> = ({
  title,
  subtitle,
  href,
}): JSX.Element => {
  return (
    <Box className="guide-banner" padding={[2, 4]} borderRadius="m">
      <Row>
        <Col span={18}>
          <Typography.Title className="guide-banner__text" level={4}>
            {title}
          </Typography.Title>
          <Typography.Footnote className="guide-banner__text">
            {subtitle}
          </Typography.Footnote>
        </Col>
        <Col span={6}>
          <Row justify="end" align="middle" fillHeight>
            <Button className="guide-banner__btn" href={href} target="_blank">
              <Trans>Read Guide</Trans>
            </Button>
          </Row>
        </Col>
      </Row>
    </Box>
  );
};

export { GuideBanner };
