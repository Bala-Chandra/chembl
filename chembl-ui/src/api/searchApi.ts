import { api } from './axios';
import type { SearchCategory, AutocompleteItem } from '../types/search';

// -----------------------------
// COUNTS
// -----------------------------
export const fetchCounts = (value: string) =>
  api.post('/search/counts', { value });

// -----------------------------
// CREATE SEARCH SESSION
// -----------------------------
export const createSearchSession = (value: string) =>
  api.post('/search/session', { value });

// -----------------------------
// AUTOCOMPLETE
// -----------------------------
export const fetchAutocomplete = (
  category: SearchCategory,
  query: string,
  signal?: AbortSignal
) =>
  api.get<AutocompleteItem[]>('/search/autocomplete', {
    params: {
      category,
      q: query,
    },
    signal,
  });
