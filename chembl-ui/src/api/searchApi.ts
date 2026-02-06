import { api } from './axios';
import type { SearchCategory, AutocompleteItem } from '../types/search';

// -----------------------------
// COUNTS
// -----------------------------
export const fetchDefaultCounts = () =>
  api.get('/search/counts/default');

export const fetchCounts = (category:SearchCategory, value: string, ) =>
  api.post('/search/counts', { category, value });

// -----------------------------
// CREATE SEARCH SESSION
// -----------------------------
export const createSearchSession = (
  category: SearchCategory,
  value: string,
) =>
  api.post('/search/session', {
    category,
    value,
  });


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
