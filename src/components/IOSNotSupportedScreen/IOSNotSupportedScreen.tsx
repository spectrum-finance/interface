import { Flex, Typography } from '@ergolabs/ui-kit';
import React from 'react';

export const IOSNotSupportedScreen = () => {
  return (
    <Flex align="center" justify="center" direction="col" className="light">
      <Flex.Item marginBottom={4}>
        <Typography.Title level={3}>Your OS is not supported</Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={4}>
        <Typography.Body align="center">
          Update the operating system and try
          <br />
          refreshing the page
        </Typography.Body>
      </Flex.Item>
    </Flex>
  );
};
