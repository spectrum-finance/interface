import { Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { useAdaHandle } from '../../../api/adaHandle';
import { ReactComponent as AdaHandleIcon } from '../ada-handle-icon.svg';

interface ActiveAdaHandleProps {
  readonly small?: boolean;
}
export const ActiveAdaHandle: FC<ActiveAdaHandleProps> = ({ small }) => {
  const [activeAdaHandle] = useAdaHandle();

  return (
    <>
      {activeAdaHandle && (
        <Flex align="center">
          <AdaHandleIcon />
          <Flex.Item marginLeft={1}>
            {small ? (
              <Typography.Body style={{ fontSize: '1rem', marginRight: '4px' }}>
                {activeAdaHandle?.name}
              </Typography.Body>
            ) : (
              <Typography.Title level={4}>
                {activeAdaHandle?.name}
              </Typography.Title>
            )}
          </Flex.Item>
        </Flex>
      )}
    </>
  );
};
