import { Control, Flex, Input, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC, ReactNode, useState } from 'react';

import { escapeRegExp } from '../../../components/common/TokenControl/AssetAmountInput/format';
import { FeeBox } from './FeeBox/FeeBox';

interface FeeDescriptor {
  readonly percent: number;
  readonly description: string;
  readonly content: ReactNode | ReactNode[] | string;
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

const isValidAmount = (value: string): boolean => {
  return (value.split('.')[1]?.length || 0) <= 1;
};

export type FeeSelectorProps = Control<number | undefined>;

export const FeeSelector: FC<FeeSelectorProps> = ({ value, onChange }) => {
  const [userInput, setUserInput] = useState<string | undefined>(undefined);
  const handleItemClick = (percent: number) => onChange && onChange(percent);
  const FEES: FeeDescriptor[] = [
    {
      percent: 0.3,
      description: t`Best for most pairs`,
      content: `0.3%`,
    },
    {
      percent: 1,
      description: t`Best for exotic pairs`,
      content: `1%`,
    },
  ];

  const handleInputChange = (nextUserInput: string) => {
    if (nextUserInput.startsWith('.')) {
      nextUserInput = nextUserInput.replace('.', '0.');
    }
    if (nextUserInput === '' && onChange) {
      setUserInput('');
      onChange(undefined);
      return;
    }
    if (
      inputRegex.test(escapeRegExp(nextUserInput)) &&
      onChange &&
      isValidAmount(nextUserInput)
    ) {
      const newValue = Number(nextUserInput);
      setUserInput(newValue > 100 ? '100' : nextUserInput);
      onChange(newValue > 100 ? 100 : newValue);
      return;
    }
    setUserInput(userInput ?? '');
  };

  return (
    <Flex>
      {FEES.map((fee) => (
        <Flex.Item key={fee.percent} flex={1} marginRight={2}>
          <FeeBox
            onClick={() => handleItemClick(fee.percent)}
            active={fee.percent === value}
            description={fee.description}
            content={fee.content}
          />
        </Flex.Item>
      ))}
      <Flex.Item flex={1}>
        <FeeBox
          active={!!value && FEES.every((fee) => value !== fee.percent)}
          description={t`Custom fee tier`}
          content={
            <Input
              size="large"
              textAlign="right"
              value={userInput}
              onChange={(e) => handleInputChange(e.target.value)}
              suffix={<Typography.Body>%</Typography.Body>}
            />
          }
        />
      </Flex.Item>
    </Flex>
  );
};
