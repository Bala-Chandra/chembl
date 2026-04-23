import { createContext } from 'react';
import type { SearchCounts as Counts } from '../types/search';

export type SearchContextType = {
  counts: Counts | null;
  setCounts: (c: Counts | null) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);