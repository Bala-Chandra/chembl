import axios from 'axios';
import type { SearchCategory } from '../types/search';

const api = axios.create({
  baseURL: 'http://localhost:3000', // NestJS
});

export const fetchAutocomplete = (
  category: SearchCategory,
  query: string,
  signal: AbortSignal
) =>
  api.get(`/autocomplete/${category}`, {
    params: { q: query },
    signal,
  });

export const fetchCounts = (
  category: SearchCategory,
  value: string
) =>
  api.post('/search/counts', {
    category,
    value,
  });
