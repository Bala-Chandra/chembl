import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface ResultsRequest {
  category: string;
  value: string;
  page: number;
  pageSize: number;
}

export const fetchResults = (
  type: 'structures' | 'documents' | 'assays' | 'activities',
  payload: ResultsRequest
) =>
  api.post(`/results/${type}`, payload);
