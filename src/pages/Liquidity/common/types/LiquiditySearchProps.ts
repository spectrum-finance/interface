import * as React from 'react';

export interface LiquiditySearchProps {
  readonly term: string;
  readonly handleSearchTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
