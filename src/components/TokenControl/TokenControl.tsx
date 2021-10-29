import { Form } from 'antd';
import React, { FC } from 'react';

import { Box, Button, Input, Typography } from '../../ergodex-cdk';
import { Flex } from '../../ergodex-cdk/components/Flex/Flex';
import { TokenInput } from './TokenInput/TokenInput';

interface TokenControlValue {
  amount?: number;
  token?: string;
}

export interface TokenControlProps {
  label?: string;
  value?: TokenControlValue;
  onChange?: (value: TokenControlValue) => void;
  balance?: number;
}

export const TokenControl: FC<TokenControlProps> = ({
  label,
  value,
  onChange,
  balance,
}) => {
  return (
    <Box padding={4} borderRadius="l">
      <Flex>
        <TokenInput label={'Ergo'} value="123" onChange={() => {}} />
        <Flex flexDirection="row" alignItems="center">
          <Flex.Item marginRight={2}>
            {/*{*/}
            {/*  value?.token ?*/}
            {/*    <Typography.Body>{balance}</Typography.Body>*/}
            {/*}*/}
          </Flex.Item>
          <Button ghost type="primary" size="small">
            Max
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export const TokenControlFormItem = ({ label }: { label: string }) => {
  // const {} = useWallet();

  return (
    <Form.Item name="from" rules={[{ required: true, message: undefined }]}>
      <TokenControl label={label} />
    </Form.Item>
  );
};
