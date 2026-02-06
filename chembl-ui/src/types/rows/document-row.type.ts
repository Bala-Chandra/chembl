// src/types/rows/document-row.type.ts

export interface DocumentRow {
  doc_id: number;
  pubmed_id: string | null;
  year: number | null;
  journal: string | null;
}
