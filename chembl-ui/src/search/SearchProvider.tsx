import { useState, type ReactNode } from 'react';
import { SearchContext } from './SearchContext';
import type { SearchCounts as Counts } from '../types/search';

type Props = {
  children: ReactNode;
};

export function SearchProvider({ children }: Props) {
  const [counts, setCounts] = useState<Counts | null>(null);

  return (
    <SearchContext.Provider value={{ counts, setCounts }}>
      {children}
    </SearchContext.Provider>
  );
}