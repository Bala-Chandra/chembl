export interface DocumentRow {
  doc_id: number;
  pubmed_id: string | null;
  journal: string | null;
  year: number | null;

  volume: string | null;
  issue: string | null;
  first_page: string | null;
  last_page: string | null;

  doi: string | null;
}
