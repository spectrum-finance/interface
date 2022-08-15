import React, { Input, InputProps, SearchOutlined } from '@ergolabs/ui-kit';
import { FC } from 'react';

export type SearchInputProps = Omit<InputProps, 'prefix'>;

export const SearchInput: FC<SearchInputProps> = (props) => (
  <Input prefix={<SearchOutlined />} {...props} />
);
