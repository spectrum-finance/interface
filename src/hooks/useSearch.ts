import { useState } from 'react';

type SetSearch = (term: string) => void;

type SearchByTerm<T> = (items: T[] | undefined) => T[];

export const searchByTerm = <T>(
  items: T[] = [],
  term: string | undefined = undefined,
  keys: (keyof T)[] = [],
): T[] => {
  const normalizedTerm = term?.toLowerCase();

  if (!normalizedTerm) {
    return items;
  }

  return items.filter((i) =>
    keys.some((k) => {
      const iKeyValue = i[k];

      if (typeof iKeyValue !== 'string') {
        return false;
      }

      return iKeyValue.toLowerCase().includes(normalizedTerm);
    }),
  );
};

export const useSearch = <T>(
  keys: (keyof T)[],
): [SearchByTerm<T>, SetSearch, string] => {
  const [term, setTerm] = useState<string>('');

  const setSearch = (term: string | undefined) =>
    setTerm(term?.toLowerCase() || '');

  const _searchByTerm = (items: T[] | undefined) =>
    searchByTerm(items, term, keys);

  return [_searchByTerm, setSearch, term];
};
