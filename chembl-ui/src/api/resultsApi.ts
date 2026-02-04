import { api } from './axios';

export const fetchResults = (
  type: 'structures' | 'documents' | 'assays' | 'activities',
  page: number,
  pageSize: number
) =>
  api.post(`/results/${type}`, {
    page,
    pageSize,
  });
