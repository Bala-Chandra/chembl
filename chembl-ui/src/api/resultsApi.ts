import { api } from './axios';

export type ResultType =
  | 'structures'
  | 'documents'
  | 'assays'
  | 'activities';

export const fetchResults = (
  type: ResultType,
  page = 1,
  pageSize = 25,
) => {
  return api.get(`/results/${type}`, {
    params: { page, pageSize },
    withCredentials: true, // 🔑 required for session cookie
  });
};
